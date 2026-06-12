"use client";

import { useState, useRef } from "react";
import { Scissors, Upload, Download, Loader2, CheckCircle2, X, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { decodeAudioFile, sliceAudioBuffer, audioBufferToWav, downloadBlob, fmtTime } from "@/lib/audio-utils";

export function Mp3CutterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
  const [startSec, setStartSec] = useState(0);
  const [endSec, setEndSec] = useState(0);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  async function handleFile(f: File) {
    setFile(f);
    setError("");
    setDone(false);
    setLoading(true);
    try {
      const buf = await decodeAudioFile(f);
      setBuffer(buf);
      setStartSec(0);
      setEndSec(Math.floor(buf.duration));
    } catch {
      setError("Could not decode file. Please try an MP3, WAV, or M4A file.");
    } finally {
      setLoading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function previewRange() {
    if (!buffer) return;
    stopPreview();
    const sliced = sliceAudioBuffer(buffer, startSec, endSec);
    const wav = audioBufferToWav(sliced);
    const url = URL.createObjectURL(wav);
    previewUrlRef.current = url;
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => setPlaying(false);
    audio.play();
    setPlaying(true);
  }

  function stopPreview() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPlaying(false);
  }

  async function cut() {
    if (!buffer || !file) return;
    setProcessing(true);
    setError("");
    try {
      const sliced = sliceAudioBuffer(buffer, startSec, endSec);
      const wav = audioBufferToWav(sliced);
      const outName = file.name.replace(/\.[^.]+$/, "") + `_cut.wav`;
      downloadBlob(wav, outName);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Processing failed.");
    } finally {
      setProcessing(false);
    }
  }

  function reset() {
    stopPreview();
    setFile(null);
    setBuffer(null);
    setDone(false);
    setError("");
  }

  const duration = buffer?.duration ?? 0;
  const selectionLen = endSec - startSec;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      {!buffer ? (
        <div
          className="border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <Scissors className="w-10 h-10 mx-auto mb-3 text-muted-foreground/60" />
          <p className="font-medium text-sm mb-1">Drop your audio file here</p>
          <p className="text-xs text-muted-foreground">MP3, WAV, M4A, OGG supported</p>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="audio/*"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          {loading && <p className="text-xs mt-3 text-primary animate-pulse">Decoding…</p>}
        </div>
      ) : (
        <div className="space-y-5">
          {/* File info */}
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{file?.name}</span>
            <span className="text-muted-foreground">Duration: {fmtTime(duration)}</span>
          </div>

          {/* Range sliders */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Start time</Label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={0.1}
                  value={startSec}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setStartSec(Math.min(v, endSec - 0.1));
                  }}
                  className="flex-1 accent-primary"
                />
                <Input
                  type="number"
                  min={0}
                  max={endSec - 0.1}
                  step={0.1}
                  value={startSec.toFixed(1)}
                  onChange={(e) => setStartSec(Math.max(0, Math.min(parseFloat(e.target.value) || 0, endSec - 0.1)))}
                  className="w-24 text-xs"
                />
                <span className="text-xs text-muted-foreground w-20">{fmtTime(startSec)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">End time</Label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={0.1}
                  value={endSec}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setEndSec(Math.max(v, startSec + 0.1));
                  }}
                  className="flex-1 accent-primary"
                />
                <Input
                  type="number"
                  min={startSec + 0.1}
                  max={duration}
                  step={0.1}
                  value={endSec.toFixed(1)}
                  onChange={(e) => setEndSec(Math.min(duration, Math.max(parseFloat(e.target.value) || 0, startSec + 0.1)))}
                  className="w-24 text-xs"
                />
                <span className="text-xs text-muted-foreground w-20">{fmtTime(endSec)}</span>
              </div>
            </div>
          </div>

          {/* Selection info */}
          <div className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
            Selected: <strong>{fmtTime(startSec)}</strong> → <strong>{fmtTime(endSec)}</strong>
            &nbsp;·&nbsp; Length: <strong>{fmtTime(selectionLen)}</strong>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={playing ? stopPreview : previewRange}
              className="gap-2"
            >
              {playing ? <><Square className="w-3.5 h-3.5" />Stop</> : <><Play className="w-3.5 h-3.5" />Preview</>}
            </Button>
            <Button onClick={cut} disabled={processing || selectionLen <= 0} className="gap-2">
              {processing ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Cutting…</>
              ) : (
                <><Download className="w-4 h-4" />Cut & Download</>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={reset}>
              <X className="w-4 h-4 mr-1" />Clear
            </Button>
          </div>

          {done && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              Download started — output is a WAV file.
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )}

      <div className="text-xs text-muted-foreground/60 pt-2 border-t border-border">
        All processing is done locally in your browser. No files are sent anywhere.
      </div>
    </div>
  );
}
