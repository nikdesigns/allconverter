"use client";

import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, FileText } from "lucide-react";
import { toast } from "sonner";

// ── PDF Page Number Adder ─────────────────────────────────────────────────────
function PdfPageNumberAdder() {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState<"bottom-center"|"bottom-right"|"bottom-left">("bottom-center");
  const [startNum, setStartNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const process = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const pages = doc.getPages();
      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const text = String(i + startNum);
        const fontSize = 10;
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        let x = width / 2 - textWidth / 2;
        if (position === "bottom-right") x = width - textWidth - 20;
        if (position === "bottom-left") x = 20;
        page.drawText(text, { x, y: 18, size: fontSize, font, color: rgb(0.3, 0.3, 0.3) });
      });
      const saved = await doc.save();
      const blob = new Blob([saved as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `numbered_${file.name}`; a.click();
      URL.revokeObjectURL(url);
      toast.success(`Page numbers added to ${pages.length} pages`);
    } catch (e) { toast.error("Failed: " + (e as Error).message); }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <DropZone file={file} setFile={setFile} fileRef={fileRef} />
      <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)setFile(f);}} />
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs text-muted-foreground mb-1 block">Position</label>
          <select value={position} onChange={e=>setPosition(e.target.value as typeof position)} className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm">
            <option value="bottom-center">Bottom Center</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
          </select></div>
        <div><label className="text-xs text-muted-foreground mb-1 block">Start from</label>
          <Input type="number" min={0} value={startNum} onChange={e=>setStartNum(+e.target.value)} className="text-sm font-mono" /></div>
      </div>
      <Button onClick={process} disabled={!file || loading} className="w-full gap-2">
        <Download className="w-4 h-4" />{loading ? "Processing…" : "Add Page Numbers & Download"}
      </Button>
    </div>
  );
}

// ── PDF Metadata Editor ───────────────────────────────────────────────────────
function PdfMetadataEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [keywords, setKeywords] = useState("");
  const [creator, setCreator] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadMeta = async (f: File) => {
    setFile(f);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const buffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setTitle(doc.getTitle() ?? ""); setAuthor(doc.getAuthor() ?? "");
      setSubject(doc.getSubject() ?? ""); setKeywords(doc.getKeywords() ?? "");
      setCreator(doc.getCreator() ?? "");
    } catch { /* non-critical */ }
  };

  const process = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      if (title) doc.setTitle(title);
      if (author) doc.setAuthor(author);
      if (subject) doc.setSubject(subject);
      if (keywords) doc.setKeywords([keywords]);
      if (creator) doc.setCreator(creator);
      const saved = await doc.save();
      const blob = new Blob([saved as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `meta_${file.name}`; a.click();
      URL.revokeObjectURL(url);
      toast.success("Metadata updated");
    } catch (e) { toast.error("Failed: " + (e as Error).message); }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <DropZone file={file} setFile={loadMeta} fileRef={fileRef} />
      <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)loadMeta(f);}} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[["Title",title,setTitle],["Author",author,setAuthor],["Subject",subject,setSubject],["Keywords",keywords,setKeywords],["Creator",creator,setCreator]].map(([label,val,set])=>(
          <div key={label as string}><label className="text-xs text-muted-foreground mb-1 block">{label as string}</label>
            <Input value={val as string} onChange={e=>(set as (v:string)=>void)(e.target.value)} className="text-sm" /></div>
        ))}
      </div>
      <Button onClick={process} disabled={!file || loading} className="w-full gap-2">
        <Download className="w-4 h-4" />{loading ? "Processing…" : "Save Metadata & Download"}
      </Button>
    </div>
  );
}

// ── PDF Page Reorder ──────────────────────────────────────────────────────────
function PdfPageReorder() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [order, setOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadPdf = async (f: File) => {
    setFile(f);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const buffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = doc.getPageCount();
      setPageCount(count);
      setOrder(Array.from({length:count},(_,i)=>i+1).join(", "));
    } catch { toast.error("Failed to read PDF"); }
  };

  const process = async () => {
    if (!file || !order.trim()) return;
    setLoading(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer);
      const newDoc = await PDFDocument.create();
      const indices = order.split(",").map(s => parseInt(s.trim()) - 1).filter(i => i >= 0 && i < srcDoc.getPageCount());
      const pages = await newDoc.copyPages(srcDoc, indices);
      pages.forEach(p => newDoc.addPage(p));
      const saved = await newDoc.save();
      const blob = new Blob([saved as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `reordered_${file.name}`; a.click();
      URL.revokeObjectURL(url);
      toast.success(`PDF saved with ${indices.length} pages`);
    } catch (e) { toast.error("Failed: " + (e as Error).message); }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <DropZone file={file} setFile={loadPdf} fileRef={fileRef} />
      <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)loadPdf(f);}} />
      {pageCount > 0 && (
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Page order (comma-separated, 1–{pageCount}). Duplicate or skip pages as needed.
          </label>
          <Input value={order} onChange={e=>setOrder(e.target.value)} className="font-mono text-sm" placeholder="1, 3, 2, 4…" />
          <p className="text-xs text-muted-foreground mt-1">Original: {pageCount} pages</p>
        </div>
      )}
      <Button onClick={process} disabled={!file || loading || !pageCount} className="w-full gap-2">
        <Download className="w-4 h-4" />{loading ? "Processing…" : "Reorder & Download"}
      </Button>
    </div>
  );
}

