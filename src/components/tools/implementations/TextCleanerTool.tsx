"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Eraser, Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const OPERATIONS = [
  { id: "trim", label: "Trim whitespace", desc: "Remove leading/trailing spaces" },
  { id: "singlespace", label: "Single spaces", desc: "Collapse multiple spaces into one" },
  { id: "singleline", label: "Single line breaks", desc: "Collapse multiple blank lines into one" },
  { id: "removeblank", label: "Remove blank lines", desc: "Delete all empty lines" },
  { id: "removespecial", label: "Remove special chars", desc: "Strip non-ASCII characters" },
  { id: "removenumbers", label: "Remove numbers", desc: "Delete all digit characters" },
  { id: "removepunct", label: "Remove punctuation", desc: "Strip punctuation marks" },
  { id: "unixtoline", label: "Unix line endings", desc: "Replace \\r\\n with \\n" },
  { id: "removehtmltags", label: "Strip HTML tags", desc: "Remove <tag> patterns" },
  { id: "removeurls", label: "Remove URLs", desc: "Strip http/https links" },
  { id: "removeemails", label: "Remove emails", desc: "Strip email addresses" },
];

function applyOps(text: string, ops: Set<string>): string {
  let t = text;
  if (ops.has("trim")) t = t.split("\n").map(l => l.trim()).join("\n");
  if (ops.has("unixtoline")) t = t.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (ops.has("removehtmltags")) t = t.replace(/<[^>]+>/g, "");
  if (ops.has("removeurls")) t = t.replace(/https?:\/\/\S+/g, "");
  if (ops.has("removeemails")) t = t.replace(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g, "");
  if (ops.has("singlespace")) t = t.replace(/[ \t]+/g, " ");
  if (ops.has("singleline")) t = t.replace(/\n{3,}/g, "\n\n");
  if (ops.has("removeblank")) t = t.split("\n").filter(l => l.trim()).join("\n");
  if (ops.has("removespecial")) t = t.replace(/[^\x00-\x7F]/g, "");
  if (ops.has("removenumbers")) t = t.replace(/[0-9]/g, "");
  if (ops.has("removepunct")) t = t.replace(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g, "");
  return t;
}

export function TextCleanerTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [ops, setOps] = useState<Set<string>>(new Set(["trim","singlespace","singleline"]));

  const toggle = (id: string) => setOps(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const clean = () => { const r = applyOps(input, ops); setOutput(r); };
  const copy = () => { navigator.clipboard.writeText(output); toast.success("Copied!"); };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Eraser className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Text Cleaner</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {OPERATIONS.map(op => (
            <label key={op.id} className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${ops.has(op.id)?"border-primary/30 bg-primary/5":"border-border hover:border-border/70"}`}>
              <input type="checkbox" checked={ops.has(op.id)} onChange={() => toggle(op.id)} className="mt-0.5 accent-primary" />
              <div>
                <p className="text-xs font-medium">{op.label}</p>
                <p className="text-[11px] text-muted-foreground">{op.desc}</p>
              </div>
            </label>
          ))}
        </div>

        <Textarea value={input} onChange={e => setInput(e.target.value)}
          placeholder="Paste your messy text here…" className="min-h-[140px] resize-none text-sm font-mono" />

        <Button onClick={clean} disabled={!input.trim()} className="w-full gap-2">
          <Eraser className="w-4 h-4" /> Clean Text
        </Button>

        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{output.length} chars · {output.split(/\n/).length} lines</span>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={copy} className="h-7 text-xs gap-1"><Copy className="w-3.5 h-3.5" />Copy</Button>
                <Button size="sm" variant="ghost" onClick={() => { setInput(output); setOutput(""); }} className="h-7 text-xs gap-1"><RotateCcw className="w-3.5 h-3.5" />Re-clean</Button>
              </div>
            </div>
            <Textarea readOnly value={output} className="min-h-[140px] resize-none text-sm font-mono bg-muted/20" />
          </div>
        )}
      </div>
    </div>
  );
}
