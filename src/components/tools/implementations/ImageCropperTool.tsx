"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUploadZone } from "@/components/tools/shared/FileUploadZone";
import { Download, Crop, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type AspectPreset = { label: string; ratio: number | null };
const ASPECT_PRESETS: AspectPreset[] = [
  { label: "Free", ratio: null },
  { label: "1:1", ratio: 1 },
  { label: "4:3", ratio: 4/3 },
  { label: "16:9", ratio: 16/9 },
  { label: "3:2", ratio: 3/2 },
  { label: "2:3", ratio: 2/3 },
  { label: "9:16", ratio: 9/16 },
];

interface CropRect { x: number; y: number; w: number; h: number; }

export function ImageCropperTool() {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState("");
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [aspectPreset, setAspectPreset] = useState(0);
  const [cropRect, setCropRect] = useState<CropRect>({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ mx: 0, my: 0, cx: 0, cy: 0 });
  const [outputUrl, setOutputUrl] = useState("");
  const [outputSize, setOutputSize] = useState({ w: 0, h: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = (files: File[]) => {
    const f = files[0]; setFile(f); setOutputUrl("");
    const url = URL.createObjectURL(f); setImageSrc(url);
    const img = new Image();
    img.onload = () => { setNaturalW(img.naturalWidth); setNaturalH(img.naturalHeight); imgRef.current = img; drawCanvas(); };
    img.src = url;
  };

  const drawCanvas = useCallback(() => {
    if (!canvasRef.current || !imgRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const img = imgRef.current;
    const dpr = window.devicePixelRatio || 1;
    const displayW = canvas.offsetWidth;
    const displayH = canvas.offsetHeight;
    canvas.width = displayW * dpr;
    canvas.height = displayH * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, displayW, displayH);

    // Scale image to fit canvas
    const scale = Math.min(displayW / img.naturalWidth, displayH / img.naturalHeight);
    const imgW = img.naturalWidth * scale;
    const imgH = img.naturalHeight * scale;
    const imgX = (displayW - imgW) / 2;
    const imgY = (displayH - imgH) / 2;

    ctx.drawImage(img, imgX, imgY, imgW, imgH);

    // Crop overlay
    const cx = imgX + cropRect.x * imgW;
    const cy = imgY + cropRect.y * imgH;
    const cw = cropRect.w * imgW;
    const ch = cropRect.h * imgH;

    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(imgX, imgY, imgW, imgH);
    ctx.clearRect(cx, cy, cw, ch);
    ctx.drawImage(img, imgX + cropRect.x * imgW, imgY + cropRect.y * imgH, cw, ch, cx, cy, cw, ch);
    ctx.strokeStyle = "rgba(99,102,241,0.9)";
    ctx.lineWidth = 2;
    ctx.strokeRect(cx, cy, cw, ch);

    // Handles
    const hs = 8;
    ctx.fillStyle = "rgba(99,102,241,1)";
    [[cx,cy],[cx+cw,cy],[cx,cy+ch],[cx+cw,cy+ch]].forEach(([hx,hy]) => ctx.fillRect(hx-hs/2,hy-hs/2,hs,hs));
  }, [cropRect]);

  useEffect(() => { drawCanvas(); }, [cropRect, drawCanvas]);

  const getRelativePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!; const rect = canvas.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getRelativePos(e);
    if (!imgRef.current) return;
    const scale = Math.min(1 / imgRef.current.naturalWidth, 1 / imgRef.current.naturalHeight);
    setDragging(true);
    setDragStart({ mx: pos.x, my: pos.y, cx: cropRect.x, cy: cropRect.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging) return;
    const pos = getRelativePos(e);
    const dx = pos.x - dragStart.mx;
    const dy = pos.y - dragStart.my;
    const aspect = ASPECT_PRESETS[aspectPreset].ratio;
    let nx = Math.max(0, Math.min(1 - cropRect.w, dragStart.cx + dx));
    let ny = Math.max(0, Math.min(1 - cropRect.h, dragStart.cy + dy));
    setCropRect(prev => ({ ...prev, x: nx, y: ny }));
  };

  const handleMouseUp = () => setDragging(false);

  const applyCrop = () => {
    if (!imgRef.current || !file) return;
    const img = imgRef.current;
    const canvas = document.createElement("canvas");
    const px = Math.round(cropRect.x * img.naturalWidth);
    const py = Math.round(cropRect.y * img.naturalHeight);
    const pw = Math.round(cropRect.w * img.naturalWidth);
    const ph = Math.round(cropRect.h * img.naturalHeight);
    canvas.width = pw; canvas.height = ph;
    canvas.getContext("2d")!.drawImage(img, px, py, pw, ph, 0, 0, pw, ph);
    canvas.toBlob((blob) => {
      if (blob) { setOutputUrl(URL.createObjectURL(blob)); setOutputSize({ w: pw, h: ph }); }
    }, file.type || "image/jpeg", 0.95);
  };

  const outputName = file ? file.name.replace(/\.[^.]+$/, `_cropped$&`) : "";

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Crop className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Image Cropper</span>
      </div>
      <div className="p-5 space-y-4">
        {!file ? (
          <FileUploadZone accept="image/*" onFiles={handleFile} label="Drop an image to crop" />
        ) : (
          <>
            {/* Aspect ratio */}
            <div className="flex flex-wrap gap-1.5">
              {ASPECT_PRESETS.map((p, i) => (
                <button key={i} onClick={() => setAspectPreset(i)}
                  className={cn("px-2.5 py-1 rounded-lg border text-xs font-medium transition-all",
                    aspectPreset === i ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground")}>
                  {p.label}
                </button>
              ))}
            </div>

            {/* Canvas */}
            <div className="relative rounded-xl overflow-hidden border border-border bg-muted/10" style={{ height: 360 }}>
              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Drag the crop area to reposition. Crop: {Math.round(cropRect.x*100)}%,{Math.round(cropRect.y*100)}% — {Math.round(cropRect.w*100)}%×{Math.round(cropRect.h*100)}%
            </p>

            <div className="flex gap-2">
              <Button onClick={applyCrop} className="flex-1 gap-2">
                <Crop className="w-4 h-4" /> Apply Crop
              </Button>
              <Button variant="outline" onClick={() => { setFile(null); setOutputUrl(""); }} className="gap-1.5">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {outputUrl && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center gap-4">
                <img src={outputUrl} alt="Cropped" className="w-16 h-16 object-cover rounded-lg border" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Cropped: {outputSize.w}×{outputSize.h} px</p>
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
