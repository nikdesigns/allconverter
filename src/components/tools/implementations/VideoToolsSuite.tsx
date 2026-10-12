"use client";


import { activateOnKey } from "@/lib/a11y";
import { useState, useRef, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Upload, Download, X, Play, Square, Scissors,
  Minimize2, ImagePlay, ScreenShare, Music, Camera, Mic, MicOff, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { runFfmpeg, ffmpegInputName, ffmpegTime } from "@/lib/ffmpeg";

// ─── Shared helpers ────────────────────────────────────────────────────────────

function dl(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 6000);
}

function fmtBytes(b: number) {
  return b > 1_048_576 ? `${(b / 1_048_576).toFixed(2)} MB` : `${Math.round(b / 1024)} KB`;
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function parseSecs(str: string): number {
  const parts = str.split(":").map(Number);
  if (parts.length === 2) return (parts[0] ?? 0) * 60 + (parts[1] ?? 0);
  return Number(str) || 0;
}

type CaptureState = "idle" | "processing" | "done" | "error";

function DropZone({
  onFile, accept = "video/*", label = "Drop a video file here",
}: { onFile: (f: File) => void; accept?: string; label?: string }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div role="button" tabIndex={0} onKeyDown={activateOnKey}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
      onClick={() => ref.current?.click()}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer transition-all py-10 px-4",
        drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
      )}
    >
      <Upload className="w-8 h-8 text-muted-foreground" />
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
      </div>
      <input aria-label="Choose file" ref={ref} type="file" accept={accept} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
    </div>
  );
}

function FileChip({ file, onRemove }: { file: File; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-2.5">
      <Play className="w-4 h-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">{fmtBytes(file.size)}</p>
      </div>
      <button aria-label="Remove" onClick={onRemove} className="text-muted-foreground hover:text-rose-400 transition-colors"><X className="w-4 h-4" /></button>
    </div>
  );
}

function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{Math.round(value * 100)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  );
}

function RealtimeNote() {
  return (
    <div className="flex gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
      <p className="text-xs text-amber-300/80">
        Processing happens in real time in your browser — a 1-minute clip takes approximately 1 minute to process.
        Large files take longer.
      </p>
    </div>
  );
}

function ResultCard({ blob, filename, onReset }: { blob: Blob; filename: string; onReset: () => void }) {
  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
      <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
        <Download className="w-4 h-4" /> Ready to download
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={() => dl(blob, filename)} className="gap-2 flex-1">
          <Download className="w-4 h-4" /> Download {filename.split(".").pop()?.toUpperCase()}
        </Button>
        <Button variant="outline" onClick={onReset} className="gap-2">
          <Upload className="w-4 h-4" /> New file
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Output size: {fmtBytes(blob.size)}</p>
    </div>
  );
}

// ─── FFmpeg-backed tools ───────────────────────────────────────────────────────

/** Shared state for one FFmpeg run: loading the engine, progress, result or error. */
function useFfmpegJob() {
  const [state, setState]       = useState<CaptureState>("idle");
  const [stage, setStage]       = useState("");
  const [progress, setProgress] = useState(0);
  const [outBlob, setOutBlob]   = useState<Blob | null>(null);
  const [outName, setOutName]   = useState("");
  const [error, setError]       = useState("");

  const reset = useCallback(() => { setState("idle"); setProgress(0); setOutBlob(null); setError(""); setStage(""); }, []);

  const run = useCallback(async (file: File, args: (input: string, output: string) => string[], outExt: string, mime: string, suffix: string) => {
    setState("processing"); setProgress(0); setError(""); setOutBlob(null);
    setStage("Loading video engine (about 30 MB, first time only)…");
    const input = ffmpegInputName(file);
    const output = `output.${outExt}`;
    try {
      const res = await runFfmpeg({
        inputs: [{ name: input, file }],
        args: args(input, output),
        outputs: [output],
        onReady: () => setStage("Processing…"),
        onProgress: setProgress,
      });
      const data = res.files.get(output);
      if (!data || data.length === 0) {
        const hint = res.log.filter((l) => /error|invalid|not found|unsupported|does not contain/i.test(l)).slice(-2).join(" ");
        throw new Error(hint || "This video could not be processed. It may use a format the engine does not support.");
      }
      setOutBlob(new Blob([new Uint8Array(data)], { type: mime }));
      setOutName(file.name.replace(/\.[^.]+$/, "") + suffix + "." + outExt);
      setState("done");
      toast.success("Done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Processing failed.");
      setState("error");
    }
  }, []);

  return { state, stage, progress, outBlob, outName, error, run, reset };
}