// ── PDF Size Analyzer ─────────────────────────────────────────────────────────
function PdfSizeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [info, setInfo] = useState<{pageCount:number;size:number;pagesSizes:string[]}|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const analyze = async (f: File) => {
    setFile(f);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const buffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = doc.getPages();
      const pageSizes = pages.map((p,i) => {
        const { width, height } = p.getSize();
        const wIn = (width / 72).toFixed(2); const hIn = (height / 72).toFixed(2);
        const wCm = (width * 0.0352778).toFixed(2); const hCm = (height * 0.0352778).toFixed(2);
        return `Page ${i+1}: ${width.toFixed(0)}×${height.toFixed(0)} pt | ${wIn}"×${hIn}" | ${wCm}×${hCm} cm`;
      });
      setInfo({ pageCount: pages.length, size: f.size, pagesSizes: pageSizes });
    } catch { toast.error("Failed to read PDF"); }
  };

  const fmt = (b: number) => b > 1048576 ? `${(b/1048576).toFixed(2)} MB` : `${(b/1024).toFixed(1)} KB`;

  return (
    <div className="space-y-4">
      <DropZone file={file} setFile={analyze} fileRef={fileRef} />
      <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)analyze(f);}} />
      {info && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl border border-border bg-muted/10">
              <p className="text-xs text-muted-foreground">File size</p>
              <p className="text-lg font-mono font-bold text-primary">{fmt(info.size)}</p>
            </div>
            <div className="p-3 rounded-xl border border-border bg-muted/10">
              <p className="text-xs text-muted-foreground">Pages</p>
              <p className="text-lg font-mono font-bold">{info.pageCount}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Page dimensions</p>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {info.pagesSizes.map((s,i)=>(
                <div key={i} className="px-3 py-2 rounded-xl border border-border bg-muted/10 text-xs font-mono">{s}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PDF to Text ───────────────────────────────────────────────────────────────
function PdfToText() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const extract = async (f: File) => {
    setFile(f); setLoading(true); setText("");
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
      const buffer = await f.arrayBuffer();
      const loadTask = pdfjs.getDocument({ data: buffer });
      const doc = await loadTask.promise;
      const pages: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => ("str" in item ? item.str : "")).join(" ");
        pages.push(`--- Page ${i} ---\n${pageText}`);
      }
      setText(pages.join("\n\n"));
      toast.success(`Extracted text from ${doc.numPages} pages`);
    } catch (e) { toast.error("Failed: " + (e as Error).message); }
    setLoading(false);
  };

  const copy = () => { navigator.clipboard.writeText(text); toast.success("Copied!"); };
  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${file?.name.replace(".pdf","")}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <DropZone file={file} setFile={extract} fileRef={fileRef} />
      <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)extract(f);}} />
      {loading && <div className="text-center py-4 text-sm text-muted-foreground animate-pulse">Extracting text…</div>}
      {text && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={copy} className="flex-1 gap-1">Copy Text</Button>
            <Button size="sm" onClick={download} className="flex-1 gap-1"><Download className="w-3 h-3" />Download .txt</Button>
          </div>
          <textarea readOnly value={text} className="w-full min-h-[300px] rounded-xl border border-border bg-muted/10 p-3 text-xs font-mono resize-none" />
        </div>
      )}
    </div>
  );
}

// ── Shared DropZone ───────────────────────────────────────────────────────────
function DropZone({ file, setFile, fileRef }: { file: File|null; setFile: (f:File)=>void; fileRef: React.RefObject<HTMLInputElement | null> }) {
  return (
    <div
      className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
      onClick={() => fileRef.current?.click()}
      onDragOver={e=>e.preventDefault()}
      onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)setFile(f);}}>
      {file
        ? <><FileText className="w-8 h-8 text-primary mx-auto mb-2" /><p className="text-sm font-medium">{file.name}</p><p className="text-xs text-muted-foreground">{(file.size/1024).toFixed(1)} KB — click to replace</p></>
        : <><Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" /><p className="text-sm font-medium">Drop PDF here or click to browse</p></>}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const TOOLS: Record<string,{title:string;component:React.ReactNode}> = {
  "pdf-page-number-adder": { title:"PDF Page Number Adder", component: <PdfPageNumberAdder /> },
  "pdf-metadata-editor": { title:"PDF Metadata Editor", component: <PdfMetadataEditor /> },
  "pdf-page-reorder": { title:"PDF Page Reorder", component: <PdfPageReorder /> },
  "pdf-size-analyzer": { title:"PDF Size Analyzer", component: <PdfSizeAnalyzer /> },
  "pdf-to-text": { title:"PDF to Text Extractor", component: <PdfToText /> },
};

export function PdfAdvancedTool() {
  const pathname = usePathname();
  const slug = pathname?.split("/").filter(Boolean).at(-1) ?? "pdf-page-number-adder";
  const tool = TOOLS[slug] ?? TOOLS["pdf-page-number-adder"];
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <FileText className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{tool.title}</span>
      </div>
      <div className="p-5">{tool.component}</div>
    </div>
  );
}
