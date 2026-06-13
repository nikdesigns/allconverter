"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Copy, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function copy(text: string) { navigator.clipboard.writeText(text); toast.success("Copied!"); }

// ─── JSON Validator ───────────────────────────────────────────────────────────

function JsonValidator() {
  const [input, setInput]   = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle"|"valid"|"invalid">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [indent, setIndent] = useState(2);

  const validate = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setStatus("valid");
      setErrMsg("");
    } catch (e) {
      setStatus("invalid");
      setOutput("");
      setErrMsg((e as Error).message);
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setStatus("valid");
      setErrMsg("");
    } catch (e) {
      setStatus("invalid");
      setErrMsg((e as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">JSON input</label>
          <Textarea value={input} onChange={e => { setInput(e.target.value); setStatus("idle"); }}
            placeholder={'{"key": "value"}'} className="min-h-[220px] text-sm font-mono resize-y" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Formatted output</label>
          <Textarea value={output} readOnly className="min-h-[220px] text-sm font-mono resize-y bg-muted/5" />
        </div>
      </div>

      {status !== "idle" && (
        <div className={cn("flex items-start gap-2 rounded-xl p-3 text-sm", status === "valid" ? "bg-emerald-500/5 border border-emerald-500/20 text-emerald-400" : "bg-rose-500/5 border border-rose-500/20 text-rose-400")}>
          {status === "valid" ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> : <XCircle className="w-4 h-4 mt-0.5 shrink-0" />}
          {status === "valid" ? "Valid JSON" : errMsg}
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          Indent:
          {[2, 4].map(n => (
            <button key={n} onClick={() => setIndent(n)}
              className={cn("w-7 h-7 rounded-lg border text-xs font-medium transition-all",
                indent === n ? "border-primary/50 bg-primary/5 text-primary" : "border-border hover:border-primary/40")}>
              {n}
            </button>
          ))}
        </div>
        <Button onClick={validate} disabled={!input.trim()} className="gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Validate & Format
        </Button>
        <Button variant="outline" size="sm" onClick={minify} disabled={!input.trim()} className="gap-1 text-xs">Minify</Button>
        {output && <Button variant="ghost" size="sm" onClick={() => copy(output)} className="gap-1 text-xs"><Copy className="w-3 h-3" />Copy</Button>}
      </div>
    </div>
  );
}

// ─── HTML Formatter ───────────────────────────────────────────────────────────

function formatHtml(html: string): string {
  let indent = 0;
  const lines: string[] = [];
  const voidTags = new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);
  const inlineTags = new Set(["a","abbr","acronym","b","bdo","big","br","cite","code","dfn","em","i","img","input","kbd","label","map","object","q","s","samp","select","small","span","strong","sub","sup","textarea","time","tt","u","var"]);

  const tokens = html.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) ?? [];
  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;
    if (/^<!--/.test(trimmed)) {
      lines.push("  ".repeat(indent) + trimmed);
      continue;
    }
    if (/^<\//.test(trimmed)) {
      const tag = trimmed.replace(/^<\/([a-z0-9]+).*/i, "$1").toLowerCase();
      if (!inlineTags.has(tag)) indent = Math.max(0, indent - 1);
      lines.push("  ".repeat(indent) + trimmed);
      continue;
    }
    if (/^<[a-z]/i.test(trimmed)) {
      const tag = trimmed.replace(/^<([a-z0-9]+).*/i, "$1").toLowerCase();
      lines.push("  ".repeat(indent) + trimmed);
      if (!voidTags.has(tag) && !inlineTags.has(tag) && !/\/>$/.test(trimmed)) indent++;
      continue;
    }
    if (trimmed) lines.push("  ".repeat(indent) + trimmed);
  }
  return lines.join("\n");
}

function HtmlFormatter() {
  const [input, setInput]   = useState("");
  const [output, setOutput] = useState("");

  const format = () => {
    if (!input.trim()) return;
    setOutput(formatHtml(input));
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <Textarea value={input} onChange={e => setInput(e.target.value)}
          placeholder="Paste HTML here…" className="min-h-[220px] text-sm font-mono resize-y" />
        <Textarea value={output} readOnly className="min-h-[220px] text-sm font-mono resize-y bg-muted/5" />
      </div>
      <div className="flex gap-2">
        <Button onClick={format} disabled={!input.trim()} className="gap-1.5"><RefreshCw className="w-3.5 h-3.5" />Format HTML</Button>
        {output && <Button variant="ghost" size="sm" onClick={() => copy(output)} className="gap-1 text-xs"><Copy className="w-3 h-3" />Copy</Button>}
      </div>
    </div>
  );
}

