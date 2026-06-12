/** Encodes an AudioBuffer as a 16-bit PCM WAV Blob. */
export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const numFrames = buffer.length;

  // Interleave all channels into a single Int16 array
  const pcm = new Int16Array(numFrames * numChannels);
  for (let ch = 0; ch < numChannels; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < numFrames; i++) {
      const s = Math.max(-1, Math.min(1, data[i]));
      pcm[i * numChannels + ch] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
  }

  const dataBytes = pcm.buffer.byteLength;
  const wav = new ArrayBuffer(44 + dataBytes);
  const v = new DataView(wav);
  const str = (o: number, s: string) => {
    for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
  };

  str(0, "RIFF");
  v.setUint32(4, 36 + dataBytes, true);
  str(8, "WAVE");
  str(12, "fmt ");
  v.setUint32(16, 16, true);          // PCM chunk size
  v.setUint16(20, 1, true);           // PCM format
  v.setUint16(22, numChannels, true);
  v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate * numChannels * 2, true); // byte rate
  v.setUint16(32, numChannels * 2, true);              // block align
  v.setUint16(34, 16, true);          // bits per sample
  str(36, "data");
  v.setUint32(40, dataBytes, true);
  new Int16Array(wav, 44).set(pcm);

  return new Blob([wav], { type: "audio/wav" });
}

/** Decodes any browser-supported audio/video file to an AudioBuffer. */
export async function decodeAudioFile(file: File): Promise<AudioBuffer> {
  const ctx = new AudioContext();
  const ab = await file.arrayBuffer();
  try {
    return await ctx.decodeAudioData(ab);
  } finally {
    ctx.close();
  }
}

/** Slices an AudioBuffer between startSec and endSec. */
export function sliceAudioBuffer(
  buffer: AudioBuffer,
  startSec: number,
  endSec: number
): AudioBuffer {
  const sr = buffer.sampleRate;
  const startFrame = Math.floor(startSec * sr);
  const endFrame = Math.min(Math.ceil(endSec * sr), buffer.length);
  const length = endFrame - startFrame;
  const out = new AudioContext().createBuffer(
    buffer.numberOfChannels,
    length,
    sr
  );
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    out.copyToChannel(buffer.getChannelData(ch).slice(startFrame, endFrame), ch);
  }
  return out;
}

/** Concatenates multiple AudioBuffers (resamples to the first buffer's rate if needed). */
export function joinAudioBuffers(buffers: AudioBuffer[]): AudioBuffer {
  if (buffers.length === 0) throw new Error("No buffers");
  const sr = buffers[0].sampleRate;
  const channels = Math.max(...buffers.map((b) => b.numberOfChannels));
  const totalLength = buffers.reduce((n, b) => n + b.length, 0);
  const out = new AudioContext().createBuffer(channels, totalLength, sr);
  let offset = 0;
  for (const buf of buffers) {
    for (let ch = 0; ch < channels; ch++) {
      const src =
        ch < buf.numberOfChannels
          ? buf.getChannelData(ch)
          : new Float32Array(buf.length);
      out.copyToChannel(src, ch, offset);
    }
    offset += buf.length;
  }
  return out;
}

/** Applies a gain multiplier to every sample in the buffer (in-place). */
export function applyGain(buffer: AudioBuffer, gain: number): AudioBuffer {
  const out = new AudioContext().createBuffer(
    buffer.numberOfChannels,
    buffer.length,
    buffer.sampleRate
  );
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const src = buffer.getChannelData(ch);
    const dst = out.getChannelData(ch);
    for (let i = 0; i < src.length; i++) {
      dst[i] = Math.max(-1, Math.min(1, src[i] * gain));
    }
  }
  return out;
}

/** Formats seconds as m:ss.xx */
export function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toFixed(2).padStart(5, "0")}`;
}

/** Triggers a browser download for a Blob. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
