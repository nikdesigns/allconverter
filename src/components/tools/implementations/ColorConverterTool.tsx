"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return [r, g, b];
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return [r, g, b];
  }
  return null;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const v = max;
  const s = max === 0 ? 0 : (max - min) / max;
  let h = 0;
  if (max !== min) {
    switch (max) {
      case r: h = ((g - b) / (max - min) + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / (max - min) + 2) / 6; break;
      case b: h = ((r - g) / (max - min) + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
}

function toHex2(n: number) {
  return n.toString(16).padStart(2, "0").toUpperCase();
}

function luminance(r: number, g: number, b: number): number {
  const [rv, gv, bv] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rv + 0.7152 * gv + 0.0722 * bv;
}

export function ColorConverterTool() {
  const [hex, setHex] = useState("#6366F1");
  const [pickerVal, setPickerVal] = useState("#6366F1");
  const [copied, setCopied] = useState<string | null>(null);

  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => rgb ? rgbToHsl(...rgb) : null, [rgb]);
  const hsv = useMemo(() => rgb ? rgbToHsv(...rgb) : null, [rgb]);

  const formats = useMemo(() => {
    if (!rgb || !hsl || !hsv) return [];
    const [r, g, b] = rgb;
    const [h, s, l] = hsl;
    const [hh, sv, v] = hsv;
    const lum = luminance(r, g, b);
    const contrastWhite = (1.05) / (lum + 0.05);
    const contrastBlack = (lum + 0.05) / 0.05;
    return [
      { label: "HEX", value: `#${toHex2(r)}${toHex2(g)}${toHex2(b)}` },
      { label: "RGB", value: `rgb(${r}, ${g}, ${b})` },
      { label: "RGBA", value: `rgba(${r}, ${g}, ${b}, 1)` },
      { label: "HSL", value: `hsl(${h}, ${s}%, ${l}%)` },
      { label: "HSLA", value: `hsla(${h}, ${s}%, ${l}%, 1)` },
      { label: "HSV", value: `hsv(${hh}, ${sv}%, ${v}%)` },
      { label: "CSS Variable", value: `--color: #${toHex2(r)}${toHex2(g)}${toHex2(b)};` },
      {
        label: "Contrast on White",
        value: `${contrastWhite.toFixed(2)}:1 (${contrastWhite >= 4.5 ? "AA ✓" : "Fail"})`,
      },
      {
        label: "Contrast on Black",
        value: `${contrastBlack.toFixed(2)}:1 (${contrastBlack >= 4.5 ? "AA ✓" : "Fail"})`,
      },
    ];
  }, [rgb, hsl, hsv]);

  const validHex = rgb !== null;

  const copy = async (val: string, label: string) => {
    await navigator.clipboard.writeText(val);
    setCopied(label);
    toast.success(`Copied ${label}`);
    setTimeout(() => setCopied(null), 2000);
  };

  const syncFromPicker = (val: string) => {
    setPickerVal(val);
    setHex(val);
  };

  const syncFromInput = (val: string) => {
    setHex(val);
    if (hexToRgb(val)) setPickerVal(val);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <span className="text-sm font-medium">Color Converter</span>
      </div>

      <div className="p-5 space-y-5">
        {/* Color picker + input */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <input
              type="color"
              value={pickerVal}
              onChange={(e) => syncFromPicker(e.target.value)}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
            />
            <div
              className="w-14 h-14 rounded-2xl border-2 border-border shadow-md cursor-pointer transition-transform hover:scale-105"
              style={{ backgroundColor: validHex ? hex : "#6366F1" }}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">
              HEX Color
            </label>
            <Input
              value={hex}
              onChange={(e) => syncFromInput(e.target.value)}
              placeholder="#6366F1"
              className="font-mono h-11"
            />
            {!validHex && hex && (
              <p className="text-xs text-destructive mt-1">Invalid hex color</p>
            )}
          </div>
        </div>

        {/* Color swatch row */}
        {validHex && rgb && (
          <div className="flex gap-2">
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90].map((tint) => {
              const [r, g, b] = rgb;
              const factor = tint / 100;
              const tr = Math.round(r + (255 - r) * (1 - factor));
              const tg = Math.round(g + (255 - g) * (1 - factor));
              const tb = Math.round(b + (255 - b) * (1 - factor));
              return (
                <div
                  key={tint}
                  className="flex-1 h-8 rounded-lg cursor-pointer border border-transparent hover:border-foreground/20 transition-all"
                  style={{ backgroundColor: `rgb(${tr},${tg},${tb})` }}
                  title={`${tint}% tint`}
                />
              );
            })}
          </div>
        )}

        {/* Format list */}
        <div className="space-y-2">
          {formats.map((f) => (
            <div
              key={f.label}
              className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-border hover:bg-muted/30 transition-all group"
            >
              <span className="text-xs font-medium text-muted-foreground min-w-[120px]">
                {f.label}
              </span>
              <span className="font-mono text-sm text-foreground flex-1 truncate">
                {f.value}
              </span>
              <button
                onClick={() => copy(f.value, f.label)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-muted transition-all shrink-0"
              >
                {copied === f.label ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
