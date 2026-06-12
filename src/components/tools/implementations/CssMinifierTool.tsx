"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Minimize2, Maximize2 } from "lucide-react";
import { toast } from "sonner";

function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")      // remove comments
    .replace(/\s*([{}:;,>~+])\s*/g, "$1")  // remove spaces around punctuation
    .replace(/;\s*}/g, "}")                  // remove last semicolon before }
    .replace(/\s+/g, " ")                    // collapse whitespace
    .replace(/^\s+|\s+$/g, "")              // trim
    .replace(/ {/g, "{")                     // no space before {
    .replace(/: /g, ":")                     // no space after :
    .replace(/, /g, ",");                    // no space after ,
}

function beautifyCss(css: string): string {
  const minified = minifyCss(css);
  return minified
    .replace(/}/g, "}\n")
    .replace(/{/g, " {\n  ")
    .replace(/;/g, ";\n  ")
    .replace(/,(?=[^}])/g, ",\n")
    .replace(/\n  }/g, "\n}")
    .replace(/  \n}/g, "\n}")
    .trim();
}

const SAMPLE = `/* Main styles */
body {
  font-family: Inter, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  background-color: #fff;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

h1, h2, h3 {
  font-weight: 700;
  line-height: 1.2;
}`;

export function CssMinifierTool() {
  const [input, setInput] = useState(SAMPLE);
  const [mode, setMode] = useState<"minify" | "beautify">("minify");

  const output = mode === "minify" ? minifyCss(input) : beautifyCss(input);
  const copy = () => { navigator.clipboard.writeText(output); toast.success("Copied!"); };

  const origBytes = new TextEncoder().encode(input).length;
  const outBytes = new TextEncoder().encode(output).length;
  const saved = origBytes > 0 ? Math.round((1 - outBytes / origBytes) * 100) : 0;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Minimize2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">CSS Minifier / Beautifier</span>
        </div>
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button onClick={() => setMode("minify")}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-medium transition-all ${mode==="minify"?"bg-primary text-primary-foreground":"text-muted-foreground"}`}>
            <Minimize2 className="w-3 h-3" />Minify
          </button>
          <button onClick={() => setMode("beautify")}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-medium transition-all ${mode==="beautify"?"bg-primary text-primary-foreground":"text-muted-foreground"}`}>
            <Maximize2 className="w-3 h-3" />Beautify
          </button>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Input CSS</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)}
            className="min-h-[200px] resize-none text-sm font-mono" placeholder="Paste your CSS here…" />
        </div>

        {input && (
          <div className="flex items-center gap-4 p-3 rounded-xl border border-border bg-muted/20 text-xs">
            <div><span className="text-muted-foreground">Original:</span> <span className="font-medium">{origBytes} bytes</span></div>
            <div><span className="text-muted-foreground">Output:</span> <span className="font-medium">{outBytes} bytes</span></div>
            {mode === "minify" && saved > 0 && (
              <div className="text-emerald-600 dark:text-emerald-400 font-medium">Saved {saved}%</div>
            )}
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Output ({mode === "minify" ? "minified" : "beautified"})</label>
            <Button size="sm" variant="ghost" onClick={copy} className="h-6 text-xs gap-1">
              <Copy className="w-3 h-3" />Copy
            </Button>
          </div>
          <Textarea readOnly value={output} className="min-h-[200px] resize-none text-sm font-mono bg-muted/20" />
        </div>
      </div>
    </div>
  );
}
