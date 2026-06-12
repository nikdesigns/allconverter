"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUploadZone } from "@/components/tools/shared/FileUploadZone";
import { Download, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ResizeMode = "pixels" | "percent" | "preset";
const PRESETS = [
  { label: "HD (1280×720)", w: 1280, h: 720 },
  { label: "Full HD (1920×1080)", w: 1920, h: 1080 },
  { label: "4K (3840×2160)", w: 3840, h: 2160 },
  { label: "Square (1:1)", w: 1000, h: 1000 },
  { label: "Social Post (1080×1080)", w: 1080, h: 1080 },
  { label: "Twitter Card (1200×630)", w: 1200, h: 630 },
  { label: "OG Image (1200×630)", w: 1200, h: 630 },
  { label: "Thumbnail (320×180)", w: 320, h: 180 },
];

export function ImageResizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [mode, setMode] = useState<ResizeMode>("pixels");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [percent, setPercent] = useState("50");
  const [preset, setPreset] = useState(0);
  const [keepRatio, setKeepRatio] = useState(true);
  const [outputUrl, setOutputUrl] = useState("");
  const [outputDims, setOutputDims] = useState({ w: 0, h: 0 });
  const [processing, setProcessing] = useState(false);

  const handleFile = (files: File[]) => {
    const f = files[0];
    setFile(f);
    setOutputUrl("");
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setOrigW(img.naturalWidth);
      setOrigH(img.naturalHeight);
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
      URL.revokeObjectURL(url);
    };
    img.src = url;
    setPreview(URL.createObjectURL(f));
  };

  const onWidthChange = (v: string) => {
    setWidth(v);
    if (keepRatio && origW && origH) {
      const w = parseInt(v);
      if (!isNaN(w)) setHeight(String(Math.round((w * origH) / origW)));
    }
  };
  const onHeightChange = (v: string) => {
    setHeight(v);
    if (keepRatio && origW && origH) {
      const h = parseInt(v);
      if (!isNaN(h)) setWidth(String(Math.round((h * origW) / origH)));
    }
  };

  const resize = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      let targetW: number, targetH: number;
      if (mode === "pixels") {
        targetW = parseInt(width) || origW;
        targetH = parseInt(height) || origH;
      } else if (mode === "percent") {
        const p = parseFloat(percent) / 100;
        targetW = Math.round(origW * p);
        targetH = Math.round(origH * p);
      } else {
        targetW = PRESETS[preset].w;
        targetH = PRESETS[preset].h;
      }

      await new Promise<void>((resolve) => {
        const img = new Image();
        const src = URL.createObjectURL(file);
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext("2d")!;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, targetW, targetH);
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(src);
            if (blob) {
              setOutputUrl(URL.createObjectURL(blob));
              setOutputDims({ w: targetW, h: targetH });
            }
            resolve();
          }, file.type || "image/jpeg", 0.92);
        };
        img.src = src;
      });
      toast.success("Image resized successfully");
    } finally {
      setProcessing(false);
    }
  };

  const outputName = file ? file.name.replace(/\.[^.]+$/, `_${outputDims.w}x${outputDims.h}$&`) : "";

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Maximize2 className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Image Resizer</span>
      </div>
      <div className="p-5 space-y-5">
        {!file ? (
          <FileUploadZone accept="image/*" onFiles={handleFile} label="Drop an image to resize" sublabel="JPG, PNG, WebP, GIF supported" />
        ) : (
          <>
            {/* Image preview + info */}
            <div className="flex items-start gap-4">
              <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-border" />
              <div className="flex-1">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{origW} × {origH} px · {(file.size / 1024).toFixed(1)} KB</p>
                <button onClick={() => { setFile(null); setOutputUrl(""); }} className="text-xs text-muted-foreground hover:text-destructive mt-1 transition-colors">Remove</button>
              </div>
            </div>

            {/* Mode tabs */}
            <div>
              <div className="flex bg-muted rounded-lg p-0.5 mb-4">
                {(["pixels", "percent", "preset"] as ResizeMode[]).map((m) => (
                  <button key={m} onClick={() => setMode(m)}
                    className={cn("flex-1 py-1.5 rounded-md text-xs font-medium capitalize transition-all",
                      mode === m ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                    {m === "pixels" ? "By Pixels" : m === "percent" ? "By %" : "Presets"}
                  </button>
                ))}
              </div>

              {mode === "pixels" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Width (px)</label>
                      <Input type="number" value={width} onChange={(e) => onWidthChange(e.target.value)} className="h-10" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Height (px)</label>
                      <Input type="number" value={height} onChange={(e) => onHeightChange(e.target.value)} className="h-10" />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                    <input type="checkbox" checked={keepRatio} onChange={(e) => setKeepRatio(e.target.checked)} className="accent-primary" />
                    Maintain aspect ratio
                  </label>
                </div>
              )}

              {mode === "percent" && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Scale: {percent}%</label>
                  <input type="range" min={5} max={200} value={percent} onChange={(e) => setPercent(e.target.value)} className="w-full accent-primary h-1.5" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Output: {Math.round(origW * parseFloat(percent) / 100)} × {Math.round(origH * parseFloat(percent) / 100)} px
                  </p>
                </div>
              )}

              {mode === "preset" && (
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map((p, i) => (
                    <button key={i} onClick={() => setPreset(i)}
                      className={cn("p-2.5 rounded-xl border text-left text-xs transition-all",
                        preset === i ? "border-primary/40 bg-primary/8 text-foreground" : "border-border hover:border-primary/20")}>
                      <p className="font-medium">{p.label}</p>
                      <p className="text-muted-foreground">{p.w}×{p.h}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button onClick={resize} disabled={processing} className="w-full gap-2">
              {processing ? <><div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />Resizing…</> : "Resize Image"}
            </Button>

            {outputUrl && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center gap-4">
                <img src={outputUrl} alt="Output" className="w-16 h-16 object-cover rounded-lg border border-border" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Resized to {outputDims.w} × {outputDims.h} px</p>
                </div>
                <a href={outputUrl} download={outputName}>
                  <Button size="sm" className="gap-1.5"><Download className="w-3.5 h-3.5" />Download</Button>
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
