"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, Layers } from "lucide-react";
import { toast } from "sonner";

interface FileEntry { file: File; status: "pending" | "done" | "error"; dataUrl?: string; }
type OutputFormat = "jpeg" | "png" | "webp";

async function convertImage(file: File, format: OutputFormat, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const src = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(src);
      const mime = `image/${format}`;
      const dataUrl = canvas.toDataURL(mime, format !== "png" ? quality / 100 : undefined);
      resolve(dataUrl);
    };
    img.onerror = () => { URL.revokeObjectURL(src); reject(new Error("Failed to load")); };
    img.src = src;
  });
}

export function BulkImageConverterTool() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [format, setFormat] = useState<OutputFormat>("jpeg");
  const [quality, setQuality] = useState(85);
  const [converting, setConverting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: FileList) => {
    const entries: FileEntry[] = Array.from(newFiles)
      .filter(f => f.type.startsWith("image/"))
      .map(f => ({ file: f, status: "pending" }));
    setFiles(prev => [...prev, ...entries]);
  };

  const convertAll = async () => {
    setConverting(true);
    const updated = [...files];
    for (let i = 0; i < updated.length; i++) {
      if (updated[i].status === "done") continue;
      try {
        const dataUrl = await convertImage(updated[i].file, format, quality);
        updated[i] = { ...updated[i], status: "done", dataUrl };
        setFiles([...updated]);
      } catch { updated[i] = { ...updated[i], status: "error" }; }
    }
    setConverting(false);
    toast.success(`Converted ${updated.filter(f=>f.status==="done").length} images`);
  };

  const downloadAll = () => {
    files.forEach(({ file, dataUrl }) => {
      if (!dataUrl) return;
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = file.name.replace(/\.[^.]+$/, `.${format === "jpeg" ? "jpg" : format}`);
      a.click();
    });
  };

  const downloadOne = (entry: FileEntry) => {
    if (!entry.dataUrl) return;
    const a = document.createElement("a");
    a.href = entry.dataUrl;
    a.download = entry.file.name.replace(/\.[^.]+$/, `.${format === "jpeg" ? "jpg" : format}`);
    a.click();
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Layers className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Bulk Image Converter</span>
      </div>
      <div className="p-5 space-y-4">
        <div
          className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
          onClick={() => fileRef.current?.click()}
          onDragOver={e=>e.preventDefault()}
          onDrop={e=>{e.preventDefault();addFiles(e.dataTransfer.files);}}>
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium">Drop multiple images here or click to browse</p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP, AVIF — any format</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e=>{if(e.target.files)addFiles(e.target.files);}} />

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Output format</label>
            <div className="flex gap-1.5">
              {(["jpeg","png","webp"] as OutputFormat[]).map(f=>(
                <button key={f} onClick={()=>setFormat(f)} className={`flex-1 py-2 rounded-xl border text-xs font-mono font-medium uppercase transition-all ${format===f?"border-primary/40 bg-primary/10 text-primary":"border-border text-muted-foreground"}`}>{f}</button>
              ))}
            </div>
          </div>
          {format !== "png" && (
            <div className="w-28">
              <label className="text-xs text-muted-foreground mb-1 block">Quality: {quality}%</label>
              <Input type="number" min={10} max={100} step={5} value={quality} onChange={e=>setQuality(+e.target.value)} className="text-sm font-mono" />
            </div>
          )}
        </div>

        {files.length > 0 && (
          <>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {files.map((entry, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-muted/10">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${entry.status==="done"?"bg-emerald-500":entry.status==="error"?"bg-red-500":"bg-muted-foreground/30"}`} />
                  <span className="text-xs flex-1 truncate font-mono">{entry.file.name}</span>
                  <span className="text-xs text-muted-foreground">{(entry.file.size/1024).toFixed(0)} KB</span>
                  {entry.status === "done" && (
                    <button onClick={()=>downloadOne(entry)} className="text-xs text-primary hover:underline">↓</button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={convertAll} disabled={converting || !files.length} className="flex-1 gap-2">
                {converting ? "Converting…" : `Convert ${files.length} images`}
              </Button>
              {files.some(f=>f.status==="done") && (
                <Button onClick={downloadAll} variant="outline" className="gap-2"><Download className="w-4 h-4" />Download All</Button>
              )}
            </div>
            <button onClick={()=>setFiles([])} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors">Clear all</button>
          </>
        )}
      </div>
    </div>
  );
}
