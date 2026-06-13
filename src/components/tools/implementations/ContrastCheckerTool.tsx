"use client";

import { useState, useMemo } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function hexToRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
}

function linearize(c: number) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luminance(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  return 0.2126 * linearize(rgb.r) + 0.7152 * linearize(rgb.g) + 0.0722 * linearize(rgb.b);
}

function contrastRatio(fg: string, bg: string) {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const PRESETS = [
  { fg: "#000000", bg: "#ffffff", label: "Black / White" },
  { fg: "#ffffff", bg: "#000000", label: "White / Black" },
  { fg: "#1d4ed8", bg: "#ffffff", label: "Blue / White" },
  { fg: "#ffffff", bg: "#1d4ed8", label: "White / Blue" },
  { fg: "#dc2626", bg: "#ffffff", label: "Red / White" },
  { fg: "#16a34a", bg: "#ffffff", label: "Green / White" },
  { fg: "#f59e0b", bg: "#000000", label: "Amber / Black" },
  { fg: "#6d28d9", bg: "#faf5ff", label: "Purple / Lavender" },
];

export function ContrastCheckerTool() {
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [fgHex, setFgHex] = useState("#000000");
  const [bgHex, setBgHex] = useState("#ffffff");

  const ratio = useMemo(() => contrastRatio(fg, bg), [fg, bg]);

  const pass = {
    aaSmall: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaaSmall: ratio >= 7,
    aaaLarge: ratio >= 4.5,
  };

  const applyFgHex = (v: string) => {
    setFgHex(v);
    if (/^#[0-9a-f]{6}$/i.test(v)) setFg(v);
  };
  const applyBgHex = (v: string) => {
    setBgHex(v);
    if (/^#[0-9a-f]{6}$/i.test(v)) setBg(v);
  };

  const copyReport = () => {
    const lines = [
      `Contrast Ratio: ${ratio.toFixed(2)}:1`,
      `WCAG AA — Normal text (≥4.5:1): ${pass.aaSmall ? "PASS" : "FAIL"}`,
      `WCAG AA — Large text (≥3:1): ${pass.aaLarge ? "PASS" : "FAIL"}`,
      `WCAG AAA — Normal text (≥7:1): ${pass.aaaSmall ? "PASS" : "FAIL"}`,
      `WCAG AAA — Large text (≥4.5:1): ${pass.aaaLarge ? "PASS" : "FAIL"}`,
      `Foreground: ${fg}  |  Background: ${bg}`,
    ].join("\n");
    navigator.clipboard.writeText(lines);
    toast.success("Copied report!");
  };

  const badge = (p: boolean) => (
    <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide",
      p ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400")}>
      {p ? "PASS" : "FAIL"}
    </span>
  );

  const overall = pass.aaSmall && pass.aaLarge;
  const overallColor = ratio >= 7 ? "text-emerald-400" : ratio >= 4.5 ? "text-emerald-400" : ratio >= 3 ? "text-amber-400" : "text-rose-400";

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <div className="w-4 h-4 rounded-sm border border-border/60 bg-gradient-to-br from-white to-black" />
        <span className="text-sm font-medium">Contrast Checker</span>
        <span className="ml-auto text-[10px] text-muted-foreground">WCAG 2.1 AA / AAA</span>
      </div>

      <div className="p-5 space-y-5">

        {/* Color pickers */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Text (Foreground)</label>
            <div className="flex items-center gap-2">
              <input type="color" value={fg}
                onChange={e => { setFg(e.target.value); setFgHex(e.target.value); }}
                className="w-10 h-10 rounded-xl border border-input cursor-pointer p-0.5 bg-transparent" />
              <input type="text" value={fgHex} onChange={e => applyFgHex(e.target.value)} maxLength={7}
                className="flex-1 h-10 px-3 rounded-xl border border-input bg-background text-sm font-mono uppercase"
                placeholder="#000000" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Background</label>
            <div className="flex items-center gap-2">
              <input type="color" value={bg}
                onChange={e => { setBg(e.target.value); setBgHex(e.target.value); }}
                className="w-10 h-10 rounded-xl border border-input cursor-pointer p-0.5 bg-transparent" />
              <input type="text" value={bgHex} onChange={e => applyBgHex(e.target.value)} maxLength={7}
                className="flex-1 h-10 px-3 rounded-xl border border-input bg-background text-sm font-mono uppercase"
                placeholder="#ffffff" />
            </div>
          </div>
        </div>

        {/* Presets */}
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Quick Presets</label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <button key={p.label}
                onClick={() => { setFg(p.fg); setFgHex(p.fg); setBg(p.bg); setBgHex(p.bg); }}
                className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all",
                  fg === p.fg && bg === p.bg
                    ? "border-primary/50 text-foreground bg-primary/5"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}>
                <div className="w-5 h-4 rounded border border-border/40 flex items-center justify-center"
                  style={{ backgroundColor: p.bg }}>
                  <span style={{ color: p.fg, fontSize: 9, fontWeight: "bold", lineHeight: 1 }}>A</span>
                </div>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live preview */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-4 space-y-2" style={{ backgroundColor: bg }}>
            <p style={{ color: fg, fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}>
              Large text — Heading (24px bold)
            </p>
            <p style={{ color: fg, fontSize: 16 }}>
              Normal body text at 16px. The quick brown fox jumps over the lazy dog.
            </p>
            <p style={{ color: fg, fontSize: 13 }}>
              Small text at 13px — may not meet WCAG AA requirements.
            </p>
          </div>
        </div>

        {/* Ratio + WCAG results */}
        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className={cn("text-4xl font-black tabular-nums", overallColor)}>
                {ratio.toFixed(2)}
              </span>
              <span className="text-xl text-muted-foreground font-normal">:1</span>
              <div className="text-xs text-muted-foreground mt-0.5">
                {ratio >= 7 ? "Excellent — Passes AAA" : ratio >= 4.5 ? "Good — Passes AA" : ratio >= 3 ? "Low — Large text only" : "Poor — Fails WCAG"}
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={copyReport} className="h-8 text-xs gap-1.5">
              <Copy className="w-3 h-3" /> Copy Report
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: "AA — Normal text", req: "≥4.5:1", p: pass.aaSmall },
              { label: "AA — Large text",  req: "≥3:1",   p: pass.aaLarge },
              { label: "AAA — Normal text", req: "≥7:1",  p: pass.aaaSmall },
              { label: "AAA — Large text",  req: "≥4.5:1", p: pass.aaaLarge },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border/50">
                <div>
                  <div className="text-xs font-medium">{r.label}</div>
                  <div className="text-[11px] text-muted-foreground">{r.req}</div>
                </div>
                {badge(r.p)}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-muted/20 border border-border/50 p-3 text-xs text-muted-foreground space-y-1">
          <p><strong className="text-foreground">Normal text</strong>: under 18pt regular (24px) or 14pt bold (18.67px)</p>
          <p><strong className="text-foreground">Large text</strong>: 18pt+ regular or 14pt+ bold — less strict requirements</p>
          <p><strong className="text-foreground">AA</strong> is the legal minimum for most jurisdictions; <strong className="text-foreground">AAA</strong> is enhanced</p>
        </div>

      </div>
    </div>
  );
}
