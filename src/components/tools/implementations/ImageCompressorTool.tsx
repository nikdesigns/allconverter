"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadZone, formatBytes2 } from "@/components/tools/shared/FileUploadZone";
import { Download, Trash2, ImageDown, RefreshCw, Layers } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CompressedFile {
  original: File;
  blob: Blob;
  url: string;
  outputName: string;
  savings: number;
  width: number;
  height: number;
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
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(objUrl);
      const mime = fmtMime ?? (file.type === "image/png" ? "image/png" : "image/jpeg");
      canvas.toBlob(
        (blob) => {
          if (blob) resolve({ blob, w, h });
          else reject(new Error("Compression failed"));
        },
        mime,
        quality / 100
      );
    };
    img.onerror = () => { URL.revokeObjectURL(objUrl); reject(new Error("Load failed")); };
    img.src = objUrl;
  });
}

const FORMAT_OPTS = [
  { value: "auto", label: "Auto (keep original)" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WebP" },
];

export function ImageCompressorTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState("");
  const [outputFormat, setOutputFormat] = useState("auto");
  const [results, setResults] = useState<CompressedFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runCompress = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    const mw = maxWidth ? parseInt(maxWidth) : undefined;
    const mime = outputFormat === "auto" ? undefined : outputFormat;
    const extMap: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
    const out: CompressedFile[] = [];

    for (const file of files) {
      try {
        const { blob, w, h } = await compressImage(file, quality, mw, mime);
        const savings = Math.round(((file.size - blob.size) / file.size) * 100);
        const ext = mime ? extMap[mime] : (file.type === "image/png" ? "png" : "jpg");
        out.push({
          original: file,
          blob,
          url: URL.createObjectURL(blob),
          outputName: file.name.replace(/\.[^.]+$/, `_compressed.${ext}`),
          savings,
          width: w,
          height: h,
        });
      } catch {
        toast.error(`Failed: ${file.name}`);
      }
    }
    setResults(out);
    setProcessing(false);
  }, [files, quality, maxWidth, outputFormat]);

  // Auto-recompress whenever settings or files change (debounced 350ms)
  useEffect(() => {
    if (files.length === 0) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(runCompress, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [files, quality, maxWidth, outputFormat, runCompress]);

  const handleFiles = (newFiles: File[]) => {
    setFiles((p) => [...p, ...newFiles]);
    setResults([]);
  };

  const removeFile = (i: number) => {
    setFiles((p) => p.filter((_, idx) => idx !== i));
    setResults([]);
  };

  const downloadAll = () =>
    results.forEach((r) => {
      const a = document.createElement("a");
      a.href = r.url;
      a.download = r.outputName;
      a.click();
    });

  const totalOrig = files.reduce((s, f) => s + f.size, 0);
  const totalComp = results.reduce((s, r) => s + r.blob.size, 0);
  const totalSaved = totalOrig > 0 ? Math.round(((totalOrig - totalComp) / totalOrig) * 100) : 0;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <ImageDown className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Image Compressor</span>
          {processing && (
            <div className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          )}
          {!processing && results.length > 0 && (
            <span className="text-[10px] text-emerald-500 font-medium">● Live</span>
          )}
        </div>
        {files.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => { setFiles([]); setResults([]); }}
            className="h-7 text-xs gap-1"
          >
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
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-input bg-background text-sm"
                >
                  {FORMAT_OPTS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Max width (px)</label>
                <input
                  type="number"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(e.target.value)}
                  placeholder="Keep original"
                  className="w-full h-9 px-3 rounded-xl border border-input bg-background text-sm"
                />
              </div>
            </div>

            {/* Quality slider — live feedback */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Quality
                </label>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold tabular-nums">{quality}%</span>
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                      quality >= 80
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : quality >= 55
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    )}
                  >
                    {quality >= 80 ? "High" : quality >= 55 ? "Medium" : "Low"}
                  </span>
                  {results.length > 0 && totalSaved > 0 && (
                    <span className="text-xs font-semibold text-emerald-500">
                      −{totalSaved}% saved
                    </span>
                  )}
                </div>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-primary h-1.5"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>

            {/* File cards */}
            <div className="space-y-2">
              {files.map((f, i) => {
                const r = results[i];
                const sav = r ? Math.round(((f.size - r.blob.size) / f.size) * 100) : null;
                const positive = sav !== null && sav > 0;
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all duration-300",
                      r && positive
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : r
                        ? "border-amber-500/30 bg-amber-500/5"
                        : "border-border bg-card"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{f.name}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-muted-foreground">{formatBytes2(f.size)}</span>
                        {r ? (
                          <>
                            <span className="text-xs text-muted-foreground">→</span>
                            <span className="text-xs font-semibold">{formatBytes2(r.blob.size)}</span>
                            {sav !== null && (
                              <span
                                className={cn(
                                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                                  positive
                                    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                                    : "text-amber-600 dark:text-amber-400 bg-amber-500/10"
                                )}
                              >
                                {positive ? `−${sav}%` : `+${Math.abs(sav)}%`}
                              </span>
                            )}
                            <span className="text-[10px] text-muted-foreground">
                              {r.width}×{r.height}px
                            </span>
                            {/* Compression bar */}
                            <div className="hidden sm:flex flex-1 max-w-[100px] h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all duration-500",
                                  positive ? "bg-emerald-500" : "bg-amber-500"
                                )}
                                style={{ width: `${Math.min(100, Math.max(5, 100 - (sav ?? 0)))}%` }}
                              />
                            </div>
                          </>
                        ) : (
                          processing && (
                            <div className="w-3 h-3 rounded-full border border-muted-foreground/40 border-t-transparent animate-spin" />
                          )
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
                    <button
                      onClick={() => removeFile(i)}
                      className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            {results.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center gap-2 text-sm">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{files.length} file{files.length > 1 ? "s" : ""}:</span>
                  <span className="font-mono">{formatBytes2(totalOrig)}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-mono font-semibold">{formatBytes2(totalComp)}</span>
                  {totalSaved > 0 && (
                    <span className="font-bold text-emerald-500">({totalSaved}% saved)</span>
                  )}
                </div>
                {results.length > 1 && (
                  <Button variant="outline" onClick={downloadAll} className="gap-1.5 h-8 text-xs">
                    <Download className="w-3.5 h-3.5" /> Download All
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
