"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Copy, Download, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ColorSwatch {
  hex: string;
  r: number;
  g: number;
  b: number;
  count: number;
  name: string;
}

function toHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function colorName(r: number, g: number, b: number): string {
  const [h, s, l] = rgbToHsl(r, g, b);
  if (l < 10) return "Black";
  if (l > 90) return "White";
  if (s < 15) return l < 35 ? "Dark Gray" : l < 65 ? "Gray" : "Light Gray";
  if (h < 15 || h >= 345) return l < 40 ? "Dark Red" : "Red";
  if (h < 40) return s > 80 ? "Orange" : "Brown";
  if (h < 65) return s > 70 ? "Yellow" : "Khaki";
  if (h < 155) return l < 40 ? "Dark Green" : "Green";
  if (h < 195) return "Cyan";
  if (h < 255) return l < 40 ? "Dark Blue" : "Blue";
  if (h < 290) return "Purple";
  if (h < 345) return "Pink";
  return "Color";
}

function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function quantizeColors(imageData: ImageData, k = 8): ColorSwatch[] {
  const pixels: [number, number, number][] = [];
  const data = imageData.data;
  const step = Math.max(4, Math.floor(data.length / 4 / 5000)) * 4;
  for (let i = 0; i < data.length; i += step) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    if (a < 128) continue;
    const [, s, l] = rgbToHsl(r, g, b);
    if (l < 3 || l > 97) continue; // skip near-black and near-white extremes
    pixels.push([r, g, b]);
  }
  if (pixels.length === 0) return [];

  // K-means clustering
  let centroids: [number, number, number][] = Array.from({ length: k }, (_, i) => {
    const idx = Math.floor((i / k) * pixels.length);
    return [...pixels[idx]] as [number, number, number];
  });

  for (let iter = 0; iter < 10; iter++) {
    const clusters: [number, number, number][][] = Array.from({ length: k }, () => []);
    for (const p of pixels) {
      let minDist = Infinity, closest = 0;
      for (let c = 0; c < centroids.length; c++) {
        const d = colorDistance(p[0], p[1], p[2], centroids[c][0], centroids[c][1], centroids[c][2]);
        if (d < minDist) { minDist = d; closest = c; }
      }
      clusters[closest].push(p);
    }
    centroids = clusters.map(cluster => {
      if (cluster.length === 0) return centroids[0];
      const avg = cluster.reduce((a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]);
      return avg.map(v => Math.round(v / cluster.length)) as [number, number, number];
    });
  }

  return centroids
    .map((c, i) => {
      const count = pixels.filter(p => {
        let minDist = Infinity, closest = 0;
        for (let j = 0; j < centroids.length; j++) {
          const d = colorDistance(p[0], p[1], p[2], centroids[j][0], centroids[j][1], centroids[j][2]);
          if (d < minDist) { minDist = d; closest = j; }
        }
        return closest === i;
      }).length;
      return { hex: toHex(c[0], c[1], c[2]), r: c[0], g: c[1], b: c[2], count, name: colorName(c[0], c[1], c[2]) };
    })
    .filter(s => s.count > 0)
    .sort((a, b) => b.count - a.count);
}

