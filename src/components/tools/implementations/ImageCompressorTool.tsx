"use client";

import { usePersistentState } from "@/lib/persist";
import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileUploadZone, formatBytes2 } from "@/components/tools/shared/FileUploadZone";
import { Download, Trash2, ImageDown, Layers } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ProcessingStatus, useProcessing } from "@/components/processing";
import { compressToTarget, loadImage } from "@/lib/target-size";

interface CompressedFile {
  original: File;
  blob: Blob;
  url: string;
  outputName: string;
  savings: number;
  width: number;
  height: number;
  /** Target-size mode only: false when the limit could not be reached. */
  met?: boolean;
}

function compressImage(
  file: File,
  quality: number,
  maxWidth?: number,
  fmtMime?: string
): Promise<{ blob: Blob; w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objUrl = URL.createObjectURL(file);
    img.onload = () => {
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (maxWidth && w > maxWidth) {
        h = Math.round((h * maxWidth) / w);
        w = maxWidth;
      }
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(objUrl);

      // PNG is lossless — the browser's canvas PNG encoder often produces larger
      // files than the original (especially palette/indexed PNGs). Auto-prefer
      // WebP when no explicit format was chosen and the input is PNG.
      const isPng = file.type === "image/png";
      const mime  = fmtMime ?? (isPng ? "image/webp" : "image/jpeg");

      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error("Compression failed")); return; }
          // If output is still larger than input, return original unchanged
          if (blob.size >= file.size && !maxWidth && !fmtMime) {
            resolve({ blob: file.slice(0, file.size, file.type) as Blob, w, h });
          } else {
            resolve({ blob, w, h });
          }
        },
        mime, quality / 100
      );
    };
    img.onerror = () => { URL.revokeObjectURL(objUrl); reject(new Error("Load failed")); };
    img.src = objUrl;
  });
}

