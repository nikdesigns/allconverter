"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Sparkles, Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Summary {
  title: string;
  wordCount: number;
  pageCount: number;
  readingTime: number;
  keyTopics: string[];
  executiveSummary: string;
  keyPoints: string[];
  conclusions: string;
}

function extractKeyTopics(text: string): string[] {
  const stopWords = new Set(["the","a","an","and","or","but","in","on","at","to","for","of","with","by","from","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","could","should","may","might","shall","can","this","that","these","those","i","we","you","he","she","it","they","not","no","as","if","then","than","so","yet","both","either","neither","nor","what","which","who","whom","whose","when","where","why","how","all","each","every","some","any","few","more","most","other","into","through","during","before","after","above","below","between","because","since","while","although","though","even","whether","however","therefore","thus","hence","also","too","just","only","very","here","there","now","then","up","down","out","about","around","again","already","still","once","upon","per","via","such","its","their","our","your","my","his","her","its"]);

  const words = text.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter(w => w.length > 4 && !stopWords.has(w));
  const freq: Record<string, number> = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));
}

function extractKeyPoints(text: string): string[] {
  const points: string[] = [];
  const sentences = text.match(/[^.!?\n]{40,250}[.!?]/g) ?? [];
  const importantWords = /\b(?:key|important|significant|critical|main|primary|essential|core|major|result|conclusion|finding|recommend|shows?|demonstrates?|indicates?|proves?|suggests?|reveals?|shows?)\b/i;

  for (const s of sentences) {
    if (importantWords.test(s) && points.length < 8) {
      points.push(s.trim().replace(/\s+/g, " ").slice(0, 200));
    }
  }

  if (points.length < 3) {
    const sents = sentences.filter(s => s.length > 60);
    const step = Math.max(1, Math.floor(sents.length / 5));
    for (let i = 0; i < sents.length && points.length < 6; i += step) {
      const candidate = sents[i].trim().replace(/\s+/g, " ").slice(0, 200);
      if (!points.includes(candidate)) points.push(candidate);
    }
  }
  return points.slice(0, 6);
}

function detectTitle(text: string): string {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  for (const line of lines.slice(0, 10)) {
    if (line.length > 8 && line.length < 120 && !/^(page|abstract|introduction|table|copyright|\d+)$/i.test(line)) {
      return line.replace(/\s+/g, " ");
    }
  }
  return "Document";
}

function buildExecutiveSummary(text: string, pageCount: number, keyTopics: string[]): string {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const sentences = text.match(/[^.!?\n]{40,300}[.!?]/g) ?? [];
  const intro = sentences.slice(0, 2).map(s => s.trim()).join(" ");
  const mid = sentences[Math.floor(sentences.length / 2)]?.trim() ?? "";
  const end = sentences.slice(-2).map(s => s.trim()).join(" ");
  const parts = [intro, mid, end].filter(Boolean).join(" ").slice(0, 600);
  return parts || `This ${pageCount}-page document (${wordCount.toLocaleString()} words) covers topics including ${keyTopics.slice(0, 4).join(", ")}.`;
}

function buildConclusions(text: string): string {
  const conclusionRx = /(?:conclusion|summary|in summary|to summarize|in conclusion|finally|overall|therefore|thus|hence)[^.!?\n]{20,400}[.!?]/gi;
  const matches = [...text.matchAll(conclusionRx)].map(m => m[0].trim()).slice(0, 3);
  if (matches.length > 0) return matches.join(" ").slice(0, 400);
  const sentences = text.match(/[^.!?\n]{40,300}[.!?]/g) ?? [];
  return sentences.slice(-3).map(s => s.trim()).join(" ").slice(0, 400);
}

async function extractTextFromPdf(file: File): Promise<{ text: string; pageCount: number }> {
  const pdfjsLib = await import("pdfjs-dist");
  const pdfWorkerUrl = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageCount = pdf.numPages;

  const pages: string[] = [];
  for (let i = 1; i <= Math.min(pageCount, 50); i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
  }

  return { text: pages.join("\n"), pageCount };
}