export function ColorPaletteExtractorTool() {
  const [swatches, setSwatches]   = useState<ColorSwatch[]>([]);
  const [imgSrc, setImgSrc]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const [colorCount, setCount]    = useState(8);
  const inputRef                  = useRef<HTMLInputElement>(null);
  const canvasRef                 = useRef<HTMLCanvasElement>(null);

  const processImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image"); return; }
    setLoading(true);
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const MAX = 200;
      const scale = Math.min(MAX / img.width, MAX / img.height, 1);
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const palette = quantizeColors(data, colorCount);
      setSwatches(palette);
      setLoading(false);
    };
    img.onerror = () => { toast.error("Failed to load image"); setLoading(false); };
    img.src = url;
  }, [colorCount]);

  const copyCss = () => {
    const css = swatches.map((s, i) => `--color-${i + 1}: ${s.hex};`).join("\n");
    navigator.clipboard.writeText(`:root {\n${css}\n}`);
    toast.success("Copied CSS variables!");
  };

  const copyHex = () => {
    navigator.clipboard.writeText(swatches.map(s => s.hex).join(", "));
    toast.success("Copied hex codes!");
  };

  const downloadPalette = () => {
    const canvas = document.createElement("canvas");
    canvas.width = swatches.length * 80;
    canvas.height = 120;
    const ctx = canvas.getContext("2d")!;
    swatches.forEach((s, i) => {
      ctx.fillStyle = s.hex;
      ctx.fillRect(i * 80, 0, 80, 80);
      ctx.fillStyle = "#000";
      ctx.font = "10px monospace";
      ctx.fillText(s.hex, i * 80 + 4, 95);
    });
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "palette.png";
    a.click();
    toast.success("Downloaded palette!");
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Palette className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Color Palette Extractor</span>
        <span className="ml-auto text-[10px] text-muted-foreground">Upload Image → Extract Colors</span>
      </div>
      <canvas ref={canvasRef} className="hidden" />

      <div className="p-5 space-y-4">

        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) processImage(f); }}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={cn(
            "border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden",
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          )}
        >
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) processImage(f); }} />
          {imgSrc ? (
            <img src={imgSrc} alt="uploaded" className="w-full max-h-48 object-contain bg-checkerboard" />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-10">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <div className="text-sm font-medium">Drop image here or click to upload</div>
              <div className="text-xs text-muted-foreground">PNG, JPG, WebP, SVG</div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs text-muted-foreground shrink-0">Colors to extract:</label>
          <input type="range" min={4} max={12} value={colorCount}
            onChange={e => setCount(+e.target.value)}
            className="flex-1 accent-primary" />
          <span className="text-sm font-medium w-4">{colorCount}</span>
          {imgSrc && (
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => {
              const f = inputRef.current?.files?.[0];
              if (f) processImage(f);
            }}>
              Re-extract
            </Button>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground text-sm">
            <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            Extracting palette…
          </div>
        )}

        {swatches.length > 0 && !loading && (
          <div className="space-y-4">
            {/* Color bar */}
            <div className="flex h-12 rounded-xl overflow-hidden border border-border">
              {swatches.map((s, i) => (
                <div key={i} title={`${s.name} — ${s.hex}`} style={{ backgroundColor: s.hex, flex: s.count }} className="cursor-pointer transition-all hover:scale-x-110" onClick={() => { navigator.clipboard.writeText(s.hex); toast.success(`Copied ${s.hex}`); }} />
              ))}
            </div>

            {/* Swatch grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {swatches.map((s, i) => (
                <button key={i} onClick={() => { navigator.clipboard.writeText(s.hex); toast.success(`Copied ${s.hex}`); }}
                  className="group rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all">
                  <div className="h-12" style={{ backgroundColor: s.hex }} />
                  <div className="p-2 bg-background">
                    <div className="text-xs font-mono font-semibold">{s.hex}</div>
                    <div className="text-[10px] text-muted-foreground">{s.name}</div>
                    <div className="text-[9px] text-muted-foreground/60">rgb({s.r},{s.g},{s.b})</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={copyHex} className="h-8 text-xs gap-1.5">
                <Copy className="w-3 h-3" /> Copy Hex Codes
              </Button>
              <Button size="sm" variant="outline" onClick={copyCss} className="h-8 text-xs gap-1.5">
                <Copy className="w-3 h-3" /> Copy CSS Variables
              </Button>
              <Button size="sm" variant="outline" onClick={downloadPalette} className="h-8 text-xs gap-1.5">
                <Download className="w-3 h-3" /> Download Palette
              </Button>
            </div>

            {/* CSS output */}
            <pre className="rounded-xl bg-muted/20 border border-border p-3 text-xs font-mono overflow-x-auto">
              {`:root {\n${swatches.map((s, i) => `  --color-${i + 1}: ${s.hex}; /* ${s.name} */`).join("\n")}\n}`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
