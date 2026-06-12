"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";

// Extractive summarisation — picks the highest scoring sentences
function summarize(text: string, ratio: number): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  if (sentences.length <= 3) return text;

  // Term frequency map
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 3);
  const freq: Record<string, number> = {};
  for (const w of words) freq[w] = (freq[w] ?? 0) + 1;
  const max = Math.max(...Object.values(freq));

  // Score each sentence
  const scored = sentences.map((s, i) => {
    const sw = s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 3);
    const score = sw.reduce((sum, w) => sum + (freq[w] ?? 0) / max, 0) / (sw.length || 1);
    return { s, score, i };
  });

  const topN = Math.max(3, Math.round(sentences.length * ratio));
  const selected = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .sort((a, b) => a.i - b.i)
    .map(x => x.s.trim());

  return selected.join(" ");
}

function extractKeyPoints(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [];
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 3);
  const freq: Record<string, number> = {};
  for (const w of words) freq[w] = (freq[w] ?? 0) + 1;
  const max = Math.max(...Object.values(freq), 1);

  return sentences
    .map(s => {
      const sw = s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 3);
      const score = sw.reduce((sum, w) => sum + (freq[w] ?? 0) / max, 0) / (sw.length || 1);
      return { s: s.trim(), score };
    })
    .filter(x => x.score > 0.3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(x => x.s);
}

const SAMPLE = `Artificial intelligence (AI) has emerged as one of the most transformative technologies of the 21st century. From healthcare to finance, AI is revolutionizing industries by automating complex tasks, providing deeper insights, and enabling new capabilities that were previously unimaginable.

In healthcare, AI algorithms can now detect diseases from medical images with accuracy rivaling that of expert physicians. Machine learning models have been developed to predict patient outcomes, personalize treatment plans, and accelerate drug discovery, potentially saving millions of lives and billions of dollars.

The financial sector has also been transformed by AI, with algorithms making split-second trading decisions, detecting fraudulent transactions, and providing personalized financial advice. Banks and fintech companies are leveraging AI to improve customer service and streamline operations.

However, the rise of AI also presents significant challenges. Issues of bias and fairness in AI systems have raised concerns about discrimination. Privacy concerns have emerged as AI systems require vast amounts of data to function effectively. The potential for job displacement has sparked debates about the future of work.

Despite these challenges, experts remain optimistic about AI's potential. With proper governance frameworks, transparent development practices, and inclusive design principles, AI can be harnessed to address some of humanity's most pressing problems, from climate change to poverty, while ensuring that its benefits are distributed equitably across society.`;

export function TextSummarizerTool() {
  const [input, setInput] = useState(SAMPLE);
  const [ratio, setRatio] = useState(0.3);
  const [mode, setMode] = useState<"summary" | "bullets">("summary");

  const { summary, bullets, wordCount, sentenceCount } = useMemo(() => {
    if (!input.trim()) return { summary: "", bullets: [], wordCount: 0, sentenceCount: 0 };
    const summary = summarize(input, ratio);
    const bullets = extractKeyPoints(input);
    const wordCount = input.split(/\s+/).filter(Boolean).length;
    const sentenceCount = (input.match(/[.!?]+/g) || []).length;
    return { summary, bullets, wordCount, sentenceCount };
  }, [input, ratio]);

  const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copied!"); };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Text Summarizer</span>
        </div>
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button onClick={() => setMode("summary")}
            className={`px-3 py-1 text-xs font-medium transition-all ${mode==="summary"?"bg-primary text-primary-foreground":"text-muted-foreground"}`}>
            Summary
          </button>
          <button onClick={() => setMode("bullets")}
            className={`px-3 py-1 text-xs font-medium transition-all ${mode==="bullets"?"bg-primary text-primary-foreground":"text-muted-foreground"}`}>
            Key Points
          </button>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Input Text</label>
            <span className="text-xs text-muted-foreground">{wordCount} words · {sentenceCount} sentences</span>
          </div>
          <Textarea value={input} onChange={e => setInput(e.target.value)}
            className="min-h-[180px] resize-none text-sm" placeholder="Paste article or text to summarize…" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Summary length</label>
            <span className="text-xs font-medium">{Math.round(ratio * 100)}% of original</span>
          </div>
          <input type="range" min={0.1} max={0.6} step={0.05} value={ratio}
            onChange={e => setRatio(parseFloat(e.target.value))}
            className="w-full accent-primary h-1.5" />
          <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
            <span>Shorter</span><span>Longer</span>
          </div>
        </div>

        {input.trim() && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">{mode === "summary" ? "Summary" : "Key Points"}</span>
              <Button size="sm" variant="ghost" onClick={() => copy(mode==="summary" ? summary : bullets.map((b,i)=>`${i+1}. ${b}`).join("\n"))}
                className="h-6 text-xs gap-1"><Copy className="w-3 h-3" />Copy</Button>
            </div>
            {mode === "summary" ? (
              <div className="p-4 rounded-xl border border-border bg-primary/3 text-sm leading-relaxed">
                {summary || "Not enough content to summarize."}
              </div>
            ) : (
              <ul className="space-y-2">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-muted/10 text-sm">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Uses extractive AI summarization — runs entirely in your browser.
        </p>
      </div>
    </div>
  );
}
