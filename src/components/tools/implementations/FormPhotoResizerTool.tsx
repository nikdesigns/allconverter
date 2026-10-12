"use client";

import { SendToTool } from "@/components/tools/shared/SendToTool";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadZone, formatBytes2 } from "@/components/tools/shared/FileUploadZone";
import { Crop, Download, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePersistentState } from "@/lib/persist";
import { compressToTarget, loadImage, type TargetResult } from "@/lib/target-size";

type Unit = "px" | "cm" | "mm" | "in";

interface Preset {
  id: string;
  label: string;
  width: number;
  height: number;
  unit: Unit;
  dpi: number;
  minKb: number;
  maxKb: number;
}

// Common starting points. Every value stays editable because each form sets its own rules.
const PRESETS: Preset[] = [
  { id: "photo",     label: "Passport-style photo (3.5 × 4.5 cm)", width: 3.5, height: 4.5, unit: "cm", dpi: 200, minKb: 20, maxKb: 50 },
  { id: "signature", label: "Signature (4 × 2 cm)",                width: 4,   height: 2,   unit: "cm", dpi: 200, minKb: 10, maxKb: 20 },
  { id: "square",    label: "Square photo (2 × 2 in)",              width: 2,   height: 2,   unit: "in", dpi: 300, minKb: 0,  maxKb: 240 },
  { id: "stamp",     label: "Stamp-size photo (2 × 2.5 cm)",        width: 2,   height: 2.5, unit: "cm", dpi: 200, minKb: 10, maxKb: 30 },
  { id: "custom",    label: "Custom size",                          width: 600, height: 800, unit: "px", dpi: 200, minKb: 0,  maxKb: 100 },
];

const PER_INCH: Record<Unit, number> = { px: 0, in: 1, cm: 2.54, mm: 25.4 };

const toPx = (value: number, unit: Unit, dpi: number) =>
  Math.max(1, Math.round(unit === "px" ? value : (value / PER_INCH[unit]) * dpi));

const inputClass = "w-full h-9 px-3 rounded-xl border border-input bg-background text-sm";

