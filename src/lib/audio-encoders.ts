import { audioBufferToWav } from "@/lib/audio-utils";
import { encodeFlac } from "@/lib/flac-encoder";

export type AudioFormat = "mp3" | "wav" | "flac" | "aac";

export const AUDIO_FORMAT_INFO: Record<AudioFormat, { ext: string; mime: string; label: string; lossy: boolean }> = {
  mp3:  { ext: "mp3",  mime: "audio/mpeg", label: "MP3",  lossy: true },
  wav:  { ext: "wav",  mime: "audio/wav",  label: "WAV (16-bit PCM)", lossy: false },
  flac: { ext: "flac", mime: "audio/flac", label: "FLAC (lossless)",  lossy: false },
  aac:  { ext: "aac",  mime: "audio/aac",  label: "AAC",  lossy: true },
};

type Progress = (fraction: number) => void;

/** Sample rates the MP3 format allows. */
const MP3_RATES = [8000, 11025, 12000, 16000, 22050, 24000, 32000, 44100, 48000];

const nextTick = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

function floatToInt16(data: Float32Array): Int16Array {
  const out = new Int16Array(data.length);
  for (let i = 0; i < data.length; i++) {
    const s = Math.max(-1, Math.min(1, data[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}

/** First one or two channels as 16-bit PCM. Surround files keep front left/right. */
function int16Channels(buffer: AudioBuffer): Int16Array[] {
  const count = Math.min(2, buffer.numberOfChannels);
  return Array.from({ length: count }, (_, c) => floatToInt16(buffer.getChannelData(c)));
}

async function resample(buffer: AudioBuffer, sampleRate: number): Promise<AudioBuffer> {
  if (buffer.sampleRate === sampleRate) return buffer;
  const channels = Math.min(2, buffer.numberOfChannels);
  const ctx = new OfflineAudioContext(channels, Math.ceil(buffer.duration * sampleRate), sampleRate);
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.connect(ctx.destination);
  src.start();
  return ctx.startRendering();
}

/** Encode to a real MP3 file with the LAME encoder (constant bitrate). */
export async function encodeMp3(buffer: AudioBuffer, kbps = 192, onProgress?: Progress): Promise<Blob> {
  const { Mp3Encoder } = await import("@breezystack/lamejs");
  const source = MP3_RATES.includes(buffer.sampleRate) ? buffer : await resample(buffer, 44100);
  const [left, right] = int16Channels(source);
  const encoder = new Mp3Encoder(right ? 2 : 1, source.sampleRate, kbps);

  const CHUNK = 1152 * 40;
  const parts: BlobPart[] = [];
  for (let i = 0; i < left.length; i += CHUNK) {
    const l = left.subarray(i, i + CHUNK);
    const out = right ? encoder.encodeBuffer(l, right.subarray(i, i + CHUNK)) : encoder.encodeBuffer(l);
    if (out.length) parts.push(new Uint8Array(out));
    onProgress?.(Math.min(1, (i + CHUNK) / left.length));
    await nextTick(); // keep the page responsive on long files
  }
  const tail = encoder.flush();
  if (tail.length) parts.push(new Uint8Array(tail));
  return new Blob(parts, { type: AUDIO_FORMAT_INFO.mp3.mime });
}

/** Encode to a real, lossless FLAC file. */
export async function encodeFlacBlob(buffer: AudioBuffer): Promise<Blob> {
  await nextTick();
  const bytes = encodeFlac(int16Channels(buffer), buffer.sampleRate);
  return new Blob([new Uint8Array(bytes)], { type: AUDIO_FORMAT_INFO.flac.mime });
}

type AacEncoderConfig = AudioEncoderConfig & { aac?: { format: "aac" | "adts" } };

/** True when this browser can encode AAC (Chrome, Edge and recent Safari). */
export async function canEncodeAac(): Promise<boolean> {
  if (typeof AudioEncoder === "undefined") return false;
  try {
    const config: AacEncoderConfig = { codec: "mp4a.40.2", sampleRate: 44100, numberOfChannels: 2, bitrate: 128000, aac: { format: "adts" } };
    return (await AudioEncoder.isConfigSupported(config)).supported === true;
  } catch {
    return false;
  }
}

/**
 * Encode to AAC-LC in an ADTS stream (a plain .aac file) with the browser's own
 * encoder. Throws when the browser has no AAC encoder.
 */
export async function encodeAac(buffer: AudioBuffer, kbps = 160, onProgress?: Progress): Promise<Blob> {
  if (!(await canEncodeAac())) {
    throw new Error("This browser cannot encode AAC. Use Chrome or Edge on a desktop computer, or convert to MP3 instead.");
  }
  const source = [44100, 48000].includes(buffer.sampleRate) ? buffer : await resample(buffer, 44100);
  const channels = Math.min(2, source.numberOfChannels);
  const parts: BlobPart[] = [];
  let failure: Error | null = null;

  const encoder = new AudioEncoder({
    output: (chunk) => {
      const bytes = new Uint8Array(chunk.byteLength);
      chunk.copyTo(bytes);
      parts.push(bytes);
    },
    error: (e) => { failure = e; },
  });
  const config: AacEncoderConfig = {
    codec: "mp4a.40.2",
    sampleRate: source.sampleRate,
    numberOfChannels: channels,
    bitrate: kbps * 1000,
    aac: { format: "adts" },
  };
  encoder.configure(config);

  const FRAMES = 1024 * 32;
  for (let start = 0; start < source.length; start += FRAMES) {
    if (failure) break;
    const n = Math.min(FRAMES, source.length - start);
    const planar = new Float32Array(n * channels);
    for (let c = 0; c < channels; c++) planar.set(source.getChannelData(c).subarray(start, start + n), c * n);
    const data = new AudioData({
      format: "f32-planar",
      sampleRate: source.sampleRate,
      numberOfFrames: n,
      numberOfChannels: channels,
      timestamp: Math.round((start / source.sampleRate) * 1e6),
      data: planar,
    });
    encoder.encode(data);
    data.close();
    onProgress?.(Math.min(1, (start + n) / source.length));
    if (encoder.encodeQueueSize > 8) await nextTick();
  }
  await encoder.flush();
  encoder.close();
  if (failure) throw failure;
  return new Blob(parts, { type: AUDIO_FORMAT_INFO.aac.mime });
}

/** Encode an AudioBuffer to the requested format. */
export async function encodeAudio(
  buffer: AudioBuffer,
  format: AudioFormat,
  options: { kbps?: number; onProgress?: Progress } = {},
): Promise<Blob> {
  switch (format) {
    case "mp3":  return encodeMp3(buffer, options.kbps ?? 192, options.onProgress);
    case "aac":  return encodeAac(buffer, options.kbps ?? 160, options.onProgress);
    case "flac": return encodeFlacBlob(buffer);
    default:     return audioBufferToWav(buffer);
  }
}
