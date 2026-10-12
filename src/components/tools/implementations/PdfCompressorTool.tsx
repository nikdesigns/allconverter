"use client";

import { usePersistentState } from "@/lib/persist";
import { SendToTool } from "@/components/tools/shared/SendToTool";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileUploadZone, formatBytes2 } from "@/components/tools/shared/FileUploadZone";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { ProcessingStatus, useProcessing } from "@/components/processing";

type Level = "low" | "medium" | "high" | "target";

const LEVELS: Record<Level, { label: string; hint: string; image?: { quality: number; maxDimension: number } }> = {
  low:    { label: "Lossless", hint: "No quality change" },
  medium: { label: "Balanced", hint: "Images at good quality", image: { quality: 0.72, maxDimension: 2000 } },
  high:   { label: "Smallest", hint: "Images reduced further", image: { quality: 0.5, maxDimension: 1400 } },
  target: { label: "Target size", hint: "Fit under a limit" },
};

/** Settings tried in order, gentlest first, when compressing to a size limit. */
const TARGET_LADDER = [
  { quality: 0.8,  maxDimension: 2400 },
  { quality: 0.7,  maxDimension: 2000 },
  { quality: 0.6,  maxDimension: 1600 },
  { quality: 0.5,  maxDimension: 1300 },
  { quality: 0.4,  maxDimension: 1100 },
  { quality: 0.32, maxDimension: 900 },
  { quality: 0.25, maxDimension: 700 },
];

