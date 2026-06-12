"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadZone, UploadedFileCard, formatBytes2 } from "@/components/tools/shared/FileUploadZone";
import { Download, Trash2, ImageDown, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CompressedFile {
  original: File;
  blob: Blob;
  url: string;
  outputName: string;
  savings: number;
}

function compressImage(file: File, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) resolve(blob);
          else reject(new Error("Compression failed"));
        },
        mimeType,
        quality / 100
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
    img.src = url;
  });
}

export function ImageCompressorTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(80);
  const [results, setResults] = useState<CompressedFile[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setResults([]);
  };

  const compress = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    const compressed: CompressedFile[] = [];
    for (const file of files) {
      try {
        const blob = await compressImage(file, quality);
        const savings = Math.round(((file.size - blob.size) / file.size) * 100);
        const ext = file.type === "image/png" ? "png" : "jpg";
        const outputName = file.name.replace(/\.[^.]+$/, `_compressed.${ext}`);
        compressed.push({
          original: file,
          blob,
          url: URL.createObjectURL(blob),
          outputName,
          savings: Math.max(0, savings),
        });
      } catch {
        toast.error(`Failed to compress ${file.name}`);
      }
    }
    setResults(compressed);
    setProcessing(false);
    toast.success(`Compressed ${compressed.length} image${compressed.length > 1 ? "s" : ""}`);
  };

  const downloadAll = () => {
    results.forEach((r) => {
      const a = document.createElement("a");
      a.href = r.url;
      a.download = r.outputName;
      a.click();
    });
  };

  const clear = () => { setFiles([]); setResults([]); };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <ImageDown className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Image Compressor</span>
        </div>
        {files.length > 0 && (
          <Button size="sm" variant="ghost" onClick={clear} className="h-7 text-xs gap-1">
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </Button>
        )}
      </div>

      <div className="p-5 space-y-5">
        <FileUploadZone
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onFiles={handleFiles}
          label="Drop images here or click to upload"
          sublabel="JPG, PNG, WebP, GIF supported"
        />

        {files.length > 0 && (
          <>
            {/* Quality slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quality</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tabular-nums">{quality}%</span>
                  <span className="text-xs text-muted-foreground">
                    {quality >= 80 ? "High" : quality >= 60 ? "Medium" : "Low"}
                  </span>
                </div>
              </div>
              <input type="range" min={10} max={100} value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-primary h-1.5" />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>Smaller file</span><span>Better quality</span>
              </div>
            </div>

            {/* File list */}
            <div className="space-y-2">
              {files.map((f, i) => {
                const r = results[i];
                return (
                  <div key={i} className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border",
                    r ? "border-emerald-500/30 bg-emerald-500/5" : "border-border bg-card"
                  )}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{f.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes2(f.size)}
                        {r && <span className="ml-2 text-emerald-600 dark:text-emerald-400 font-medium">→ {formatBytes2(r.blob.size)} <span className="text-emerald-500">(-{r.savings}%)</span></span>}
                      </p>
                    </div>
                    {r && (
                      <a href={r.url} download={r.outputName}>
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                          <Download className="w-3 h-3" /> Save
                        </Button>
                      </a>
                    )}
                    <button onClick={() => { setFiles(prev => prev.filter((_, idx) => idx !== i)); setResults([]); }}
                      className="p-1 rounded hover:bg-muted transition-all shrink-0">
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <Button onClick={compress} disabled={processing} className="flex-1 gap-2">
                {processing ? (
                  <><div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />Compressing…</>
                ) : (
                  <><ArrowDown className="w-4 h-4" />Compress {files.length} Image{files.length > 1 ? "s" : ""}</>
                )}
              </Button>
              {results.length > 1 && (
                <Button variant="outline" onClick={downloadAll} className="gap-1.5">
                  <Download className="w-4 h-4" /> All
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