// ─── CSS Formatter ────────────────────────────────────────────────────────────

function formatCss(css: string): string {
  return css
    .replace(/\s*\{\s*/g, " {\n  ")
    .replace(/;\s*/g, ";\n  ")
    .replace(/\s*\}\s*/g, "\n}\n")
    .replace(/,\s*([^\n])/g, ",\n$1")
    .replace(/  \n\}/g, "\n}")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function CssFormatter() {
  const [input, setInput]   = useState("");
  const [output, setOutput] = useState("");

  const format = () => { if (input.trim()) setOutput(formatCss(input)); };
  const minify = () => {
    if (!input.trim()) return;
    setOutput(input.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,])\s*/g, "$1").trim());
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <Textarea value={input} onChange={e => setInput(e.target.value)}
          placeholder="Paste CSS here…" className="min-h-[220px] text-sm font-mono resize-y" />
        <Textarea value={output} readOnly className="min-h-[220px] text-sm font-mono resize-y bg-muted/5" />
      </div>
      <div className="flex gap-2">
        <Button onClick={format} disabled={!input.trim()} className="gap-1.5"><RefreshCw className="w-3.5 h-3.5" />Format CSS</Button>
        <Button variant="outline" size="sm" onClick={minify} disabled={!input.trim()} className="text-xs">Minify</Button>
        {output && <Button variant="ghost" size="sm" onClick={() => copy(output)} className="gap-1 text-xs"><Copy className="w-3 h-3" />Copy</Button>}
      </div>
    </div>
  );
}

// ─── JavaScript Formatter ─────────────────────────────────────────────────────

function formatJs(js: string): string {
  let indent = 0;
  const lines = js
    .replace(/;(?!\s*\n)/g, ";\n")
    .replace(/\{(?!\s*\n)/g, "{\n")
    .replace(/\}(?!\s*[\n;])/g, "\n}")
    .split("\n");

  return lines.map(rawLine => {
    const line = rawLine.trim();
    if (!line) return "";
    const closers = (line.match(/[}\]]/g) ?? []).length;
    const openers = (line.match(/[{[]/g) ?? []).length;
    if (closers > openers) indent = Math.max(0, indent - (closers - openers));
    const result = "  ".repeat(indent) + line;
    if (openers > closers) indent += (openers - closers);
    return result;
  }).filter(l => l !== "").join("\n").replace(/\n{3,}/g, "\n\n");
}

function JsFormatter() {
  const [input, setInput]   = useState("");
  const [output, setOutput] = useState("");

  const format = () => { if (input.trim()) setOutput(formatJs(input)); };
  const minify = () => {
    if (!input.trim()) return;
    setOutput(input.replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").trim());
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <Textarea value={input} onChange={e => setInput(e.target.value)}
          placeholder="Paste JavaScript here…" className="min-h-[220px] text-sm font-mono resize-y" />
        <Textarea value={output} readOnly className="min-h-[220px] text-sm font-mono resize-y bg-muted/5" />
      </div>
      <div className="flex gap-2">
        <Button onClick={format} disabled={!input.trim()} className="gap-1.5"><RefreshCw className="w-3.5 h-3.5" />Format JS</Button>
        <Button variant="outline" size="sm" onClick={minify} disabled={!input.trim()} className="text-xs">Minify</Button>
        {output && <Button variant="ghost" size="sm" onClick={() => copy(output)} className="gap-1 text-xs"><Copy className="w-3 h-3" />Copy</Button>}
      </div>
    </div>
  );
}

// ─── Suite Router ─────────────────────────────────────────────────────────────

const TOOLS: Record<string, { title: string; component: React.ComponentType }> = {
  "json-validator":  { title: "JSON Validator",          component: JsonValidator },
  "html-formatter":  { title: "HTML Formatter",          component: HtmlFormatter },
  "css-formatter":   { title: "CSS Formatter",           component: CssFormatter },
  "js-formatter":    { title: "JavaScript Formatter",    component: JsFormatter },
};

export function CodeFormatterSuite() {
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
