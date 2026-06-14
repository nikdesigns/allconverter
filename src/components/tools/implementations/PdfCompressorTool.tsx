"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileUploadZone, formatBytes2 } from "@/components/tools/shared/FileUploadZone";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { ProcessingStatus, useProcessing } from "@/components/processing";

export function PdfCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState("");
  const [outputSize, setOutputSize] = useState(0);
  const [level, setLevel] = useState<"low" | "medium" | "high">("medium");
  const [processing, setProcessing] = useState(false);

  const proc = useProcessing({ category: "pdf" });

  const handleFile = (files: File[]) => { setFile(files[0]); setOutputUrl(""); proc.reset(); };

  const compress = async () => {
    if (!file) return;
    setProcessing(true);
    await proc.setFile(file);
    proc.advance("analyzing");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      proc.advance("processing");

      const saveOptions = level === "high"
        ? { useObjectStreams: false, addDefaultPage: false, objectsPerTick: 50 }
        : level === "medium"
        ? { useObjectStreams: true, addDefaultPage: false }
        : { useObjectStreams: true };

      if (level !== "low") {
        doc.setTitle("");
        doc.setAuthor("");
        doc.setSubject("");
        doc.setKeywords([]);
        doc.setProducer("");
        doc.setCreator("");
      }

      const compressed = await doc.save(saveOptions);
      const blob = new Blob([compressed as unknown as BlobPart], { type: "application/pdf" });
      setOutputUrl(URL.createObjectURL(blob));
      setOutputSize(blob.size);
      const saved = Math.round((1 - blob.size / file.size) * 100);
      proc.complete([
        { label: "Original Size", after: formatBytes2(file.size) },
        { label: "Compressed Size", after: formatBytes2(blob.size), warn: blob.size >= file.size },
        { label: "Space Saved", after: saved > 0 ? `${saved}%` : "~0%", highlight: saved > 0 },
      ]);
      toast.success(`Compressed! ${saved > 0 ? `Saved ${saved}%` : "File optimized"}`);
    } catch {
      proc.error("Failed to compress PDF.");
      toast.error("Failed to compress PDF.");
    } finally {
      setProcessing(false);
    }
  };

  const saved = outputSize && file ? Math.round((1 - outputSize / file.size) * 100) : 0;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <FileText className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">PDF Compressor</span>
      </div>
      <div className="p-5 space-y-4">
        <FileUploadZone accept=".pdf,application/pdf" onFiles={handleFile}
          label="Drop a PDF file here" sublabel="Reduces file size while preserving quality" />

        {file && (
          <>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-rose-500">PDF</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatBytes2(file.size)}</p>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Compression Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(["low", "medium", "high"] as const).map((l) => (
                  <button key={l} onClick={() => setLevel(l)}
                    className={`py-2.5 rounded-xl border text-xs font-medium capitalize transition-all ${level===l?"border-primary/40 bg-primary/10 text-primary":"border-border text-muted-foreground hover:text-foreground"}`}>
                    {l}
                    <span className="block text-[10px] opacity-60 mt-0.5">{l==="low"?"Faster":l==="medium"?"Balanced":"Smaller"}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={compress} disabled={processing} className="w-full gap-2">
              {processing ? <><div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />Compressing…</> : "Compress PDF"}
            </Button>

            <AnimatePresence>
              {proc.state.stage !== "idle" && (
                <ProcessingStatus state={proc.state} config={proc.config} onRetry={compress} showFileCard={false} />
              )}
            </AnimatePresence>

            {outputUrl && (
              <div className="flex items-center gap-4 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-emerald-500">PDF</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {saved > 0 ? `Saved ${saved}% · ` : ""}{formatBytes2(outputSize)}
                  </p>
                  <p className="text-xs text-muted-foreground">Original: {formatBytes2(file.size)}</p>
                </div>
                <a href={outputUrl} download={file.name.replace(".pdf", "_compressed.pdf")}>
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
