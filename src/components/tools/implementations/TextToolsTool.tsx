"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, AlignJustify } from "lucide-react";
import { toast } from "sonner";

// ROT13
function rot13(s: string) { return s.replace(/[a-zA-Z]/g, c => { const base = c <= "Z" ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base); }); }

// Text to ASCII / ASCII to Text
function textToAscii(s: string, fmt: "dec"|"hex"|"bin") {
  return s.split("").map(c => {
    const code = c.charCodeAt(0);
    return fmt === "hex" ? code.toString(16).padStart(2,"0") : fmt === "bin" ? code.toString(2).padStart(8,"0") : String(code);
  }).join(" ");
}
function asciiToText(s: string, fmt: "dec"|"hex"|"bin") {
  return s.trim().split(/\s+/).map(v => String.fromCharCode(parseInt(v, fmt === "hex" ? 16 : fmt === "bin" ? 2 : 10))).join("");
}

export function TextToolsTool() {
  const pathname = usePathname();
  const slug = pathname?.split("/").filter(Boolean).at(-1) ?? "rot13-encoder";

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [asciiMode, setAsciiMode] = useState<"dec"|"hex"|"bin">("dec");
  const [lineStart, setLineStart] = useState(1);
  const [separator, setSeparator] = useState(". ");
  const [lineBreakReplace, setLineBreakReplace] = useState(" ");

  const copy = () => { navigator.clipboard.writeText(output); toast.success("Copied!"); };

  const process = () => {
    switch (slug) {
      case "rot13-encoder": setOutput(rot13(input)); break;
      case "text-to-ascii": setOutput(textToAscii(input, asciiMode)); break;
      case "ascii-to-text": setOutput(asciiToText(input, asciiMode)); break;
      case "remove-line-breaks":
        setOutput(input.split(/\r?\n/).map(l => l.trim()).filter(Boolean).join(lineBreakReplace)); break;
      case "add-line-numbers":
        setOutput(input.split(/\r?\n/).map((l,i) => `${i+lineStart}${separator}${l}`).join("\n")); break;
      case "duplicate-word-finder": {
        const words = input.toLowerCase().match(/\b\w{3,}\b/g) ?? [];
        const freq: Record<string, number> = {};
        words.forEach(w => { freq[w] = (freq[w] ?? 0) + 1; });
        const dupes = Object.entries(freq).filter(([,n]) => n > 1).sort((a,b) => b[1]-a[1]);
        setOutput(dupes.length ? dupes.map(([w,n]) => `${w}: ${n}×`).join("\n") : "No duplicate words found."); break;
      }
      case "reading-time-calculator": {
        const wc = input.trim().split(/\s+/).filter(Boolean).length;
        const slow = Math.ceil(wc / 150); const avg = Math.ceil(wc / 200); const fast = Math.ceil(wc / 250);
        setOutput(`${wc} words\n\nSlow reader (150 wpm):  ${slow} min\nAverage (200 wpm):       ${avg} min\nFast reader (250 wpm):  ${fast} min`); break;
      }
    }
  };

  const labels: Record<string, { title: string; inputLabel: string; outputLabel: string }> = {
    "rot13-encoder": { title: "ROT13 Encoder / Decoder", inputLabel: "Input text", outputLabel: "ROT13 output" },
    "text-to-ascii": { title: "Text to ASCII Codes", inputLabel: "Text to convert", outputLabel: "ASCII codes" },
    "ascii-to-text": { title: "ASCII to Text", inputLabel: "ASCII codes (space-separated)", outputLabel: "Decoded text" },
    "remove-line-breaks": { title: "Remove Line Breaks", inputLabel: "Text with line breaks", outputLabel: "Result" },
    "add-line-numbers": { title: "Add Line Numbers", inputLabel: "Text to number", outputLabel: "Numbered lines" },
    "duplicate-word-finder": { title: "Duplicate Word Finder", inputLabel: "Text to analyze", outputLabel: "Duplicates found" },
    "reading-time-calculator": { title: "Reading Time Calculator", inputLabel: "Text or article", outputLabel: "Reading time estimate" },
  };
  const label = labels[slug] ?? labels["rot13-encoder"];

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <AlignJustify className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{label.title}</span>
      </div>
      <div className="p-5 space-y-4">
        {(slug === "text-to-ascii" || slug === "ascii-to-text") && (
          <div className="flex gap-2">
            {(["dec","hex","bin"] as const).map(f => (
              <button key={f} onClick={() => setAsciiMode(f)}
                className={`flex-1 py-2 rounded-xl border text-xs font-mono font-medium uppercase transition-all ${asciiMode===f?"border-primary/40 bg-primary/10 text-primary":"border-border text-muted-foreground"}`}>
                {f}
              </button>
            ))}
          </div>
        )}
        {slug === "remove-line-breaks" && (
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Replace line breaks with</label>
            <Input value={lineBreakReplace} onChange={e => setLineBreakReplace(e.target.value)} className="font-mono text-sm w-40" placeholder="space, comma, etc." />
          </div>
        )}
        {slug === "add-line-numbers" && (
          <div className="flex gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Start number</label>
              <Input type="number" value={lineStart} onChange={e => setLineStart(+e.target.value)} className="w-24 text-sm font-mono" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Separator</label>
              <Input value={separator} onChange={e => setSeparator(e.target.value)} className="w-20 text-sm font-mono" />
            </div>
          </div>
        )}

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">{label.inputLabel}</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} className="min-h-[140px] resize-none text-sm font-mono" placeholder="Paste your text here…" />
        </div>

        <Button onClick={process} disabled={!input.trim()} className="w-full">Process</Button>

        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{label.outputLabel}</span>
              <Button size="sm" variant="ghost" onClick={copy} className="h-6 text-xs gap-1"><Copy className="w-3 h-3" />Copy</Button>
            </div>
            <Textarea readOnly value={output} className="min-h-[140px] resize-none text-sm font-mono bg-muted/20" />
          </div>
        )}
      </div>
    </div>
  );
}
