"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, Image } from "lucide-react";
import { toast } from "sonner";

const FAVICON_SIZES = [16, 32, 48, 64, 96, 128, 180, 192, 256, 512];

export function FaviconGeneratorTool() {
  const [src, setSrc] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Array<{size:number; dataUrl:string}>>([]);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [padding, setPadding] = useState(10);
  const [roundedCorners, setRoundedCorners] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback((imgSrc: string, bg: string, pad: number, rounded: boolean) => {
    const img = new window.Image();
    img.onload = () => {
      const newPreviews = FAVICON_SIZES.map(size => {
        const canvas = document.createElement("canvas");
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = bg;
        if (rounded) {
          const r = size * 0.15;
          ctx.beginPath();
          ctx.moveTo(r, 0);
          ctx.lineTo(size - r, 0);
          ctx.quadraticCurveTo(size, 0, size, r);
          ctx.lineTo(size, size - r);
          ctx.quadraticCurveTo(size, size, size - r, size);
          ctx.lineTo(r, size);
          ctx.quadraticCurveTo(0, size, 0, size - r);
          ctx.lineTo(0, r);
          ctx.quadraticCurveTo(0, 0, r, 0);
          ctx.closePath();
          ctx.fill();
          ctx.clip();
        } else {
          ctx.fillRect(0, 0, size, size);
        }
        const p = (size * pad) / 100;
        ctx.drawImage(img, p, p, size - p * 2, size - p * 2);
        return { size, dataUrl: canvas.toDataURL("image/png") };
      });
      setPreviews(newPreviews);
    };
    img.src = imgSrc;
  }, []);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string;
      setSrc(result);
      processImage(result, bgColor, padding, roundedCorners);
    };
    reader.readAsDataURL(file);
  };

  const regenerate = () => { if (src) processImage(src, bgColor, padding, roundedCorners); };

  const download = (size: number, dataUrl: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `favicon-${size}x${size}.png`;
    a.click();
    toast.success(`Downloaded ${size}×${size}`);
  };

  const downloadAll = () => {
    previews.forEach(({ size, dataUrl }, i) => {
      setTimeout(() => download(size, dataUrl), i * 100);
    });
  };

  const htmlSnippet = `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">`;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Image className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Favicon Generator</span>
      </div>
      <div className="p-5 space-y-4">
        <div
          className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
          onClick={() => fileRef.current?.click()}
          onDragOver={e=>e.preventDefault()}
          onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleFile(f);}}>
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium">Upload your logo or icon</p>
          <p className="text-xs text-muted-foreground mt-1">PNG, SVG, JPG — transparent PNG works best</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f);}} />

        {src && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div><label className="text-xs text-muted-foreground mb-1 block">Background</label>
                <Input type="color" value={bgColor} onChange={e=>setBgColor(e.target.value)} className="h-10 p-1 cursor-pointer" /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Padding %</label>
                <Input type="number" min={0} max={40} value={padding} onChange={e=>setPadding(+e.target.value)} className="text-sm font-mono" /></div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={roundedCorners} onChange={e=>setRoundedCorners(e.target.checked)} className="w-4 h-4 rounded" />
                  Rounded corners
                </label>
              </div>
            </div>
            <Button onClick={regenerate} className="w-full">Regenerate</Button>
          </>
        )}

        {previews.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{previews.length} sizes generated</span>
              <Button size="sm" onClick={downloadAll} className="gap-1 h-7 text-xs"><Download className="w-3 h-3" />Download All</Button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {previews.map(({ size, dataUrl }) => (
                <button key={size} onClick={() => download(size, dataUrl)}
                  className="group flex flex-col items-center gap-1.5 p-2 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all">
                  <img src={dataUrl} alt={`${size}×${size}`}
                    style={{ width: Math.min(size, 48), height: Math.min(size, 48), imageRendering: size <= 32 ? "pixelated" : "auto" }}
                    className="rounded" />
                  <span className="text-[10px] font-mono text-muted-foreground group-hover:text-primary">{size}px</span>
                </button>
              ))}
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">HTML snippet</p>
              <pre className="p-3 rounded-xl bg-muted/10 border border-border text-xs font-mono whitespace-pre-wrap">{htmlSnippet}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