export function PdfCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState("");
  const [outputSize, setOutputSize] = useState(0);
  const [level, setLevel] = usePersistentState<Level>("pdf-compressor.level", "medium");
  const [processing, setProcessing] = useState(false);
  const [note, setNote] = useState("");
  const [targetKb, setTargetKb] = usePersistentState("pdf-compressor.targetKb", "200");

  const proc = useProcessing({ category: "pdf" });

  const handleFile = (files: File[]) => { setFile(files[0]); setOutputUrl(""); setNote(""); proc.reset(); };

  const compress = async () => {
    if (!file) return;
    setProcessing(true);
    await proc.setFile(file);
    proc.advance("analyzing");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const probe = await PDFDocument.load(bytes, { ignoreEncryption: true });
      if (probe.isEncrypted) {
        throw new Error("This PDF is password-protected. Remove the password first, then compress it.");
      }
      proc.advance("processing");

      const saveOptions = { useObjectStreams: true, addDefaultPage: false };
      type ImageSetting = { quality: number; maxDimension: number };

      // One full pass: load a fresh copy, optionally re-encode its photos, and save.
      const pass = async (image?: ImageSetting) => {
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        let images = { found: 0, recompressed: 0, savedBytes: 0 };
        if (image) {
          const { recompressPdfImages } = await import("@/lib/pdf-image-compress");
          images = await recompressPdfImages(doc, image);
          doc.setTitle(""); doc.setAuthor(""); doc.setSubject("");
          doc.setKeywords([]); doc.setProducer(""); doc.setCreator("");
        }
        return { out: await doc.save(saveOptions), images };
      };

      const limit = Math.max(1, parseFloat(targetKb) || 0) * 1024;
      let best: Awaited<ReturnType<typeof pass>>;
      let reached = true;

      if (level !== "target") {
        best = await pass(LEVELS[level].image);
      } else if (file.size <= limit) {
        best = { out: new Uint8Array(bytes), images: { found: 0, recompressed: 0, savedBytes: 0 } };
      } else {
        // Step down through stronger settings and stop at the first one that fits,
        // so the result keeps as much image quality as the limit allows.
        best = await pass(TARGET_LADDER[0]);
        // With no photos to re-encode, stronger settings cannot help: one pass is enough.
        for (let i = 1; i < TARGET_LADDER.length && best.out.length > limit && best.images.found > 0; i++) {
          proc.setProgress(30 + Math.round((i / TARGET_LADDER.length) * 55));
          const next = await pass(TARGET_LADDER[i]);
          if (next.out.length < best.out.length) best = next;
        }
        reached = best.out.length <= limit;
      }

      const { out: compressed, images } = best;
      // Never hand back a file that is larger than the one that came in.
      const smaller = compressed.length < file.size;
      const blob = smaller ? new Blob([compressed as unknown as BlobPart], { type: "application/pdf" }) : file;
      setNote(
        level === "target" && file.size <= limit
          ? "This PDF is already under your target size, so it is returned unchanged."
          : level === "target" && !reached
          ? images.found === 0
            ? `Could not reach ${formatBytes2(limit)}: this PDF has no JPEG photos to compress, and text and vector content cannot be made smaller. Splitting it into parts is the way to get under the limit.`
            : `Could not reach ${formatBytes2(limit)} even at the strongest image setting. This is the smallest version; splitting the PDF into parts will get each part under the limit.`
          : !smaller
          ? "This PDF is already well optimised, so the original is returned unchanged."
          : level === "low"
          ? "Lossless: the file structure was repacked. Choose Balanced or Smallest to also compress images."
          : images.found === 0
          ? "No JPEG photos were found in this PDF, so only lossless repacking was applied. Text-only PDFs have little left to remove."
          : `${images.recompressed} of ${images.found} image${images.found === 1 ? "" : "s"} re-encoded. Text and vector graphics were left untouched.`,
      );
      setOutputUrl(URL.createObjectURL(blob));
      setOutputSize(blob.size);
      const saved = Math.round((1 - blob.size / file.size) * 100);
      proc.complete([
        { label: "Original Size", after: formatBytes2(file.size) },
        { label: "Compressed Size", after: formatBytes2(blob.size), warn: blob.size >= file.size || !reached },
        { label: "Space Saved", after: saved > 0 ? `${saved}%` : "~0%", highlight: saved > 0 },
        ...(level !== "low" ? [{ label: "Images Re-encoded", after: `${images.recompressed} of ${images.found}` }] : []),
        ...(level === "target" ? [{ label: "Target", after: reached ? `Under ${formatBytes2(limit)}` : "Not reached", warn: !reached, highlight: reached }] : []),
      ]);
      toast.success(saved > 0 ? `Compressed! Saved ${saved}%` : "File checked");
    } catch (e) {
      const msg = e instanceof Error && e.message.includes("password") ? e.message : "Failed to compress PDF.";
      proc.error(msg);
      toast.error(msg);
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
          label="Drop a PDF file here" sublabel="Compresses the photos inside your PDF; text stays sharp and selectable" />

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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["low", "medium", "high", "target"] as const).map((l) => (
                  <button key={l} onClick={() => setLevel(l)}
                    aria-pressed={level === l}
                    className={`py-2.5 rounded-xl border text-xs font-medium transition-all ${level===l?"border-primary/40 bg-primary/10 text-primary":"border-border text-muted-foreground hover:text-foreground"}`}>
                    {LEVELS[l].label}
                    <span className="block text-[10px] opacity-60 mt-0.5">{LEVELS[l].hint}</span>
                  </button>
                ))}
              </div>
            </div>

            {level === "target" && (
              <div>
                <label htmlFor="pdf-target-kb" className="text-xs text-muted-foreground mb-2 block">Maximum file size</label>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <input id="pdf-target-kb" type="number" min={1} value={targetKb} onChange={(e) => setTargetKb(e.target.value)}
                      className="w-24 h-9 px-3 rounded-xl border border-input bg-background text-sm" />
                    <span className="text-sm text-muted-foreground">KB</span>
                  </div>
                  {[100, 200, 500, 1024, 2048].map((kb) => (
                    <button key={kb} type="button" onClick={() => setTargetKb(String(kb))}
                      className={`h-8 px-2.5 rounded-lg border text-xs transition-all ${targetKb === String(kb) ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                      {kb >= 1024 ? `${kb / 1024} MB` : `${kb} KB`}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  Images are compressed only as far as needed to fit, so quality stays as high as the limit allows.
                </p>
              </div>
            )}

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
                  {note && <p className="text-xs text-muted-foreground mt-1">{note}</p>}
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end"><a href={outputUrl} download={file.name.replace(".pdf", "_compressed.pdf")}>
                  <Button size="sm" className="gap-1.5"><Download className="w-3.5 h-3.5" />Download</Button>
                </a><SendToTool url={outputUrl} name={file.name.replace(".pdf", "_compressed.pdf")} /></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
