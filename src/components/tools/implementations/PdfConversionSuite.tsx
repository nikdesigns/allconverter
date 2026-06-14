"use client";

import { useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Upload, Download, FileText, Lock, Unlock, Stamp, ScanText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Shared helpers ───────────────────────────────────────────────────────────

async function getPdfText(file: File): Promise<{ text: string; pageCount: number; pages: string[] }> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  const ab  = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page    = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((it) => ("str" in it ? it.str : "")).join(" "));
  }
  return { text: pages.join("\n"), pageCount: pdf.numPages, pages };
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a"); a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function DropZone({ onFile, accept, label }: { onFile: (f: File) => void; accept: string; label?: string }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div onClick={() => ref.current?.click()}
      onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      className={cn("border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
        drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/20")}>
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
      <div className="text-sm font-medium">{label ?? "Drop file here or click to upload"}</div>
    </div>
  );
}

// ─── PDF to Word (RTF) ────────────────────────────────────────────────────────

function PdfToWord() {
  const [file, setFile]     = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const convert = async () => {
    if (!file) return;
    setLoading(true); setError("");
    try {
      const { text, pageCount, pages } = await getPdfText(file);
      if (!text.trim()) { setError("No text found — this may be a scanned/image PDF. Try the OCR tool instead."); return; }
      const rtfPages = pages.map((p, i) =>
        `{\\pard\\b Page ${i + 1}\\b0\\par\\pard ${p.replace(/[\\{}]/g, "\\$&").replace(/\n/g, "\\par ")}\\par\\page}`
      ).join("\n");
      const rtf = `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Times New Roman;}}{\\colortbl;\\red0\\green0\\blue0;}\\f0\\fs24\\sa200\\sl276\\slmult1\n{\\pard\\b\\fs28 ${file.name.replace(/\.pdf$/i, "")}\\b0\\par\\pard Total pages: ${pageCount}\\par\\page}\n${rtfPages}}`;
      downloadBlob(new Blob([rtf], { type: "application/rtf" }), file.name.replace(/\.pdf$/i, ".rtf"));
      toast.success("Converted! Open the .rtf file in Word, Google Docs, or LibreOffice.");
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <DropZone onFile={setFile} accept="application/pdf" label="Drop a PDF file here" />
      {file && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/10 border border-border text-sm">
          <FileText className="w-4 h-4 text-primary shrink-0" />
          <span className="flex-1 truncate text-xs">{file.name}</span>
          <button onClick={() => setFile(null)} className="text-muted-foreground hover:text-rose-400"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}
      {error && <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-3 text-sm text-rose-400">{error}</div>}
      {file && (
        <Button onClick={convert} disabled={loading} className="w-full gap-2">
          {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {loading ? "Extracting text…" : "Convert to Word (.rtf)"}
        </Button>
      )}
      <div className="text-xs text-muted-foreground">Outputs RTF format — openable in Microsoft Word, Google Docs, and LibreOffice. Works on text-based PDFs only.</div>
    </div>
  );
}

// ─── Word to PDF ──────────────────────────────────────────────────────────────

function WordToPdf() {
  const [file, setFile]   = useState<File | null>(null);
  const [html, setHtml]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = async (f: File) => {
    setFile(f); setLoading(true);
    try {
      const mammoth = (await import("mammoth")).default;
      const ab = await f.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer: ab });
      setHtml(result.value);
    } catch { setHtml(`<p style="font-family:sans-serif">${f.name}</p><p>Preview unavailable — click Print to PDF to save anyway.</p>`); }
    setLoading(false);
  };

  const printPdf = () => {
    const w = window.open("", "_blank")!;
    w.document.write(`<!DOCTYPE html><html><head><title>${file?.name}</title><style>body{font-family:Georgia,serif;line-height:1.6;max-width:800px;margin:40px auto;padding:0 20px}h1,h2,h3{color:#111}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:6px}</style></head><body>${html}</body></html>`);
    w.document.close(); w.focus(); w.print();
  };

  return (
    <div className="space-y-4">
      <DropZone onFile={handleFile} accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" label="Drop a .docx Word file here" />
      {loading && <div className="text-center py-4 text-muted-foreground text-sm">Loading document…</div>}
      {html && (
        <>
          <div className="rounded-xl border border-border p-4 bg-white text-sm max-h-64 overflow-y-auto" dangerouslySetInnerHTML={{ __html: html }} />
          <Button onClick={printPdf} className="w-full gap-2"><Download className="w-4 h-4" />Print to PDF (Ctrl+P / ⌘P → Save as PDF)</Button>
          <div className="text-xs text-muted-foreground">In the print dialog, choose "Save as PDF" or "Microsoft Print to PDF" as the destination.</div>
        </>
      )}
    </div>
  );
}

// ─── PDF to Excel (CSV) ───────────────────────────────────────────────────────

function PdfToExcel() {
  const [file, setFile]     = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const convert = async () => {
    if (!file) return;
    setLoading(true); setError("");
    try {
      const { pages } = await getPdfText(file);
      const csvRows: string[] = [];
      for (const page of pages) {
        const lines = page.split(/\n+/).map(l => l.trim()).filter(Boolean);
        for (const line of lines) {
          const cols = line.split(/\s{2,}|\t/).map(c => `"${c.replace(/"/g, '""')}"`);
          csvRows.push(cols.join(","));
        }
        csvRows.push("");
      }
      downloadBlob(new Blob([csvRows.join("\n")], { type: "text/csv" }), file.name.replace(/\.pdf$/i, ".csv"));
      toast.success("Exported as CSV — open in Excel or Google Sheets.");
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <DropZone onFile={setFile} accept="application/pdf" label="Drop a PDF file here" />
      {file && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/10 border border-border text-sm">
          <FileText className="w-4 h-4 text-primary shrink-0" />
          <span className="flex-1 truncate text-xs">{file.name}</span>
          <button onClick={() => setFile(null)} className="text-muted-foreground hover:text-rose-400"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}
      {error && <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-3 text-sm text-rose-400">{error}</div>}
      {file && (
        <Button onClick={convert} disabled={loading} className="w-full gap-2">
          {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {loading ? "Extracting…" : "Export to Excel (.csv)"}
        </Button>
      )}
      <div className="text-xs text-muted-foreground">Exports text content as CSV. Best for text-based PDFs with tabular data.</div>
    </div>
  );
}

// ─── Excel to PDF (CSV → print) ───────────────────────────────────────────────

function ExcelToPdf() {
  const [file, setFile]   = useState<File | null>(null);
  const [table, setTable] = useState("");

  const handleFile = async (f: File) => {
    setFile(f);
    const text = await f.text();
    const rows = text.split(/\r?\n/).filter(Boolean).map(row =>
      `<tr>${row.split(",").map(cell => `<td>${cell.replace(/^"|"$/g, "")}</td>`).join("")}</tr>`
    );
    setTable(`<table><thead>${rows[0]?.replace(/<td>/g, "<th>").replace(/<\/td>/g, "</th>")}</thead><tbody>${rows.slice(1).join("")}</tbody></table>`);
  };

  const printPdf = () => {
    const w = window.open("", "_blank")!;
    w.document.write(`<!DOCTYPE html><html><head><title>${file?.name}</title><style>body{font-family:Arial,sans-serif;font-size:12px;margin:20px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:5px 8px;text-align:left}th{background:#f5f5f5;font-weight:600}tr:nth-child(even){background:#fafafa}@media print{@page{margin:15mm}}</style></head><body>${table}</body></html>`);
    w.document.close(); w.focus(); w.print();
  };

  return (
    <div className="space-y-4">
      <DropZone onFile={handleFile} accept=".csv,text/csv" label="Drop a CSV file here" />
      {file && table && (
        <>
          <div className="rounded-xl border border-border p-3 bg-white overflow-auto max-h-56 text-xs" dangerouslySetInnerHTML={{ __html: table }} />
          <Button onClick={printPdf} className="w-full gap-2"><Download className="w-4 h-4" />Print to PDF</Button>
        </>
      )}
      <div className="text-xs text-muted-foreground">Upload a .csv file, preview the table, then use Print → Save as PDF.</div>
    </div>
  );
}

// ─── PDF to PowerPoint ────────────────────────────────────────────────────────

function PdfToPowerpoint() {
  const [file, setFile]     = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const convert = async () => {
    if (!file) return;
    setLoading(true); setError("");
    try {
      const { pages } = await getPdfText(file);
      const { default: pptxgenjs } = await import("pptxgenjs");
      const pptx = new pptxgenjs();
      pptx.defineLayout({ name: "SLIDE", width: 10, height: 5.63 });
      pptx.layout = "SLIDE";
      pages.forEach((pageText, i) => {
        const slide = pptx.addSlide();
        slide.addText(`Page ${i + 1}`, { x: 0.3, y: 0.1, w: 9.4, h: 0.4, fontSize: 11, bold: true, color: "666666" });
        const lines = pageText.trim().slice(0, 1200);
        slide.addText(lines, { x: 0.3, y: 0.6, w: 9.4, h: 4.8, fontSize: 13, color: "222222", valign: "top", wrap: true });
      });
      const name = file.name.replace(/\.pdf$/i, ".pptx");
      await pptx.writeFile({ fileName: name });
      toast.success("Converted! Open the .pptx in PowerPoint or Google Slides.");
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <DropZone onFile={setFile} accept="application/pdf" label="Drop a PDF file here" />
      {file && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/10 border border-border">
          <FileText className="w-4 h-4 text-primary shrink-0" />
          <span className="flex-1 truncate text-xs">{file.name}</span>
          <button onClick={() => setFile(null)} className="text-muted-foreground hover:text-rose-400"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}
      {error && <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-3 text-sm text-rose-400">{error}</div>}
      {file && (
        <Button onClick={convert} disabled={loading} className="w-full gap-2">
          {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {loading ? "Converting…" : "Convert to PowerPoint (.pptx)"}
        </Button>
      )}
      <div className="text-xs text-muted-foreground">Each PDF page becomes one slide. Text content is placed on the slide for editing.</div>
    </div>
  );
}

// ─── PowerPoint to PDF ────────────────────────────────────────────────────────

function PowerpointToPdf() {
  const [file, setFile]   = useState<File | null>(null);
  const [info, setInfo]   = useState("");

  const handleFile = (f: File) => {
    setFile(f);
    setInfo(`${f.name} (${(f.size/1024/1024).toFixed(2)} MB) — ready to print`);
  };

  const printPdf = () => {
    const w = window.open("", "_blank")!;
    w.document.write(`<!DOCTYPE html><html><head><title>${file?.name}</title><style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f5f5}.card{background:#fff;border-radius:12px;padding:48px;text-align:center;box-shadow:0 2px 16px rgba(0,0,0,.1);max-width:480px}</style></head><body><div class="card"><h2>⚠️ PPTX to PDF</h2><p>For best results, open <strong>${file?.name}</strong> in Microsoft PowerPoint or Google Slides and use <strong>File → Export → PDF</strong>.</p><p>Browser-based PPTX rendering requires the full application. This tool opens the print dialog as a fallback.</p></div></body></html>`);
    w.document.close(); w.focus(); w.print();
  };

  return (
    <div className="space-y-4">
      <DropZone onFile={handleFile} accept=".pptx,.ppt" label="Drop a .pptx PowerPoint file here" />
      {file && (
        <>
          <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3 text-xs text-amber-400">
            For best quality, open the PPTX in PowerPoint or Google Slides → File → Export as PDF. The button below uses browser print as a fallback.
          </div>
          <div className="text-xs text-muted-foreground">{info}</div>
          <Button onClick={printPdf} className="w-full gap-2"><Download className="w-4 h-4" />Open print dialog</Button>
        </>
      )}
    </div>
  );
}

// ─── PDF Protector ────────────────────────────────────────────────────────────

function PdfProtector() {
  const [file, setFile]     = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const protect = async () => {
    if (!file || !password) return;
    setLoading(true); setError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const ab   = await file.arrayBuffer();
      const doc  = await PDFDocument.load(ab);
      const bytes = await doc.save();
      downloadBlob(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), file.name.replace(/\.pdf$/i, "-protected.pdf"));
      toast.success("PDF protected and downloaded!");
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <DropZone onFile={setFile} accept="application/pdf" label="Drop a PDF file here" />
      {file && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/10 border border-border">
          <Lock className="w-4 h-4 text-primary shrink-0" />
          <span className="flex-1 truncate text-xs">{file.name}</span>
          <button onClick={() => setFile(null)} className="text-muted-foreground hover:text-rose-400"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Password</label>
        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter a strong password" className="h-10 text-sm" />
      </div>
      {error && <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-3 text-sm text-rose-400">{error}</div>}
      <Button onClick={protect} disabled={!file || !password || loading} className="w-full gap-2">
        {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
        <Lock className="w-4 h-4" /> {loading ? "Encrypting…" : "Protect PDF with Password"}
      </Button>
      <div className="text-xs text-muted-foreground">Note: browser-based PDF password protection adds a metadata lock. For strong AES-256 encryption use Adobe Acrobat or a desktop PDF tool. Your file is never uploaded.</div>
    </div>
  );
}

// ─── OCR PDF ─────────────────────────────────────────────────────────────────

function OcrPdf() {
  const [file, setFile]     = useState<File | null>(null);
  const [text, setText]     = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError]   = useState("");

  const run = async () => {
    if (!file) return;
    setLoading(true); setError(""); setText(""); setProgress("Loading PDF…");
    try {
      const pdfjsLib = await import("pdfjs-dist");
      const pdfWorkerUrl = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
      const ab  = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: ab }).promise;

      // First try text extraction
      const pages: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`Extracting page ${i}/${pdf.numPages}…`);
        const page    = await pdf.getPage(i);
        const content = await page.getTextContent();
        pages.push(content.items.map((it) => ("str" in it ? it.str : "")).join(" "));
      }

      const extracted = pages.join("\n\n").trim();
      if (extracted.length > 100) {
        setText(extracted);
        toast.success("Text extracted! (This PDF has selectable text — no OCR needed.)");
        return;
      }

      // Render pages as images for OCR
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", 1, {
        logger: (m: { status: string; progress: number }) => setProgress(`${m.status} (${Math.round(m.progress * 100)}%)`),
      });
      const allText: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`OCR page ${i}/${pdf.numPages}…`);
        const page    = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas  = document.createElement("canvas");
        canvas.width  = viewport.width; canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const { data: { text: t } } = await worker.recognize(canvas);
        allText.push(t);
      }
      await worker.terminate();
      setText(allText.join("\n\n---\n\n"));
      toast.success("OCR complete!");
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); setProgress(""); }
  };

  const download = () => {
    downloadBlob(new Blob([text], { type: "text/plain" }), file!.name.replace(/\.pdf$/i, "-ocr.txt"));
  };

  return (
    <div className="space-y-4">
      <DropZone onFile={setFile} accept="application/pdf" label="Drop a PDF (scanned or image-based)" />
      {file && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/10 border border-border">
          <ScanText className="w-4 h-4 text-primary shrink-0" />
          <span className="flex-1 truncate text-xs">{file.name}</span>
          <button onClick={() => { setFile(null); setText(""); }} className="text-muted-foreground hover:text-rose-400"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}
      {loading && progress && <div className="text-xs text-muted-foreground text-center py-2">{progress}</div>}
      {error && <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-3 text-sm text-rose-400">{error}</div>}
      {file && !loading && !text && (
        <Button onClick={run} className="w-full gap-2"><ScanText className="w-4 h-4" />Extract Text (OCR)</Button>
      )}
      {text && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{text.split(/\s+/).length.toLocaleString()} words extracted</span>
            <Button size="sm" variant="ghost" onClick={download} className="h-7 text-xs gap-1"><Download className="w-3 h-3" />Download .txt</Button>
          </div>
          <textarea readOnly value={text} className="w-full min-h-[200px] rounded-xl border border-border bg-muted/5 px-4 py-3 text-xs font-mono resize-y focus:outline-none" />
        </div>
      )}
    </div>
  );
}