export function AiPdfSummarizerTool() {
  const [file, setFile]             = useState<File | null>(null);
  const [loading, setLoading]       = useState(false);
  const [summary, setSummary]       = useState<Summary | null>(null);
  const [error, setError]           = useState("");
  const [dragOver, setDragOver]     = useState(false);
  const inputRef                    = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") { toast.error("Please upload a PDF file"); return; }
    if (f.size > 20 * 1024 * 1024) { toast.error("File too large — max 20 MB"); return; }
    setFile(f);
    setSummary(null);
    setError("");
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const { text, pageCount } = await extractTextFromPdf(file);
      if (!text.trim() || text.trim().length < 100) {
        setError("Could not extract text — this PDF may be scanned/image-based. Try a text-based PDF.");
        return;
      }
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      const readingTime = Math.ceil(wordCount / 200);
      const keyTopics = extractKeyTopics(text);
      const keyPoints = extractKeyPoints(text);
      const title = detectTitle(text);
      const executiveSummary = buildExecutiveSummary(text, pageCount, keyTopics);
      const conclusions = buildConclusions(text);
      setSummary({ title, wordCount, pageCount, readingTime, keyTopics, executiveSummary, keyPoints, conclusions });
    } catch (e) {
      setError("Failed to process PDF. Make sure it is not password-protected.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyReport = () => {
    if (!summary) return;
    const r = [
      `PDF SUMMARY REPORT`,
      `==================`,
      `Title: ${summary.title}`,
      `Pages: ${summary.pageCount}  |  Words: ${summary.wordCount.toLocaleString()}  |  Reading time: ~${summary.readingTime} min`,
      `Key Topics: ${summary.keyTopics.join(", ")}`,
      ``,
      `EXECUTIVE SUMMARY`,
      summary.executiveSummary,
      ``,
      `KEY POINTS`,
      ...summary.keyPoints.map((p, i) => `${i + 1}. ${p}`),
      ``,
      `CONCLUSIONS`,
      summary.conclusions,
    ].join("\n");
    navigator.clipboard.writeText(r);
    toast.success("Report copied!");
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">AI PDF Summarizer</span>
        <span className="ml-auto text-[10px] text-muted-foreground">Upload → Instant Summary</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={cn(
            "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/20"
          )}
        >
          <input ref={inputRef} type="file" accept="application/pdf" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <div className="text-sm font-medium">Drop PDF here or click to upload</div>
          <div className="text-xs text-muted-foreground mt-1">Max 20 MB · Text-based PDFs only</div>
        </div>

        {file && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/20 border border-border">
            <FileText className="w-5 h-5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{file.name}</div>
              <div className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
            <button onClick={() => { setFile(null); setSummary(null); }} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {file && !summary && (
          <Button onClick={analyze} disabled={loading} className="w-full gap-2">
            {loading ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Analyzing PDF…" : "Summarize PDF"}
          </Button>
        )}

        {error && (
          <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-3 text-sm text-rose-400">{error}</div>
        )}

        {summary && (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Pages",        value: summary.pageCount },
                { label: "Words",        value: summary.wordCount.toLocaleString() },
                { label: "Reading Time", value: `~${summary.readingTime} min` },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-border p-3 text-center">
                  <div className="text-lg font-bold">{s.value}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm font-medium truncate">{summary.title}</div>
              <Button size="sm" variant="ghost" onClick={copyReport} className="h-7 text-xs gap-1 shrink-0">
                <Copy className="w-3 h-3" /> Copy Report
              </Button>
            </div>

            {/* Key Topics */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Key Topics</div>
              <div className="flex flex-wrap gap-1.5">
                {summary.keyTopics.map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium">{t}</span>
                ))}
              </div>
            </div>

            {/* Executive Summary */}
            <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Executive Summary</div>
              <p className="text-sm leading-relaxed">{summary.executiveSummary}</p>
            </div>

            {/* Key Points */}
            {summary.keyPoints.length > 0 && (
              <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Key Points</div>
                <ul className="space-y-2">
                  {summary.keyPoints.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="shrink-0 w-4 h-4 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[10px] font-bold mt-0.5">{i + 1}</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Conclusions */}
            <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Conclusions</div>
              <p className="text-sm leading-relaxed text-muted-foreground">{summary.conclusions}</p>
            </div>

            <div className="text-xs text-muted-foreground">Summaries are extracted from text content — accuracy depends on document structure.</div>
          </div>
        )}
      </div>
    </div>
  );
}
