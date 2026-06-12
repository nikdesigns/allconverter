"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Paintbrush } from "lucide-react";
import { toast } from "sonner";

// ── CSS Grid Generator ────────────────────────────────────────────────────────
function GridGenerator() {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(3);
  const [colGap, setColGap] = useState(16);
  const [rowGap, setRowGap] = useState(16);
  const [colTemplate, setColTemplate] = useState("repeat(3, 1fr)");
  const [rowTemplate, setRowTemplate] = useState("repeat(3, 1fr)");

  const css = `.grid-container {
  display: grid;
  grid-template-columns: ${colTemplate};
  grid-template-rows: ${rowTemplate};
  column-gap: ${colGap}px;
  row-gap: ${rowGap}px;
}`;

  const copy = () => { navigator.clipboard.writeText(css); toast.success("CSS copied!"); };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs text-muted-foreground mb-1 block">Columns</label>
          <Input type="number" min={1} max={12} value={cols} onChange={e=>{setCols(+e.target.value);setColTemplate(`repeat(${e.target.value}, 1fr)`);}} className="text-sm font-mono" /></div>
        <div><label className="text-xs text-muted-foreground mb-1 block">Rows</label>
          <Input type="number" min={1} max={12} value={rows} onChange={e=>{setRows(+e.target.value);setRowTemplate(`repeat(${e.target.value}, 1fr)`);}} className="text-sm font-mono" /></div>
        <div><label className="text-xs text-muted-foreground mb-1 block">Column Gap (px)</label>
          <Input type="number" value={colGap} onChange={e=>setColGap(+e.target.value)} className="text-sm font-mono" /></div>
        <div><label className="text-xs text-muted-foreground mb-1 block">Row Gap (px)</label>
          <Input type="number" value={rowGap} onChange={e=>setRowGap(+e.target.value)} className="text-sm font-mono" /></div>
      </div>
      <div><label className="text-xs text-muted-foreground mb-1 block">Column template</label>
        <Input value={colTemplate} onChange={e=>setColTemplate(e.target.value)} className="font-mono text-sm" /></div>
      <div><label className="text-xs text-muted-foreground mb-1 block">Row template</label>
        <Input value={rowTemplate} onChange={e=>setRowTemplate(e.target.value)} className="font-mono text-sm" /></div>
      <div
        className="border border-border rounded-xl p-4 min-h-[200px]"
        style={{display:"grid",gridTemplateColumns:colTemplate,gridTemplateRows:rowTemplate,columnGap:colGap,rowGap:rowGap}}>
        {Array.from({length:cols*rows}).map((_,i)=>(
          <div key={i} className="bg-primary/20 rounded-lg border border-primary/30 flex items-center justify-center text-xs text-primary font-mono">{i+1}</div>
        ))}
      </div>
      <div className="relative">
        <pre className="p-3 rounded-xl bg-muted/10 border border-border text-xs font-mono whitespace-pre-wrap">{css}</pre>
        <Button size="sm" variant="ghost" onClick={copy} className="absolute top-2 right-2 h-6 text-xs gap-1"><Copy className="w-3 h-3" />Copy</Button>
      </div>
    </div>
  );
}

