"use client";

import { useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Upload, Download, Image as ImageIcon, Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function copy(text: string) { navigator.clipboard.writeText(text); toast.success("Copied!"); }

// ─── Generic canvas-based image converter ────────────────────────────────────

type ConvFormat = "image/jpeg" | "image/png" | "image/webp";

interface ConvertedFile { name: string; url: string; size: string; }

function CanvasConverter({
  accept, outputFormat, outputExt, quality: defaultQuality = 0.92, showQuality = false,
}: {
  accept: string; outputFormat: ConvFormat; outputExt: string;
  quality?: number; showQuality?: boolean;
}) {
  const [files, setFiles]       = useState<File[]>([]);
  const [results, setResults]   = useState<ConvertedFile[]>([]);
  const [quality, setQuality]   = useState(defaultQuality);
  const [converting, setConverting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef                = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter(f => f.type.startsWith("image/") || f.name.toLowerCase().endsWith(".heic") || f.name.toLowerCase().endsWith(".heif"));
    setFiles(prev => [...prev, ...valid]);
    setResults([]);
  }, []);

  const convertFile = (file: File): Promise<ConvertedFile> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width; canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          if (outputFormat === "image/jpeg") { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(blob => {
            if (!blob) { reject(new Error("Conversion failed")); return; }
            const url  = URL.createObjectURL(blob);
            const name = file.name.replace(/\.[^.]+$/, "") + "." + outputExt;
            const size = blob.size > 1024 * 1024 ? `${(blob.size / 1024 / 1024).toFixed(2)} MB` : `${Math.round(blob.size / 1024)} KB`;
            resolve({ name, url, size });
          }, outputFormat, quality);
        };
        img.onerror = () => reject(new Error(`Could not load image: ${file.name}`));
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });

  const convertAll = async () => {
    if (!files.length) return;
    setConverting(true);
    const out: ConvertedFile[] = [];
    for (const f of files) {
      try { out.push(await convertFile(f)); } catch (e) { toast.error((e as Error).message); }
    }
    setResults(out);
    setConverting(false);
    toast.success(`Converted ${out.length} file${out.length !== 1 ? "s" : ""}!`);
  };

  const downloadAll = () => {
    results.forEach(r => {
      const a = document.createElement("a"); a.href = r.url; a.download = r.name; a.click();
    });
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={cn("border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
          dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/20")}>
        <input ref={inputRef} type="file" accept={accept} multiple className="hidden"
          onChange={e => addFiles(e.target.files)} />
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <div className="text-sm font-medium">Drop images here or click to upload</div>
        <div className="text-xs text-muted-foreground mt-1">{accept.toUpperCase().replace(/image\//g, "").replace(/,/g, ", ")} supported · Multiple files OK</div>
      </div>

      {showQuality && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-16">Quality: {Math.round(quality * 100)}%</span>
          <input type="range" min={0.5} max={1} step={0.01} value={quality}
            onChange={e => setQuality(Number(e.target.value))} className="flex-1 h-2 accent-primary" />
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/10 border border-border text-sm">
              <ImageIcon className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="flex-1 truncate text-xs">{f.name}</span>
              <span className="text-xs text-muted-foreground shrink-0">{(f.size/1024).toFixed(0)} KB</span>
              <button onClick={() => { setFiles(fs => fs.filter((_,j)=>j!==i)); setResults([]); }} className="text-muted-foreground hover:text-rose-400">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <Button onClick={convertAll} disabled={converting} className="w-full gap-2">
          {converting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
          {converting ? "Converting…" : `Convert ${files.length} file${files.length!==1?"s":""} to .${outputExt.toUpperCase()}`}
        </Button>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Converted files</span>
            {results.length > 1 && (
              <Button size="sm" variant="ghost" onClick={downloadAll} className="h-7 text-xs gap-1">
                <Download className="w-3 h-3" /> Download all
              </Button>
            )}
          </div>
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="flex-1 truncate text-xs font-medium">{r.name}</span>
              <span className="text-xs text-muted-foreground shrink-0">{r.size}</span>
              <a href={r.url} download={r.name}>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Download className="w-3.5 h-3.5" /></Button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── HEIC Converter ───────────────────────────────────────────────────────────

function HeicConverter({ outputFormat, outputExt }: { outputFormat: "jpg"|"png"; outputExt: string }) {
  const [files, setFiles]       = useState<File[]>([]);
  const [results, setResults]   = useState<ConvertedFile[]>([]);
  const [converting, setConverting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef                = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter(f =>
      f.name.toLowerCase().endsWith(".heic") || f.name.toLowerCase().endsWith(".heif") || f.type === "image/heic" || f.type === "image/heif"
    );
    if (!valid.length) { toast.error("Please upload HEIC/HEIF files only"); return; }
    setFiles(prev => [...prev, ...valid]); setResults([]);
  };

  const convertAll = async () => {
    setConverting(true);
    const out: ConvertedFile[] = [];
    try {
      const heic2any = (await import("heic2any")).default;
      for (const file of files) {
        try {
          const result = await heic2any({ blob: file, toType: `image/${outputFormat}`, quality: 0.92 });
          const blob = Array.isArray(result) ? result[0] : result;
          const url  = URL.createObjectURL(blob);
          const name = file.name.replace(/\.(heic|heif)$/i, `.${outputExt}`);
          const size = blob.size > 1024*1024 ? `${(blob.size/1024/1024).toFixed(2)} MB` : `${Math.round(blob.size/1024)} KB`;
          out.push({ name, url, size });
        } catch (e) { toast.error(`Failed: ${file.name} — ${(e as Error).message}`); }
      }
    } catch { toast.error("Failed to load HEIC converter library"); }
    setResults(out);
    setConverting(false);
    if (out.length) toast.success(`Converted ${out.length} file${out.length!==1?"s":""}!`);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={cn("border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
          dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/20")}>
        <input ref={inputRef} type="file" accept=".heic,.heif" multiple className="hidden"
          onChange={e => addFiles(e.target.files)} />
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <div className="text-sm font-medium">Drop HEIC/HEIF files here</div>
        <div className="text-xs text-muted-foreground mt-1">iPhone & Mac photos (.heic, .heif) · Multiple files OK</div>
      </div>

      {files.length > 0 && (
        <>
          <div className="space-y-1.5">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/10 border border-border text-sm">
                <ImageIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="flex-1 truncate text-xs">{f.name}</span>
                <button onClick={() => setFiles(fs => fs.filter((_,j)=>j!==i))} className="text-muted-foreground hover:text-rose-400"><X className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
          <Button onClick={convertAll} disabled={converting} className="w-full gap-2">
            {converting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {converting ? "Converting…" : `Convert ${files.length} file${files.length!==1?"s":""} to .${outputExt.toUpperCase()}`}
          </Button>
        </>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="flex-1 truncate text-xs font-medium">{r.name}</span>
              <span className="text-xs text-muted-foreground">{r.size}</span>
              <a href={r.url} download={r.name}><Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Download className="w-3.5 h-3.5" /></Button></a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Image to Base64 ──────────────────────────────────────────────────────────

function ImageToBase64() {
  const [file, setFile]   = useState<File | null>(null);
  const [b64, setB64]     = useState("");
  const [tab, setTab]     = useState<"raw"|"img"|"css"|"json">("raw");
  const inputRef          = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setB64(e.target?.result as string ?? "");
    reader.readAsDataURL(f);
  };

  const snippets = {
    raw:  b64,
    img:  `<img src="${b64}" alt="${file?.name ?? "image"}" />`,
    css:  `.element {\n  background-image: url('${b64}');\n}`,
    json: `{\n  "image": "${b64}"\n}`,
  };

  return (
    <div className="space-y-4">
      <div onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/10 transition-all">
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <Upload className="w-7 h-7 mx-auto mb-2 text-muted-foreground" />
        <div className="text-sm">{file ? file.name : "Click to upload an image"}</div>
        {file && <div className="text-xs text-muted-foreground mt-1">{(file.size/1024).toFixed(1)} KB → {(b64.length/1024).toFixed(1)} KB Base64</div>}
      </div>

      {b64 && (
        <div className="space-y-3">
          <div className="flex gap-1.5 flex-wrap">
            {(["raw","img","css","json"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={cn("px-3 py-1 rounded-full border text-xs font-mono font-medium transition-all",
                  tab === t ? "border-primary/50 bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40")}>
                {t === "raw" ? "Base64" : t === "img" ? "<img>" : t === "css" ? "CSS" : "JSON"}
              </button>
            ))}
          </div>
          <div className="relative">
            <textarea readOnly value={snippets[tab]}
              className="w-full min-h-[120px] rounded-xl border border-border bg-muted/5 px-4 py-3 text-xs font-mono resize-y focus:outline-none" />
            <Button size="sm" variant="ghost" onClick={() => copy(snippets[tab])} className="absolute top-2 right-2 h-6 text-xs gap-1">
              <Copy className="w-3 h-3" />Copy
            </Button>
          </div>
          {tab === "raw" && (
            <div className="flex items-center justify-center rounded-xl border border-border p-3 bg-muted/5">
              <img src={b64} alt="preview" className="max-h-40 max-w-full rounded-lg object-contain" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Base64 to Image ──────────────────────────────────────────────────────────

function Base64ToImage() {
  const [input, setInput] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [error, setError]   = useState("");

  const decode = () => {
    const raw = input.trim();
    if (!raw) return;
    const src = raw.startsWith("data:") ? raw : `data:image/png;base64,${raw}`;
    setError(""); setImgSrc(src);
  };

  const download = () => {
    if (!imgSrc) return;
    const ext = imgSrc.match(/data:image\/([a-z]+)/)?.[1] ?? "png";
    const a = document.createElement("a"); a.href = imgSrc; a.download = `decoded-image.${ext}`; a.click();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Base64 string</label>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          placeholder="Paste Base64 string here (with or without the data:image/… prefix)…"
          className="w-full min-h-[120px] rounded-xl border border-border bg-background px-4 py-3 text-xs font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>
      <Button onClick={decode} disabled={!input.trim()} className="gap-1.5">Decode Image</Button>
      {error && <div className="text-sm text-rose-400">{error}</div>}
      {imgSrc && (
        <div className="space-y-3">
          <div className="rounded-xl border border-border p-4 bg-muted/5 flex items-center justify-center">
            <img src={imgSrc} alt="decoded" className="max-h-64 max-w-full rounded-lg object-contain"
              onError={() => { setError("Invalid Base64 — could not decode image."); setImgSrc(""); }} />
          </div>
          <Button variant="outline" onClick={download} className="gap-1.5 text-sm">
            <Download className="w-4 h-4" /> Download Image
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Suite Router ─────────────────────────────────────────────────────────────

const TOOLS: Record<string, { title: string; component: React.ComponentType }> = {
  "webp-to-jpg":     { title: "WebP to JPG",     component: () => <CanvasConverter accept="image/webp" outputFormat="image/jpeg" outputExt="jpg" showQuality /> },
  "webp-to-png":     { title: "WebP to PNG",     component: () => <CanvasConverter accept="image/webp" outputFormat="image/png"  outputExt="png" /> },
  "heic-to-jpg":     { title: "HEIC to JPG",     component: () => <HeicConverter outputFormat="jpg" outputExt="jpg" /> },
  "heic-to-png":     { title: "HEIC to PNG",     component: () => <HeicConverter outputFormat="png" outputExt="png" /> },
  "image-to-base64": { title: "Image to Base64", component: ImageToBase64 },
  "base64-to-image": { title: "Base64 to Image", component: Base64ToImage },
};

export function ImageConversionSuite() {
  const pathname = usePathname();
  const slug = pathname.split("/tools/")[1]?.replace(/\/$/, "") ?? "";
  const tool = TOOLS[slug];
  if (!tool) return <div className="p-6 text-muted-foreground text-sm">Tool not found.</div>;
  const Component = tool.component;
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <ImageIcon className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{tool.title}</span>
      </div>
      <div className="p-5">
        <Component />
      </div>
    </div>
  );
}
