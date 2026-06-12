"use client";

import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SAMPLE_YAML = `name: Alice
age: 30
address:
  city: New York
  country: US
hobbies:
  - reading
  - coding
active: true`;

type Dir = "yaml2json" | "json2yaml";

export function YamlJsonConverterTool() {
  const [input, setInput] = useState(SAMPLE_YAML);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [dir, setDir] = useState<Dir>("yaml2json");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const convert = async (src: string, direction: Dir) => {
    if (!src.trim()) { setOutput(""); setError(""); return; }
    setError("");
    try {
      const yaml = await import("js-yaml");
      if (direction === "yaml2json") {
        const obj = yaml.load(src);
        setOutput(JSON.stringify(obj, null, 2));
      } else {
        const obj = JSON.parse(src);
        setOutput(yaml.dump(obj));
      }
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  // Auto-convert 300ms after input or direction changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => convert(input, dir), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, dir]);

  const copy = () => { navigator.clipboard.writeText(output); toast.success("Copied!"); };

  const swap = () => {
    setInput(output);
    setDir(dir === "yaml2json" ? "json2yaml" : "yaml2json");
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setDir("yaml2json")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                dir === "yaml2json" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              YAML <ArrowRight className="w-3 h-3" /> JSON
            </button>
            <button
              onClick={() => setDir("json2yaml")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                dir === "json2yaml" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              JSON <ArrowRight className="w-3 h-3" /> YAML
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-emerald-500 font-medium">● Live</span>
          {output && (
            <button onClick={swap} className="text-xs px-2.5 py-1 rounded-lg border border-border hover:border-primary/40 transition-all">
              <ArrowLeft className="w-3 h-3 inline mr-1" />Swap
            </button>
          )}
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Input ({dir === "yaml2json" ? "YAML" : "JSON"})
            </label>
            <Textarea value={input} onChange={e => setInput(e.target.value)} className="min-h-[280px] resize-none text-xs font-mono" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-muted-foreground">
                Output ({dir === "yaml2json" ? "JSON" : "YAML"})
              </label>
              {output && <Button size="sm" variant="ghost" onClick={copy} className="h-6 text-xs gap-1"><Copy className="w-3 h-3" />Copy</Button>}
            </div>
            {error ? (
              <div className="min-h-[280px] p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-500 font-mono">{error}</div>
            ) : (
              <Textarea readOnly value={output} className="min-h-[280px] resize-none text-xs font-mono bg-muted/10" placeholder="Output will appear here…" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
