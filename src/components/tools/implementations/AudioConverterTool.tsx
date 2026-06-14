"use client";

import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { FileAudio, Upload, Download, Loader2, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { decodeAudioFile, audioBufferToWav, downloadBlob } from "@/lib/audio-utils";
import { ProcessingStatus, useProcessing } from "@/components/processing";

const ACCEPT: Record<string, string> = {
  "mp4-to-mp3":      "video/mp4,audio/mp4,.mp4",
  "video-to-audio":  "video/*,.mp4,.mkv,.avi,.mov,.webm",
  "wav-to-mp3":      "audio/wav,.wav",
  "mp3-to-wav":      "audio/mpeg,.mp3",
  "m4a-to-mp3":      "audio/m4a,.m4a,audio/aac,.aac",
};

const LABEL: Record<string, { from: string; to: string; note?: string }> = {
  "mp4-to-mp3":     { from: "MP4 video", to: "WAV audio", note: "Extracts the audio track from your video." },
  "video-to-audio": { from: "video file", to: "WAV audio", note: "Strips audio from any browser-supported video." },
  "wav-to-mp3":     { from: "WAV", to: "WAV (lossless)", note: "WAV files are already uncompressed — this re-exports at 44.1 kHz stereo." },
  "mp3-to-wav":     { from: "MP3", to: "WAV", note: "Converts lossy MP3 to uncompressed WAV for editing." },
  "m4a-to-mp3":     { from: "M4A / AAC", to: "WAV", note: "Decodes AAC audio and exports as uncompressed WAV." },
};

interface Props { slug?: string }

export function AudioConverterTool({ slug = "mp3-to-wav" }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const proc = useProcessing({ category: "audio" });
  const info = LABEL[slug] ?? LABEL["mp3-to-wav"];

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
      setProgress("Encoding WAV…");
      proc.advance("processing");
      const wav = audioBufferToWav(buffer);
      const outName = file.name.replace(/\.[^.]+$/, "") + ".wav";
      downloadBlob(wav, outName);
      setStatus("done");
      proc.complete([
        { label: "Input Format", after: info.from },
        { label: "Output Format", after: "WAV", highlight: true },
        { label: "Duration", after: `${buffer.duration.toFixed(1)}s` },
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
        <span className="block mt-1 text-xs opacity-70">Output format: WAV (16-bit PCM, lossless)</span>
      </div>

      {/* Drop zone */}
      <div
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
        <input
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
