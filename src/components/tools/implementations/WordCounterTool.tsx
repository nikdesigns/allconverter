"use client";

import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

function analyze(text: string) {
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const sentences = text === "" ? 0 : (text.match(/[.!?]+/g) || []).length;
  const paragraphs = text === "" ? 0 : text.split(/\n\s*\n/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(words / 225));
  const speakingTime = Math.max(1, Math.ceil(words / 130));

  // Top keywords (3+ chars, excluding stop words)
  const stopWords = new Set([
    "the","a","an","and","or","but","in","on","at","to","for","of","with","by",
    "from","as","is","was","are","were","be","been","being","have","has","had",
    "do","does","did","will","would","could","should","may","might","this","that",
    "these","those","it","its","not","no","so","if","then","than","more","also",
  ]);
  const wordFreq: Record<string, number> = {};
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !stopWords.has(w))
    .forEach((w) => { wordFreq[w] = (wordFreq[w] || 0) + 1; });
  const topKeywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return { words, chars, charsNoSpace, sentences, paragraphs, readingTime, speakingTime, topKeywords };
}

const stats_def = [
  { label: "Words", key: "words" as const },
  { label: "Characters", key: "chars" as const },
  { label: "Characters (no spaces)", key: "charsNoSpace" as const },
  { label: "Sentences", key: "sentences" as const },
  { label: "Paragraphs", key: "paragraphs" as const },
  { label: "Reading time (min)", key: "readingTime" as const },
  { label: "Speaking time (min)", key: "speakingTime" as const },
];

export function WordCounterTool() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyze(text), [text]);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <span className="text-sm font-medium">Word Counter</span>
        <div className="ml-auto">
          <Button size="sm" variant="ghost" onClick={() => setText("")} className="h-8 text-xs">
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* Input */}
        <div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to analyze word count, character count, reading time, and more..."
            className="border-0 rounded-none font-sans text-sm min-h-[360px] resize-none focus-visible:ring-0 bg-transparent leading-relaxed"
          />
        </div>

        {/* Stats */}
        <div className="p-4">
          {/* Main stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {stats_def.map((s) => (
              <div key={s.key} className="rounded-xl border border-border bg-muted/30 p-3 text-center">
                <p className="text-xl font-bold tabular-nums text-foreground">
                  {stats[s.key].toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Top keywords */}
          {stats.topKeywords.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                Top Keywords
              </p>
              <div className="space-y-1.5">
                {stats.topKeywords.map(([word, count]) => (
                  <div key={word} className="flex items-center gap-2">
                    <span className="text-xs text-foreground font-medium min-w-0 truncate flex-1">
                      {word}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="h-1.5 rounded-full bg-primary/40"
                        style={{
                          width: `${Math.round((count / (stats.topKeywords[0]?.[1] || 1)) * 60)}px`,
                        }}
                      />
                      <span className="text-[10px] text-muted-foreground w-4 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