function EngineNote() {
  return (
    <div className="flex gap-2 rounded-xl border border-border bg-muted/30 p-3">
      <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
      <p className="text-xs text-muted-foreground">
        Encoding runs on your device with FFmpeg, so nothing is uploaded. Speed depends on your computer: long or
        high-resolution videos can take several minutes. Keep this tab open while it works.
      </p>
    </div>
  );
}

function JobStatus({ job }: { job: ReturnType<typeof useFfmpegJob> }) {
  if (job.state === "processing") return <div role="status"><ProgressBar value={job.progress} label={job.stage} /></div>;
  if (job.state === "error") {
    return <div role="alert" className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-3 text-sm text-rose-500">{job.error}</div>;
  }
  return null;
}

const selectClass = "w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

// ─── 1. Video to Audio ─────────────────────────────────────────────────────────

const AUDIO_OUTPUTS = {
  mp3: { label: "MP3", ext: "mp3", mime: "audio/mpeg", args: (kbps: number) => ["-c:a", "libmp3lame", "-b:a", `${kbps}k`] },
  m4a: { label: "M4A (AAC)", ext: "m4a", mime: "audio/mp4", args: (kbps: number) => ["-c:a", "aac", "-b:a", `${kbps}k`] },
  wav: { label: "WAV (lossless)", ext: "wav", mime: "audio/wav", args: () => ["-c:a", "pcm_s16le"] },
} as const;

