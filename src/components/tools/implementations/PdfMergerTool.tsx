"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/tools/shared/FileUploadZone";
import { Download, FilePlus2, Trash2, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { formatBytes2 } from "@/components/tools/shared/FileUploadZone";
import { ProcessingStatus, useProcessing } from "@/components/processing";

export function PdfMergerTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [outputUrl, setOutputUrl] = useState("");
  const [outputSize, setOutputSize] = useState(0);
  const [processing, setProcessing] = useState(false);

  const proc = useProcessing({ category: "pdf" });

  const handleFiles = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    setOutputUrl("");
    proc.reset();
  };

  const moveUp = (i: number) => {
    if (i === 0) return;
    setFiles(prev => { const a = [...prev]; [a[i-1],a[i]] = [a[i],a[i-1]]; return a; });
  };
  const moveDown = (i: number) => {
    setFiles(prev => { if (i >= prev.length-1) return prev; const a = [...prev]; [a[i],a[i+1]] = [a[i+1],a[i]]; return a; });
  };
  const remove = (i: number) => { setFiles(prev => prev.filter((_,idx) => idx !== i)); setOutputUrl(""); };

  const merge = async () => {
    if (files.length < 2) { toast.error("Add at least 2 PDF files"); return; }
    setProcessing(true);
    await proc.setFile(files[0]);
    proc.advance("analyzing");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      let totalPages = 0;
      for (let i = 0; i < files.length; i++) {
        proc.setProgress(28 + Math.round(((i + 0.5) / files.length) * 44));
        const bytes = await files[i].arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => merged.addPage(p));
        totalPages += doc.getPageCount();
      }
      proc.advance("processing");
      const bytes = await merged.save();
      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      setOutputUrl(URL.createObjectURL(blob));
      setOutputSize(blob.size);
      proc.complete([
        { label: "Files Merged", after: `${files.length}` },
        { label: "Total Pages", after: `${totalPages}` },
        { label: "Output Size", after: formatBytes2(blob.size), highlight: true },
      ]);
      toast.success(`Merged ${files.length} PDFs successfully`);
    } catch {
      proc.error("Failed to merge PDFs. Make sure all files are valid.");
      toast.error("Failed to merge PDFs. Make sure all files are valid.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <FilePlus2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">PDF Merger</span>
        </div>
        {files.length > 0 && (
          <Button size="sm" variant="ghost" onClick={() => { setFiles([]); setOutputUrl(""); }} className="h-7 text-xs gap-1">
            <Trash2 className="w-3.5 h-3.5" /> Clear all
          </Button>
        )}
      </div>
      <div className="p-5 space-y-4">
        <FileUploadZone accept=".pdf,application/pdf" multiple onFiles={handleFiles}
          label="Drop PDF files here" sublabel="Add 2 or more PDFs to merge" />

        {files.length > 0 && (
          <>
            <div className="space-y-2">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card">
                  <GripVertical className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                  <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-rose-500">PDF</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes2(f.size)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => moveUp(i)} disabled={i===0}
                      className="p-1.5 rounded hover:bg-muted disabled:opacity-30 transition-all">
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => moveDown(i)} disabled={i===files.length-1}
                      className="p-1.5 rounded hover:bg-muted disabled:opacity-30 transition-all">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => remove(i)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">Drag arrows to reorder pages in the merged PDF.</p>

            <Button onClick={merge} disabled={processing || files.length < 2} className="w-full gap-2">
              {processing ? <><div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />Merging…</> : `Merge ${files.length} PDFs`}
            </Button>

            <AnimatePresence>
              {proc.state.stage !== "idle" && (
                <ProcessingStatus state={proc.state} config={proc.config} onRetry={merge} showFileCard={false} />
              )}
            </AnimatePresence>

            {outputUrl && (
              <div className="flex items-center gap-4 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-emerald-500">PDF</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Merged PDF ready!</p>
                  <p className="text-xs text-muted-foreground">{formatBytes2(outputSize)}</p>
                </div>
                <a href={outputUrl} download="merged.pdf">
                  <Button size="sm" className="gap-1.5"><Download className="w-3.5 h-3.5" />Download</Button>
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
