"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const SAMPLE_YAML = `name: Alice
age: 30
address:
  city: New York
  country: US
hobbies:
  - reading
  - coding
active: true`;

export function YamlJsonConverterTool() {
  const [input, setInput] = useState(SAMPLE_YAML);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = async () => {
    setError("");
    try {
      const yaml = await import("js-yaml");
      const obj = yaml.load(input);
      setOutput(JSON.stringify(obj, null, 2));
    } catch (e) { setError((e as Error).message); }
  };

  const convertBack = async () => {
    setError("");
    try {
      const yaml = await import("js-yaml");
      const obj = JSON.parse(input);
      setOutput(yaml.dump(obj));
    } catch (e) { setError((e as Error).message); }
  };

  const copy = () => { navigator.clipboard.writeText(output); toast.success("Copied!"); };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <ArrowRight className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">YAML ↔ JSON Converter</span>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Input (YAML or JSON)</label>
            <Textarea value={input} onChange={e => setInput(e.target.value)} className="min-h-[280px] resize-none text-xs font-mono" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-muted-foreground">Output</label>
              {output && <Button size="sm" variant="ghost" onClick={copy} className="h-6 text-xs gap-1"><Copy className="w-3 h-3" />Copy</Button>}
            </div>
            {error ? (
              <div className="min-h-[280px] p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-500 font-mono">{error}</div>
            ) : (
              <Textarea readOnly value={output} className="min-h-[280px] resize-none text-xs font-mono bg-muted/10" placeholder="Output will appear here…" />
            )}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={convert} className="flex-1 gap-2"><ArrowRight className="w-4 h-4" />YAML → JSON</Button>
          <Button onClick={convertBack} variant="outline" className="flex-1 gap-2"><ArrowRight className="w-4 h-4 rotate-180" />JSON → YAML</Button>
        </div>
      </div>
    </div>
  );
}