const FORMAT_OPTS = [
  { value: "auto",       label: "Auto (keep original)" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png",  label: "PNG" },
  { value: "image/webp", label: "WebP" },
];

export function ImageCompressorTool() {
  const [files, setFiles]               = useState<File[]>([]);
  const [quality, setQuality]           = usePersistentState("image-compressor.quality", 80);
  const [maxWidth, setMaxWidth]         = useState("");
  const [outputFormat, setOutputFormat] = usePersistentState("image-compressor.format", "auto");
  const [results, setResults]           = useState<CompressedFile[]>([]);
  const [mode, setMode]                 = usePersistentState<"quality" | "target">("image-compressor.mode", "quality");
  const [targetKb, setTargetKb]         = usePersistentState("image-compressor.targetKb", "100");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const proc = useProcessing({ category: "image" });

  const runCompress = useCallback(async () => {
    if (files.length === 0) return;

    // Drive the status states
    await proc.setFile(files[0]!);
    proc.advance("analyzing");
    await new Promise(r => setTimeout(r, 320));

    proc.advance("processing");
    const mw   = maxWidth ? parseInt(maxWidth) : undefined;
    const mime = outputFormat === "auto" ? undefined : outputFormat;
    const extMap: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
    const out: CompressedFile[] = [];

    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx]!;
      proc.setProgress(28 + Math.round(((idx + 0.5) / files.length) * 44));
      try {
        if (mode === "target") {
          const limit = Math.max(1, parseFloat(targetKb) || 0) * 1024;
          // Already under the limit: hand the original back untouched.
          if (file.size <= limit && !mw && !mime) {
            const bmp = await loadImage(file);
            out.push({ original: file, blob: file, url: URL.createObjectURL(file), outputName: file.name, savings: 0, width: bmp.width, height: bmp.height, met: true });
            bmp.close();
            continue;
          }
          const bmp = await loadImage(file);
          const targetMime = mime === "image/webp" ? "image/webp" : "image/jpeg";
          const res = await compressToTarget(bmp, { maxBytes: limit, mime: targetMime, maxDimension: mw });
          bmp.close();
          out.push({
            original: file, blob: res.blob,
            url: URL.createObjectURL(res.blob),
            outputName: file.name.replace(/\.[^.]+$/, `_${Math.round(limit / 1024)}kb.${extMap[targetMime]}`),
            savings: Math.round(((file.size - res.blob.size) / file.size) * 100),
            width: res.width, height: res.height, met: res.met,
          });
          continue;
        }
        const { blob, w, h } = await compressImage(file, quality, mw, mime);
        const savings = Math.round(((file.size - blob.size) / file.size) * 100);
        // Determine actual output mime (auto for PNG → webp)
        const actualMime = mime ?? (file.type === "image/png" ? "image/webp" : "image/jpeg");
        const ext = extMap[actualMime] ?? "jpg";
        out.push({
          original: file, blob,
          url: URL.createObjectURL(blob),
          outputName: file.name.replace(/\.[^.]+$/, `_compressed.${ext}`),
          savings, width: w, height: h,
        });
      } catch {
        toast.error(`Failed: ${file.name}`);
      }
    }

    proc.advance("optimizing");
    await new Promise(r => setTimeout(r, 200));

    setResults(out);

    const totalOrig  = files.reduce((s, f) => s + f.size, 0);
    const totalComp  = out.reduce((s, r) => s + r.blob.size, 0);
    const savedPct   = totalOrig > 0 ? Math.round(((totalOrig - totalComp) / totalOrig) * 100) : 0;
    const gotBigger  = savedPct < 0;

    proc.complete([
      { label: "Original Size",   after: formatBytes2(totalOrig) },
      { label: "Output Size",     after: formatBytes2(totalComp), warn: gotBigger },
      {
        label: gotBigger ? "Size Increase" : "Space Saved",
        after: gotBigger ? `+${Math.abs(savedPct)}%` : `${savedPct}%`,
        delta: gotBigger
          ? "PNG re-encoded by browser — try WebP or JPEG format for smaller files"
          : undefined,
        highlight: savedPct > 0,
        warn: gotBigger,
      },
      { label: "Files Processed", after: `${out.length}` },
    ]);
  }, [files, quality, maxWidth, outputFormat, mode, targetKb, proc]);

  // Auto-recompress whenever settings or files change (debounced 350ms)
  useEffect(() => {
    if (files.length === 0) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(runCompress, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, quality, maxWidth, outputFormat, mode, targetKb]);

  const handleFiles = (newFiles: File[]) => {
    setFiles(p => [...p, ...newFiles]);
    setResults([]);
    proc.reset();
  };

  const removeFile = (i: number) => {
    setFiles(p => p.filter((_, idx) => idx !== i));
    setResults([]);
    proc.reset();
  };

  // One ZIP instead of a burst of separate downloads, which browsers often block.
  const downloadAll = async () => {
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    const used = new Set<string>();
    results.forEach((r) => {
      let name = r.outputName;
      for (let n = 2; used.has(name); n++) name = r.outputName.replace(/(\.[^.]+)$/, `-${n}$1`);
      used.add(name);
      zip.file(name, r.blob);
    });
    const blob = await zip.generateAsync({ type: "blob", compression: "STORE" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "compressed-images.zip"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  };

  const totalOrig  = files.reduce((s, f) => s + f.size, 0);
  const totalComp  = results.reduce((s, r) => s + r.blob.size, 0);
  const totalSaved = totalOrig > 0 ? Math.round(((totalOrig - totalComp) / totalOrig) * 100) : 0;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <ImageDown className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Image Compressor</span>
          {proc.state.stage === "processing" && (
            <span className="relative flex h-2 w-2 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
          )}
          {proc.state.stage === "complete" && (
            <span className="text-[10px] text-emerald-500 font-medium">● Live</span>
          )}
        </div>
        {files.length > 0 && (
          <Button size="sm" variant="ghost" onClick={() => { setFiles([]); setResults([]); proc.reset(); }} className="h-7 text-xs gap-1">
            <Trash2 className="w-3.5 h-3.5" /> Clear all
          </Button>
        )}
      </div>

      <div className="p-5 space-y-5">
        <FileUploadZone
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onFiles={handleFiles}
          label="Drop images here or click to upload"
          sublabel="JPG, PNG, WebP, GIF — updates in real time as you adjust settings"
        />

        {files.length > 0 && (
          <>
            {/* Controls */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Output format</label>
                <select aria-label="Output format"
                  value={outputFormat}
                  onChange={e => setOutputFormat(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-input bg-background text-sm"
                >
                  {FORMAT_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Max width (px)</label>
                <input aria-label="Max width (px)"
                  type="number" value={maxWidth}
                  onChange={e => setMaxWidth(e.target.value)}
                  placeholder="Keep original"
                  className="w-full h-9 px-3 rounded-xl border border-input bg-background text-sm"
                />
              </div>
            </div>

            {/* Mode: by quality, or to a file-size limit */}
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Compression mode">
              {([["quality", "By quality"], ["target", "To a target size"]] as const).map(([m, label]) => (
                <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}
                  className={cn("h-9 rounded-xl border text-xs font-medium transition-all",
                    mode === m ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground")}>
                  {label}
                </button>
              ))}
            </div>

            {mode === "target" && (
              <div>
                <label htmlFor="target-kb" className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Maximum file size</label>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <input id="target-kb" type="number" min={1} value={targetKb}
                      onChange={e => setTargetKb(e.target.value)}
                      className="w-24 h-9 px-3 rounded-xl border border-input bg-background text-sm" />
                    <span className="text-sm text-muted-foreground">KB</span>
                  </div>
                  {[20, 50, 100, 200, 500, 1024].map(kb => (
                    <button key={kb} type="button" onClick={() => setTargetKb(String(kb))}
                      className={cn("h-8 px-2.5 rounded-lg border text-xs transition-all",
                        targetKb === String(kb) ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground")}>
                      {kb >= 1024 ? "1 MB" : `${kb} KB`}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  Each image is saved at the highest quality that fits. Dimensions are reduced only if quality alone is not enough. Output is JPEG, or WebP if selected above.
                </p>
              </div>
            )}

            {/* Quality slider */}
            <div className={mode === "target" ? "hidden" : undefined}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quality</label>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold tabular-nums">{quality}%</span>
                  <span className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                    quality >= 80 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : quality >= 55 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  )}>
                    {quality >= 80 ? "High" : quality >= 55 ? "Medium" : "Low"}
                  </span>
                  {results.length > 0 && totalSaved > 0 && (
                    <span className="text-xs font-semibold text-emerald-500">−{totalSaved}% saved</span>
                  )}
                </div>
              </div>
              <input aria-label="Quality" type="range" min={5} max={100} value={quality}
                onChange={e => setQuality(Number(e.target.value))}
                className="w-full accent-primary h-1.5" />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>Smaller file</span><span>Better quality</span>
              </div>
            </div>

            {/* ── Processing Status ─────────────────────────────────── */}
            <AnimatePresence>
              {proc.state.stage !== "idle" && (
                <ProcessingStatus
                  state={proc.state}
                  config={proc.config}
                  onRetry={runCompress}
                  showFileCard={files.length === 1}
                />
              )}
            </AnimatePresence>

            {/* Per-file result cards — shown after complete */}
            {results.length > 0 && (
              <div className="space-y-2">
                {files.map((f, i) => {
                  const r = results[i];
                  const sav = r ? Math.round(((f.size - r.blob.size) / f.size) * 100) : null;
                  const positive = sav !== null && sav > 0;
                  return (
                    <div key={i} className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all duration-300",
                      r && positive ? "border-emerald-500/30 bg-emerald-500/5"
                      : r ? "border-amber-500/30 bg-amber-500/5"
                      : "border-border bg-card"
                    )}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{f.name}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs text-muted-foreground">{formatBytes2(f.size)}</span>
                          {r && (
                            <>
                              <span className="text-xs text-muted-foreground">→</span>
                              <span className="text-xs font-semibold">{formatBytes2(r.blob.size)}</span>
                              {sav !== null && (
                                <span className={cn(
                                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                                  positive ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                                  : "text-amber-600 dark:text-amber-400 bg-amber-500/10"
                                )}>
                                  {positive ? `−${sav}%` : `+${Math.abs(sav)}%`}
                                </span>
                              )}
                              <span className="text-[10px] text-muted-foreground">{r.width}×{r.height}px</span>
                              {r.met === false && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-rose-600 dark:text-rose-400 bg-rose-500/10">
                                  Could not reach target
                                </span>
                              )}
                              <div className="hidden sm:flex flex-1 max-w-25 h-1.5 rounded-full bg-muted overflow-hidden">
                                <div className={cn(
                                  "h-full rounded-full transition-all duration-500",
                                  positive ? "bg-emerald-500" : "bg-amber-500"
                                )} style={{ width: `${Math.min(100, Math.max(5, 100 - (sav ?? 0)))}%` }} />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      {r && (
                        <a href={r.url} download={r.outputName}>
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 shrink-0">
                            <Download className="w-3 h-3" /> Save
                          </Button>
                        </a>
                      )}
                      <button aria-label="Remove" onClick={() => removeFile(i)}
                        className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Summary bar */}
            {results.length > 1 && (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center gap-2 text-sm">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{files.length} files:</span>
                  <span className="font-mono">{formatBytes2(totalOrig)}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-mono font-semibold">{formatBytes2(totalComp)}</span>
                  {totalSaved > 0 && <span className="font-bold text-emerald-500">({totalSaved}% saved)</span>}
                </div>
                <Button variant="outline" onClick={downloadAll} className="gap-1.5 h-8 text-xs">
                  <Download className="w-3.5 h-3.5" /> Download all (ZIP)
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
