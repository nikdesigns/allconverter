"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/tools/shared/FileUploadZone";
import { Download, RotateCcw, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Adjustments {
  brightness: number;   // -100 → +100  (maps to 0.5× – 1.5×)
  contrast: number;     // -100 → +100
  saturation: number;   // -100 → +100  (0 = greyscale, 100 = normal, 200 = vivid)
  temperature: number;  // -50 → +50    (negative = cool, positive = warm)
  sharpness: number;    // 0 → 100
  vignette: number;     // 0 → 100
}

const DEFAULT: Adjustments = {
  brightness: 0, contrast: 0, saturation: 0,
  temperature: 0, sharpness: 0, vignette: 0,
};

// ── Presets ────────────────────────────────────────────────────────────────────

const PRESETS: { label: string; values: Adjustments }[] = [
  { label: "Portrait",  values: { brightness: 5,  contrast: 10, saturation: 15, temperature: 12, sharpness: 30, vignette: 25 } },
  { label: "Vivid",     values: { brightness: 5,  contrast: 25, saturation: 50, temperature: 5,  sharpness: 50, vignette: 15 } },
  { label: "Landscape", values: { brightness: 0,  contrast: 20, saturation: 35, temperature: -8, sharpness: 40, vignette: 10 } },
  { label: "Soft",      values: { brightness: 10, contrast: -15,saturation: 10, temperature: 15, sharpness: 0,  vignette: 20 } },
  { label: "B & W",     values: { brightness: 5,  contrast: 20, saturation: -100, temperature: 0, sharpness: 25, vignette: 30 } },
  { label: "Night",     values: { brightness: 15, contrast: 30, saturation: 20, temperature: -15, sharpness: 35, vignette: 40 } },
];

// ── Canvas Rendering ───────────────────────────────────────────────────────────

function applyAdjustments(
  src: HTMLImageElement,
  adj: Adjustments,
  canvas: HTMLCanvasElement,
) {
  const { naturalWidth: w, naturalHeight: h } = src;
  canvas.width  = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // 1. Brightness + Contrast + Saturation via ctx.filter (GPU-accelerated)
  const b = 1 + adj.brightness / 100;
  const c = 1 + adj.contrast   / 100;
  const s = Math.max(0, 1 + adj.saturation / 100);
  ctx.filter = `brightness(${b}) contrast(${c}) saturate(${s})`;
  ctx.drawImage(src, 0, 0);
  ctx.filter = "none";

  // 2. Color temperature — shift R/B channels pixel-by-pixel
  if (adj.temperature !== 0) {
    const imgData = ctx.getImageData(0, 0, w, h);
    const d = imgData.data;
    const t = adj.temperature; // -50 .. +50
    const rShift = Math.round(t * 1.2);   // warm → +R, cool → -R
    const bShift = Math.round(-t * 1.2);  // warm → -B, cool → +B
    for (let i = 0; i < d.length; i += 4) {
      d[i]   = Math.min(255, Math.max(0, d[i]   + rShift));
      d[i+2] = Math.min(255, Math.max(0, d[i+2] + bShift));
    }
    ctx.putImageData(imgData, 0, 0);
  }

  // 3. Unsharp mask sharpening (3×3 Laplacian added back)
  if (adj.sharpness > 0) {
    const factor = adj.sharpness / 100; // 0..1
    const imgData  = ctx.getImageData(0, 0, w, h);
    const src8     = new Uint8ClampedArray(imgData.data);
    const dst8     = imgData.data;
    // 3×3 unsharp mask kernel weights
    const K = [-1, -1, -1, -1, 9, -1, -1, -1, -1]; // divide by 1
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const base = (y * w + x) * 4;
        for (let c = 0; c < 3; c++) {
          let acc = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              acc += src8[((y + ky) * w + (x + kx)) * 4 + c] * K[(ky + 1) * 3 + (kx + 1)];
            }
          }
          const sharp = Math.min(255, Math.max(0, acc));
          // blend between original and sharpened
          dst8[base + c] = Math.round(src8[base + c] * (1 - factor) + sharp * factor);
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  // 4. Vignette — radial gradient overlay
  if (adj.vignette > 0) {
    const opacity = adj.vignette / 100 * 0.75; // max 75% opacity
    const cx = w / 2, cy = h / 2;
    const radius = Math.sqrt(cx * cx + cy * cy);
    const grad = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, `rgba(0,0,0,${opacity.toFixed(2)})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
}

// ── Auto-enhance: Histogram analysis ──────────────────────────────────────────

function analyzeAndEnhance(img: HTMLImageElement): Adjustments {
  const MAX = 400;
  const scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth  * scale);
  const h = Math.round(img.naturalHeight * scale);
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  const total = w * h;

  let sumL = 0, sumSq = 0, sumR = 0, sumG = 0, sumB = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2];
    // Rec.709 luminance
    const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    sumL  += L;
    sumSq += L * L;
    sumR  += r; sumG += g; sumB += b;
  }
  const meanL = sumL  / total;
  const stdL  = Math.sqrt(sumSq / total - meanL * meanL);
  const meanR = sumR / total;
  const meanB = sumB / total;

  // Brightness correction: target mean luminance ≈ 118 (46%)
  const brightAdj = Math.round(Math.max(-40, Math.min(40, (118 - meanL) * 0.45)));

  // Contrast correction: target std-dev ≈ 55
  const contrastAdj = Math.round(Math.max(-20, Math.min(40, (55 - stdL) * 0.6)));

  // Saturation boost if image looks dull
  const satAdj = meanL < 50 ? 10 : stdL < 40 ? 20 : 10;

  // Temperature: if R channel is much lower than B, add warmth
  const tempAdj = Math.round(Math.max(-20, Math.min(20, (meanR - meanB) * -0.15)));

  // Sharpness always modest
  const sharpAdj = 25;

  return {
    brightness: brightAdj,
    contrast:   contrastAdj,
    saturation: satAdj,
    temperature: tempAdj,
    sharpness:  sharpAdj,
    vignette:   10,
  };
}

// ── CSS filter string for live preview ────────────────────────────────────────

function getCssFilter(adj: Adjustments): string {
  const b  = 1 + adj.brightness / 100;
  const c  = 1 + adj.contrast   / 100;
  const s  = Math.max(0, 1 + adj.saturation / 100);
  const hue = adj.temperature * -0.3; // subtle hue hint
  return `brightness(${b.toFixed(3)}) contrast(${c.toFixed(3)}) saturate(${s.toFixed(3)}) hue-rotate(${hue.toFixed(1)}deg)`;
}

// ── Slider component ───────────────────────────────────────────────────────────

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  icon: string;
}

function Slider({ label, value, min, max, onChange, icon }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <span>{icon}</span>{label}
        </span>
        <span className={`text-xs font-mono font-semibold tabular-nums ${value !== 0 ? "text-primary" : "text-muted-foreground"}`}>
          {value > 0 ? `+${value}` : value}
        </span>
      </div>
      <div className="relative h-2 flex items-center">
        <div className="absolute inset-0 rounded-full bg-muted/50" />
        <div
          className="absolute h-full rounded-full bg-primary/40"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min} max={max} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative w-full h-2 opacity-0 cursor-pointer z-10"
        />
        <div
          className="absolute w-3.5 h-3.5 rounded-full bg-primary border-2 border-background shadow-sm pointer-events-none transition-transform hover:scale-110"
          style={{ left: `calc(${pct}% - 7px)` }}
        />
      </div>
    </div>
  );
}

// ── Main Tool ──────────────────────────────────────────────────────────────────

export function ImageEnhancerTool() {
  const [file,        setFile]        = useState<File | null>(null);
  const [objectUrl,   setObjectUrl]   = useState("");
  const [adj,         setAdj]         = useState<Adjustments>(DEFAULT);
  const [dividerPct,  setDividerPct]  = useState(50);
  const [enhancing,   setEnhancing]   = useState(false);
  const [exporting,   setExporting]   = useState(false);
  const [quality,     setQuality]     = useState(92);

  const imgRef       = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const exportCanvas = useRef<HTMLCanvasElement | null>(null);
  const getExportCanvas = () => {
    if (!exportCanvas.current) exportCanvas.current = document.createElement("canvas");
    return exportCanvas.current;
  };

  // ── Pointer-capture drag (works for mouse + touch, no global listeners) ──────
  const updateDivider = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct  = Math.min(95, Math.max(5, ((e.clientX - rect.left) / rect.width) * 100));
    setDividerPct(pct);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    updateDivider(e);
  }, [updateDivider]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons === 0) return; // only while pressed
    updateDivider(e);
  }, [updateDivider]);

  const set = useCallback((key: keyof Adjustments, val: number) => {
    setAdj(prev => ({ ...prev, [key]: val }));
  }, []);

  // ── File load ──────────────────────────────────────────────────────────────

  const handleFile = (files: File[]) => {
    const f = files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setFile(f);
    setObjectUrl(url);
    setAdj(DEFAULT);
    setDividerPct(50);
    const img = new Image();
    img.onload  = () => { imgRef.current = img; };
    img.src = url;
  };


  // ── Auto Enhance ──────────────────────────────────────────────────────────

  const autoEnhance = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    setEnhancing(true);
    setTimeout(() => {
      const result = analyzeAndEnhance(img);
      setAdj(result);
      setEnhancing(false);
      toast.success("Smart enhancements applied");
    }, 50);
  }, []);

  // ── Export ────────────────────────────────────────────────────────────────

  const handleDownload = useCallback(() => {
    const img = imgRef.current;
    if (!img || !file) return;
    setExporting(true);
    const isAllDefault = Object.values(adj).every(v => v === 0);

    setTimeout(() => {
      try {
        if (isAllDefault) {
          // No adjustments — just re-download original
          const a = document.createElement("a");
          a.href = objectUrl;
          a.download = file.name.replace(/\.[^.]+$/, "_enhanced.jpg");
          a.click();
          toast.success("Downloaded");
          setExporting(false);
          return;
        }
        const canvas = getExportCanvas();
        applyAdjustments(img, adj, canvas);
        const mime = "image/jpeg";
        canvas.toBlob((blob) => {
          if (!blob) { toast.error("Export failed"); setExporting(false); return; }
          const url  = URL.createObjectURL(blob);
          const name = file.name.replace(/\.[^.]+$/, "_enhanced.jpg");
          const a    = document.createElement("a");
          a.href = url; a.download = name; a.click();
          URL.revokeObjectURL(url);
          toast.success("Image downloaded");
          setExporting(false);
        }, mime, quality / 100);
      } catch {
        toast.error("Export failed"); setExporting(false);
      }
    }, 50);
  }, [adj, file, objectUrl, quality]);

  const reset = useCallback(() => { setAdj(DEFAULT); }, []);
  const isChanged = JSON.stringify(adj) !== JSON.stringify(DEFAULT);

  // ── Derived preview filter string ─────────────────────────────────────────

  const cssFilter = getCssFilter(adj);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!file) {
    return (
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Image Enhancer</span>
          <span className="ml-auto text-xs text-muted-foreground">Non-destructive • Browser-based • No upload</span>
        </div>
        <div className="p-6">
          <FileUploadZone
            accept="image/*"
            onFiles={handleFile}
            label="Drop an image to enhance"
            sublabel="JPG, PNG, WebP, AVIF — processed entirely in your browser"
          />
          <div className="mt-6 grid grid-cols-3 md:grid-cols-6 gap-2">
            {PRESETS.map(p => (
              <div key={p.label} className="rounded-xl border border-border bg-muted/20 px-3 py-2 text-center">
                <p className="text-xs font-medium">{p.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-muted-foreground mt-4">
            Upload an image to apply any of these presets or fine-tune with individual sliders
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Image Enhancer</span>
        <span className="ml-auto text-xs text-muted-foreground hidden sm:block truncate max-w-[160px]">{file.name}</span>
      </div>

      <div className="p-4 space-y-5">

        {/* ── Presets ──────────────────────────────────────────────────── */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Presets</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {PRESETS.map(p => {
              const active = JSON.stringify(adj) === JSON.stringify(p.values);
              return (
                <button
                  key={p.label}
                  onClick={() => setAdj(p.values)}
                  className={`py-2 rounded-xl border text-xs font-medium transition-all ${
                    active
                      ? "border-primary/50 bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Before / After Preview ───────────────────────────────────── */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Preview</p>
            <span className="text-[10px] text-muted-foreground">Drag the divider to compare</span>
          </div>
          {/* The container is the drag target — pointer capture handles both mouse & touch */}
          <div
            ref={containerRef}
            className="relative w-full overflow-hidden rounded-xl border border-border select-none cursor-ew-resize"
            style={{ aspectRatio: "16/9", background: "#111", touchAction: "none" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
          >
            {/* Original (always full width, behind) */}
            <img
              src={objectUrl}
              alt="Original"
              className="absolute inset-0 w-full h-full object-contain"
              style={{ pointerEvents: "none" }}
              draggable={false}
            />

            {/* Enhanced (full width, clipped to show only right of divider) */}
            <img
              src={objectUrl}
              alt="Enhanced"
              className="absolute inset-0 w-full h-full object-contain"
              style={{
                filter: cssFilter,
                clipPath: `inset(0 ${(100 - dividerPct).toFixed(1)}% 0 0)`,
                pointerEvents: "none",
              }}
              draggable={false}
            />

            {/* Divider line */}
            <div
              className="absolute top-0 bottom-0 w-px bg-white shadow-[0_0_6px_rgba(0,0,0,0.8)] pointer-events-none"
              style={{ left: `${dividerPct}%` }}
            >
              {/* Handle knob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center gap-1">
                <div className="w-0.5 h-4 bg-gray-400 rounded-full" />
                <div className="w-0.5 h-4 bg-gray-400 rounded-full" />
              </div>
            </div>

            {/* Labels */}
            <span className="absolute bottom-2 left-3 text-[10px] font-medium text-white bg-black/50 rounded px-1.5 py-0.5 pointer-events-none">Original</span>
            <span className="absolute bottom-2 right-3 text-[10px] font-medium text-white bg-black/50 rounded px-1.5 py-0.5 pointer-events-none">Enhanced</span>
          </div>
        </div>

        {/* ── Sliders ──────────────────────────────────────────────────── */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Adjustments</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <Slider label="Brightness"   icon="☀️" value={adj.brightness}  min={-100} max={100} onChange={v => set("brightness",  v)} />
            <Slider label="Contrast"     icon="◑"  value={adj.contrast}    min={-100} max={100} onChange={v => set("contrast",    v)} />
            <Slider label="Saturation"   icon="🎨" value={adj.saturation}  min={-100} max={100} onChange={v => set("saturation",  v)} />
            <Slider label="Temperature"  icon="🌡️" value={adj.temperature} min={-50}  max={50}  onChange={v => set("temperature", v)} />
            <Slider label="Sharpness"    icon="🔍" value={adj.sharpness}   min={0}    max={100} onChange={v => set("sharpness",   v)} />
            <Slider label="Vignette"     icon="🌑" value={adj.vignette}    min={0}    max={100} onChange={v => set("vignette",    v)} />
          </div>
        </div>

        {/* ── Actions ──────────────────────────────────────────────────── */}
        <div className="space-y-2.5">
          {/* Quality slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-24 shrink-0">Output quality</span>
            <input
              type="range" min={60} max={100} value={quality}
              onChange={e => setQuality(Number(e.target.value))}
              className="flex-1 accent-primary h-1.5"
            />
            <span className="text-xs font-mono text-muted-foreground w-8 text-right">{quality}%</span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {/* Auto-enhance */}
            <Button
              onClick={autoEnhance}
              disabled={enhancing}
              variant="outline"
              className="flex-1 gap-2 min-w-[140px]"
            >
              {enhancing ? (
                <><div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />Analyzing…</>
              ) : (
                <><Wand2 className="w-4 h-4" />Auto Enhance</>
              )}
            </Button>

            {/* Download */}
            <Button
              onClick={handleDownload}
              disabled={exporting}
              className="flex-1 gap-2 min-w-[140px]"
            >
              {exporting ? (
                <><div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />Processing…</>
              ) : (
                <><Download className="w-4 h-4" />Download JPG</>
              )}
            </Button>

            {/* Reset */}
            {isChanged && (
              <Button variant="ghost" size="icon" onClick={reset} title="Reset all">
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* ── Info ─────────────────────────────────────────────────────── */}
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          <strong>Sharpness</strong> and <strong>Vignette</strong> are applied during export (not in the preview) — the preview uses CSS filters for real-time response.{" "}
          <strong>Auto Enhance</strong> analyses the image histogram and applies optimal brightness, contrast, and colour corrections automatically.
        </p>
      </div>
    </div>
  );
}
