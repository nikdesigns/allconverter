"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Upload, Download, Music, X, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Web Audio API context (lazy)
let audioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  return audioCtx;
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a"); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function formatSize(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : `${Math.round(bytes / 1024)} KB`;
}

// ─── Generic audio re-encoder via AudioContext + MediaRecorder ───────────────

async function convertAudio(
  file: File,
  mimeType: string,
  onProgress: (p: string) => void
): Promise<Blob> {
  onProgress("Decoding audio…");
  const ctx     = getAudioCtx();
  const ab      = await file.arrayBuffer();
  const decoded = await ctx.decodeAudioData(ab);

  onProgress("Re-encoding…");
  const offlineCtx = new OfflineAudioContext(decoded.numberOfChannels, decoded.length, decoded.sampleRate);
  const source     = offlineCtx.createBufferSource();
  source.buffer    = decoded;
  source.connect(offlineCtx.destination);
  source.start();
  const rendered   = await offlineCtx.startRendering();

  // Use MediaRecorder to encode
  const streamDest = ctx.createMediaStreamDestination();
  const bufSource  = ctx.createBufferSource();
  bufSource.buffer = rendered;
  bufSource.connect(streamDest);

  return new Promise((resolve, reject) => {
    const supported = MediaRecorder.isTypeSupported(mimeType) ? mimeType : "audio/webm";
    const recorder  = new MediaRecorder(streamDest.stream, { mimeType: supported });
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => resolve(new Blob(chunks, { type: supported }));
    recorder.onerror = e => reject(e);
    recorder.start(100);
    bufSource.onended = () => recorder.stop();
    bufSource.start();
    onProgress("Recording output…");
  });
}

// ─── Generic converter UI ─────────────────────────────────────────────────────

