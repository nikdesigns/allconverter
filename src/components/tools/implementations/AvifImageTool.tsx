"use client";

import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload, Download, ImageIcon } from "lucide-react";
import { toast } from "sonner";

// AVIF is supported natively in modern browsers. We use canvas to convert.
// AVIF→JPG/PNG: draw to canvas via <img>, export as JPEG/PNG
// JPG/PNG→AVIF: draw to canvas, export as image/avif (Chrome 93+, Firefox 113+)

export function AvifImageTool() {
  const pathname = usePathname();
  const slug = pathname?.split("/").filter(Boolean).at(-1) ?? "avif-to-jpg";
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(90);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isAvifInput = slug === "avif-to-jpg" || slug === "avif-to-png";
  const outputFormat = slug === "avif-to-jpg" || slug === "jpg-to-avif" ? (slug === "avif-to-jpg" ? "jpeg" : "avif") : (slug === "avif-to-png" ? "png" : "avif");

  const title: Record<string,string> = {
    "avif-to-jpg": "AVIF to JPG", "avif-to-png": "AVIF to PNG",
    "jpg-to-avif": "JPG to AVIF", "png-to-avif": "PNG to AVIF",
  };
  const accept: Record<string,string> = {
    "avif-to-jpg": "image/avif,.avif", "avif-to-png": "image/avif,.avif",
    "jpg-to-avif": "image/jpeg,.jpg,.jpeg", "png-to-avif": "image/png,.png",
  };

  const handleFile = (f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const convert = async () => {
    if (!file || !preview) return;
    setLoading(true);
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new window.Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image. AVIF may not be supported in this browser."));
        img.src = preview;
      });
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      const mime = outputFormat === "avif" ? "image/avif" : outputFormat === "jpeg" ? "image/jpeg" : "image/png";
      const q = outputFormat === "png" ? undefined : quality / 100;
      const dataUrl = canvas.toDataURL(mime, q);
      const a = document.createElement("a");
      a.href = dataUrl;
      const ext = outputFormat === "jpeg" ? "jpg" : outputFormat;
      a.download = file.name.replace(/\.[^.]+$/, `.${ext}`);
      a.click();
      toast.success("Converted successfully!");
    } catch (e) { toast.error((e as Error).message); }
    setLoading(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <ImageIcon className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{title[slug] ?? "Image Converter"}</span>
      </div>
      <div className="p-5 space-y-4">
        {(slug === "jpg-to-avif" || slug === "png-to-avif") && (
          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-400">
            AVIF export requires Chrome 93+, Firefox 113+, or Safari 16.4+. Older browsers will fall back to PNG.
          </div>
        )}
        <div
          className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
          onClick={() => fileRef.current?.click()}
          onDragOver={e=>e.preventDefault()}
          onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleFile(f);}}>
          {preview
            ? <img src={preview} alt="preview" className="max-h-40 mx-auto rounded-lg object-contain" onError={()=>setPreview(null)} />
            : <><Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" /><p className="text-sm font-medium">Upload {isAvifInput?"AVIF":slug.includes("jpg")?"JPG":"PNG"} image</p></>}
        </div>
        <input ref={fileRef} type="file" accept={accept[slug]} className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f);}} />

        {outputFormat !== "png" && (
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Quality: {quality}%</label>
            <input type="range" min={10} max={100} step={5} value={quality} onChange={e=>setQuality(+e.target.value)} className="w-full" />
          </div>
        )}
        <Button onClick={convert} disabled={!file || loading} className="w-full gap-2">
          <Download className="w-4 h-4" />{loading ? "Converting…" : `Convert to ${outputFormat.toUpperCase()}`}
        </Button>
      </div>
    </div>
  );
}
