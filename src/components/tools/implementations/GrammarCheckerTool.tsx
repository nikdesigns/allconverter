"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, CheckCircle2, AlertCircle, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface Issue {
  type: "grammar" | "style" | "spelling";
  from: number;
  to: number;
  message: string;
  suggestion?: string;
}

// Rule-based grammar checker
const RULES: Array<{ pattern: RegExp; message: string; suggestion?: (m: RegExpExecArray) => string; type: Issue["type"] }> = [
  { pattern: /\b(a)\s+([aeiou])/gi, message: 'Use "an" before vowel sounds', suggestion: m => `an ${m[2]}`, type: "grammar" },
  { pattern: /\b(an)\s+([bcdfghjklmnpqrstvwxyz])/gi, message: 'Use "a" before consonant sounds', suggestion: m => `a ${m[2]}`, type: "grammar" },
  { pattern: /\s{2,}/g, message: "Double space", suggestion: () => " ", type: "style" },
  { pattern: /\bi\b(?!\s*\w+'ve|\s*am|\s*was|\s*will|\s*would|\s*can|\s*could|\s*should|\s*shall|\s*may|\s*might|\s*must|\s*do|\s*did)/g, message: 'Capitalise "I"', suggestion: () => "I", type: "grammar" },
  { pattern: /([.!?])\s+([a-z])/g, message: "Sentence should start with a capital letter", type: "grammar" },
  { pattern: /\b(its)\s+(a\b|an\b|the\b|very\b|quite\b)/gi, message: '"its" (possessive) vs "it\'s" (it is) — check usage', type: "grammar" },
  { pattern: /\b(their)\s+(is|are|was|were|has|have)\b/gi, message: 'Did you mean "there"?', suggestion: m => `there ${m[2]}`, type: "grammar" },
  { pattern: /\byour\s+(is|are|was|were|has|have|will|would)\b/gi, message: 'Did you mean "you\'re"?', type: "grammar" },
  { pattern: /\b(very|really|quite|just|basically|literally|actually)\b/gi, message: 'Consider removing filler word for clarity', type: "style" },
  { pattern: /\b(utilize)\b/gi, message: '"Use" is simpler than "utilize"', suggestion: () => "use", type: "style" },
  { pattern: /\b(in order to)\b/gi, message: '"to" is more concise than "in order to"', suggestion: () => "to", type: "style" },
  { pattern: /\b(due to the fact that)\b/gi, message: '"because" is more concise', suggestion: () => "because", type: "style" },
  { pattern: /\bpassive\s+voice\b/gi, message: "Passive voice detected — consider active voice", type: "style" },
];

function checkGrammar(text: string): Issue[] {
  const issues: Issue[] = [];
  for (const rule of RULES) {
    const re = new RegExp(rule.pattern.source, rule.pattern.flags);
    let m;
    while ((m = re.exec(text)) !== null) {
      issues.push({
        type: rule.type,
        from: m.index,
        to: m.index + m[0].length,
        message: rule.message,
        suggestion: rule.suggestion ? rule.suggestion(m) : undefined,
      });
      if (!re.flags.includes("g")) break;
    }
  }
  return issues.sort((a, b) => a.from - b.from);
}

const SAMPLE = `i was going to the store but their was no milk there. The weather was very nice and i decided to utilize public transport. it's a good idea in order to save money. Sometimes i like to basically just relax and watch a movie.`;

export function GrammarCheckerTool() {
  const [text, setText] = useState(SAMPLE);

  const issues = useMemo(() => checkGrammar(text), [text]);

  const applyFix = (issue: Issue) => {
    if (!issue.suggestion) return;
    setText(p => p.slice(0, issue.from) + issue.suggestion + p.slice(issue.to));
    toast.success("Fix applied");
  };

  const applyAll = () => {
    let t = text;
    const sortedDesc = [...issues].filter(i => i.suggestion).sort((a, b) => b.from - a.from);
    for (const issue of sortedDesc) {
      t = t.slice(0, issue.from) + issue.suggestion + t.slice(issue.to);
    }
    setText(t);
    toast.success(`Applied ${sortedDesc.length} fix${sortedDesc.length !== 1 ? "es" : ""}`);
  };

  const typeColors = { grammar: "text-red-500 bg-red-500/10 border-red-500/20", style: "text-amber-500 bg-amber-500/10 border-amber-500/20", spelling: "text-orange-500 bg-orange-500/10 border-orange-500/20" };
  const typeIcons = { grammar: "G", style: "S", spelling: "Sp" };

  const grammarCount = issues.filter(i => i.type === "grammar").length;
  const styleCount = issues.filter(i => i.type === "style").length;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <BookOpen className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Grammar Checker</span>
      </div>
      <div className="p-5 space-y-4">
        <Textarea value={text} onChange={e => setText(e.target.value)}
          className="min-h-[180px] resize-none text-sm" placeholder="Paste or type text to check grammar…" />

        <div className="flex items-center gap-3 flex-wrap">
          {issues.length === 0 && text.trim() ? (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm">
              <CheckCircle2 className="w-4 h-4" />No issues found!
            </div>
          ) : (
            <>
              {grammarCount > 0 && <span className="text-xs px-2 py-1 rounded-full border border-red-500/20 bg-red-500/10 text-red-500">{grammarCount} grammar</span>}
              {styleCount > 0 && <span className="text-xs px-2 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500">{styleCount} style</span>}
              {issues.some(i => i.suggestion) && (
                <Button size="sm" onClick={applyAll} className="ml-auto h-7 text-xs gap-1">
                  Fix all auto-fixable
                </Button>
              )}
            </>
          )}
        </div>

        {issues.length > 0 && (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {issues.map((issue, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${typeColors[issue.type]}`}>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 mt-0.5 border-current">
                  {typeIcons[issue.type]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium">{issue.message}</p>
                  <code className="text-[11px] opacity-70 block mt-0.5 truncate">"{text.slice(issue.from, issue.to)}"</code>
                  {issue.suggestion && <p className="text-[11px] mt-0.5">Suggestion: <strong>"{issue.suggestion}"</strong></p>}
                </div>
                {issue.suggestion && (
                  <Button size="sm" variant="ghost" onClick={() => applyFix(issue)} className="h-6 text-[11px] shrink-0">Fix</Button>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Rule-based grammar checker — runs in your browser. For best results use a professional tool like Grammarly.
        </p>
      </div>
    </div>
  );
}
