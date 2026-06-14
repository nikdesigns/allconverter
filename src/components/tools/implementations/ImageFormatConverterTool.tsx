"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/tools/shared/FileUploadZone";
import { Download, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatBytes2 } from "@/components/tools/shared/FileUploadZone";
import { ProcessingStatus, useProcessing } from "@/components/processing";

interface ConvertedFile { name: string; url: string; blob: Blob; }

const CONFIG: Record<string, { from: string; to: string; mimeIn: string; mimeOut: string; ext: string; quality: number }> = {
  "jpg-to-png":  { from: "JPG", to: "PNG",  mimeIn: "image/jpeg", mimeOut: "image/png",  ext: "png",  quality: 1 },
  "png-to-jpg":  { from: "PNG", to: "JPG",  mimeIn: "image/png",  mimeOut: "image/jpeg", ext: "jpg",  quality: 0.92 },
  "png-to-webp": { from: "PNG", to: "WebP", mimeIn: "image/png",  mimeOut: "image/webp", ext: "webp", quality: 0.9 },
  "jpg-to-webp": { from: "JPG", to: "WebP", mimeIn: "image/jpeg", mimeOut: "image/webp", ext: "webp", quality: 0.9 },
  "webp-to-png": { from: "WebP","to": "PNG", mimeIn: "image/webp", mimeOut: "image/png",  ext: "png",  quality: 1 },
  "webp-to-jpg": { from: "WebP","to": "JPG", mimeIn: "image/webp", mimeOut: "image/jpeg", ext: "jpg",  quality: 0.92 },
};

function convertImage(file: File, outMime: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      if (outMime === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(src);
      canvas.toBlob((b) => b ? resolve(b) : reject(new Error("Conversion failed")), outMime, quality);
    };
    img.onerror = () => { URL.revokeObjectURL(src); reject(new Error("Failed to load")); };
    img.src = src;
  });
}

export function ImageFormatConverterTool() {
  const pathname = usePathname();
  const slug = pathname?.split("/").filter(Boolean).at(-1) ?? "jpg-to-png";
  const cfg = CONFIG[slug] ?? CONFIG["jpg-to-png"];

  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ConvertedFile[]>([]);
  const [processing, setProcessing] = useState(false);

  const proc = useProcessing({ category: "image" });

  const handleFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setResults([]);
    proc.reset();
  };

  const convert = async () => {
    if (!files.length) return;
    setProcessing(true);
    await proc.setFile(files[0]);
    proc.advance("analyzing");
    const out: ConvertedFile[] = [];
    try {
      proc.advance("processing");
      for (let i = 0; i < files.length; i++) {
        proc.setProgress(52 + Math.round(((i + 0.5) / files.length) * 38));
        const f = files[i];
        try {
          const blob = await convertImage(f, cfg.mimeOut, cfg.quality);
          const name = f.name.replace(/\.[^.]+$/, `.${cfg.ext}`);
          out.push({ name, url: URL.createObjectURL(blob), blob });
        } catch { toast.error(`Failed to convert ${f.name}`); }
      }
      setResults(out);
      const totalSize = out.reduce((s, r) => s + r.blob.size, 0);
      proc.complete([
        { label: "Files Converted", after: `${out.length}` },
        { label: "Output Format", after: cfg.to },
        { label: "Total Output Size", after: formatBytes2(totalSize), highlight: true },
      ]);
      if (out.length) toast.success(`Converted ${out.length} file${out.length > 1 ? "s" : ""}`);
    } catch {
      proc.error("Conversion failed");
    } finally {
      setProcessing(false);
    }
  };

  const downloadAll = () => results.forEach((r) => { const a = document.createElement("a"); a.href = r.url; a.download = r.name; a.click(); });

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{cfg.from} to {cfg.to} Converter</span>
        </div>
        {files.length > 0 && (
          <Button size="sm" variant="ghost" onClick={() => { setFiles([]); setResults([]); }} className="h-7 text-xs gap-1">
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </Button>
        )}
      </div>

      <div className="p-5 space-y-4">
        <FileUploadZone accept="image/*" multiple onFiles={handleFiles}
          label={`Drop ${cfg.from} files here`} sublabel={`Files will be converted to ${cfg.to} format`} />

        {files.length > 0 && (
          <>
            <div className="space-y-2">
              {files.map((f, i) => {
                const r = results[i];
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{formatBytes2(f.size)} → {cfg.to}</p>
                    </div>
                    {r ? (
                      <a href={r.url} download={r.name}>
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                          <Download className="w-3 h-3" /> Save
                        </Button>
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">{cfg.from}</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <Button onClick={convert} disabled={processing} className="flex-1 gap-2">
                {processing ? (
                  <><div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />Converting…</>
                ) : `Convert to ${cfg.to}`}
              </Button>
              {results.length > 1 && (
                <Button variant="outline" onClick={downloadAll} className="gap-1.5">
                  <Download className="w-4 h-4" /> All
                </Button>
              )}
            </div>

            <AnimatePresence>
              {proc.state.stage !== "idle" && (
                <ProcessingStatus state={proc.state} config={proc.config} onRetry={convert} showFileCard={false} />
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
