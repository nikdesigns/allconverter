"use client";

import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, ArrowRight } from "lucide-react";
import { toast } from "sonner";

function csvToXml(csv: string, rootEl: string, rowEl: string): string {
  const lines = csv.trim().split(/\r?\n/);
  if (!lines.length) return "";
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g,"").replace(/\s+/g,"_").replace(/[^a-zA-Z0-9_-]/g,"_") || "field");
  const rows = lines.slice(1).map(line => {
    const vals = line.split(",").map(v => v.trim().replace(/^"|"$/g,""));
    return `  <${rowEl}>\n` + headers.map((h,i) => `    <${h}>${(vals[i]||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</${h}>`).join("\n") + `\n  </${rowEl}>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootEl}>\n${rows.join("\n")}\n</${rootEl}>`;
}

const SAMPLE = `name,age,city
Alice,30,New York
Bob,25,Boston
Charlie,35,Chicago`;

export function CsvXmlConverterTool() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [rootEl, setRootEl] = useState("records");
  const [rowEl, setRowEl] = useState("record");
  const [error, setError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const convert = (src: string, root: string, row: string) => {
    if (!src.trim()) { setOutput(""); setError(""); return; }
    setError("");
    try {
      setOutput(csvToXml(src, root.trim() || "records", row.trim() || "record"));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => convert(input, rootEl, rowEl), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, rootEl, rowEl]);

  const copy = () => { navigator.clipboard.writeText(output); toast.success("Copied!"); };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">CSV to XML Converter</span>
        </div>
        <span className="text-[10px] text-emerald-500 font-medium">● Live</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Root element</label>
            <Input value={rootEl} onChange={e => setRootEl(e.target.value)} className="w-32 text-sm font-mono" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Row element</label>
            <Input value={rowEl} onChange={e => setRowEl(e.target.value)} className="w-32 text-sm font-mono" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">CSV Input</label>
            <Textarea value={input} onChange={e => setInput(e.target.value)} className="min-h-[260px] resize-none text-sm font-mono" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-muted-foreground">XML Output</label>
              {output && <Button size="sm" variant="ghost" onClick={copy} className="h-6 text-xs gap-1"><Copy className="w-3 h-3" />Copy</Button>}
            </div>
            {error ? (
              <div className="min-h-[260px] p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-500 font-mono">{error}</div>
            ) : (
              <Textarea readOnly value={output} className="min-h-[260px] resize-none text-xs font-mono bg-muted/10" placeholder="Output will appear here…" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
