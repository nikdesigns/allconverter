"use client";


import { usePersistentState } from "@/lib/persist";
import { useHandoff } from "@/lib/handoff";
import { activateOnKey } from "@/lib/a11y";
import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { FileAudio, Upload, Download, Loader2, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { decodeAudioFile, downloadBlob } from "@/lib/audio-utils";
import { encodeAudio, AUDIO_FORMAT_INFO, type AudioFormat } from "@/lib/audio-encoders";
import { ProcessingStatus, useProcessing } from "@/components/processing";

const ACCEPT: Record<string, string> = {
  "mp4-to-mp3":      "video/mp4,audio/mp4,.mp4",
  "video-to-audio":  "video/*,.mp4,.mkv,.avi,.mov,.webm",
  "wav-to-mp3":      "audio/wav,.wav",
  "mp3-to-wav":      "audio/mpeg,.mp3",
  "m4a-to-mp3":      "audio/m4a,.m4a,audio/aac,.aac",
  "aac-to-mp3":      "audio/aac,.aac,audio/m4a,.m4a",
  "flac-to-mp3":     "audio/flac,.flac",
  "mp3-to-flac":     "audio/mpeg,.mp3",
  "mp3-to-aac":      "audio/mpeg,.mp3",
};

const LABEL: Record<string, { from: string; format: AudioFormat; note: string }> = {
  "mp4-to-mp3":     { from: "MP4 video",  format: "mp3",  note: "Extracts the audio track from your video and encodes it as MP3." },
  "video-to-audio": { from: "video file", format: "wav",  note: "Extracts the audio track from any browser-supported video." },
  "wav-to-mp3":     { from: "WAV",        format: "mp3",  note: "Compresses uncompressed WAV audio to MP3, typically a tenth of the size." },
  "mp3-to-wav":     { from: "MP3",        format: "wav",  note: "Converts lossy MP3 to uncompressed WAV for editing." },
  "m4a-to-mp3":     { from: "M4A / AAC",  format: "mp3",  note: "Decodes AAC audio and re-encodes it as MP3 for players that cannot read M4A." },
  "aac-to-mp3":     { from: "AAC / M4A",  format: "mp3",  note: "Decodes AAC audio and re-encodes it as MP3." },
  "flac-to-mp3":    { from: "FLAC",       format: "mp3",  note: "Encodes lossless FLAC to a much smaller MP3." },
  "mp3-to-flac":    { from: "MP3",        format: "flac", note: "Stores the decoded MP3 in a lossless FLAC file. Quality lost to MP3 is not restored." },
  "mp3-to-aac":     { from: "MP3",        format: "aac",  note: "Re-encodes MP3 audio as AAC using your browser's built-in encoder." },
};

const BITRATES = [128, 192, 256, 320];

interface Props { slug?: string }

export function AudioConverterTool({ slug = "mp3-to-wav" }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const [kbps, setKbps] = usePersistentState("audio-converter.kbps", 192);
  const inputRef = useRef<HTMLInputElement>(null);

  const proc = useProcessing({ category: "audio" });
  const info = LABEL[slug] ?? LABEL["mp3-to-wav"];
  const format = AUDIO_FORMAT_INFO[info.format];

  useHandoff(ACCEPT[slug] ?? "audio/*", false, (files) => handleFile(files[0]));

  function handleFile(f: File) {
    setFile(f);
    setStatus("idle");
    setError("");
    proc.reset();
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function convert() {
    if (!file) return;
    setStatus("processing");
    setProgress("Decoding audio…");
    setError("");
    await proc.setFile(file);
    proc.advance("analyzing");
    try {
      const buffer = await decodeAudioFile(file);
      setProgress(`Encoding ${info.format.toUpperCase()}…`);
      proc.advance("processing");
      const out = await encodeAudio(buffer, info.format, {
        kbps,
        onProgress: (f) => setProgress(`Encoding ${info.format.toUpperCase()}… ${Math.round(f * 100)}%`),
      });
      const outName = file.name.replace(/\.[^.]+$/, "") + "." + format.ext;
      downloadBlob(out, outName);
      setStatus("done");
      proc.complete([
        { label: "Input Format", after: info.from },
        { label: "Output Format", after: format.label + (format.lossy ? ` · ${kbps} kbps` : ""), highlight: true },
        { label: "Duration", after: `${buffer.duration.toFixed(1)}s` },
        { label: "File Size", before: `${(file.size / 1024 / 1024).toFixed(2)} MB`, after: `${(out.size / 1024 / 1024).toFixed(2)} MB` },
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not decode file. Is this a supported audio/video format?";
      setError(msg);
      setStatus("error");
      proc.error(msg);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      <div className="text-sm text-muted-foreground bg-muted/40 rounded-xl px-4 py-3">
        {info.note}
        <span className="block mt-1 text-xs opacity-70">Output format: {format.label}</span>
      </div>

      {format.lossy && (
        <div className="flex items-center gap-3">
          <label htmlFor="audio-bitrate" className="text-sm font-medium">Bitrate</label>
          <select
            id="audio-bitrate"
            value={kbps}
            onChange={(e) => setKbps(Number(e.target.value))}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {BITRATES.map((b) => (
              <option key={b} value={b}>{b} kbps{b === 192 ? " (recommended)" : ""}</option>
            ))}
          </select>
          <span className="text-xs text-muted-foreground">Higher is better quality and a larger file.</span>
        </div>
      )}

      {/* Drop zone */}
      <div role="button" tabIndex={0} onKeyDown={activateOnKey}
        className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <FileAudio className="w-10 h-10 mx-auto mb-3 text-muted-foreground/60" />
        {file ? (
          <div className="space-y-1">
            <p className="font-medium text-sm">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <>
            <p className="font-medium text-sm mb-1">Drop your {info.from} here</p>
            <p className="text-xs text-muted-foreground">or click to browse</p>
          </>
        )}
        <input aria-label="Choose file"
          ref={inputRef}
          type="file"
          className="hidden"
          accept={ACCEPT[slug] ?? "audio/*,video/*"}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={convert} disabled={!file || status === "processing"} className="gap-2">
          {status === "processing" ? (
            <><Loader2 className="w-4 h-4 animate-spin" />{progress}</>
          ) : (
            <><Download className="w-4 h-4" />Convert & Download</>
          )}
        </Button>
        {file && (
          <Button variant="ghost" size="sm" onClick={() => { setFile(null); setStatus("idle"); setError(""); }}>
            <X className="w-4 h-4 mr-1" />Clear
          </Button>
        )}
      </div>

      <AnimatePresence>
        {proc.state.stage !== "idle" && (
          <ProcessingStatus state={proc.state} config={proc.config} onRetry={convert} showFileCard={false} showSteps={false} />
        )}
      </AnimatePresence>

      {status === "done" && proc.state.stage !== "complete" && (
        <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          Download started — check your Downloads folder.
        </div>
      )}
      {status === "error" && proc.state.stage !== "error" && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="text-xs text-muted-foreground/60 pt-2 border-t border-border">
        Processing happens entirely in your browser. No files are uploaded to any server.
      </div>
    </div>
  );
}