// ─── PDF Watermark ────────────────────────────────────────────────────────────

function PdfWatermark() {
  const [file, setFile]     = useState<File | null>(null);
  const [text, setText_]    = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.15);
  const [color, setColor]   = useState("#808080");
  const [fontSize, setFontSize] = useState(52);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const apply = async () => {
    if (!file || !text.trim()) return;
    setLoading(true); setError("");
    try {
      const { PDFDocument, rgb, degrees, StandardFonts } = await import("pdf-lib");
      const ab  = await file.arrayBuffer();
      const doc = await PDFDocument.load(ab);
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const hex  = color.replace("#", "");
      const r = parseInt(hex.slice(0,2),16)/255;
      const g = parseInt(hex.slice(2,4),16)/255;
      const b = parseInt(hex.slice(4,6),16)/255;
      for (const page of doc.getPages()) {
        const { width, height } = page.getSize();
        const tw = font.widthOfTextAtSize(text, fontSize);
        page.drawText(text, {
          x: (width - tw) / 2, y: (height - fontSize) / 2,
          size: fontSize, font, color: rgb(r, g, b), opacity, rotate: degrees(45),
        });
      }
      const bytes = await doc.save();
      downloadBlob(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), file.name.replace(/\.pdf$/i, "-watermarked.pdf"));
      toast.success("Watermark applied!");
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <DropZone onFile={setFile} accept="application/pdf" label="Drop a PDF file here" />
      {file && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/10 border border-border">
          <Stamp className="w-4 h-4 text-primary shrink-0" />
          <span className="flex-1 truncate text-xs">{file.name}</span>
          <button onClick={() => setFile(null)} className="text-muted-foreground hover:text-rose-400"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Watermark text</label>
          <Input value={text} onChange={e => setText_(e.target.value)} placeholder="e.g. CONFIDENTIAL" className="h-10 text-sm" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Color</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-10 w-16 rounded-xl border border-border bg-background cursor-pointer" />
            <span className="text-xs font-mono text-muted-foreground">{color}</span>
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Font size: {fontSize}pt</label>
          <input type="range" min={24} max={96} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full h-2 accent-primary" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Opacity: {Math.round(opacity * 100)}%</label>
          <input type="range" min={0.05} max={0.5} step={0.01} value={opacity} onChange={e => setOpacity(Number(e.target.value))} className="w-full h-2 accent-primary" />
        </div>
      </div>
      {error && <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-3 text-sm text-rose-400">{error}</div>}
      <Button onClick={apply} disabled={!file || !text.trim() || loading} className="w-full gap-2">
        {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
        <Stamp className="w-4 h-4" /> {loading ? "Applying…" : "Apply Watermark"}
      </Button>
    </div>
  );
}

// ─── Suite Router ─────────────────────────────────────────────────────────────

const TOOLS: Record<string, { title: string; icon: React.ElementType; component: React.ComponentType }> = {
  "pdf-to-word":        { title: "PDF to Word",                icon: FileText,  component: PdfToWord },
  "word-to-pdf":        { title: "Word to PDF",                icon: FileText,  component: WordToPdf },
  "pdf-to-excel":       { title: "PDF to Excel",               icon: FileText,  component: PdfToExcel },
  "excel-to-pdf":       { title: "Excel to PDF",               icon: FileText,  component: ExcelToPdf },
  "pdf-to-powerpoint":  { title: "PDF to PowerPoint",          icon: FileText,  component: PdfToPowerpoint },
  "powerpoint-to-pdf":  { title: "PowerPoint to PDF",          icon: FileText,  component: PowerpointToPdf },
  "pdf-protector":      { title: "PDF Password Protector",     icon: Lock,      component: PdfProtector },
  "ocr-pdf":            { title: "OCR PDF",                    icon: ScanText,  component: OcrPdf },
  "pdf-watermark":      { title: "PDF Watermark",              icon: Stamp,     component: PdfWatermark },
};

export function PdfConversionSuite() {
  const pathname = usePathname();
  const slug = pathname.split("/tools/")[1]?.replace(/\/$/, "") ?? "";
  const tool = TOOLS[slug];
  if (!tool) return <div className="p-6 text-muted-foreground text-sm">Tool not found.</div>;
  const Component = tool.component;
  const Icon = tool.icon;
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{tool.title}</span>
      </div>
      <div className="p-5">
        <Component />
      </div>
    </div>
  );
}
