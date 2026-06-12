"use client";

import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { GitCompare } from "lucide-react";

function deepDiff(a: unknown, b: unknown, path = ""): Array<{ path: string; type: "added"|"removed"|"changed"; aVal: unknown; bVal: unknown }> {
  const results: ReturnType<typeof deepDiff> = [];
  if (JSON.stringify(a) === JSON.stringify(b)) return results;
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    return [{ path: path || "(root)", type: "changed", aVal: a, bVal: b }];
  }
  if (typeof a === "object" && a !== null && b !== null && typeof b === "object") {
    const aObj = a as Record<string, unknown>; const bObj = b as Record<string, unknown>;
    const keys = new Set([...Object.keys(aObj), ...Object.keys(bObj)]);
    for (const k of keys) {
      const p = path ? `${path}.${k}` : k;
      if (!(k in aObj)) results.push({ path: p, type: "added", aVal: undefined, bVal: bObj[k] });
      else if (!(k in bObj)) results.push({ path: p, type: "removed", aVal: aObj[k], bVal: undefined });
      else results.push(...deepDiff(aObj[k], bObj[k], p));
    }
  } else {
    results.push({ path: path || "(root)", type: "changed", aVal: a, bVal: b });
  }
  return results;
}

const fmt = (v: unknown) => v === undefined ? "(missing)" : JSON.stringify(v);

export function JsonDiffTool() {
  const [a, setA] = useState('{\n  "name": "Alice",\n  "age": 30,\n  "city": "New York"\n}');
  const [b, setB] = useState('{\n  "name": "Alice",\n  "age": 31,\n  "city": "Boston",\n  "country": "US"\n}');

  const { diffs, error } = useMemo(() => {
    try {
      const pa = JSON.parse(a); const pb = JSON.parse(b);
      return { diffs: deepDiff(pa, pb), error: "" };
    } catch (e) { return { diffs: [], error: (e as Error).message }; }
  }, [a, b]);

  const typeColor = { added: "text-emerald-500 bg-emerald-500/5 border-emerald-500/20", removed: "text-red-500 bg-red-500/5 border-red-500/20", changed: "text-amber-500 bg-amber-500/5 border-amber-500/20" };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <GitCompare className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">JSON Diff Tool</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">JSON A (original)</label>
            <Textarea value={a} onChange={e => setA(e.target.value)} className="min-h-[200px] resize-none text-xs font-mono" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">JSON B (modified)</label>
            <Textarea value={b} onChange={e => setB(e.target.value)} className="min-h-[200px] resize-none text-xs font-mono" />
          </div>
        </div>

        {error && <p className="text-xs text-red-500 p-3 rounded-xl border border-red-500/20 bg-red-500/5">{error}</p>}

        {!error && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">Differences</p>
              <div className="flex gap-3 text-xs">
                <span className="text-emerald-500">+{diffs.filter(d=>d.type==="added").length} added</span>
                <span className="text-red-500">-{diffs.filter(d=>d.type==="removed").length} removed</span>
                <span className="text-amber-500">~{diffs.filter(d=>d.type==="changed").length} changed</span>
              </div>
            </div>
            {diffs.length === 0 ? (
              <div className="text-center py-8 text-sm text-emerald-500 font-medium">✓ JSON objects are identical</div>
            ) : (
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {diffs.map((d, i) => (
                  <div key={i} className={`flex items-start gap-3 p-2.5 rounded-xl border text-xs ${typeColor[d.type]}`}>
                    <span className="font-mono font-bold w-16 shrink-0">{d.type.toUpperCase()}</span>
                    <code className="font-mono font-medium shrink-0">{d.path}</code>
                    <div className="flex-1 min-w-0">
                      {d.type !== "added" && <div className="line-through opacity-70 truncate">{fmt(d.aVal)}</div>}
                      {d.type !== "removed" && <div className="truncate">{fmt(d.bVal)}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