export function FormPhotoResizerTool() {
  const [file, setFile]       = useState<File | null>(null);
  const [bitmap, setBitmap]   = useState<ImageBitmap | null>(null);
  const [presetId, setPreset] = usePersistentState("form-photo.preset", "photo");
  const [width, setWidth]     = usePersistentState("form-photo.width", "3.5");
  const [height, setHeight]   = usePersistentState("form-photo.height", "4.5");
  const [unit, setUnit]       = usePersistentState<Unit>("form-photo.unit", "cm");
  const [dpi, setDpi]         = usePersistentState("form-photo.dpi", "200");
  const [minKb, setMinKb]     = usePersistentState("form-photo.minKb", "20");
  const [maxKb, setMaxKb]     = usePersistentState("form-photo.maxKb", "50");
  const [zoom, setZoom]       = useState(1);
  const [focusX, setFocusX]   = useState(0.5);
  const [focusY, setFocusY]   = useState(0.5);
  const [result, setResult]   = useState<(TargetResult & { url: string }) | null>(null);
  const [error, setError]     = useState("");
  const runRef = useRef(0);

  const pxW = toPx(parseFloat(width) || 0, unit, parseFloat(dpi) || 200);
  const pxH = toPx(parseFloat(height) || 0, unit, parseFloat(dpi) || 200);
  const maxBytes = Math.max(1, parseFloat(maxKb) || 0) * 1024;
  const minBytes = Math.max(0, parseFloat(minKb) || 0) * 1024;

  const applyPreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    setPreset(id);
    setWidth(String(p.width)); setHeight(String(p.height)); setUnit(p.unit);
    setDpi(String(p.dpi)); setMinKb(String(p.minKb)); setMaxKb(String(p.maxKb));
  };

  const handleFiles = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setError(""); setResult(null);
    try {
      const bmp = await loadImage(f);
      bitmap?.close();
      setBitmap(bmp); setFile(f);
      setZoom(1); setFocusX(0.5); setFocusY(0.5);
    } catch {
      setError("This image could not be opened. Try a JPG or PNG file.");
    }
  };

  const clear = () => {
    bitmap?.close();
    setBitmap(null); setFile(null); setResult(null); setError("");
  };

  // Re-render shortly after any setting changes; a newer run cancels an older one.
  useEffect(() => {
    if (!bitmap) return;
    if (pxW > 6000 || pxH > 6000) return;
    const run = ++runRef.current;
    const timer = setTimeout(async () => {
      try {
        const res = await compressToTarget(bitmap, {
          maxBytes, minBytes, width: pxW, height: pxH, zoom, focusX, focusY, mime: "image/jpeg",
        });
        if (run !== runRef.current) return;
        setError("");
        setResult((prev) => {
          if (prev) URL.revokeObjectURL(prev.url);
          return { ...res, url: URL.createObjectURL(res.blob) };
        });
      } catch {
        if (run === runRef.current) setError("Could not process this image.");
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [bitmap, pxW, pxH, maxBytes, minBytes, zoom, focusX, focusY]);

  const oversize = pxW > 6000 || pxH > 6000;
  const tooBig   = !!result && result.blob.size > maxBytes;
  const tooSmall = !!result && minBytes > 0 && result.blob.size < minBytes;
  const ok       = !!result && !tooBig && !tooSmall;
  const outName  = file ? file.name.replace(/\.[^.]+$/, "") + `_${pxW}x${pxH}.jpg` : "photo.jpg";

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Crop className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Photo &amp; Signature Resizer</span>
        </div>
        {file && (
          <Button size="sm" variant="ghost" onClick={clear} className="h-7 text-xs gap-1">
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </Button>
        )}
      </div>

      <div className="p-5 space-y-5">
        {!bitmap && (
          <FileUploadZone
            accept="image/jpeg,image/png,image/webp"
            onFiles={handleFiles}
            label="Drop your photo or signature scan here"
            sublabel="JPG, PNG or WebP. It stays on your device."
          />
        )}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {bitmap && oversize && <p role="alert" className="text-sm text-destructive">That output size is too large. Check the unit and DPI.</p>}

        {bitmap && (
          <>
            <div>
              <label htmlFor="fp-preset" className="text-xs text-muted-foreground mb-1 block">Start from</label>
              <select id="fp-preset" value={presetId} onChange={(e) => applyPreset(e.target.value)} className={inputClass}>
                {PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label htmlFor="fp-w" className="text-xs text-muted-foreground mb-1 block">Width</label>
                <input id="fp-w" type="number" min={0} step="any" value={width} onChange={(e) => { setWidth(e.target.value); setPreset("custom"); }} className={inputClass} />
              </div>
              <div>
                <label htmlFor="fp-h" className="text-xs text-muted-foreground mb-1 block">Height</label>
                <input id="fp-h" type="number" min={0} step="any" value={height} onChange={(e) => { setHeight(e.target.value); setPreset("custom"); }} className={inputClass} />
              </div>
              <div>
                <label htmlFor="fp-unit" className="text-xs text-muted-foreground mb-1 block">Unit</label>
                <select id="fp-unit" value={unit} onChange={(e) => { setUnit(e.target.value as Unit); setPreset("custom"); }} className={inputClass}>
                  <option value="px">pixels</option><option value="cm">cm</option><option value="mm">mm</option><option value="in">inches</option>
                </select>
              </div>
              <div>
                <label htmlFor="fp-dpi" className="text-xs text-muted-foreground mb-1 block">DPI</label>
                <input id="fp-dpi" type="number" min={50} max={600} value={dpi} disabled={unit === "px"} onChange={(e) => { setDpi(e.target.value); setPreset("custom"); }} className={cn(inputClass, unit === "px" && "opacity-50")} />
              </div>
              <div>
                <label htmlFor="fp-min" className="text-xs text-muted-foreground mb-1 block">Minimum size (KB)</label>
                <input id="fp-min" type="number" min={0} value={minKb} onChange={(e) => { setMinKb(e.target.value); setPreset("custom"); }} className={inputClass} />
              </div>
              <div>
                <label htmlFor="fp-max" className="text-xs text-muted-foreground mb-1 block">Maximum size (KB)</label>
                <input id="fp-max" type="number" min={1} value={maxKb} onChange={(e) => { setMaxKb(e.target.value); setPreset("custom"); }} className={inputClass} />
              </div>
              <div className="col-span-2 flex items-end">
                <p className="text-xs text-muted-foreground pb-2">Output: <span className="font-mono text-foreground">{pxW} × {pxH} px</span> JPG</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-[auto_1fr] gap-5 items-start">
              <div className="mx-auto sm:mx-0">
                <div className="rounded-xl border border-border bg-muted/30 p-2 inline-block">
                  {result ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={result.url} alt="Preview of the resized image" className="block max-w-[220px] max-h-[260px] w-auto h-auto" />
                  ) : (
                    <div className="w-[160px] h-[200px] flex items-center justify-center text-xs text-muted-foreground">Rendering…</div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor="fp-zoom" className="text-xs text-muted-foreground mb-1 flex justify-between"><span>Zoom</span><span>{zoom.toFixed(2)}×</span></label>
                  <input id="fp-zoom" type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-primary h-1.5" />
                </div>
                <div>
                  <label htmlFor="fp-x" className="text-xs text-muted-foreground mb-1 block">Move left / right</label>
                  <input id="fp-x" type="range" min={0} max={1} step={0.01} value={focusX} onChange={(e) => setFocusX(Number(e.target.value))} className="w-full accent-primary h-1.5" />
                </div>
                <div>
                  <label htmlFor="fp-y" className="text-xs text-muted-foreground mb-1 block">Move up / down</label>
                  <input id="fp-y" type="range" min={0} max={1} step={0.01} value={focusY} onChange={(e) => setFocusY(Number(e.target.value))} className="w-full accent-primary h-1.5" />
                </div>

                {result && (
                  <div role="status" className={cn("flex items-start gap-2 rounded-xl border p-3 text-sm",
                    ok ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5")}>
                    {ok ? <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-600 dark:text-amber-400 shrink-0" />}
                    <div>
                      <p className="font-medium">{result.width} × {result.height} px · {formatBytes2(result.blob.size)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {ok && `Within your limits${minBytes > 0 ? ` (${minKb}–${maxKb} KB)` : ` (under ${maxKb} KB)`}.`}
                        {tooBig && `Still over ${maxKb} KB at the lowest quality. Reduce the pixel size or raise the limit.`}
                        {tooSmall && `Under the ${minKb} KB minimum even at full quality. Increase the DPI or pixel size so the file has more detail.`}
                      </p>
                    </div>
                  </div>
                )}

                {result && (
                  <a href={result.url} download={outName} className="block">
                    <Button className="w-full gap-2"><Download className="w-4 h-4" />Download JPG</Button>
                  </a>
                )}
                {result && (
                  <SendToTool url={result.url} name={outName} />
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground border-t border-border pt-3">
              The presets are common starting points, not official rules. Always check the size, dimensions and background your form asks for, and edit the values above to match.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
