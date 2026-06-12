"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadZone, formatBytes2 } from "@/components/tools/shared/FileUploadZone";
import { Download, ImageIcon, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";

export function JpgToPdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [outputUrl, setOutputUrl] = useState("");
  const [outputSize, setOutputSize] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [pageSize, setPageSize] = useState<"fit" | "a4">("fit");

  const handleFiles = (newFiles: File[]) => { setFiles(p => [...p, ...newFiles]); setOutputUrl(""); };
  const remove = (i: number) => { setFiles(p => p.filter((_,j) => j !== i)); setOutputUrl(""); };
  const moveUp = (i: number) => { if (!i) return; setFiles(p => { const a=[...p]; [a[i-1],a[i]]=[a[i],a[i-1]]; return a; }); };
  const moveDown = (i: number) => { setFiles(p => { if (i>=p.length-1) return p; const a=[...p]; [a[i],a[i+1]]=[a[i+1],a[i]]; return a; }); };

  const convert = async () => {
    if (!files.length) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        let img;
        if (file.type === "image/png") {
          img = await doc.embedPng(bytes);
        } else {
          img = await doc.embedJpg(bytes);
        }
        const { width: iw, height: ih } = img;
        let pw: number, ph: number;
        if (pageSize === "a4") {
          pw = 595.28; ph = 841.89;
        } else {
          pw = iw; ph = ih;
        }
        const page = doc.addPage([pw, ph]);
        const scale = Math.min(pw / iw, ph / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        page.drawImage(img, { x: (pw-dw)/2, y: (ph-dh)/2, width: dw, height: dh });
      }

      const saved = await doc.save();
      // pdf-lib returns Uint8Array<ArrayBufferLike> — cast for Blob constructor compat
      const blob = new Blob([saved as unknown as BlobPart], { type: "application/pdf" });
      setOutputUrl(URL.createObjectURL(blob));
      setOutputSize(blob.size);
      toast.success(`Created PDF with ${files.length} page${files.length>1?"s":""}`);
    } catch { toast.error("Failed to create PDF"); }
    finally { setProcessing(false); }
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">JPG / PNG to PDF</span>
        </div>
        {files.length > 0 && (
          <Button size="sm" variant="ghost" onClick={() => { setFiles([]); setOutputUrl(""); }} className="h-7 text-xs gap-1">
            <Trash2 className="w-3.5 h-3.5" />Clear
          </Button>
        )}
      </div>
      <div className="p-5 space-y-4">
        <FileUploadZone accept="image/jpeg,image/png,image/jpg,.jpg,.jpeg,.png" multiple onFiles={handleFiles}
          label="Drop images here" sublabel="JPG, PNG files — each image becomes one page" />

        {files.length > 0 && (
          <>
            <div className="space-y-2">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-xl border border-border bg-muted/20">
                  <span className="text-xs font-bold text-muted-foreground w-5 text-center shrink-0">{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes2(f.size)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => moveUp(i)} disabled={i===0} className="p-1 rounded hover:bg-muted disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
                    <button onClick={() => moveDown(i)} disabled={i===files.length-1} className="p-1 rounded hover:bg-muted disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
                    <button onClick={() => remove(i)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Page Size</label>
              <div className="flex gap-2">
                {([["fit","Fit to Image"],["a4","A4 Page"]] as const).map(([v,l]) => (
                  <button key={v} onClick={() => setPageSize(v)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-all ${pageSize===v?"border-primary/40 bg-primary/10 text-primary":"border-border text-muted-foreground"}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={convert} disabled={processing} className="w-full gap-2">
              {processing ? <><div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />Creating PDF…</> : `Create PDF from ${files.length} image${files.length>1?"s":""}`}
            </Button>

            {outputUrl && (
              <div className="flex items-center gap-4 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-emerald-500">PDF</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">PDF ready!</p>
                  <p className="text-xs text-muted-foreground">{files.length} pages · {formatBytes2(outputSize)}</p>
                </div>
                <a href={outputUrl} download="images.pdf">
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
