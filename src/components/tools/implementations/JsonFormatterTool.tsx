"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Minimize2, Maximize2, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SAMPLE = `{"name":"ToolsHub","version":"1.0","features":["JSON formatter","Base64 encoder","Word counter"],"meta":{"free":true,"users":50000}}`;

export function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);

  const format = useCallback((minify = false) => {
    const src = input.trim();
    if (!src) return;
    try {
      const parsed = JSON.parse(src);
      const result = minify
        ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, indent);
      setOutput(result);
      setError("");
    } catch (e: unknown) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input, indent]);

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    setInput(SAMPLE);
    setOutput("");
    setError("");
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const isValid = output && !error;
  const charCount = output.length;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30 flex-wrap">
        <Button size="sm" onClick={() => format(false)} className="h-8 text-xs">
          <Maximize2 className="w-3.5 h-3.5 mr-1.5" />
          Beautify
        </Button>
        <Button size="sm" variant="outline" onClick={() => format(true)} className="h-8 text-xs">
          <Minimize2 className="w-3.5 h-3.5 mr-1.5" />
          Minify
        </Button>
        <div className="flex items-center gap-1.5 ml-2">
          <span className="text-xs text-muted-foreground">Indent:</span>
          {[2, 4].map((n) => (
            <button
              key={n}
              onClick={() => setIndent(n)}
              className={cn(
                "px-2 py-0.5 rounded text-xs border transition-all",
                indent === n
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary/50"
              )}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={loadSample} className="h-8 text-xs">
            Sample
          </Button>
          <Button size="sm" variant="ghost" onClick={clear} className="h-8 text-xs">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Input */}
        <div className="relative">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground">INPUT</span>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="border-0 rounded-none font-mono text-xs min-h-[320px] resize-none focus-visible:ring-0 bg-transparent"
          />
        </div>

        {/* Output */}
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
              {output || <span className="text-muted-foreground">Formatted JSON will appear here...</span>}
            </pre>
          )}

          {output && (
            <button
              onClick={copy}
              className="absolute top-10 right-3 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/80 hover:bg-muted text-xs transition-all"
            >
              {copied ? (
                <><Check className="w-3 h-3 text-emerald-500" /> Copied</>
              ) : (
                <><Copy className="w-3 h-3" /> Copy</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
