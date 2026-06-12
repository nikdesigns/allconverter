"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, Aperture } from "lucide-react";
import { toast } from "sonner";

// Note: DPI is metadata, not actual pixel count. "Converting DPI" for display
// purposes typically means we set the metadata but the image looks the same.
// For a true resize (print resolution), we calculate new pixel dimensions.

export function ImageDpiConverterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [targetDpi, setTargetDpi] = useState(300);
  const [sourceDpi, setSourceDpi] = useState(72);
  const [format, setFormat] = useState<"jpeg"|"png">("jpeg");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new window.Image();
    img.onload = () => { setNaturalW(img.naturalWidth); setNaturalH(img.naturalHeight); };
    img.src = url;
  };

  const newW = Math.round(naturalW * targetDpi / sourceDpi);
  const newH = Math.round(naturalH * targetDpi / sourceDpi);

  const convert = () => {
    if (!file || !preview) return;
    const canvas = document.createElement("canvas");
    canvas.width = newW; canvas.height = newH;
    const ctx = canvas.getContext("2d")!;
    const img = new window.Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, newW, newH);
      const mime = format === "png" ? "image/png" : "image/jpeg";
      const dataUrl = canvas.toDataURL(mime, 0.95);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = file.name.replace(/\.[^.]+$/, `_${targetDpi}dpi.${format === "png" ? "png" : "jpg"}`);
      a.click();
      toast.success(`Saved at ${targetDpi} DPI (${newW}×${newH} px)`);
    };
    img.src = preview;
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Aperture className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Image DPI Converter</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-blue-400">
          DPI conversion rescales the image pixel dimensions. Higher DPI at the same physical size = more pixels.
        </div>
        <div
          className="border-2 border-dashed border-border rounded-2xl p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
          onClick={() => fileRef.current?.click()}
          onDragOver={e=>e.preventDefault()}
          onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleFile(f);}}>
          {preview
            ? <img src={preview} alt="preview" className="max-h-32 mx-auto rounded-lg object-contain" />
            : <><Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" /><p className="text-sm font-medium">Upload image</p></>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f);}} />
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-muted-foreground mb-1 block">Current DPI (source)</label>
            <Input type="number" value={sourceDpi} onChange={e=>setSourceDpi(+e.target.value)} className="font-mono text-sm" /></div>
          <div><label className="text-xs text-muted-foreground mb-1 block">Target DPI</label>
            <div className="flex gap-1.5 mb-1 flex-wrap">
              {[72,96,150,300,600].map(d=>(
                <button key={d} onClick={()=>setTargetDpi(d)} className={`px-2 py-1 rounded-lg border text-xs font-mono ${targetDpi===d?"border-primary/40 bg-primary/10 text-primary":"border-border"}`}>{d}</button>
              ))}
            </div>
            <Input type="number" value={targetDpi} onChange={e=>setTargetDpi(+e.target.value)} className="font-mono text-sm" /></div>
        </div>
        {naturalW > 0 && (
          <div className="p-3 rounded-xl border border-border bg-muted/10 text-sm">
            <span className="text-muted-foreground">Original: </span><code className="font-mono">{naturalW}×{naturalH}</code>
            <span className="text-muted-foreground mx-2">→</span>
            <span className="text-muted-foreground">New: </span><code className="font-mono text-primary">{newW}×{newH}</code>
          </div>
        )}
        <div className="flex gap-2">
          {(["jpeg","png"] as const).map(f=>(
            <button key={f} onClick={()=>setFormat(f)} className={`flex-1 py-2 rounded-xl border text-xs font-mono font-medium uppercase ${format===f?"border-primary/40 bg-primary/10 text-primary":"border-border text-muted-foreground"}`}>{f}</button>
          ))}
        </div>
        <Button onClick={convert} disabled={!file} className="w-full gap-2">
          <Download className="w-4 h-4" />Convert DPI & Download
        </Button>
      </div>
    </div>
  );
}
