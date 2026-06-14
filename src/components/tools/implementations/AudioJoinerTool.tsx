"use client";

import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { ListMusic, Plus, Download, Loader2, CheckCircle2, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { decodeAudioFile, joinAudioBuffers, audioBufferToWav, downloadBlob, fmtTime } from "@/lib/audio-utils";
import { ProcessingStatus, useProcessing } from "@/components/processing";

interface AudioItem {
  id: string;
  file: File;
  buffer: AudioBuffer;
}

export function AudioJoinerTool() {
  const [items, setItems] = useState<AudioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const proc = useProcessing({ category: "audio" });

  async function addFiles(files: FileList | File[]) {
    setLoading(true);
    setError("");
    setDone(false);
    const arr = Array.from(files);
    const newItems: AudioItem[] = [];
    for (const f of arr) {
      try {
        const buffer = await decodeAudioFile(f);
        newItems.push({ id: `${Date.now()}-${Math.random()}`, file: f, buffer });
      } catch {
        setError(`Could not decode "${f.name}" — skipped.`);
      }
    }
    setItems((prev) => [...prev, ...newItems]);
    setLoading(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }

  function move(id: string, dir: -1 | 1) {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx < 0) return prev;
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function join() {
    if (items.length < 2) return;
    setProcessing(true);
    setError("");
    await proc.setFile(items[0].file);
    proc.advance("processing");
    try {
      const joined = joinAudioBuffers(items.map((i) => i.buffer));
      proc.advance("optimizing");
      const wav = audioBufferToWav(joined);
      downloadBlob(wav, "joined_audio.wav");
      setDone(true);
      proc.complete([
        { label: "Files Joined", after: `${items.length}` },
        { label: "Total Duration", after: fmtTime(joined.duration), highlight: true },
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Join failed.";
      setError(msg);
      proc.error(msg);
    } finally {
      setProcessing(false);
    }
  }

  const totalDuration = items.reduce((n, i) => n + i.buffer.duration, 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      {/* Drop zone */}
      <div
        className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Plus className="w-8 h-8 mx-auto mb-2 text-muted-foreground/60" />
        <p className="text-sm font-medium mb-1">Add audio files</p>
        <p className="text-xs text-muted-foreground">MP3, WAV, M4A, OGG — drag multiple or click to browse</p>
        {loading && <p className="text-xs mt-2 text-primary animate-pulse">Loading…</p>}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="audio/*"
          className="hidden"
          onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); }}
        />
      </div>

      {/* File list */}
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/40 border border-border"
            >
              <span className="text-xs text-muted-foreground w-5 text-right">{idx + 1}</span>
              <ListMusic className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.file.name}</p>
                <p className="text-xs text-muted-foreground">{fmtTime(item.buffer.duration)} · {(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => move(item.id, -1)}
                  disabled={idx === 0}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-30"
                  title="Move up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => move(item.id, 1)}
                  disabled={idx === items.length - 1}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-30"
                  title="Move down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => remove(item.id)}
                  className="p-1.5 rounded hover:bg-destructive/10 text-destructive"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          <div className="text-xs text-muted-foreground px-2">
            {items.length} files · Total: {fmtTime(totalDuration)}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={join} disabled={items.length < 2 || processing} className="gap-2">
          {processing ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Joining…</>
          ) : (
            <><Download className="w-4 h-4" />Join & Download</>
          )}
        </Button>
        {items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => { setItems([]); setDone(false); }}>
            Clear all
          </Button>
        )}
      </div>

      {items.length < 2 && items.length > 0 && (
        <p className="text-xs text-amber-600 dark:text-amber-400">Add at least 2 files to join.</p>
      )}

      <AnimatePresence>
        {proc.state.stage !== "idle" && (
          <ProcessingStatus state={proc.state} config={proc.config} onRetry={join} showFileCard={false} showSteps={false} />
        )}
      </AnimatePresence>

      {done && proc.state.stage !== "complete" && (
        <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          Download started — output saved as joined_audio.wav
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="text-xs text-muted-foreground/60 pt-2 border-t border-border">
        Files are joined in the order shown. Processing is 100% local — no uploads.
      </div>
    </div>
  );
}
