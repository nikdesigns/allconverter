"use client";




import { useHandoff } from "@/lib/handoff";
import { escapeHtml, sanitizeHtml } from "@/lib/html";
import { localPdfWorkerUrl } from "@/lib/pdf-worker";
import { activateOnKey } from "@/lib/a11y";
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
  pdfjsLib.GlobalWorkerOptions.workerSrc = localPdfWorkerUrl();
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
  useHandoff(accept, false, (files) => onFile(files[0]));
  return (
    <div role="button" tabIndex={0} onKeyDown={activateOnKey} onClick={() => ref.current?.click()}
      onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      className={cn("border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
        drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/20")}>
      <input aria-label="Choose file" ref={ref} type="file" accept={accept} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
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
          <button aria-label="Remove" onClick={() => setFile(null)} className="text-muted-foreground hover:text-rose-400"><X className="w-3.5 h-3.5" /></button>
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
      setHtml(sanitizeHtml(result.value));
    } catch { setHtml(`<p style="font-family:sans-serif">${escapeHtml(f.name)}</p><p>Preview unavailable — click Print to PDF to save anyway.</p>`); }
    setLoading(false);
  };

  const printPdf = () => {
    const w = window.open("", "_blank")!;
    w.document.write(`<!DOCTYPE html><html><head><title>${escapeHtml(file?.name)}</title><style>body{font-family:Georgia,serif;line-height:1.6;max-width:800px;margin:40px auto;padding:0 20px}h1,h2,h3{color:#111}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:6px}</style></head><body>${html}</body></html>`);
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
          <div className="text-xs text-muted-foreground">In the print dialog, choose &quot;Save as PDF&quot; or &quot;Microsoft Print to PDF&quot; as the destination.</div>
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
          <button aria-label="Remove" onClick={() => setFile(null)} className="text-muted-foreground hover:text-rose-400"><X className="w-3.5 h-3.5" /></button>
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
      `<tr>${row.split(",").map(cell => `<td>${escapeHtml(cell.replace(/^"|"$/g, ""))}</td>`).join("")}</tr>`
    );
    setTable(`<table><thead>${rows[0]?.replace(/<td>/g, "<th>").replace(/<\/td>/g, "</th>")}</thead><tbody>${rows.slice(1).join("")}</tbody></table>`);
  };

  const printPdf = () => {
    const w = window.open("", "_blank")!;
    w.document.write(`<!DOCTYPE html><html><head><title>${escapeHtml(file?.name)}</title><style>body{font-family:Arial,sans-serif;font-size:12px;margin:20px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:5px 8px;text-align:left}th{background:#f5f5f5;font-weight:600}tr:nth-child(even){background:#fafafa}@media print{@page{margin:15mm}}</style></head><body>${table}</body></html>`);
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
          <button aria-label="Remove" onClick={() => setFile(null)} className="text-muted-foreground hover:text-rose-400"><X className="w-3.5 h-3.5" /></button>
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
  const [file, setFile]       = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError]     = useState("");
  const [result, setResult]   = useState<{ blob: Blob; slideCount: number; preview: string; skipped: number } | null>(null);

  const handleFile = async (f: File) => {
    setFile(f); setResult(null); setError(""); setLoading(true); setProgress("Reading presentation…");
    try {
      const { pptxToPdf } = await import("@/lib/pptx-to-pdf");
      setResult(await pptxToPdf(f, (done, total) => setProgress(`Rendering slide ${done} of ${total}…`)));
      toast.success("PDF ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not convert this presentation.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <DropZone onFile={handleFile} accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation" label="Drop a .pptx PowerPoint file here" />
      {loading && <div className="text-center py-4 text-muted-foreground text-sm" role="status">{progress}</div>}
      {error && <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-3 text-sm text-rose-500" role="alert">{error}</div>}
      {file && result && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={result.preview} alt="Preview of the first slide" className="w-full rounded-xl border border-border" />
          <div className="text-xs text-muted-foreground">
            {result.slideCount} slide{result.slideCount === 1 ? "" : "s"} · {(result.blob.size / 1024 / 1024).toFixed(2)} MB
            {result.skipped > 0 && ` · ${result.skipped} chart${result.skipped === 1 ? "" : "s"}, diagram${result.skipped === 1 ? "" : "s"} or unsupported image${result.skipped === 1 ? "" : "s"} left out`}
          </div>
          <Button onClick={() => downloadBlob(result.blob, file.name.replace(/\.[^.]+$/, "") + ".pdf")} className="w-full gap-2">
            <Download className="w-4 h-4" />Download PDF
          </Button>
        </>
      )}
      <div className="text-xs text-muted-foreground">
        Converts text, pictures, shapes and tables in your browser. Charts, SmartArt, gradients, theme fonts and animations are not reproduced; for a pixel-perfect PDF, export from PowerPoint or Google Slides.
      </div>
    </div>
  );
}

// ─── PDF Protector ────────────────────────────────────────────────────────────

function PdfProtector() {
  const [file, setFile]         = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [done, setDone]         = useState<{ blob: Blob; name: string } | null>(null);

  const mismatch = confirm.length > 0 && confirm !== password;
  const weak = password.length > 0 && password.length < 8;

  const protect = async () => {
    if (!file || !password || password !== confirm) return;
    setLoading(true); setError(""); setDone(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const probe = await PDFDocument.load(bytes, { ignoreEncryption: true });
      if (probe.isEncrypted) throw new Error("This PDF already has a password. Remove it first with the PDF Password Remover.");
      const { encryptPdf } = await import("@/lib/qpdf");
      const out = await encryptPdf(bytes, password);
      setDone({ blob: new Blob([new Uint8Array(out)], { type: "application/pdf" }), name: file.name.replace(/\.pdf$/i, "") + "-protected.pdf" });
      toast.success("PDF encrypted");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not protect this PDF."); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <DropZone onFile={(f) => { setFile(f); setDone(null); setError(""); }} accept="application/pdf,.pdf" label="Drop a PDF file here" />
      {file && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/10 border border-border">
          <Lock className="w-4 h-4 text-primary shrink-0" />
          <span className="flex-1 truncate text-xs">{file.name}</span>
          <button aria-label="Remove" onClick={() => { setFile(null); setDone(null); }} className="text-muted-foreground hover:text-rose-400"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="pp-pass" className="text-xs font-medium text-muted-foreground">Password</label>
          <Input id="pp-pass" type={show ? "text" : "password"} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" className="h-10 text-sm" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="pp-confirm" className="text-xs font-medium text-muted-foreground">Confirm password</label>
          <Input id="pp-confirm" type={show ? "text" : "password"} autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Type it again" className="h-10 text-sm" aria-invalid={mismatch} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input type="checkbox" checked={show} onChange={e => setShow(e.target.checked)} className="accent-primary" /> Show password
      </label>
      {mismatch && <p className="text-xs text-rose-500" role="alert">The two passwords do not match.</p>}
      {weak && !mismatch && <p className="text-xs text-amber-600 dark:text-amber-400">Short passwords can be guessed quickly. Use 12 or more characters for anything sensitive.</p>}
      {error && <div role="alert" className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-3 text-sm text-rose-500">{error}</div>}
      {!done && (
        <Button onClick={protect} disabled={!file || !password || mismatch || password !== confirm || loading} className="w-full gap-2">
          {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          <Lock className="w-4 h-4" /> {loading ? "Encrypting…" : "Encrypt PDF"}
        </Button>
      )}
      {done && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Encrypted with AES-256 · {(done.blob.size / 1024).toFixed(0)} KB</p>
          <Button onClick={() => downloadBlob(done.blob, done.name)} className="w-full gap-2"><Download className="w-4 h-4" />Download protected PDF</Button>
          <p className="text-xs text-muted-foreground">Keep the password somewhere safe. It cannot be recovered, by you or by us, if it is lost.</p>
        </div>
      )}
      <div className="text-xs text-muted-foreground">The whole file is encrypted with AES-256 using QPDF, running in your browser. The PDF and the password are never uploaded.</div>
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
      pdfjsLib.GlobalWorkerOptions.workerSrc = localPdfWorkerUrl();
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
          <button aria-label="Remove" onClick={() => { setFile(null); setText(""); }} className="text-muted-foreground hover:text-rose-400"><X className="w-3.5 h-3.5" /></button>
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
          <textarea aria-label="Extracted text" readOnly value={text} className="w-full min-h-[200px] rounded-xl border border-border bg-muted/5 px-4 py-3 text-xs font-mono resize-y focus:outline-none" />
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
          <button aria-label="Remove" onClick={() => setFile(null)} className="text-muted-foreground hover:text-rose-400"><X className="w-3.5 h-3.5" /></button>
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
            <input aria-label="Color" type="color" value={color} onChange={e => setColor(e.target.value)} className="h-10 w-16 rounded-xl border border-border bg-background cursor-pointer" />
            <span className="text-xs font-mono text-muted-foreground">{color}</span>
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Font size: {fontSize}pt</label>
          <input aria-label="Font size: pt" type="range" min={24} max={96} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full h-2 accent-primary" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Opacity: {Math.round(opacity * 100)}%</label>
          <input aria-label="Opacity: %" type="range" min={0.05} max={0.5} step={0.01} value={opacity} onChange={e => setOpacity(Number(e.target.value))} className="w-full h-2 accent-primary" />
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
