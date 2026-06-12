"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Minimize2, Maximize2, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SAMPLE = `{"name":"AllConverter.tools","version":"1.0","features":["JSON formatter","Base64 encoder","Word counter"],"meta":{"free":true,"users":50000}}`;

export function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);
  const [minified, setMinified] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const format = useCallback((src: string, mini: boolean, spaces: number) => {
    if (!src.trim()) { setOutput(""); setError(""); return; }
    try {
      const parsed = JSON.parse(src);
      setOutput(mini ? JSON.stringify(parsed) : JSON.stringify(parsed, null, spaces));
      setError("");
    } catch (e: unknown) {
      setError((e as Error).message);
      setOutput("");
    }
  }, []);

  // Auto-format 300ms after input changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => format(input, minified, indent), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, minified, indent, format]);

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => { setInput(SAMPLE); setMinified(false); };
  const clear = () => { setInput(""); setOutput(""); setError(""); };

  const isValid = output && !error;
  const charCount = output.length;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30 flex-wrap">
        <button
          onClick={() => setMinified(false)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
            !minified ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"
          )}
        >
          <Maximize2 className="w-3.5 h-3.5" /> Beautify
        </button>
        <button
          onClick={() => setMinified(true)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
            minified ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"
          )}
        >
          <Minimize2 className="w-3.5 h-3.5" /> Minify
        </button>
        {!minified && (
          <div className="flex items-center gap-1.5 ml-1">
            <span className="text-xs text-muted-foreground">Indent:</span>
            {[2, 4].map((n) => (
              <button
                key={n}
                onClick={() => setIndent(n)}
                className={cn(
                  "px-2 py-0.5 rounded text-xs border transition-all",
                  indent === n ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"
                )}
              >
                {n}
              </button>
            ))}
          </div>
        )}
        <span className="ml-auto text-[10px] text-emerald-500 font-medium">● Live</span>
        <Button size="sm" variant="ghost" onClick={loadSample} className="h-8 text-xs">Sample</Button>
        <Button size="sm" variant="ghost" onClick={clear} className="h-8 text-xs">
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        <div className="relative">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground">INPUT</span>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here…"
            className="border-0 rounded-none font-mono text-xs min-h-[320px] resize-none focus-visible:ring-0 bg-transparent"
          />
        </div>

        <div className="relative">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground">OUTPUT</span>
            {isValid && (
              <Badge className="text-[9px] h-4 px-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                Valid JSON
              </Badge>
            )}
            {charCount > 0 && (
              <span className="text-[10px] text-muted-foreground ml-auto">
                {charCount.toLocaleString()} chars
              </span>
            )}
          </div>

          {error ? (
            <div className="p-4 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-destructive">JSON Error</p>
                <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
              </div>
            </div>
          ) : (
            <pre className="font-mono text-xs p-4 overflow-auto min-h-[320px] whitespace-pre text-foreground">
              {output || <span className="text-muted-foreground">Formatted JSON will appear here…</span>}
            </pre>
          )}

          {output && (
            <button
              onClick={copy}
              className="absolute top-10 right-3 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/80 hover:bg-muted text-xs transition-all"
            >
              {copied ? <><Check className="w-3 h-3 text-emerald-500" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