function AudioConverter({
  accept, outputMime, outputExt, label,
}: {
  accept: string; outputMime: string; outputExt: string; label?: string;
}) {
  const [file, setFile]         = useState<File | null>(null);
  const [outBlob, setOutBlob]   = useState<Blob | null>(null);
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError]       = useState("");
  const [playing, setPlaying]   = useState(false);
  const audioRef                = useRef<HTMLAudioElement | null>(null);
  const dropRef                 = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => { setFile(f); setOutBlob(null); setError(""); };

  const convert = async () => {
    if (!file) return;
    setLoading(true); setError(""); setOutBlob(null);
    try {
      const blob = await convertAudio(file, outputMime, setProgress);
      setOutBlob(blob);
      toast.success("Converted!");
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); setProgress(""); }
  };

  const download = () => {
    if (!outBlob || !file) return;
    downloadBlob(outBlob, file.name.replace(/\.[^.]+$/, `.${outputExt}`));
  };

  const togglePlay = () => {
    if (!outBlob) return;
    if (playing) { audioRef.current?.pause(); setPlaying(false); return; }
    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.src = URL.createObjectURL(outBlob);
    audioRef.current.onended = () => setPlaying(false);
    audioRef.current.play();
    setPlaying(true);
  };

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  return (
    <div className="space-y-4">
      <div
        onClick={() => dropRef.current?.click()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/10 transition-all">
        <input ref={dropRef} type="file" accept={accept} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <div className="text-sm font-medium">{label ?? "Drop audio file here"}</div>
        <div className="text-xs text-muted-foreground mt-1">{accept} supported</div>
      </div>

      {file && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/10 border border-border">
          <Music className="w-4 h-4 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">{file.name}</div>
            <div className="text-[10px] text-muted-foreground">{formatSize(file.size)}</div>
          </div>
          <button onClick={() => { setFile(null); setOutBlob(null); }} className="text-muted-foreground hover:text-rose-400"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {loading && <div className="text-center py-3 text-muted-foreground text-sm">{progress || "Processing…"}</div>}
      {error && <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-3 text-sm text-rose-400">{error}</div>}

      {file && !outBlob && !loading && (
        <Button onClick={convert} className="w-full gap-2">
          <Music className="w-4 h-4" /> Convert to .{outputExt.toUpperCase()}
        </Button>
      )}

      {outBlob && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
          <div className="text-sm font-medium text-emerald-400">Conversion complete · {formatSize(outBlob.size)}</div>
          <div className="flex gap-2">
            <Button onClick={download} className="gap-1.5 flex-1"><Download className="w-4 h-4" />Download .{outputExt}</Button>
            <Button variant="outline" onClick={togglePlay} className="gap-1.5 px-3">
              {playing ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {playing ? "Stop" : "Preview"}
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">Note: browser encoding uses {outputMime.includes("aac") && MediaRecorder.isTypeSupported("audio/aac") ? "native AAC" : "WebM container"}. For exact format support, a desktop app like Audacity may produce smaller files.</div>
        </div>
      )}
    </div>
  );
}

// ─── Audio Noise Reducer ──────────────────────────────────────────────────────

function AudioNoiseReducer() {
  const [file, setFile]         = useState<File | null>(null);
  const [outBlob, setOutBlob]   = useState<Blob | null>(null);
  const [loading, setLoading]   = useState(false);
  const [threshold, setThreshold] = useState(-40); // dB
  const [playing, setPlaying]   = useState(false);
  const audioRef                = useRef<HTMLAudioElement | null>(null);
  const dropRef                 = useRef<HTMLInputElement>(null);

  const process = async () => {
    if (!file) return;
    setLoading(true); setOutBlob(null);
    try {
      const ctx     = getAudioCtx();
      const ab      = await file.arrayBuffer();
      const decoded = await ctx.decodeAudioData(ab);
      const { numberOfChannels, sampleRate, length } = decoded;

      const offline = new OfflineAudioContext(numberOfChannels, length, sampleRate);

      // Apply high-pass filter to remove low-frequency hum
      const hpf = offline.createBiquadFilter();
      hpf.type = "highpass"; hpf.frequency.value = 80; hpf.Q.value = 0.7;

      // Apply dynamics compressor to reduce noise floor
      const comp = offline.createDynamicsCompressor();
      comp.threshold.value = threshold;
      comp.knee.value = 10;
      comp.ratio.value = 12;
      comp.attack.value = 0.003;
      comp.release.value = 0.25;

      const src = offline.createBufferSource();
      src.buffer = decoded;
      src.connect(hpf); hpf.connect(comp); comp.connect(offline.destination);
      src.start();

      const rendered = await offline.startRendering();

      // Encode via MediaRecorder
      const blob = await new Promise<Blob>((resolve, reject) => {
        const dest    = ctx.createMediaStreamDestination();
        const bufSrc  = ctx.createBufferSource();
        bufSrc.buffer = rendered;
        bufSrc.connect(dest);
        const recorder = new MediaRecorder(dest.stream, { mimeType: "audio/webm" });
        const chunks: BlobPart[] = [];
        recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
        recorder.onstop = () => resolve(new Blob(chunks, { type: "audio/webm" }));
        recorder.onerror = e => reject(e);
        recorder.start(100);
        bufSrc.onended = () => recorder.stop();
        bufSrc.start();
      });

      setOutBlob(blob);
      toast.success("Noise reduction applied!");
    } catch (e) { toast.error((e as Error).message); }
    finally { setLoading(false); }
  };

  const download = () => {
    if (!outBlob || !file) return;
    downloadBlob(outBlob, file.name.replace(/\.[^.]+$/, "-cleaned.webm"));
  };

  const togglePlay = () => {
    if (!outBlob) return;
    if (playing) { audioRef.current?.pause(); setPlaying(false); return; }
    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.src = URL.createObjectURL(outBlob);
    audioRef.current.onended = () => setPlaying(false);
    audioRef.current.play(); setPlaying(true);
  };

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  return (
    <div className="space-y-4">
      <div onClick={() => dropRef.current?.click()}
        className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/10 transition-all">
        <input ref={dropRef} type="file" accept="audio/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setOutBlob(null); } }} />
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <div className="text-sm font-medium">Drop audio file here</div>
        <div className="text-xs text-muted-foreground mt-1">MP3, WAV, OGG, M4A supported</div>
      </div>

      {file && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/10 border border-border text-sm">
          <Music className="w-4 h-4 text-primary" /><span className="flex-1 truncate text-xs">{file.name}</span>
          <button onClick={()=>{setFile(null);setOutBlob(null);}} className="text-muted-foreground hover:text-rose-400"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Noise threshold: {threshold} dB</label>
        <input type="range" min={-60} max={-20} value={threshold} onChange={e=>setThreshold(Number(e.target.value))} className="w-full h-2 accent-primary" />
        <div className="flex justify-between text-[10px] text-muted-foreground"><span>Gentle (-60 dB)</span><span>Aggressive (-20 dB)</span></div>
      </div>

      {loading && <div className="text-center py-3 text-muted-foreground text-sm">Applying noise reduction…</div>}

      {file && !outBlob && !loading && (
        <Button onClick={process} className="w-full gap-2"><Music className="w-4 h-4" />Apply Noise Reduction</Button>
      )}

      {outBlob && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
          <div className="text-sm font-medium text-emerald-400">Done · {formatSize(outBlob.size)}</div>
          <div className="flex gap-2">
            <Button onClick={download} className="gap-1.5 flex-1"><Download className="w-4 h-4" />Download cleaned audio</Button>
            <Button variant="outline" onClick={togglePlay} className="px-3">{playing ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Audio Normalizer ─────────────────────────────────────────────────────────

function AudioNormalizer() {
  const [file, setFile]       = useState<File | null>(null);
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [targetDb, setTargetDb] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const audioRef              = useRef<HTMLAudioElement | null>(null);
  const dropRef               = useRef<HTMLInputElement>(null);

  const normalize = async () => {
    if (!file) return;
    setLoading(true); setOutBlob(null);
    try {
      const ctx     = getAudioCtx();
      const ab      = await file.arrayBuffer();
      const decoded = await ctx.decodeAudioData(ab);

      // Find peak amplitude
      let peak = 0;
      for (let c = 0; c < decoded.numberOfChannels; c++) {
        const data = decoded.getChannelData(c);
        for (let i = 0; i < data.length; i++) { const abs = Math.abs(data[i]); if (abs > peak) peak = abs; }
      }

      const targetLinear = Math.pow(10, targetDb / 20);
      const gain         = peak > 0 ? targetLinear / peak : 1;

      const offline = new OfflineAudioContext(decoded.numberOfChannels, decoded.length, decoded.sampleRate);
      const gainNode = offline.createGain();
      gainNode.gain.value = gain;
      const src = offline.createBufferSource();
      src.buffer = decoded;
      src.connect(gainNode); gainNode.connect(offline.destination);
      src.start();
      const rendered = await offline.startRendering();

      const blob = await new Promise<Blob>((resolve, reject) => {
        const dest   = ctx.createMediaStreamDestination();
        const bSrc   = ctx.createBufferSource();
        bSrc.buffer  = rendered;
        bSrc.connect(dest);
        const recorder = new MediaRecorder(dest.stream, { mimeType: "audio/webm" });
        const chunks: BlobPart[] = [];
        recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
        recorder.onstop = () => resolve(new Blob(chunks, { type: "audio/webm" }));
        recorder.onerror = e => reject(e);
        recorder.start(100);
        bSrc.onended = () => recorder.stop();
        bSrc.start();
      });

      setOutBlob(blob);
      toast.success(`Normalized! Gain applied: ${gain > 1 ? "+" : ""}${(20 * Math.log10(gain)).toFixed(1)} dB`);
    } catch (e) { toast.error((e as Error).message); }
    finally { setLoading(false); }
  };

  const download = () => {
    if (!outBlob || !file) return;
    downloadBlob(outBlob, file.name.replace(/\.[^.]+$/, "-normalized.webm"));
  };

  const togglePlay = () => {
    if (!outBlob) return;
    if (playing) { audioRef.current?.pause(); setPlaying(false); return; }
    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.src = URL.createObjectURL(outBlob);
    audioRef.current.onended = () => setPlaying(false);
    audioRef.current.play(); setPlaying(true);
  };

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  return (
    <div className="space-y-4">
      <div onClick={() => dropRef.current?.click()}
        className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/10 transition-all">
        <input ref={dropRef} type="file" accept="audio/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setOutBlob(null); } }} />
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <div className="text-sm font-medium">Drop audio file here</div>
        <div className="text-xs text-muted-foreground mt-1">MP3, WAV, OGG, M4A supported</div>
      </div>

      {file && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/10 border border-border">
          <Music className="w-4 h-4 text-primary" /><span className="flex-1 truncate text-xs">{file.name}</span>
          <button onClick={()=>{setFile(null);setOutBlob(null);}} className="text-muted-foreground hover:text-rose-400"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Target peak level: {targetDb} dBFS</label>
        <input type="range" min={-12} max={0} step={0.5} value={targetDb} onChange={e=>setTargetDb(Number(e.target.value))} className="w-full h-2 accent-primary" />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>-12 dBFS (conservative)</span>
          <span>-1 dBFS (streaming standard)</span>
          <span>0 dBFS (max)</span>
        </div>
      </div>

      {loading && <div className="text-center py-3 text-muted-foreground text-sm">Normalizing audio…</div>}

      {file && !outBlob && !loading && (
        <Button onClick={normalize} className="w-full gap-2"><Music className="w-4 h-4" />Normalize Volume</Button>
      )}

      {outBlob && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
          <div className="text-sm font-medium text-emerald-400">Done · {formatSize(outBlob.size)}</div>
          <div className="flex gap-2">
            <Button onClick={download} className="gap-1.5 flex-1"><Download className="w-4 h-4" />Download normalized</Button>
            <Button variant="outline" onClick={togglePlay} className="px-3">{playing ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Suite Router ─────────────────────────────────────────────────────────────

const TOOLS: Record<string, { title: string; component: React.ComponentType }> = {
  "mp3-to-aac":          { title: "MP3 to AAC",          component: () => <AudioConverter accept="audio/mpeg,.mp3" outputMime="audio/aac"  outputExt="aac"  label="Drop MP3 file here" /> },
  "aac-to-mp3":          { title: "AAC to MP3",          component: () => <AudioConverter accept="audio/aac,.m4a,.aac" outputMime="audio/mpeg" outputExt="mp3"  label="Drop AAC/M4A file here" /> },
  "flac-to-mp3":         { title: "FLAC to MP3",         component: () => <AudioConverter accept="audio/flac,.flac" outputMime="audio/mpeg" outputExt="mp3"  label="Drop FLAC file here" /> },
  "mp3-to-flac":         { title: "MP3 to FLAC",         component: () => <AudioConverter accept="audio/mpeg,.mp3" outputMime="audio/flac" outputExt="flac" label="Drop MP3 file here" /> },
  "audio-noise-reducer": { title: "Audio Noise Reducer", component: AudioNoiseReducer },
  "audio-normalizer":    { title: "Audio Normalizer",    component: AudioNormalizer },
};

export function AudioConversionSuite() {
  const pathname = usePathname();
  const slug = pathname.split("/tools/")[1]?.replace(/\/$/, "") ?? "";
  const tool = TOOLS[slug];
  if (!tool) return <div className="p-6 text-muted-foreground text-sm">Tool not found.</div>;
  const Component = tool.component;
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Music className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{tool.title}</span>
      </div>
      <div className="p-5">
        <Component />
      </div>
    </div>
  );
}
