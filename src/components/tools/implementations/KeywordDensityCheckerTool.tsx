"use client";

import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { BarChart3 } from "lucide-react";

const STOPWORDS = new Set("a an the is are was were be been being have has had do does did will would could should may might shall can i me my we our you your he she it its they their this that these those in on at to for of with by from as up about into through during before after above below between each no not or but and so yet".split(" "));

export function KeywordDensityCheckerTool() {
  const [text, setText] = useState("");
  const [minLen, setMinLen] = useState(3);
  const [showStopwords, setShowStopwords] = useState(false);

  const stats = useMemo(() => {
    if (!text.trim()) return { words: 0, chars: 0, sentences: 0, keywords: [] };
    const words = text.toLowerCase().replace(/[^a-z0-9\s'-]/g, " ").split(/\s+/).filter(w => w.length >= minLen);
    const totalWords = words.length;
    const freq: Record<string, number> = {};
    for (const w of words) { if (showStopwords || !STOPWORDS.has(w)) freq[w] = (freq[w] ?? 0) + 1; }
    const keywords = Object.entries(freq)
      .sort((a,b) => b[1]-a[1])
      .slice(0, 50)
      .map(([word, count]) => ({ word, count, density: (count / totalWords) * 100 }));
    return {
      words: totalWords,
      chars: text.length,
      sentences: text.split(/[.!?]+/).filter(s => s.trim()).length,
      keywords,
    };
  }, [text, minLen, showStopwords]);

  const maxCount = stats.keywords[0]?.count ?? 1;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <BarChart3 className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Keyword Density Checker</span>
      </div>
      <div className="p-5 space-y-4">
        <Textarea value={text} onChange={e => setText(e.target.value)}
          placeholder="Paste your article or web page content here to analyse keyword density…"
          className="min-h-[160px] resize-none text-sm" />

        <div className="flex flex-wrap items-center gap-4 p-3 rounded-xl border border-border bg-muted/10 text-xs">
          <span><span className="text-muted-foreground">Words:</span> <strong>{stats.words}</strong></span>
          <span><span className="text-muted-foreground">Characters:</span> <strong>{stats.chars}</strong></span>
          <span><span className="text-muted-foreground">Sentences:</span> <strong>{stats.sentences}</strong></span>
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-muted-foreground">Min length:</label>
            <input type="number" min={2} max={10} value={minLen} onChange={e => setMinLen(+e.target.value)}
              className="w-12 h-7 px-2 rounded-lg border border-input bg-background text-center text-xs" />
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={showStopwords} onChange={e => setShowStopwords(e.target.checked)} className="accent-primary" />
              Show stop words
            </label>
          </div>
        </div>

        {stats.keywords.length > 0 && (
          <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
            {stats.keywords.map(({ word, count, density }) => (
              <div key={word} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted/20 transition-all group">
                <span className="text-sm font-mono font-medium w-28 shrink-0 truncate">{word}</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary/60 transition-all"
                    style={{ width: `${(count / maxCount) * 100}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right shrink-0">{count}×</span>
                <span className={`text-xs w-12 text-right shrink-0 ${density > 3 ? "text-amber-500" : "text-muted-foreground"}`}>
                  {density.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        )}

        {text && !stats.keywords.length && (
          <p className="text-center text-sm text-muted-foreground py-4">No keywords found. Try reducing the minimum length.</p>
        )}
      </div>
    </div>
  );
}
