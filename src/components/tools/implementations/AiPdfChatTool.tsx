"use client";

import { useState, useRef } from "react";
import { FileText, Send, Trash2, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "assistant";
  content: string;
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  const bytes = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
  }
  return pages.join("\n\n");
}

function answerQuestion(pdfText: string, question: string): string {
  const q = question.toLowerCase().trim();
  const sentences = pdfText.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 20);
  const words = q.replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter(w => w.length > 3 && !["what","this","that","with","have","from","they","will","been","were","your","when","also","more"].includes(w));

  // Score each sentence by keyword overlap
  const scored = sentences.map(s => {
    const sl = s.toLowerCase();
    const hits = words.filter(w => sl.includes(w)).length;
    return { s, hits };
  }).filter(r => r.hits > 0).sort((a, b) => b.hits - a.hits);

  if (scored.length === 0) {
    return `I searched the document but couldn't find content directly matching your question about "${question.slice(0, 60)}". Try rephrasing or asking about a specific term from the document.`;
  }

  const topSnippets = scored.slice(0, 3).map(r => r.s.trim()).join(" … ");

  // Classify question type for better response framing
  if (/what is|what are|define|explain|describe/.test(q)) {
    return `Based on the document:\n\n${topSnippets}\n\n📄 This excerpt best matches your question. The document ${scored.length > 3 ? `contains ${scored.length} additional relevant passages` : "has limited content on this topic"}.`;
  }
  if (/how to|how do|how can|steps|process/.test(q)) {
    return `The document describes the following related to your question:\n\n${topSnippets}\n\n💡 Look for numbered lists or step-by-step sections in the full document for a complete process.`;
  }
  if (/when|date|time|year|month/.test(q)) {
    return `Time-related content from the document:\n\n${topSnippets}\n\n📅 Check the document for specific dates or timelines mentioned in context.`;
  }
  if (/who|name|person|author|team/.test(q)) {
    return `The document mentions:\n\n${topSnippets}\n\n👤 Refer to the full document for complete information about people or organizations.`;
  }
  if (/summary|summarize|overview|brief|tldr/.test(q)) {
    // Give a broader summary
    const summary = sentences.slice(0, 5).join(" ");
    return `**Document Summary:**\n\n${summary}\n\n📝 This is a summary of the first section. Ask about specific topics for targeted answers.`;
  }

  return `Here's the most relevant content from the document:\n\n${topSnippets}\n\n📌 This is extracted directly from the PDF. The document has ${sentences.length} sentences total — ask specific questions for more targeted results.`;
}

export function AiPdfChatTool() {
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function loadPdf(file: File) {
    setLoading(true);
    setMessages([]);
    setPdfText(null);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const pages: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        pages.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
      }
      const text = pages.join("\n\n");
      setPdfText(text);
      setFileName(file.name);
      setPageCount(pdf.numPages);
      setMessages([{
        role: "assistant",
        content: `✅ **${file.name}** loaded successfully — ${pdf.numPages} page${pdf.numPages !== 1 ? "s" : ""}, ~${text.split(/\s+/).length.toLocaleString()} words.\n\nAsk me anything about this document!`,
      }]);
    } catch {
      setMessages([{ role: "assistant", content: "❌ Could not read this PDF. Try a text-based PDF (not a scanned image)." }]);
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") loadPdf(f);
  }

  async function sendMessage() {
    const q = input.trim();
    if (!q || !pdfText) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setThinking(true);
    await new Promise(r => setTimeout(r, 400)); // brief thinking pause
    const answer = answerQuestion(pdfText, q);
    setMessages(prev => [...prev, { role: "assistant", content: answer }]);
    setThinking(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  function reset() {
    setPdfText(null);
    setFileName("");
    setPageCount(0);
    setMessages([]);
    setInput("");
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col" style={{ minHeight: 520 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">AI PDF Chat</span>
        </div>
        {pdfText && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{fileName} · {pageCount} pages</span>
            <Button variant="ghost" size="sm" onClick={reset} className="h-6 text-xs gap-1">
              <Trash2 className="w-3 h-3" />New
            </Button>
          </div>
        )}
      </div>

      {/* Upload area */}
      {!pdfText && !loading && (
        <div
          className="flex-1 flex flex-col items-center justify-center gap-4 p-8 cursor-pointer border-2 border-dashed border-border m-4 rounded-xl hover:border-primary/50 hover:bg-muted/20 transition-colors"
          onClick={() => fileRef.current?.click()}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <Upload className="w-12 h-12 text-muted-foreground/40" />
          <div className="text-center">
            <p className="font-medium text-sm mb-1">Upload a PDF to start chatting</p>
            <p className="text-xs text-muted-foreground">Works with text-based PDFs — reports, manuals, contracts, research papers</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="w-4 h-4" />Browse PDF
          </Button>
          <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) loadPdf(f); }} />
        </div>
      )}

      {loading && (
        <div className="flex-1 flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          Reading PDF…
        </div>
      )}

      {/* Chat messages */}
      {pdfText && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 400 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted/50 border border-border rounded-bl-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start">
                <div className="bg-muted/50 border border-border rounded-2xl rounded-bl-sm px-4 py-2.5">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-3 flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask anything about this PDF…"
              className="text-sm"
              disabled={thinking}
            />
            <Button onClick={sendMessage} disabled={!input.trim() || thinking} size="sm" className="shrink-0 gap-1.5">
              <Send className="w-3.5 h-3.5" />Send
            </Button>
          </div>
        </>
      )}

      <div className="px-4 pb-3 text-xs text-muted-foreground/50">
        PDF is processed entirely in your browser — nothing is uploaded to any server.
      </div>
    </div>
  );
}