// ── Flexbox Generator ─────────────────────────────────────────────────────────
function FlexboxGenerator() {
  const [direction, setDirection] = useState("row");
  const [wrap, setWrap] = useState("nowrap");
  const [justify, setJustify] = useState("flex-start");
  const [align, setAlign] = useState("stretch");
  const [gap, setGap] = useState(16);
  const [itemCount, setItemCount] = useState(5);

  const css = `.flex-container {
  display: flex;
  flex-direction: ${direction};
  flex-wrap: ${wrap};
  justify-content: ${justify};
  align-items: ${align};
  gap: ${gap}px;
}`;

  const copy = () => { navigator.clipboard.writeText(css); toast.success("CSS copied!"); };

  const optionRow = (label: string, val: string, setVal: (v:string)=>void, options: string[]) => (
    <div key={label}><label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map(o=><button key={o} onClick={()=>setVal(o)} className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-all ${val===o?"border-primary/40 bg-primary/10 text-primary":"border-border text-muted-foreground"}`}>{o}</button>)}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {optionRow("flex-direction",direction,setDirection,["row","row-reverse","column","column-reverse"])}
      {optionRow("flex-wrap",wrap,setWrap,["nowrap","wrap","wrap-reverse"])}
      {optionRow("justify-content",justify,setJustify,["flex-start","flex-end","center","space-between","space-around","space-evenly"])}
      {optionRow("align-items",align,setAlign,["flex-start","flex-end","center","stretch","baseline"])}
      <div className="flex gap-3">
        <div><label className="text-xs text-muted-foreground mb-1 block">Gap (px)</label>
          <Input type="number" value={gap} onChange={e=>setGap(+e.target.value)} className="w-24 text-sm font-mono" /></div>
        <div><label className="text-xs text-muted-foreground mb-1 block">Items</label>
          <Input type="number" min={1} max={12} value={itemCount} onChange={e=>setItemCount(+e.target.value)} className="w-24 text-sm font-mono" /></div>
      </div>
      <div className="border border-border rounded-xl p-4 min-h-[100px]"
        style={{display:"flex",flexDirection:direction as "row"|"column"|"row-reverse"|"column-reverse",flexWrap:wrap as "nowrap"|"wrap",justifyContent:justify,alignItems:align,gap}}>
        {Array.from({length:itemCount}).map((_,i)=>(
          <div key={i} className="bg-primary/20 rounded-lg border border-primary/30 flex items-center justify-center text-xs text-primary font-mono w-12 h-12 shrink-0">{i+1}</div>
        ))}
      </div>
      <div className="relative">
        <pre className="p-3 rounded-xl bg-muted/10 border border-border text-xs font-mono whitespace-pre-wrap">{css}</pre>
        <Button size="sm" variant="ghost" onClick={copy} className="absolute top-2 right-2 h-6 text-xs gap-1"><Copy className="w-3 h-3" />Copy</Button>
      </div>
    </div>
  );
}

// ── CSS Animation Generator ───────────────────────────────────────────────────
const PRESETS = {
  fadeIn: { from:"opacity: 0;", to:"opacity: 1;", name:"fadeIn" },
  slideInLeft: { from:"transform: translateX(-100%); opacity: 0;", to:"transform: translateX(0); opacity: 1;", name:"slideInLeft" },
  slideInTop: { from:"transform: translateY(-50px); opacity: 0;", to:"transform: translateY(0); opacity: 1;", name:"slideInTop" },
  bounce: { from:"transform: scale(1);", to:"transform: scale(1.2);", name:"bounce" },
  spin: { from:"transform: rotate(0deg);", to:"transform: rotate(360deg);", name:"spin" },
  pulse: { from:"transform: scale(1);", to:"transform: scale(1.05);", name:"pulse" },
};
function AnimationGenerator() {
  const [preset, setPreset] = useState("fadeIn");
  const [duration, setDuration] = useState("0.5");
  const [timing, setTiming] = useState("ease");
  const [iteration, setIteration] = useState("1");
  const [delay, setDelay] = useState("0");
  const [fill, setFill] = useState("both");
  const p = PRESETS[preset as keyof typeof PRESETS];
  const css = `@keyframes ${p.name} {
  from { ${p.from} }
  to { ${p.to} }
}

.animated {
  animation: ${p.name} ${duration}s ${timing} ${delay}s ${iteration} ${fill};
}`;
  const copy = () => { navigator.clipboard.writeText(css); toast.success("CSS copied!"); };
  const [preview, setPreview] = useState(false);
  const replay = () => { setPreview(false); setTimeout(()=>setPreview(true),50); };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Preset</label>
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(PRESETS).map(k=>(
            <button key={k} onClick={()=>setPreset(k)} className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-all ${preset===k?"border-primary/40 bg-primary/10 text-primary":"border-border text-muted-foreground"}`}>{k}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[["Duration (s)",duration,setDuration],["Delay (s)",delay,setDelay],["Iteration",iteration,setIteration]].map(([label,val,set])=>(
          <div key={label as string}><label className="text-xs text-muted-foreground mb-1 block">{label as string}</label>
            <Input value={val as string} onChange={e=>(set as (v:string)=>void)(e.target.value)} className="text-sm font-mono" /></div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs text-muted-foreground mb-1 block">Timing function</label>
          <select value={timing} onChange={e=>setTiming(e.target.value)} className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm">
            {["ease","linear","ease-in","ease-out","ease-in-out","cubic-bezier(0.4,0,0.2,1)"].map(t=><option key={t}>{t}</option>)}
          </select></div>
        <div><label className="text-xs text-muted-foreground mb-1 block">Fill mode</label>
          <select value={fill} onChange={e=>setFill(e.target.value)} className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm">
            {["both","forwards","backwards","none"].map(t=><option key={t}>{t}</option>)}
          </select></div>
      </div>
      <div className="flex items-center justify-center min-h-[80px] border border-border rounded-xl">
        {preview && (
          <div className="w-12 h-12 bg-primary/30 rounded-xl border border-primary/40"
            style={{animation:`${p.name} ${duration}s ${timing} ${delay}s ${iteration} ${fill}`}}>
            <style>{`@keyframes ${p.name} { from { ${p.from} } to { ${p.to} } }`}</style>
          </div>
        )}
        {!preview && <Button variant="outline" size="sm" onClick={replay}>▶ Preview</Button>}
      </div>
      {preview && <Button variant="outline" size="sm" onClick={replay} className="w-full">↺ Replay</Button>}
      <div className="relative">
        <pre className="p-3 rounded-xl bg-muted/10 border border-border text-xs font-mono whitespace-pre-wrap">{css}</pre>
        <Button size="sm" variant="ghost" onClick={copy} className="absolute top-2 right-2 h-6 text-xs gap-1"><Copy className="w-3 h-3" />Copy</Button>
      </div>
    </div>
  );
}

// ── CSS Clamp Calculator ──────────────────────────────────────────────────────
function ClampCalculator() {
  const [minVal, setMinVal] = useState("16");
  const [maxVal, setMaxVal] = useState("32");
  const [minVw, setMinVw] = useState("320");
  const [maxVw, setMaxVw] = useState("1280");

  const min = parseFloat(minVal); const max = parseFloat(maxVal);
  const minW = parseFloat(minVw); const maxW = parseFloat(maxVw);
  const slope = (max - min) / (maxW - minW);
  const intercept = min - slope * minW;
  const vw = (slope * 100).toFixed(4);
  const rem = (intercept / 16).toFixed(4);
  const clamp = `clamp(${min/16}rem, ${vw}vw + ${rem}rem, ${max/16}rem)`;
  const copy = () => { navigator.clipboard.writeText(clamp); toast.success("Copied!"); };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs text-muted-foreground mb-1 block">Min value (px)</label>
          <Input value={minVal} onChange={e=>setMinVal(e.target.value)} className="font-mono text-sm" /></div>
        <div><label className="text-xs text-muted-foreground mb-1 block">Max value (px)</label>
          <Input value={maxVal} onChange={e=>setMaxVal(e.target.value)} className="font-mono text-sm" /></div>
        <div><label className="text-xs text-muted-foreground mb-1 block">Min viewport (px)</label>
          <Input value={minVw} onChange={e=>setMinVw(e.target.value)} className="font-mono text-sm" /></div>
        <div><label className="text-xs text-muted-foreground mb-1 block">Max viewport (px)</label>
          <Input value={maxVw} onChange={e=>setMaxVw(e.target.value)} className="font-mono text-sm" /></div>
      </div>
      <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/10">
        <code className="text-sm font-mono flex-1 break-all">{clamp}</code>
        <Button size="sm" variant="ghost" onClick={copy} className="shrink-0 gap-1"><Copy className="w-3 h-3" />Copy</Button>
      </div>
    </div>
  );
}

// ── REM/PX Converter ──────────────────────────────────────────────────────────
function RemPxConverter() {
  const pathname = usePathname();
  const slug = pathname?.split("/").filter(Boolean).at(-1);
  const [value, setValue] = useState("16");
  const [base, setBase] = useState("16");
  const b = parseFloat(base) || 16;
  const v = parseFloat(value) || 0;
  const isRemToPx = slug === "rem-to-px";
  const result = isRemToPx ? `${(v * b).toFixed(4)}px` : `${(v / b).toFixed(6)}rem`;

  const copy = () => { navigator.clipboard.writeText(result); toast.success("Copied!"); };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs text-muted-foreground mb-1 block">{isRemToPx ? "REM value" : "PX value"}</label>
          <Input value={value} onChange={e=>setValue(e.target.value)} className="font-mono text-sm" /></div>
        <div><label className="text-xs text-muted-foreground mb-1 block">Base font size (px)</label>
          <Input value={base} onChange={e=>setBase(e.target.value)} className="font-mono text-sm" /></div>
      </div>
      <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/10">
        <span className="text-sm text-muted-foreground">{value}{isRemToPx ? "rem" : "px"} =</span>
        <code className="text-xl font-mono font-bold text-primary flex-1">{result}</code>
        <Button size="sm" variant="ghost" onClick={copy} className="gap-1"><Copy className="w-3 h-3" />Copy</Button>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {(isRemToPx ? [0.5,0.75,1,1.25,1.5,2,2.5,3,4,5,6,8] : [8,10,12,14,16,18,20,24,28,32,36,48]).map(n=>(
          <button key={n} onClick={()=>setValue(String(n))} className="py-1.5 rounded-xl border border-border text-xs font-mono hover:bg-muted/30 transition-all">
            {n}{isRemToPx?"rem":"px"}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── CSS Unit Converter ────────────────────────────────────────────────────────
function CssUnitConverter() {
  const [value, setValue] = useState("16");
  const [fromUnit, setFromUnit] = useState("px");
  const [toUnit, setToUnit] = useState("rem");
  const [baseFontSize] = useState(16);
  const [dpi] = useState(96);
  const UNITS = ["px","rem","em","pt","pc","cm","mm","in","vw","vh","%"];

  function toPx(v: number, unit: string): number {
    switch(unit) {
      case "px": return v;
      case "rem": case "em": return v * baseFontSize;
      case "pt": return v * (dpi / 72);
      case "pc": return v * (dpi / 6);
      case "cm": return v * (dpi / 2.54);
      case "mm": return v * (dpi / 25.4);
      case "in": return v * dpi;
      default: return v;
    }
  }
  function fromPx(v: number, unit: string): number {
    switch(unit) {
      case "px": return v;
      case "rem": case "em": return v / baseFontSize;
      case "pt": return v / (dpi / 72);
      case "pc": return v / (dpi / 6);
      case "cm": return v / (dpi / 2.54);
      case "mm": return v / (dpi / 25.4);
      case "in": return v / dpi;
      default: return v;
    }
  }
  const result = fromPx(toPx(parseFloat(value)||0, fromUnit), toUnit);
  const copy = () => { navigator.clipboard.writeText(`${result.toFixed(6)}${toUnit}`); toast.success("Copied!"); };
  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <div className="flex-1"><label className="text-xs text-muted-foreground mb-1 block">Value</label>
          <Input value={value} onChange={e=>setValue(e.target.value)} className="font-mono text-sm" /></div>
        <div className="w-24"><label className="text-xs text-muted-foreground mb-1 block">From</label>
          <select value={fromUnit} onChange={e=>setFromUnit(e.target.value)} className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm font-mono">
            {UNITS.map(u=><option key={u}>{u}</option>)}
          </select></div>
        <div className="w-24"><label className="text-xs text-muted-foreground mb-1 block">To</label>
          <select value={toUnit} onChange={e=>setToUnit(e.target.value)} className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm font-mono">
            {UNITS.map(u=><option key={u}>{u}</option>)}
          </select></div>
      </div>
      <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/10">
        <span className="text-sm text-muted-foreground">{value}{fromUnit} =</span>
        <code className="text-xl font-mono font-bold text-primary flex-1">{result.toFixed(6)}{toUnit}</code>
        <Button size="sm" variant="ghost" onClick={copy} className="gap-1"><Copy className="w-3 h-3" />Copy</Button>
      </div>
    </div>
  );
}

// ── Tailwind Color Generator ──────────────────────────────────────────────────
const TW_COLORS: Record<string,[string,string][]> = {
  slate: [["50","#f8fafc"],["100","#f1f5f9"],["200","#e2e8f0"],["300","#cbd5e1"],["400","#94a3b8"],["500","#64748b"],["600","#475569"],["700","#334155"],["800","#1e293b"],["900","#0f172a"]],
  red:   [["50","#fef2f2"],["100","#fee2e2"],["200","#fecaca"],["300","#fca5a5"],["400","#f87171"],["500","#ef4444"],["600","#dc2626"],["700","#b91c1c"],["800","#991b1b"],["900","#7f1d1d"]],
  blue:  [["50","#eff6ff"],["100","#dbeafe"],["200","#bfdbfe"],["300","#93c5fd"],["400","#60a5fa"],["500","#3b82f6"],["600","#2563eb"],["700","#1d4ed8"],["800","#1e40af"],["900","#1e3a8a"]],
  green: [["50","#f0fdf4"],["100","#dcfce7"],["200","#bbf7d0"],["300","#86efac"],["400","#4ade80"],["500","#22c55e"],["600","#16a34a"],["700","#15803d"],["800","#166534"],["900","#14532d"]],
  purple:[["50","#faf5ff"],["100","#f3e8ff"],["200","#e9d5ff"],["300","#d8b4fe"],["400","#c084fc"],["500","#a855f7"],["600","#9333ea"],["700","#7e22ce"],["800","#6b21a8"],["900","#581c87"]],
  orange:[["50","#fff7ed"],["100","#ffedd5"],["200","#fed7aa"],["300","#fdba74"],["400","#fb923c"],["500","#f97316"],["600","#ea580c"],["700","#c2410c"],["800","#9a3412"],["900","#7c2d12"]],
};
function TailwindColorGenerator() {
  const [selected, setSelected] = useState<{color:string,shade:string,hex:string}|null>(null);
  const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copied!"); };
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {Object.entries(TW_COLORS).map(([name, shades])=>(
          <div key={name}>
            <p className="text-xs font-medium text-muted-foreground capitalize mb-1.5">{name}</p>
            <div className="flex gap-1.5 flex-wrap">
              {shades.map(([shade, hex])=>(
                <button key={shade} onClick={()=>setSelected({color:name,shade,hex})}
                  className="w-10 h-10 rounded-xl border-2 transition-all hover:scale-110"
                  style={{backgroundColor:hex, borderColor:selected?.hex===hex ? "#fff":"transparent"}}
                  title={`${name}-${shade}: ${hex}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/10">
          <div className="w-10 h-10 rounded-xl shrink-0" style={{backgroundColor:selected.hex}} />
          <div className="flex-1">
            <p className="text-sm font-medium">bg-{selected.color}-{selected.shade}</p>
            <p className="text-xs text-muted-foreground font-mono">{selected.hex}</p>
          </div>
          <div className="flex gap-1.5">
            <Button size="sm" variant="ghost" onClick={()=>copy(`bg-${selected.color}-${selected.shade}`)} className="text-xs h-7">Class</Button>
            <Button size="sm" variant="ghost" onClick={()=>copy(selected.hex)} className="text-xs h-7">Hex</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tailwind Shadow Generator ─────────────────────────────────────────────────
const TW_SHADOWS: Array<{name:string;cls:string;css:string}> = [
  {name:"none",cls:"shadow-none",css:"box-shadow: none;"},
  {name:"sm",cls:"shadow-sm",css:"box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);"},
  {name:"default",cls:"shadow",css:"box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);"},
  {name:"md",cls:"shadow-md",css:"box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);"},
  {name:"lg",cls:"shadow-lg",css:"box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);"},
  {name:"xl",cls:"shadow-xl",css:"box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);"},
  {name:"2xl",cls:"shadow-2xl",css:"box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);"},
  {name:"inner",cls:"shadow-inner",css:"box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);"},
];
function TailwindShadowGenerator() {
  const [selected, setSelected] = useState("shadow-lg");
  const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copied!"); };
  const s = TW_SHADOWS.find(s=>s.cls===selected) ?? TW_SHADOWS[5];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {TW_SHADOWS.map(s=>(
          <button key={s.cls} onClick={()=>setSelected(s.cls)}
            className={`p-3 rounded-xl border text-xs font-mono transition-all ${selected===s.cls?"border-primary/40 bg-primary/10 text-primary":"border-border text-muted-foreground hover:bg-muted/20"}`}>
            {s.name}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center p-10 border border-border rounded-xl bg-muted/5">
        <div className="w-24 h-24 bg-card rounded-xl" style={{boxShadow:s.css.replace("box-shadow:","").replace(";","").trim()}} />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/10">
          <code className="text-sm font-mono">{s.cls}</code>
          <Button size="sm" variant="ghost" onClick={()=>copy(s.cls)} className="text-xs h-7 gap-1"><Copy className="w-3 h-3" />Class</Button>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/10">
          <code className="text-xs font-mono text-muted-foreground truncate mr-2">{s.css}</code>
          <Button size="sm" variant="ghost" onClick={()=>copy(s.css)} className="text-xs h-7 gap-1 shrink-0"><Copy className="w-3 h-3" />CSS</Button>
        </div>
      </div>
    </div>
  );
}

// ── Tailwind Gradient Generator ───────────────────────────────────────────────
function TailwindGradientGenerator() {
  const DIRECTIONS: Record<string,string> = {
    "to-r":"to right","to-l":"to left","to-b":"to bottom","to-t":"to top",
    "to-br":"to bottom right","to-bl":"to bottom left","to-tr":"to top right","to-tl":"to top left",
  };
  const [dir, setDir] = useState("to-r");
  const [from, setFrom] = useState("#3b82f6");
  const [via, setVia] = useState("");
  const [to, setTo] = useState("#a855f7");
  const gradient = `linear-gradient(${DIRECTIONS[dir]}, ${from}${via?", "+via:""}, ${to})`;
  const twClass = `bg-gradient-${dir} from-[${from}]${via?` via-[${via}]`:""} to-[${to}]`;
  const copy = (t: string) => { navigator.clipboard.writeText(t); toast.success("Copied!"); };
  return (
    <div className="space-y-4">
      <div><label className="text-xs text-muted-foreground mb-1 block">Direction</label>
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(DIRECTIONS).map(d=>(
            <button key={d} onClick={()=>setDir(d)} className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-all ${dir===d?"border-primary/40 bg-primary/10 text-primary":"border-border text-muted-foreground"}`}>{d}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><label className="text-xs text-muted-foreground mb-1 block">From</label>
          <Input type="color" value={from} onChange={e=>setFrom(e.target.value)} className="h-10 p-1 cursor-pointer" /></div>
        <div><label className="text-xs text-muted-foreground mb-1 block">Via (optional)</label>
          <Input type="color" value={via||"#7c3aed"} onChange={e=>setVia(e.target.value)} className="h-10 p-1 cursor-pointer" />
          <button className="text-xs text-muted-foreground mt-1" onClick={()=>setVia(v=>v?"":("#7c3aed"))}>{via?"Remove via":"Add via"}</button>
        </div>
        <div><label className="text-xs text-muted-foreground mb-1 block">To</label>
          <Input type="color" value={to} onChange={e=>setTo(e.target.value)} className="h-10 p-1 cursor-pointer" /></div>
      </div>
      <div className="h-24 rounded-xl border border-border" style={{background:gradient}} />
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/10">
          <code className="text-xs font-mono text-muted-foreground truncate mr-2">{twClass}</code>
          <Button size="sm" variant="ghost" onClick={()=>copy(twClass)} className="text-xs h-7 gap-1 shrink-0"><Copy className="w-3 h-3" />Class</Button>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/10">
          <code className="text-xs font-mono text-muted-foreground truncate mr-2">background: {gradient}</code>
          <Button size="sm" variant="ghost" onClick={()=>copy(`background: ${gradient};`)} className="text-xs h-7 gap-1 shrink-0"><Copy className="w-3 h-3" />CSS</Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const TOOLS: Record<string,{title:string; component: React.ReactNode}> = {
  "css-grid-generator": { title: "CSS Grid Generator", component: <GridGenerator /> },
  "flexbox-generator": { title: "Flexbox Generator", component: <FlexboxGenerator /> },
  "css-animation-generator": { title: "CSS Animation Generator", component: <AnimationGenerator /> },
  "css-clamp-calculator": { title: "CSS Clamp Calculator", component: <ClampCalculator /> },
  "rem-to-px": { title: "REM to PX Converter", component: <RemPxConverter /> },
  "px-to-rem": { title: "PX to REM Converter", component: <RemPxConverter /> },
  "css-unit-converter": { title: "CSS Unit Converter", component: <CssUnitConverter /> },
  "tailwind-color-generator": { title: "Tailwind Color Reference", component: <TailwindColorGenerator /> },
  "tailwind-shadow-generator": { title: "Tailwind Shadow Generator", component: <TailwindShadowGenerator /> },
  "tailwind-gradient-generator": { title: "Tailwind Gradient Generator", component: <TailwindGradientGenerator /> },
};

export function CssGeneratorTool() {
  const pathname = usePathname();
  const slug = pathname?.split("/").filter(Boolean).at(-1) ?? "css-grid-generator";
  const tool = TOOLS[slug] ?? TOOLS["css-grid-generator"];
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Paintbrush className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{tool.title}</span>
      </div>
      <div className="p-5">{tool.component}</div>
    </div>
  );
}
