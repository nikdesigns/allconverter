"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function copy(text: string) {
  navigator.clipboard.writeText(text);
  toast.success("Copied!");
}

// ─── Character Counter ────────────────────────────────────────────────────────

function CharacterCounter() {
  const [text, setText] = useState("");

  const chars        = text.length;
  const noSpaces     = text.replace(/\s/g, "").length;
  const words        = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences    = text.trim() ? (text.match(/[^.!?]+[.!?]+/g) ?? []).length || 1 : 0;
  const paragraphs   = text.trim() ? text.split(/\n\s*\n/).filter(Boolean).length : 0;
  const readingTime  = Math.max(1, Math.ceil(words / 200));
  const speakingTime = Math.max(1, Math.ceil(words / 130));

  const stats = [
    { label: "Characters",           value: chars.toLocaleString() },
    { label: "Characters (no spaces)", value: noSpaces.toLocaleString() },
    { label: "Words",                value: words.toLocaleString() },
    { label: "Sentences",            value: sentences.toLocaleString() },
    { label: "Paragraphs",           value: paragraphs.toLocaleString() },
    { label: "Reading time",         value: `~${readingTime} min` },
    { label: "Speaking time",        value: `~${speakingTime} min` },
  ];

  const copyStats = () => copy(stats.map(s => `${s.label}: ${s.value}`).join("\n"));

  return (
    <div className="space-y-4">
      <Textarea value={text} onChange={e => setText(e.target.value)}
        placeholder="Type or paste your text here…"
        className="min-h-[180px] text-sm font-mono resize-y" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {stats.slice(0, 4).map(s => (
          <div key={s.label} className="rounded-xl border border-border p-3 text-center">
            <div className="text-lg font-bold">{s.value}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        {stats.map((s, i) => (
          <div key={s.label} className={cn("flex items-center justify-between px-4 py-2.5 text-sm", i % 2 === 0 ? "bg-background" : "bg-muted/10")}>
            <span className="text-muted-foreground text-xs">{s.label}</span>
            <span className="font-semibold">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={copyStats} className="gap-1.5 text-xs h-8">
          <Copy className="w-3 h-3" /> Copy Stats
        </Button>
      </div>
    </div>
  );
}

// ─── Remove Duplicate Lines ───────────────────────────────────────────────────

function RemoveDuplicateLines() {
  const [input, setInput]   = useState("");
  const [output, setOutput] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(true);

  const process = useCallback(() => {
    const lines = input.split("\n");
    const seen = new Set<string>();
    const result = lines.filter(line => {
      const key = caseSensitive ? line : line.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const removed = lines.length - result.length;
    setOutput(result.join("\n"));
    toast.success(`Removed ${removed} duplicate line${removed !== 1 ? "s" : ""}`);
  }, [input, caseSensitive]);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Input</label>
          <Textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="Paste lines here…" className="min-h-[200px] text-sm font-mono resize-y" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Output</label>
          <Textarea value={output} readOnly className="min-h-[200px] text-sm font-mono resize-y bg-muted/5" />
        </div>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} className="rounded" />
          Case-sensitive
        </label>
        <Button onClick={process} disabled={!input.trim()} className="gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Remove Duplicates
        </Button>
        {output && (
          <Button variant="outline" size="sm" onClick={() => copy(output)} className="gap-1.5 text-xs">
            <Copy className="w-3 h-3" /> Copy
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Sort Lines ───────────────────────────────────────────────────────────────

function SortLines() {
  const [input, setInput]   = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode]     = useState<"az"|"za"|"len-asc"|"len-desc"|"numeric">("az");

  const process = useCallback(() => {
    const lines = input.split("\n");
    const sorted = [...lines].sort((a, b) => {
      if (mode === "az")       return a.localeCompare(b);
      if (mode === "za")       return b.localeCompare(a);
      if (mode === "len-asc")  return a.length - b.length;
      if (mode === "len-desc") return b.length - a.length;
      if (mode === "numeric")  return parseFloat(a) - parseFloat(b);
      return 0;
    });
    setOutput(sorted.join("\n"));
  }, [input, mode]);

  const modes = [
    { value: "az",       label: "A → Z" },
    { value: "za",       label: "Z → A" },
    { value: "len-asc",  label: "Shortest first" },
    { value: "len-desc", label: "Longest first" },
    { value: "numeric",  label: "Numeric" },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {modes.map(m => (
          <button key={m.value} onClick={() => setMode(m.value)}
            className={cn("px-3 py-1.5 rounded-full border text-xs font-medium transition-all",
              mode === m.value ? "border-primary/50 bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40")}>
            {m.label}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Textarea value={input} onChange={e => setInput(e.target.value)}
          placeholder="Paste lines to sort…" className="min-h-[200px] text-sm font-mono resize-y" />
        <Textarea value={output} readOnly className="min-h-[200px] text-sm font-mono resize-y bg-muted/5" />
      </div>
      <div className="flex gap-2">
        <Button onClick={process} disabled={!input.trim()} className="gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Sort Lines
        </Button>
        {output && <Button variant="outline" size="sm" onClick={() => copy(output)} className="gap-1.5 text-xs"><Copy className="w-3 h-3" />Copy</Button>}
      </div>
    </div>
  );
}

// ─── Reverse Text ─────────────────────────────────────────────────────────────

function ReverseText() {
  const [input, setInput] = useState("");
  const [mode, setMode]   = useState<"chars"|"words"|"lines">("chars");

  const output = (() => {
    if (!input) return "";
    if (mode === "chars")  return input.split("").reverse().join("");
    if (mode === "words")  return input.split(/\s+/).reverse().join(" ");
    if (mode === "lines")  return input.split("\n").reverse().join("\n");
    return "";
  })();

  const modes = [
    { value: "chars", label: "Reverse characters" },
    { value: "words", label: "Reverse words" },
    { value: "lines", label: "Reverse lines" },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {modes.map(m => (
          <button key={m.value} onClick={() => setMode(m.value)}
            className={cn("px-3 py-1.5 rounded-full border text-xs font-medium transition-all",
              mode === m.value ? "border-primary/50 bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40")}>
            {m.label}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Textarea value={input} onChange={e => setInput(e.target.value)}
          placeholder="Enter text to reverse…" className="min-h-[180px] text-sm font-mono resize-y" />
        <Textarea value={output} readOnly className="min-h-[180px] text-sm font-mono resize-y bg-muted/5" />
      </div>
      {output && (
        <Button variant="outline" size="sm" onClick={() => copy(output)} className="gap-1.5 text-xs">
          <Copy className="w-3 h-3" /> Copy Result
        </Button>
      )}
    </div>
  );
}

// ─── Slug Generator ───────────────────────────────────────────────────────────

const accentsMap: Record<string, string> = { à:"a",á:"a",â:"a",ã:"a",ä:"a",å:"a",æ:"ae",ç:"c",è:"e",é:"e",ê:"e",ë:"e",ì:"i",í:"i",î:"i",ï:"i",ñ:"n",ò:"o",ó:"o",ô:"o",õ:"o",ö:"o",ø:"o",ù:"u",ú:"u",û:"u",ü:"u",ý:"y",þ:"th",ÿ:"y",ß:"ss" };

function toSlug(text: string, separator = "-") {
  return text
    .toLowerCase()
    .replace(/[àáâãäåæçèéêëìíîïñòóôõöøùúûüýþÿß]/g, c => accentsMap[c] ?? c)
    .replace(/[^a-z0-9\s-_]/g, "")
    .trim()
    .replace(/[\s_-]+/g, separator)
    .replace(new RegExp(`^${separator}+|${separator}+$`, "g"), "");
}

function SlugGenerator() {
  const [input, setInput]       = useState("");
  const [separator, setSeparator] = useState("-");
  const slug = toSlug(input, separator);

  const examples = [
    "How to Build a React App in 2025",
    "10 Best Coffee Shops in New York",
    "Getting Started with TypeScript",
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Title or text</label>
        <input value={input} onChange={e => setInput(e.target.value)}
          placeholder="Enter title or text…"
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>

      <div className="flex gap-2">
        {["-", "_"].map(s => (
          <button key={s} onClick={() => setSeparator(s)}
            className={cn("px-3 py-1.5 rounded-full border text-xs font-mono font-medium transition-all",
              separator === s ? "border-primary/50 bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40")}>
            {s === "-" ? "Hyphen (-)" : "Underscore (_)"}
          </button>
        ))}
      </div>

      {slug && (
        <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2">
          <div className="text-xs text-muted-foreground font-medium">Generated slug</div>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm font-mono text-primary break-all">{slug}</code>
            <Button size="sm" variant="ghost" onClick={() => copy(slug)} className="shrink-0 h-7 gap-1 text-xs">
              <Copy className="w-3 h-3" /> Copy
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="text-xs text-muted-foreground font-medium">Try an example</div>
        <div className="flex flex-wrap gap-1.5">
          {examples.map(ex => (
            <button key={ex} onClick={() => setInput(ex)}
              className="px-2.5 py-1 rounded-full bg-muted/30 border border-border text-xs hover:bg-muted/50 transition-colors">
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Suite Router ─────────────────────────────────────────────────────────────

const TOOLS: Record<string, { title: string; component: React.ComponentType }> = {
  "character-counter":      { title: "Character Counter",           component: CharacterCounter },
  "remove-duplicate-lines": { title: "Remove Duplicate Lines",      component: RemoveDuplicateLines },
  "sort-lines":             { title: "Sort Lines Alphabetically",   component: SortLines },
  "reverse-text":           { title: "Reverse Text",                component: ReverseText },
  "slug-generator":         { title: "Slug Generator",              component: SlugGenerator },
};

export function TextUtilsSuite() {
  const pathname = usePathname();
  const slug = pathname.split("/tools/")[1]?.replace(/\/$/, "") ?? "";
  const tool = TOOLS[slug];
  if (!tool) return <div className="p-6 text-muted-foreground text-sm">Tool not found.</div>;
  const Component = tool.component;
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <span className="text-sm font-medium">{tool.title}</span>
      </div>
      <div className="p-5">
        <Component />
      </div>
    </div>
  );
}
