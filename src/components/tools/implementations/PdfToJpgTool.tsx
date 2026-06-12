"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadZone, formatBytes2 } from "@/components/tools/shared/FileUploadZone";
import { Download, ImageIcon, Info } from "lucide-react";
import { toast } from "sonner";

export function PdfToJpgTool() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<Array<{ url: string; name: string; size: number }>>([]);
  const [scale, setScale] = useState(2);

  const handleFile = (files: File[]) => { setFile(files[0]); setResults([]); };

  const convert = async () => {
    if (!file) return;
    setProcessing(true);
    setResults([]);
    try {
      // Use PDF.js via CDN for rendering
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const out: typeof results = [];

      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // pdfjs RenderParameters requires a canvas element reference
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await page.render({ canvasContext: ctx as any, viewport, canvas } as any).promise;
        const blob = await new Promise<Blob>((res, rej) => canvas.toBlob(b => b ? res(b) : rej(), "image/jpeg", 0.92));
        out.push({ url: URL.createObjectURL(blob), name: `${file.name.replace(".pdf","")}_page${p}.jpg`, size: blob.size });
      }

      setResults(out);
      toast.success(`Converted ${pdf.numPages} page${pdf.numPages>1?"s":""} to JPG`);
    } catch (e) {
      toast.error("Failed to convert. Make sure it's a valid PDF.");
    } finally {
      setProcessing(false);
    }
  };

  const downloadAll = () => results.forEach(r => { const a = document.createElement("a"); a.href = r.url; a.download = r.name; a.click(); });

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <ImageIcon className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">PDF to JPG</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-2 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-600 dark:text-amber-400">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          Renders each PDF page as a high-resolution JPG using PDF.js (loaded on demand).
        </div>

        <FileUploadZone accept=".pdf,application/pdf" onFiles={handleFile}
          label="Drop a PDF file here" sublabel="Each page will be converted to a JPG image" />

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
              <label className="text-xs text-muted-foreground mb-1 block">Output Resolution</label>
              <div className="flex rounded-xl border border-border overflow-hidden">
                {([1,2,3] as const).map(s => (
                  <button key={s} onClick={() => setScale(s)}
                    className={`flex-1 py-2 text-xs font-medium transition-all ${scale===s?"bg-primary text-primary-foreground":"bg-muted/20 text-muted-foreground"}`}>
                    {s===1?"72 dpi":s===2?"144 dpi":"216 dpi"}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={convert} disabled={processing} className="w-full gap-2">
              {processing ? <><div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />Converting…</> : "Convert to JPG"}
            </Button>

            {results.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">{results.length} images</p>
                  {results.length > 1 && (
                    <Button size="sm" variant="outline" onClick={downloadAll} className="h-7 text-xs gap-1">
                      <Download className="w-3 h-3" />Download All
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {results.map((r, i) => (
                    <div key={i} className="rounded-xl border border-border overflow-hidden group">
                      <img src={r.url} alt={`Page ${i+1}`} className="w-full h-32 object-cover" />
                      <div className="p-2 flex items-center justify-between bg-muted/20">
                        <span className="text-xs text-muted-foreground">Page {i+1}</span>
                        <a href={r.url} download={r.name}>
                          <button className="p-1 rounded hover:bg-muted"><Download className="w-3.5 h-3.5" /></button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
