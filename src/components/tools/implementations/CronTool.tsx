"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Timer } from "lucide-react";
import { toast } from "sonner";

function parseCron(expr: string): { desc: string; next: Date[]; error?: string } {
  const parts = expr.trim().split(/\s+/);
  if (parts.length < 5 || parts.length > 6) return { desc: "", next: [], error: "Cron must have 5 or 6 fields" };
  const [min, hour, dom, month, dow] = parts.slice(parts.length - 5);
  const fmtField = (val: string, unit: string, names?: string[]) => {
    if (val === "*") return `every ${unit}`;
    if (val.startsWith("*/")) return `every ${val.slice(2)} ${unit}s`;
    if (val.includes(",")) return val.split(",").map(v => names?.[+v] ?? v).join(", ");
    if (val.includes("-")) return `${unit} ${val.replace("-"," to ")}`;
    return `${unit} ${names?.[+val] ?? val}`;
  };
  const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const parts2 = [`at ${fmtField(min,"minute")}`, `of ${fmtField(hour,"hour")}`, `on ${fmtField(dom,"day-of-month")}`, `in ${fmtField(month,"month",months)}`, `on ${fmtField(dow,"weekday",days)}`];
  return { desc: parts2.join(", "), next: getNextRuns(expr, 5) };
}

function getNextRuns(expr: string, count: number): Date[] {
  // Simplified — just show next N minutes/hours based on common patterns
  const dates: Date[] = [];
  const now = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(now);
    d.setMinutes(d.getMinutes() + i * 10);
    d.setSeconds(0, 0);
    dates.push(d);
  }
  return dates;
}

const COMMON = [
  { label: "Every minute", expr: "* * * * *" },
  { label: "Every hour", expr: "0 * * * *" },
  { label: "Every day at midnight", expr: "0 0 * * *" },
  { label: "Every Monday 9am", expr: "0 9 * * 1" },
  { label: "Every month 1st", expr: "0 0 1 * *" },
  { label: "Every 15 minutes", expr: "*/15 * * * *" },
];

export function CronTool() {
  const pathname = usePathname();
  const isParser = pathname?.includes("cron-parser");
  const [expr, setExpr] = useState("0 9 * * 1");
  const [fields, setFields] = useState({ min: "0", hour: "9", dom: "*", month: "*", dow: "1" });

  const result = useMemo(() => parseCron(expr), [expr]);
  const builtExpr = `${fields.min} ${fields.hour} ${fields.dom} ${fields.month} ${fields.dow}`;

  const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copied!"); };

  if (!isParser) {
    // Generator mode
    const FIELDS = [
      { key: "min", label: "Minute", placeholder: "0-59 or * or */5" },
      { key: "hour", label: "Hour", placeholder: "0-23 or * or */2" },
      { key: "dom", label: "Day (month)", placeholder: "1-31 or *" },
      { key: "month", label: "Month", placeholder: "1-12 or *" },
      { key: "dow", label: "Day (week)", placeholder: "0-6 (Sun=0)" },
    ] as const;
    return (
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
          <Timer className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Cron Expression Generator</span>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {COMMON.map(c => (
              <button key={c.label} onClick={() => { const p = c.expr.split(" "); setFields({ min:p[0],hour:p[1],dom:p[2],month:p[3],dow:p[4] }); }}
                className="px-2.5 py-1 rounded-full border border-border text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
                {c.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2">
            {FIELDS.map(f => (
              <div key={f.key}>
                <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                <Input value={fields[f.key]} onChange={e => setFields(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} className="font-mono text-sm text-center" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/10">
            <code className="flex-1 text-base font-mono font-bold text-primary">{builtExpr}</code>
            <Button size="sm" onClick={() => copy(builtExpr)} className="gap-1.5"><Copy className="w-3.5 h-3.5" />Copy</Button>
          </div>
          {(() => { const r = parseCron(builtExpr); return r.desc ? <p className="text-sm text-muted-foreground">Runs: <strong>{r.desc}</strong></p> : null; })()}
        </div>
      </div>
    );
  }

  // Parser mode
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Timer className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Cron Expression Parser</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex gap-2">
          <Input value={expr} onChange={e => setExpr(e.target.value)} placeholder="0 9 * * 1" className="flex-1 font-mono text-sm" />
          <Button onClick={() => copy(expr)} variant="outline" className="gap-1.5"><Copy className="w-4 h-4" /></Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COMMON.map(c => (
            <button key={c.label} onClick={() => setExpr(c.expr)}
              className="px-2.5 py-1 rounded-full border border-border text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
              {c.label}
            </button>
          ))}
        </div>
        {result.error && <p className="text-sm text-red-500">{result.error}</p>}
        {result.desc && (
          <div className="p-4 rounded-xl border border-border bg-primary/5">
            <p className="text-xs text-muted-foreground mb-1">Human-readable</p>
            <p className="text-base font-medium capitalize">{result.desc}</p>
          </div>
        )}
        <div className="text-xs text-muted-foreground p-3 rounded-xl border border-border bg-muted/10">
          <div className="grid grid-cols-5 gap-1 font-mono">
            {["min","hour","day/m","month","day/w"].map((h,i) => (
              <div key={h} className="text-center">
                <div className="text-primary font-bold">{expr.split(/\s+/)[i] ?? "*"}</div>
                <div className="text-muted-foreground/70">{h}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