function VideoToAudio() {
  const [file, setFile]     = useState<File | null>(null);
  const [format, setFormat] = useState<keyof typeof AUDIO_OUTPUTS>("mp3");
  const [kbps, setKbps]     = useState(192);
  const job = useFfmpegJob();
  const out = AUDIO_OUTPUTS[format];

  const start = () => {
    if (!file) return;
    void job.run(file, (input, output) => ["-i", input, "-vn", ...out.args(kbps), output], out.ext, out.mime, "");
  };

  return (
    <div className="space-y-4">
      {!file ? <DropZone onFile={(f) => { setFile(f); job.reset(); }} label="Drop a video file to extract audio" /> : (
        <>
          <FileChip file={file} onRemove={() => { setFile(null); job.reset(); }} />
          {job.state !== "done" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="va-format" className="text-xs font-medium text-muted-foreground mb-1.5 block">Audio format</label>
                <select id="va-format" value={format} onChange={(e) => setFormat(e.target.value as keyof typeof AUDIO_OUTPUTS)} className={selectClass}>
                  {Object.entries(AUDIO_OUTPUTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="va-kbps" className="text-xs font-medium text-muted-foreground mb-1.5 block">Bitrate</label>
                <select id="va-kbps" value={kbps} disabled={format === "wav"} onChange={(e) => setKbps(Number(e.target.value))} className={cn(selectClass, format === "wav" && "opacity-50")}>
                  {[128, 192, 256, 320].map((b) => <option key={b} value={b}>{b} kbps</option>)}
                </select>
              </div>
            </div>
          )}
          <JobStatus job={job} />
          {job.state !== "processing" && job.state !== "done" && (
            <Button onClick={start} className="w-full gap-2"><Music className="w-4 h-4" /> Extract audio as {out.label}</Button>
          )}
          {job.state === "done" && job.outBlob && (
            <ResultCard blob={job.outBlob} filename={job.outName} onReset={() => { setFile(null); job.reset(); }} />
          )}
          <EngineNote />
        </>
      )}
    </div>
  );
}

// ─── 2. Video Trimmer ──────────────────────────────────────────────────────────

function VideoTrimmer() {
  const [file, setFile]         = useState<File | null>(null);
  const [startStr, setStartStr] = useState("0:00");
  const [endStr, setEndStr]     = useState("0:30");
  const [duration, setDuration] = useState(0);
  const [mode, setMode]         = useState<"fast" | "precise">("precise");
  const job = useFfmpegJob();

  const onFile = (f: File) => {
    setFile(f); job.reset(); setDuration(0);
    // Read the length so the end time can default to the whole video.
    const probe = document.createElement("video");
    probe.preload = "metadata";
    probe.onloadedmetadata = () => {
      if (Number.isFinite(probe.duration)) { setDuration(probe.duration); setEndStr(fmtTime(Math.min(30, probe.duration))); }
      URL.revokeObjectURL(probe.src);
    };
    probe.src = URL.createObjectURL(f);
  };

  const start = () => {
    if (!file) return;
    const s = parseSecs(startStr), e = parseSecs(endStr);
    if (e <= s) { toast.error("End time must be after start time"); return; }
    const length = String(e - s);
    const ext = (file.name.match(/\.([a-z0-9]+)$/i)?.[1] ?? "mp4").toLowerCase();
    if (mode === "fast") {
      // Stream copy: no re-encoding, so it is quick and lossless but can only cut on keyframes.
      const keep = ["mp4", "mov", "m4v", "webm", "mkv"].includes(ext) ? (ext === "m4v" ? "mp4" : ext) : "mp4";
      const mime = keep === "webm" ? "video/webm" : keep === "mkv" ? "video/x-matroska" : keep === "mov" ? "video/quicktime" : "video/mp4";
      void job.run(file, (input, output) => ["-ss", ffmpegTime(s), "-i", input, "-t", length, "-c", "copy", "-avoid_negative_ts", "make_zero", output], keep, mime, "_trimmed");
    } else {
      void job.run(file, (input, output) => [
        "-ss", ffmpegTime(s), "-i", input, "-t", length,
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "22", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", output,
      ], "mp4", "video/mp4", "_trimmed");
    }
  };

  return (
    <div className="space-y-4">
      {!file ? <DropZone onFile={onFile} label="Drop a video file to trim" /> : (
        <>
          <FileChip file={file} onRemove={() => { setFile(null); job.reset(); }} />
          {job.state !== "done" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="vt-start" className="text-xs font-medium text-muted-foreground mb-1.5 block">Start time (m:ss)</label>
                  <Input id="vt-start" value={startStr} onChange={(e) => setStartStr(e.target.value)} className="h-10 font-mono" />
                </div>
                <div>
                  <label htmlFor="vt-end" className="text-xs font-medium text-muted-foreground mb-1.5 block">End time (m:ss)</label>
                  <Input id="vt-end" value={endStr} onChange={(e) => setEndStr(e.target.value)} className="h-10 font-mono" />
                </div>
              </div>
              {duration > 0 && <p className="text-xs text-muted-foreground">Video length: {fmtTime(duration)}</p>}
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="Trim method">
                {([["precise", "Precise", "Exact cut, MP4 output"], ["fast", "Fast", "No re-encode, cuts at keyframes"]] as const).map(([m, label, hint]) => (
                  <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}
                    className={cn("py-2.5 rounded-xl border text-xs font-medium transition-all",
                      mode === m ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground")}>
                    {label}<span className="block text-[10px] opacity-70 mt-0.5">{hint}</span>
                  </button>
                ))}
              </div>
            </>
          )}
          <JobStatus job={job} />
          {job.state !== "processing" && job.state !== "done" && (
            <Button onClick={start} className="w-full gap-2"><Scissors className="w-4 h-4" /> Trim Video</Button>
          )}
          {job.state === "done" && job.outBlob && (
            <ResultCard blob={job.outBlob} filename={job.outName} onReset={() => { setFile(null); job.reset(); }} />
          )}
          <EngineNote />
        </>
      )}
    </div>
  );
}

// ─── 3. Video Compressor ───────────────────────────────────────────────────────

const RES_OPTIONS = [
  { label: "Keep original", height: 0 },
  { label: "1080p", height: 1080 },
  { label: "720p", height: 720 },
  { label: "480p", height: 480 },
  { label: "360p", height: 360 },
];

const QUALITY_OPTIONS = [
  { label: "High quality", hint: "Larger file", crf: 23 },
  { label: "Balanced", hint: "Recommended", crf: 28 },
  { label: "Smallest", hint: "Visible loss", crf: 33 },
];

function VideoCompressor() {
  const [file, setFile]       = useState<File | null>(null);
  const [res, setRes]         = useState(2); // index into RES_OPTIONS
  const [quality, setQuality] = useState(1); // index into QUALITY_OPTIONS
  const job = useFfmpegJob();

  const start = () => {
    if (!file) return;
    const h = RES_OPTIONS[res]!.height;
    // Never upscale: cap the height at the source's, keep the width even for H.264.
    const scale = h ? ["-vf", `scale=-2:min(${h}\\,ih)`] : [];
    void job.run(file, (input, output) => [
      "-i", input, ...scale,
      "-c:v", "libx264", "-preset", "veryfast", "-crf", String(QUALITY_OPTIONS[quality]!.crf), "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", output,
    ], "mp4", "video/mp4", "_compressed");
  };

  return (
    <div className="space-y-4">
      {!file ? <DropZone onFile={(f) => { setFile(f); job.reset(); }} label="Drop a video file to compress" /> : (
        <>
          <FileChip file={file} onRemove={() => { setFile(null); job.reset(); }} />
          {job.state !== "done" && (
            <>
              <div>
                <label htmlFor="vc-res" className="text-xs font-medium text-muted-foreground mb-1.5 block">Output resolution</label>
                <select id="vc-res" value={res} onChange={(e) => setRes(Number(e.target.value))} className={selectClass}>
                  {RES_OPTIONS.map((o, i) => <option key={o.label} value={i}>{o.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Quality">
                {QUALITY_OPTIONS.map((q, i) => (
                  <button key={q.label} type="button" aria-pressed={quality === i} onClick={() => setQuality(i)}
                    className={cn("py-2.5 rounded-xl border text-xs font-medium transition-all",
                      quality === i ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground")}>
                    {q.label}<span className="block text-[10px] opacity-70 mt-0.5">{q.hint}</span>
                  </button>
                ))}
              </div>
            </>
          )}
          <JobStatus job={job} />
          {job.state !== "processing" && job.state !== "done" && (
            <Button onClick={start} className="w-full gap-2"><Minimize2 className="w-4 h-4" /> Compress to MP4</Button>
          )}
          {job.state === "done" && job.outBlob && (
            <>
              <ResultCard blob={job.outBlob} filename={job.outName} onReset={() => { setFile(null); job.reset(); }} />
              <p className="text-xs text-muted-foreground">
                Original {fmtBytes(file.size)} → {fmtBytes(job.outBlob.size)}
                {job.outBlob.size < file.size ? ` (${Math.round((1 - job.outBlob.size / file.size) * 100)}% smaller)` : " — the original was already well compressed; try a lower resolution or the Smallest setting."}
              </p>
            </>
          )}
          <EngineNote />
        </>
      )}
    </div>
  );
}

// ─── 4. MP4 to GIF ────────────────────────────────────────────────────────────

function MpFourToGif() {
  const [file, setFile]         = useState<File | null>(null);
  const [startStr, setStartStr] = useState("0:00");
  const [duration, setDuration] = useState(3);
  const [fps, setFps]           = useState(10);
  const [width, setWidth]       = useState(480);
  const [state, setState]       = useState<CaptureState>("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [outBlob, setOutBlob]   = useState<Blob | null>(null);
  const [error, setError]       = useState("");
  const [videoDur, setVideoDur] = useState(0);

  const reset = () => { setFile(null); setState("idle"); setOutBlob(null); setError(""); setStatusMsg(""); };

  const onFile = (f: File) => {
    setFile(f);
    const v = document.createElement("video");
    v.src = URL.createObjectURL(f);
    v.onloadedmetadata = () => { setVideoDur(v.duration); URL.revokeObjectURL(v.src); };
  };

  const convert = useCallback(async () => {
    if (!file) return;
    const startSec = parseSecs(startStr);
    const clipDur  = Math.min(duration, 10);
    const frameCount = Math.round(clipDur * fps);
    const delay = Math.round(1000 / fps);

    setState("processing"); setError(""); setStatusMsg("Loading video…");

    try {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      await new Promise<void>((res, rej) => { video.onloadedmetadata = () => res(); video.onerror = rej; });

      const aspect = video.videoWidth / (video.videoHeight || 1);
      const tw = width; const th = Math.max(2, Math.round(tw / aspect / 2) * 2);

      const canvas = document.createElement("canvas");
      canvas.width = tw; canvas.height = th;
      const ctx = canvas.getContext("2d")!;

      const { GIFEncoder, quantize, applyPalette } = await import("gifenc");
      const gif = GIFEncoder();

      for (let i = 0; i < frameCount; i++) {
        setStatusMsg(`Encoding frame ${i + 1} / ${frameCount}…`);
        video.currentTime = startSec + i / fps;
        await new Promise<void>(r => { video.onseeked = () => r(); });
        ctx.drawImage(video, 0, 0, tw, th);
        const rgba = ctx.getImageData(0, 0, tw, th).data;
        const palette = quantize(rgba, 256);
        const index   = applyPalette(rgba, palette);
        gif.writeFrame(index, tw, th, { palette, delay });
      }

      gif.finish();
      const buf  = gif.bytes();
      const blob = new Blob([buf.buffer as ArrayBuffer], { type: "image/gif" });
      URL.revokeObjectURL(video.src);
      setOutBlob(blob); setState("done"); setStatusMsg("");
    } catch (e) {
      setError(String(e)); setState("error");
    }
  }, [file, startStr, duration, fps, width]);

  return (
    <div className="space-y-4">
      {!file ? (
        <DropZone onFile={onFile} label="Drop a video clip to convert to GIF" />
      ) : (
        <>
          <FileChip file={file} onRemove={reset} />
          {videoDur > 0 && <p className="text-xs text-muted-foreground">Video duration: {fmtTime(videoDur)}</p>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Start time (m:ss)</label>
              <Input value={startStr} onChange={e => setStartStr(e.target.value)} placeholder="0:00" className="h-10 text-sm font-mono" disabled={state === "processing"} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Duration (max 10 s)</label>
              <Input type="number" value={duration} onChange={e => setDuration(Math.min(10, Math.max(1, +e.target.value)))} min={1} max={10} className="h-10 text-sm" disabled={state === "processing"} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">
                FPS: <span className="text-foreground font-medium">{fps}</span>
              </label>
              <input aria-label="FPS" type="range" min={5} max={24} value={fps} onChange={e => setFps(+e.target.value)} className="w-full mt-2.5 accent-primary" disabled={state === "processing"} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Output width (px)</label>
              <select aria-label="Output width (px)" value={width} onChange={e => setWidth(+e.target.value)} disabled={state === "processing"}
                className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
                {[240, 320, 480, 640].map(w => <option key={w} value={w}>{w}px</option>)}
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
            Estimated frames: <span className="text-foreground font-medium">{Math.round(Math.min(duration, 10) * fps)}</span>
            {" · "}Lower FPS + smaller width = smaller GIF file size
          </div>

          {state === "idle" && (
            <Button onClick={convert} className="w-full gap-2 h-11">
              <ImagePlay className="w-4 h-4" /> Convert to GIF
            </Button>
          )}
          {state === "processing" && (
            <div className="rounded-xl border border-border bg-muted/20 p-4 text-center">
              <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{statusMsg}</p>
            </div>
          )}
          {state === "done" && outBlob && (
            <>
              <img src={URL.createObjectURL(outBlob)} alt="GIF preview" className="w-full rounded-xl border border-border object-contain max-h-64" />
              <ResultCard blob={outBlob} filename={file.name.replace(/\.[^.]+$/, "") + ".gif"} onReset={reset} />
            </>
          )}
          {state === "error" && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-sm text-rose-400">{error}</div>
          )}
        </>
      )}
    </div>
  );
}

// ─── 5. Video Thumbnail Extractor ─────────────────────────────────────────────

function VideoThumbnail() {
  const [file, setFile]       = useState<File | null>(null);
  const [timeStr, setTimeStr] = useState("0:00");
  const [preview, setPreview] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [capturing, setCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState("");

  const reset = () => { setFile(null); setPreview(null); setVideoSrc(""); setDuration(0); setTimeStr("0:00"); };

  const onFile = (f: File) => {
    setFile(f);
    const src = URL.createObjectURL(f);
    setVideoSrc(src);
  };

  useEffect(() => {
    if (videoRef.current && videoSrc) {
      const v = videoRef.current;
      const onMeta = () => { setDuration(v.duration); };
      v.addEventListener("loadedmetadata", onMeta);
      return () => v.removeEventListener("loadedmetadata", onMeta);
    }
  }, [videoSrc]);

  const capture = async () => {
    if (!videoRef.current || !videoSrc) return;
    setCapturing(true);
    const v = videoRef.current;
    const seekTo = parseSecs(timeStr);

    v.currentTime = seekTo;
    await new Promise<void>(r => { v.onseeked = () => r(); });

    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth; canvas.height = v.videoHeight;
    canvas.getContext("2d")!.drawImage(v, 0, 0);

    canvas.toBlob(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(url);
        dl(blob, (file?.name.replace(/\.[^.]+$/, "") ?? "frame") + `_${timeStr.replace(":", "m")}s.png`);
      }
      setCapturing(false);
    }, "image/png");
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <DropZone onFile={onFile} label="Drop a video to extract frames" />
      ) : (
        <>
          <FileChip file={file} onRemove={reset} />
          {videoSrc && (
            <video ref={videoRef} src={videoSrc} controls className="w-full rounded-xl border border-border max-h-56 object-contain bg-black" />
          )}
          {duration > 0 && <p className="text-xs text-muted-foreground">Duration: {fmtTime(duration)}</p>}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1.5 block">Capture at (m:ss)</label>
              <Input value={timeStr} onChange={e => setTimeStr(e.target.value)} placeholder="0:05" className="h-10 text-sm font-mono" />
            </div>
            <div className="flex items-end">
              <Button onClick={capture} disabled={capturing} className="h-10 gap-2 px-5">
                <Camera className="w-4 h-4" /> {capturing ? "Capturing…" : "Capture PNG"}
              </Button>
            </div>
          </div>
          {preview && (
            <div className="space-y-2">
              <img src={preview} alt="Captured frame" className="w-full rounded-xl border border-border object-contain max-h-64" />
              <p className="text-xs text-muted-foreground text-center">Frame captured — PNG downloaded automatically. Seek to another time and capture again.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── 6. Screen Recorder ────────────────────────────────────────────────────────

function ScreenRecorder() {
  const [state, setState]     = useState<"idle" | "recording" | "done">("idle");
  const [useMic, setUseMic]   = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [error, setError]     = useState("");
  const recRef    = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => { setState("idle"); setOutBlob(null); setError(""); setElapsed(0); };

  const start = async () => {
    setError(""); setOutBlob(null);
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "monitor" } as MediaTrackConstraints,
        audio: true,
      });
      let finalStream = displayStream;
      if (useMic) {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          finalStream = new MediaStream([...displayStream.getTracks(), ...micStream.getAudioTracks()]);
        } catch { /* mic denied — continue without */ }
      }
      const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus") ? "video/webm;codecs=vp8,opus" : "video/webm";
      const recorder = new MediaRecorder(finalStream, { mimeType: mime });
      chunksRef.current = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        finalStream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: mime });
        setOutBlob(blob); setState("done");
        if (timerRef.current) clearInterval(timerRef.current);
      };
      recRef.current = recorder;
      recorder.start(500);
      setState("recording");
      const startAt = Date.now();
      timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startAt) / 1000)), 1000);
      displayStream.getVideoTracks()[0].onended = () => recorder.stop();
    } catch (e) {
      if ((e as Error).name !== "NotAllowedError") setError("Screen capture failed. Use Chrome or Firefox.");
    }
  };

  const stop = () => { recRef.current?.stop(); };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-muted/10 p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <ScreenShare className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Screen Recorder</h3>
          <p className="text-sm text-muted-foreground mt-1">Record your screen, a window, or a browser tab. No software needed.</p>
        </div>

        {state === "idle" && (
          <div className="space-y-3">
            <button onClick={() => setUseMic(m => !m)}
              className={cn("flex items-center gap-2 mx-auto px-4 py-2 rounded-xl border text-sm font-medium transition-all",
                useMic ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
              )}>
              {useMic ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              Microphone {useMic ? "on" : "off"}
            </button>
            <Button onClick={start} className="gap-2 w-full max-w-xs mx-auto">
              <ScreenShare className="w-4 h-4" /> Start Recording
            </Button>
          </div>
        )}

        {state === "recording" && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-rose-400 font-mono font-semibold text-lg">{fmtTime(elapsed)}</span>
              <span className="text-xs text-muted-foreground">Recording…</span>
            </div>
            <Button onClick={stop} variant="destructive" className="gap-2 mx-auto">
              <Square className="w-4 h-4" /> Stop Recording
            </Button>
          </div>
        )}

        {state === "done" && outBlob && (
          <div className="space-y-2">
            <p className="text-sm text-emerald-400 font-medium">Recording complete — {fmtBytes(outBlob.size)}</p>
            <div className="flex gap-2 justify-center flex-wrap">
              <Button onClick={() => dl(outBlob, `screen-recording-${Date.now()}.webm`)} className="gap-2">
                <Download className="w-4 h-4" /> Download WebM
              </Button>
              <Button variant="outline" onClick={reset} className="gap-2">
                <ScreenShare className="w-4 h-4" /> Record Again
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="flex gap-2 items-start rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-sm text-rose-400 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-muted/10 p-3 text-xs text-muted-foreground space-y-1">
        <p><span className="font-medium text-foreground">Browser support:</span> Chrome, Edge, Firefox. Safari is not supported.</p>
        <p><span className="font-medium text-foreground">Privacy:</span> Recording stays in your browser — nothing is uploaded.</p>
        <p><span className="font-medium text-foreground">Output:</span> WebM video, compatible with VLC, Chrome, Firefox, and most video players.</p>
      </div>
    </div>
  );
}

// ─── Suite router ──────────────────────────────────────────────────────────────

const TOOLS: Record<string, { title: string; component: React.ComponentType }> = {
  "video-audio-extractor": { title: "Video to Audio Extractor", component: VideoToAudio },
  "video-trimmer":   { title: "Video Trimmer",            component: VideoTrimmer },
  "video-compressor":{ title: "Video Compressor",         component: VideoCompressor },
  "mp4-to-gif":      { title: "MP4 to GIF Converter",     component: MpFourToGif },
  "video-thumbnail": { title: "Video Thumbnail Extractor",component: VideoThumbnail },
  "screen-recorder": { title: "Screen Recorder",          component: ScreenRecorder },
};

export function VideoToolsSuite() {
  const pathname = usePathname();
  const slug     = pathname.split("/tools/")[1]?.replace(/\/$/, "") ?? "";
  const entry    = TOOLS[slug];
  const Component = entry?.component ?? VideoToAudio;
  return <Component />;
}
