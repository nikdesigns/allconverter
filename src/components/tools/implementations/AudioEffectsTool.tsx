"use client";

import { useState, useRef } from "react";
import { Volume2, Gauge, AudioLines, Upload, Download, Loader2, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { decodeAudioFile, applyGain, audioBufferToWav, downloadBlob, fmtTime } from "@/lib/audio-utils";

type Mode = "audio-volume-booster" | "audio-speed-changer" | "audio-compressor";

const CONFIG: Record<Mode, { icon: React.ElementType; label: string; description: string }> = {
  "audio-volume-booster": {
    icon: Volume2,
    label: "Volume Booster",
    description: "Amplify quiet audio up to 5×. Clipping is prevented automatically.",
  },
  "audio-speed-changer": {
    icon: Gauge,
    label: "Speed Changer",
    description: "Speed up or slow down audio without pitch distortion (0.25× – 4×).",
  },
  "audio-compressor": {
    icon: AudioLines,
    label: "Audio Compressor",
    description: "Apply dynamic range compression to even out loud and quiet sections.",
  },
};

interface Props { slug?: string }

export function AudioEffectsTool({ slug = "audio-volume-booster" }: Props) {
  const mode = (slug as Mode) in CONFIG ? (slug as Mode) : "audio-volume-booster";
  const cfg = CONFIG[mode];
  const Icon = cfg.icon;

  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  // Controls
  const [gain, setGain] = useState(2);         // volume booster: 1–5
  const [speed, setSpeed] = useState(1.5);      // speed: 0.25–4
  const [threshold, setThreshold] = useState(-24); // compressor threshold dB
  const [ratio, setRatio] = useState(4);         // compressor ratio

  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(f: File) {
    setFile(f);
    setError("");
    setDone(false);
    setLoading(true);
    try {
      setBuffer(await decodeAudioFile(f));
    } catch {
      setError("Could not decode file.");
    } finally {
      setLoading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function processVolumeBooster(buf: AudioBuffer): Promise<AudioBuffer> {
    return applyGain(buf, gain);
  }

  async function processSpeedChanger(buf: AudioBuffer): Promise<AudioBuffer> {
    const sr = buf.sampleRate;
    const newLength = Math.floor(buf.length / speed);
    const offline = new OfflineAudioContext(buf.numberOfChannels, newLength, sr);
    const src = offline.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = speed;
    src.connect(offline.destination);
    src.start(0);
    return offline.startRendering();
  }

  async function processCompressor(buf: AudioBuffer): Promise<AudioBuffer> {
    const sr = buf.sampleRate;
    const offline = new OfflineAudioContext(buf.numberOfChannels, buf.length, sr);
    const src = offline.createBufferSource();
    src.buffer = buf;
    const comp = offline.createDynamicsCompressor();
    comp.threshold.value = threshold;
    comp.knee.value = 10;
    comp.ratio.value = ratio;
    comp.attack.value = 0.003;
    comp.release.value = 0.25;
    const gainNode = offline.createGain();
    gainNode.gain.value = 1.5; // makeup gain
    src.connect(comp);
    comp.connect(gainNode);
    gainNode.connect(offline.destination);
    src.start(0);
    return offline.startRendering();
  }

  async function process() {
    if (!buffer || !file) return;
    setProcessing(true);
    setError("");
    try {
      let out: AudioBuffer;
      if (mode === "audio-volume-booster") out = await processVolumeBooster(buffer);
      else if (mode === "audio-speed-changer") out = await processSpeedChanger(buffer);
      else out = await processCompressor(buffer);

      const wav = audioBufferToWav(out);
      const suffix = mode === "audio-volume-booster" ? "_boosted" : mode === "audio-speed-changer" ? "_speed" : "_compressed";
      downloadBlob(wav, file.name.replace(/\.[^.]+$/, "") + suffix + ".wav");
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Processing failed.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      <div className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/40 rounded-xl px-4 py-3">
        <Icon className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
        {cfg.description}
      </div>

      {/* Drop zone */}
      {!buffer ? (
        <div
          className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground/60" />
          <p className="font-medium text-sm mb-1">Drop your audio file here</p>
          <p className="text-xs text-muted-foreground">MP3, WAV, M4A, OGG</p>
          {loading && <p className="text-xs mt-2 text-primary animate-pulse">Decoding…</p>}
          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between text-sm bg-muted/40 rounded-xl px-4 py-2">
          <span className="font-medium truncate">{file?.name}</span>
          <span className="text-muted-foreground shrink-0 ml-3">{fmtTime(buffer.duration)}</span>
        </div>
      )}

      {/* Controls */}
      {buffer && (
        <div className="space-y-4">
          {mode === "audio-volume-booster" && (
            <div className="space-y-2">
              <Label className="text-xs flex justify-between">
                <span>Volume multiplier</span>
                <span className="font-mono text-primary">{gain.toFixed(1)}×</span>
              </Label>
              <input
                type="range" min={1} max={5} step={0.1} value={gain}
                onChange={(e) => setGain(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1× (no change)</span><span>3×</span><span>5× (loudest)</span>
              </div>
            </div>
          )}

          {mode === "audio-speed-changer" && (
            <div className="space-y-2">
              <Label className="text-xs flex justify-between">
                <span>Playback speed</span>
                <span className="font-mono text-primary">{speed.toFixed(2)}×</span>
              </Label>
              <input
                type="range" min={0.25} max={4} step={0.05} value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.25× (slow)</span><span>1× (normal)</span><span>4× (fast)</span>
              </div>
            </div>
          )}

          {mode === "audio-compressor" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs flex justify-between">
                  <span>Threshold</span>
                  <span className="font-mono text-primary">{threshold} dB</span>
                </Label>
                <input
                  type="range" min={-60} max={0} step={1} value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>-60 dB (heavy)</span><span>0 dB (off)</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs flex justify-between">
                  <span>Ratio</span>
                  <span className="font-mono text-primary">{ratio}:1</span>
                </Label>
                <input
                  type="range" min={1} max={20} step={0.5} value={ratio}
                  onChange={(e) => setRatio(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1:1 (none)</span><span>20:1 (limiting)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={process} disabled={!buffer || processing} className="gap-2">
          {processing ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Processing…</>
          ) : (
            <><Download className="w-4 h-4" />Process & Download</>
          )}
        </Button>
        {buffer && (
          <Button variant="ghost" size="sm" onClick={() => { setFile(null); setBuffer(null); setDone(false); setError(""); }}>
            <X className="w-4 h-4 mr-1" />Clear
          </Button>
        )}
      </div>

      {done && (
        <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          Download started — output saved as WAV.
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="text-xs text-muted-foreground/60 pt-2 border-t border-border">
        All processing is done locally in your browser — no files are uploaded.
      </div>
    </div>
  );
}
