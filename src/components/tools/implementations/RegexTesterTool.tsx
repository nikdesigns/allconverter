"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle } from "lucide-react";

const EXAMPLES = [
  { label: "Email", pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}", flags: "g" },
  { label: "URL", pattern: "https?:\\/\\/[^\\s]+", flags: "g" },
  { label: "IPv4", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: "g" },
  { label: "Date MM/DD/YYYY", pattern: "\\b\\d{2}\\/\\d{2}\\/\\d{4}\\b", flags: "g" },
  { label: "Hex color", pattern: "#[0-9a-fA-F]{3,6}\\b", flags: "g" },
];

const SAMPLE_TEXT = `Hello World! Contact us at hello@example.com or support@test.io
Visit https://example.com or http://test.org for more info.
IP: 192.168.1.1, Date: 12/31/2024, Color: #FF5733 or #fff
Another email: john.doe+tag@company.co.uk`;

export function RegexTesterTool() {
  const [pattern, setPattern] = useState("[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState(SAMPLE_TEXT);
  const [replaceWith, setReplaceWith] = useState("");
  const [showReplace, setShowReplace] = useState(false);

  const { matches, error, highlighted, replaced } = useMemo(() => {
    if (!pattern) return { matches: [], error: "", highlighted: text, replaced: text };
    try {
      const re = new RegExp(pattern, flags);
      const allMatches: Array<{ match: string; index: number; groups: string[] }> = [];
      let m;
      if (flags.includes("g")) {
        const iter = text.matchAll(re);
        for (const match of iter) {
          allMatches.push({ match: match[0], index: match.index ?? 0, groups: match.slice(1) });
        }
      } else {
        const match = text.match(re);
        if (match) allMatches.push({ match: match[0], index: match.index ?? 0, groups: match.slice(1) });
      }

      // Build highlighted HTML
      let h = ""; let last = 0;
      const escHtml = (s: string) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      for (const { match, index } of allMatches) {
        h += escHtml(text.slice(last, index));
        h += `<mark class="bg-primary/25 text-foreground rounded px-0.5">${escHtml(match)}</mark>`;
        last = index + match.length;
      }
      h += escHtml(text.slice(last));

      const replaced = replaceWith !== undefined ? text.replace(re, replaceWith) : text;
      return { matches: allMatches, error: "", highlighted: h, replaced };
    } catch (e) {
      return { matches: [], error: (e as Error).message, highlighted: text, replaced: text };
    }
  }, [pattern, flags, text, replaceWith]);

  const flagOptions = ["g","i","m","s"];

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Search className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Regex Tester</span>
      </div>
      <div className="p-5 space-y-4">
        {/* Pattern input */}
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Pattern</label>
            <div className="flex rounded-xl border border-border overflow-hidden focus-within:ring-2 focus-within:ring-primary/30">
              <span className="px-3 py-2 bg-muted/40 text-muted-foreground text-sm font-mono border-r border-border">/</span>
              <input value={pattern} onChange={e => setPattern(e.target.value)}
                className="flex-1 px-3 py-2 bg-transparent text-sm font-mono outline-none"
                placeholder="your regex here" />
              <span className="px-3 py-2 bg-muted/40 text-muted-foreground text-sm font-mono border-l border-border">/</span>
              <span className="px-3 py-2 bg-muted/40 text-sm font-mono">{flags}</span>
            </div>
          </div>
          <div className="shrink-0">
            <label className="text-xs text-muted-foreground mb-1 block">Flags</label>
            <div className="flex gap-1">
              {flagOptions.map(f => (
                <button key={f} onClick={() => setFlags(p => p.includes(f) ? p.replace(f,"") : p+f)}
                  className={`w-8 h-9 rounded-lg border text-xs font-mono font-medium transition-all ${flags.includes(f)?"border-primary/40 bg-primary/10 text-primary":"border-border text-muted-foreground"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg border border-destructive/30 bg-destructive/5 text-xs text-destructive">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}
          </div>
        )}

        {/* Quick examples */}
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLES.map(ex => (
            <button key={ex.label} onClick={() => { setPattern(ex.pattern); setFlags(ex.flags); }}
              className="px-2.5 py-1 rounded-full border border-border text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
              {ex.label}
            </button>
          ))}
        </div>

        {/* Test text */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Test String</label>
          <Textarea value={text} onChange={e => setText(e.target.value)}
            className="min-h-[120px] resize-none text-sm font-mono" />
        </div>

        {/* Match highlights */}
        {!error && pattern && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Matches highlighted</span>
              <span className={`text-xs font-medium ${matches.length?"text-primary":"text-muted-foreground"}`}>
                {matches.length} match{matches.length!==1?"es":""}
              </span>
            </div>
            <div className="p-3 rounded-xl border border-border bg-muted/10 text-sm font-mono whitespace-pre-wrap leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlighted }} />
          </div>
        )}

        {/* Match list */}
        {matches.length > 0 && (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {matches.map((m, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/20 text-xs">
                <span className="text-muted-foreground shrink-0">#{i+1}</span>
                <code className="flex-1 font-mono text-primary truncate">{m.match}</code>
                <span className="text-muted-foreground shrink-0">@{m.index}</span>
              </div>
            ))}
          </div>
        )}

        {/* Replace */}
        <div>
          <button onClick={() => setShowReplace(p => !p)} className="text-xs text-primary underline-offset-2 hover:underline">
            {showReplace ? "Hide" : "Show"} replace
          </button>
          {showReplace && (
            <div className="mt-2 space-y-2">
              <Input value={replaceWith} onChange={e => setReplaceWith(e.target.value)}
                placeholder="Replacement string ($1, $2 for groups)" className="font-mono text-sm" />
              {pattern && !error && (
                <div className="p-3 rounded-xl border border-border bg-muted/10 text-sm font-mono whitespace-pre-wrap">
                  {replaced}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
