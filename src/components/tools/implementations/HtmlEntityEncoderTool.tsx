"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, ArrowLeftRight, Code2 } from "lucide-react";
import { toast } from "sonner";

function encodeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\//g, "&#x2F;")
    .replace(/`/g, "&#x60;")
    .replace(/=/g, "&#x3D;");
}

function decodeHtml(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&#x60;/g, "`")
    .replace(/&#x3D;/g, "=")
    .replace(/&nbsp;/g, " ")
    .replace(/&copy;/g, "©")
    .replace(/&reg;/g, "®")
    .replace(/&trade;/g, "™")
    .replace(/&euro;/g, "€")
    .replace(/&pound;/g, "£")
    .replace(/&yen;/g, "¥")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

const SAMPLES = [
  { label: "HTML encode", text: '<h1 class="title">Hello "World" & <Earth>!</h1>' },
  { label: "Encoded text", text: "&lt;h1 class=&quot;title&quot;&gt;Hello &amp; World&lt;/h1&gt;" },
];

export function HtmlEntityEncoderTool() {
  const [input, setInput] = useState('<h1 class="title">Hello "World" & <Earth>!</h1>');
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const output = mode === "encode" ? encodeHtml(input) : decodeHtml(input);
  const copy = () => { navigator.clipboard.writeText(output); toast.success("Copied!"); };
  const swap = () => { setInput(output); setMode(m => m === "encode" ? "decode" : "encode"); };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">HTML Entity Encoder</span>
        </div>
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button onClick={() => setMode("encode")}
            className={`px-3 py-1 text-xs font-medium transition-all ${mode==="encode"?"bg-primary text-primary-foreground":"text-muted-foreground"}`}>
            Encode
          </button>
          <button onClick={() => setMode("decode")}
            className={`px-3 py-1 text-xs font-medium transition-all ${mode==="decode"?"bg-primary text-primary-foreground":"text-muted-foreground"}`}>
            Decode
          </button>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {SAMPLES.map(s => (
            <button key={s.label} onClick={() => { setInput(s.text); setMode(s.label.includes("encode") ? "encode" : "decode"); }}
              className="px-2.5 py-1 rounded-full border border-border text-[11px] text-muted-foreground hover:text-foreground transition-all">
              {s.label}
            </button>
          ))}
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Input</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Enter HTML or text to encode…" : "Enter encoded entities to decode…"}
            className="min-h-[140px] resize-none text-sm font-mono" />
        </div>

        <div className="flex justify-center">
          <Button variant="outline" size="sm" onClick={swap} className="gap-2">
            <ArrowLeftRight className="w-4 h-4" /> Swap &amp; flip mode
          </Button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Output ({mode === "encode" ? "encoded" : "decoded"})</label>
            <Button size="sm" variant="ghost" onClick={copy} className="h-6 text-xs gap-1">
              <Copy className="w-3 h-3" />Copy
            </Button>
          </div>
          <Textarea readOnly value={output} className="min-h-[140px] resize-none text-sm font-mono bg-muted/20" />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="p-3 rounded-xl border border-border bg-muted/10">
            <p className="font-medium text-foreground mb-1">Common entities</p>
            <code className="block">&amp;amp; → &amp;</code>
            <code className="block">&amp;lt; → &lt;</code>
            <code className="block">&amp;gt; → &gt;</code>
            <code className="block">&amp;quot; → "</code>
          </div>
          <div className="p-3 rounded-xl border border-border bg-muted/10">
            <p className="font-medium text-foreground mb-1">Special chars</p>
            <code className="block">&amp;nbsp; → (space)</code>
            <code className="block">&amp;copy; → ©</code>
            <code className="block">&amp;trade; → ™</code>
            <code className="block">&amp;euro; → €</code>
          </div>
        </div>
      </div>
    </div>
  );
}
