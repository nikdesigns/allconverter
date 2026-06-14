"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUploadZone, formatBytes2 } from "@/components/tools/shared/FileUploadZone";
import { Download, Scissors, FileText } from "lucide-react";
import { toast } from "sonner";
import { ProcessingStatus, useProcessing } from "@/components/processing";

interface SplitResult { name: string; url: string; size: number; pages: string; }

export function PdfSplitterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<"range" | "each">("range");
  const [rangeInput, setRangeInput] = useState("1-3, 4-6");
  const [results, setResults] = useState<SplitResult[]>([]);
  const [processing, setProcessing] = useState(false);

  const proc = useProcessing({ category: "pdf" });

  const handleFile = async (files: File[]) => {
    const f = files[0]; setFile(f); setResults([]); proc.reset();
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
    } catch { toast.error("Could not read PDF"); }
  };

  const parseRanges = (input: string, max: number): Array<number[]> => {
    return input.split(",").map(s => s.trim()).filter(Boolean).map(s => {
      const [a, b] = s.split("-").map(n => parseInt(n.trim(), 10));
      const start = Math.max(1, a || 1);
      const end = Math.min(max, b ?? start);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i - 1);
    }).filter(r => r.length > 0);
  };

  const split = async () => {
    if (!file || !pageCount) return;
    setProcessing(true);
    await proc.setFile(file);
    proc.advance("analyzing");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
      proc.advance("processing");

      let ranges: Array<number[]>;
      if (mode === "each") {
        ranges = Array.from({ length: pageCount }, (_, i) => [i]);
      } else {
        ranges = parseRanges(rangeInput, pageCount);
        if (!ranges.length) {
          proc.error("No valid page ranges");
          toast.error("No valid page ranges");
          setProcessing(false);
          return;
        }
      }

      const out: SplitResult[] = [];
      for (let i = 0; i < ranges.length; i++) {
        proc.setProgress(52 + Math.round(((i + 0.5) / ranges.length) * 38));
        const indices = ranges[i];
        const doc = await PDFDocument.create();
        const pages = await doc.copyPages(src, indices);
        pages.forEach(p => doc.addPage(p));
        const saved = await doc.save();
        const blob = new Blob([saved as unknown as BlobPart], { type: "application/pdf" });
        const pageLabel = indices.length === 1 ? `p${indices[0]+1}` : `p${indices[0]+1}-p${indices[indices.length-1]+1}`;
        out.push({ name: `${file.name.replace(".pdf","")}_${pageLabel}.pdf`, url: URL.createObjectURL(blob), size: blob.size, pages: indices.map(n=>n+1).join(", ") });
      }
      setResults(out);
      const totalSize = out.reduce((s, r) => s + r.size, 0);
      proc.complete([
        { label: "Parts Created", after: `${out.length}` },
        { label: "Source Pages", after: `${pageCount}` },
        { label: "Total Output Size", after: formatBytes2(totalSize), highlight: true },
      ]);
      toast.success(`Split into ${out.length} PDF${out.length>1?"s":""}`);
    } catch {
      proc.error("Failed to split PDF");
      toast.error("Failed to split PDF");
    }
    finally { setProcessing(false); }
  };

  const downloadAll = () => results.forEach(r => { const a = document.createElement("a"); a.href = r.url; a.download = r.name; a.click(); });

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Scissors className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">PDF Splitter</span>
      </div>
      <div className="p-5 space-y-4">
        <FileUploadZone accept=".pdf,application/pdf" onFiles={handleFile}
          label="Drop a PDF file here" sublabel="Split into multiple PDFs by page range" />

        {file && (
          <>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-rose-500">PDF</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatBytes2(file.size)} · {pageCount} pages</p>
              </div>
            </div>

            <div className="flex rounded-xl border border-border overflow-hidden">
              <button onClick={() => setMode("range")}
                className={`flex-1 py-2.5 text-xs font-medium transition-all ${mode==="range"?"bg-primary text-primary-foreground":"bg-muted/20 text-muted-foreground"}`}>
                By Page Range
              </button>
              <button onClick={() => setMode("each")}
                className={`flex-1 py-2.5 text-xs font-medium transition-all ${mode==="each"?"bg-primary text-primary-foreground":"bg-muted/20 text-muted-foreground"}`}>
                Every Page Separately
              </button>
            </div>

            {mode === "range" && (
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Page ranges (e.g. <code className="font-mono">1-3, 4-6, 7</code>)
                </label>
                <Input value={rangeInput} onChange={e => setRangeInput(e.target.value)}
                  placeholder={`1-3, 4-${Math.max(pageCount,6)}`} className="font-mono text-sm" />
                <p className="text-xs text-muted-foreground mt-1">PDF has {pageCount} pages. Each comma-separated range becomes one PDF.</p>
              </div>
            )}

            <Button onClick={split} disabled={processing} className="w-full gap-2">
              {processing ? <><div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />Splitting…</> : "Split PDF"}
            </Button>

            <AnimatePresence>
              {proc.state.stage !== "idle" && (
                <ProcessingStatus state={proc.state} config={proc.config} onRetry={split} showFileCard={false} />
              )}
            </AnimatePresence>

            {results.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">{results.length} parts created</p>
                  {results.length > 1 && (
                    <Button size="sm" variant="outline" onClick={downloadAll} className="h-7 text-xs gap-1">
                      <Download className="w-3 h-3" />Download All
                    </Button>
                  )}
                </div>
                {results.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                    <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.name}</p>
                      <p className="text-xs text-muted-foreground">Pages {r.pages} · {formatBytes2(r.size)}</p>
                    </div>
                    <a href={r.url} download={r.name}>
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Download className="w-3 h-3" />Save</Button>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
