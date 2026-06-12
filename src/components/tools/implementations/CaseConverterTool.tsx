"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

type CaseType = {
  id: string;
  label: string;
  fn: (s: string) => string;
};

const cases: CaseType[] = [
  { id: "upper", label: "UPPER CASE", fn: (s) => s.toUpperCase() },
  { id: "lower", label: "lower case", fn: (s) => s.toLowerCase() },
  {
    id: "title",
    label: "Title Case",
    fn: (s) =>
      s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
  },
  {
    id: "sentence",
    label: "Sentence case",
    fn: (s) =>
      s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
  },
  {
    id: "camel",
    label: "camelCase",
    fn: (s) =>
      s
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
  },
  {
    id: "pascal",
    label: "PascalCase",
    fn: (s) => {
      const camel = s
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
      return camel.charAt(0).toUpperCase() + camel.slice(1);
    },
  },
  {
    id: "snake",
    label: "snake_case",
    fn: (s) =>
      s
        .replace(/\s+/g, "_")
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()
        .replace(/^_|_+/g, (m) => (m.length > 1 ? "_" : m))
        .replace(/^_/, ""),
  },
  {
    id: "kebab",
    label: "kebab-case",
    fn: (s) =>
      s
        .replace(/\s+/g, "-")
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()
        .replace(/^-|-+/g, (m) => (m.length > 1 ? "-" : m))
        .replace(/^-/, ""),
  },
  {
    id: "screaming",
    label: "SCREAMING_SNAKE",
    fn: (s) =>
      s
        .replace(/\s+/g, "_")
        .replace(/([A-Z])/g, "_$1")
        .toUpperCase()
        .replace(/^_|_+/g, (m) => (m.length > 1 ? "_" : m))
        .replace(/^_/, ""),
  },
  {
    id: "dot",
    label: "dot.case",
    fn: (s) => s.replace(/[\s_-]+/g, ".").toLowerCase(),
  },
];

export function CaseConverterTool() {
  const [input, setInput] = useState("");
  const [activeCase, setActiveCase] = useState("upper");
  const [copied, setCopied] = useState<string | null>(null);

  const convert = (caseId: string) => {
    const caseDef = cases.find((c) => c.id === caseId);
    return caseDef ? caseDef.fn(input) : input;
  };

  const copyResult = async (caseId: string) => {
    const result = convert(caseId);
    await navigator.clipboard.writeText(result);
    setCopied(caseId);
    toast.success(`Copied ${cases.find((c) => c.id === caseId)?.label} text`);
    setTimeout(() => setCopied(null), 2000);
  };

  const output = convert(activeCase);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <span className="text-sm font-medium">Case Converter</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setInput("")}
          className="ml-auto h-8 text-xs"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Input */}
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to convert..."
          className="min-h-[120px] font-sans text-sm resize-none"
        />

        {/* Case buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {cases.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCase(c.id)}
              className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all text-left ${
                activeCase === c.id
                  ? "border-primary/40 bg-primary/8 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Output */}
        {input && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Result — {cases.find((c) => c.id === activeCase)?.label}
              </span>
              <button
                onClick={() => copyResult(activeCase)}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-muted hover:bg-accent transition-all"
              >
                {copied === activeCase ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copied === activeCase ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="bg-muted rounded-xl p-4 text-sm font-mono break-all leading-relaxed min-h-[60px]">
              {output || <span className="text-muted-foreground">—</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
