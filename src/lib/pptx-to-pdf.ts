/**
 * Basic PowerPoint (.pptx) to PDF conversion that runs in the browser.
 *
 * Each slide is drawn on a canvas (background, pictures, filled shapes, text
 * boxes and simple tables, using the positions stored in the file) and the
 * canvas is placed on a PDF page of the same size. Canvas text rendering means
 * every script the device has fonts for works, including Indic and CJK text.
 *
 * It is intentionally a simplified renderer: charts, SmartArt, gradients,
 * shadows, animations and theme fonts are not reproduced.
 */

const EMU_PER_INCH = 914400;
const EMU_PER_POINT = 12700;
const DPI = 144;
const PX = DPI / EMU_PER_INCH; // pixels per EMU
const PT_TO_PX = DPI / 72;

export interface PptxToPdfResult {
  blob: Blob;
  slideCount: number;
  /** JPEG data URL of the first slide, for an on-page preview. */
  preview: string;
  /** Charts, diagrams and other objects that could not be drawn. */
  skipped: number;
}

interface Rel { target: string; type: string }
interface Box { x: number; y: number; w: number; h: number; rot: number }
interface Transform { sx: number; sy: number; dx: number; dy: number }
type Zip = import("jszip");

interface Part {
  path: string;
  doc: Document;
  rels: Map<string, Rel>;
}

interface Deck {
  zip: Zip;
  theme: Map<string, string>;
  /** The master's mapping of logical colours (tx1, bg1 ...) to theme slots. */
  clrMap: Map<string, string>;
  parts: Map<string, Part | null>;
  images: Map<string, ImageBitmap | null>;
  skipped: number;
}

// ─── XML helpers (namespace-agnostic) ─────────────────────────────────────────

const children = (el: Element | null | undefined, name?: string): Element[] =>
  el ? Array.from(el.children).filter((c) => !name || c.localName === name) : [];

const child = (el: Element | null | undefined, name: string): Element | null =>
  children(el, name)[0] ?? null;

const path = (el: Element | null | undefined, ...names: string[]): Element | null => {
  let cur: Element | null = el ?? null;
  for (const n of names) cur = child(cur, n);
  return cur;
};

const num = (el: Element | null, attr: string, fallback = 0): number => {
  const v = el?.getAttribute(attr);
  const n = v == null ? NaN : Number(v);
  return Number.isFinite(n) ? n : fallback;
};

function resolvePath(from: string, target: string): string {
  if (target.startsWith("/")) return target.slice(1);
  const parts = from.split("/").slice(0, -1);
  for (const seg of target.split("/")) {
    if (seg === "..") parts.pop();
    else if (seg !== ".") parts.push(seg);
  }
  return parts.join("/");
}

async function loadPart(deck: Deck, partPath: string): Promise<Part | null> {
  if (deck.parts.has(partPath)) return deck.parts.get(partPath) ?? null;
  const file = deck.zip.file(partPath);
  if (!file) { deck.parts.set(partPath, null); return null; }
  const doc = new DOMParser().parseFromString(await file.async("string"), "application/xml");
  const rels = new Map<string, Rel>();
  const segs = partPath.split("/");
  const relsFile = deck.zip.file([...segs.slice(0, -1), "_rels", `${segs[segs.length - 1]}.rels`].join("/"));
  if (relsFile) {
    const relDoc = new DOMParser().parseFromString(await relsFile.async("string"), "application/xml");
    for (const r of Array.from(relDoc.getElementsByTagNameNS("*", "Relationship"))) {
      if (r.getAttribute("TargetMode") === "External") continue;
      rels.set(r.getAttribute("Id") ?? "", {
        target: resolvePath(partPath, r.getAttribute("Target") ?? ""),
        type: r.getAttribute("Type") ?? "",
      });
    }
  }
  const part: Part = { path: partPath, doc, rels };
  deck.parts.set(partPath, part);
  return part;
}

const relOfType = (part: Part | null, suffix: string): string | null => {
  if (!part) return null;
  for (const r of part.rels.values()) if (r.type.endsWith(suffix)) return r.target;
  return null;
};

// ─── Colours ─────────────────────────────────────────────────────────────────

const CLR_MAP: Record<string, string> = { bg1: "lt1", tx1: "dk1", bg2: "lt2", tx2: "dk2" };

function schemeColor(deck: Deck, key: string): string | null {
  const hex = deck.theme.get(deck.clrMap.get(key) ?? CLR_MAP[key] ?? key);
  return hex ? `#${hex}` : null;
}

/** Resolve a fill container (solidFill and friends) to a CSS colour. */
function colorOf(deck: Deck, el: Element | null): string | null {
  if (!el) return null;
  const srgb = child(el, "srgbClr");
  if (srgb) return `#${srgb.getAttribute("val") ?? "000000"}`;
  const sys = child(el, "sysClr");
  if (sys) return `#${sys.getAttribute("lastClr") ?? "000000"}`;
  const scheme = child(el, "schemeClr");
  if (scheme) {
    const key = scheme.getAttribute("val") ?? "";
    return schemeColor(deck, key);
  }
  return null;
}

async function loadTheme(deck: Deck, master: Part | null) {
  const map = master?.doc.getElementsByTagNameNS("*", "clrMap")[0];
  for (const attr of Array.from(map?.attributes ?? [])) deck.clrMap.set(attr.name, attr.value);
  const themePath = relOfType(master, "/theme");
  const theme = themePath ? await loadPart(deck, themePath) : null;
  const scheme = theme?.doc.getElementsByTagNameNS("*", "clrScheme")[0];
  for (const entry of children(scheme)) {
    const srgb = child(entry, "srgbClr");
    const sys = child(entry, "sysClr");
    const hex = srgb?.getAttribute("val") ?? sys?.getAttribute("lastClr");
    if (hex) deck.theme.set(entry.localName, hex);
  }
}

// ─── Geometry ────────────────────────────────────────────────────────────────

const IDENTITY: Transform = { sx: 1, sy: 1, dx: 0, dy: 0 };

function boxOf(xfrm: Element | null, t: Transform): Box | null {
  const off = child(xfrm, "off");
  const ext = child(xfrm, "ext");
  if (!off || !ext) return null;
  return {
    x: (num(off, "x") * t.sx + t.dx) * PX,
    y: (num(off, "y") * t.sy + t.dy) * PX,
    w: num(ext, "cx") * t.sx * PX,
    h: num(ext, "cy") * t.sy * PX,
    rot: (num(xfrm, "rot") / 60000) * (Math.PI / 180),
  };
}

function groupTransform(grpSpPr: Element | null, outer: Transform): Transform {
  const xfrm = child(grpSpPr, "xfrm");
  const off = child(xfrm, "off"), ext = child(xfrm, "ext");
  const chOff = child(xfrm, "chOff"), chExt = child(xfrm, "chExt");
  if (!off || !ext || !chOff || !chExt) return outer;
  const sx = num(chExt, "cx") ? num(ext, "cx") / num(chExt, "cx") : 1;
  const sy = num(chExt, "cy") ? num(ext, "cy") / num(chExt, "cy") : 1;
  // child -> group -> outer
  return {
    sx: sx * outer.sx,
    sy: sy * outer.sy,
    dx: (num(off, "x") - num(chOff, "x") * sx) * outer.sx + outer.dx,
    dy: (num(off, "y") - num(chOff, "y") * sy) * outer.sy + outer.dy,
  };
}

function withRotation(ctx: CanvasRenderingContext2D, box: Box, draw: () => void) {
  if (!box.rot) { draw(); return; }
  ctx.save();
  ctx.translate(box.x + box.w / 2, box.y + box.h / 2);
  ctx.rotate(box.rot);
  ctx.translate(-(box.x + box.w / 2), -(box.y + box.h / 2));
  draw();
  ctx.restore();
}

// ─── Placeholders ────────────────────────────────────────────────────────────

const placeholderOf = (sp: Element): Element | null => {
  const nv = child(sp, "nvSpPr") ?? child(sp, "nvPicPr") ?? child(sp, "nvGraphicFramePr");
  return path(nv, "nvPr", "ph");
};

const sameKind = (a: string, b: string) => {
  const norm = (t: string) => (t === "ctrTitle" ? "title" : t === "subTitle" || t === "" ? "body" : t);
  return norm(a) === norm(b);
};

/** Find the matching placeholder shape on a layout or master. */
function findPlaceholder(part: Part | null, ph: Element): Element | null {
  if (!part) return null;
  const idx = ph.getAttribute("idx");
  const type = ph.getAttribute("type") ?? "";
  const shapes = Array.from(part.doc.getElementsByTagNameNS("*", "sp"));
  let byType: Element | null = null;
  for (const sp of shapes) {
    const other = placeholderOf(sp);
    if (!other) continue;
    if (idx != null && other.getAttribute("idx") === idx) return sp;
    if (!byType && sameKind(other.getAttribute("type") ?? "", type)) byType = sp;
  }
  return byType;
}

// ─── Text ────────────────────────────────────────────────────────────────────

interface Run { text: string; size: number; bold: boolean; italic: boolean; color: string; font: string }
interface Para { runs: Run[]; align: string; bullet: string; indent: number }
interface Line { runs: { run: Run; text: string; width: number }[]; width: number; height: number; para: Para; first: boolean }

const fontOf = (r: Run, scale: number) =>
  `${r.italic ? "italic " : ""}${r.bold ? "bold " : ""}${Math.max(6, r.size * scale * PT_TO_PX)}px ${r.font}`;

function defaultSize(kind: string): number {
  if (kind === "ctrTitle") return 54;
  if (kind === "title") return 40;
  if (kind === "subTitle") return 24;
  if (kind === "body") return 24;
  return 18;
}

function readParagraphs(deck: Deck, txBody: Element, kind: string, inherited: Element | null, cellSize?: number): Para[] {
  const base = cellSize ?? defaultSize(kind);
  const isBody = kind === "body";
  const textColor = schemeColor(deck, "tx1") ?? "#000000";
  const inheritedAlign = path(inherited, "txBody", "lstStyle", "lvl1pPr")?.getAttribute("algn");
  const paras: Para[] = [];

  for (const p of children(txBody, "p")) {
    const pPr = child(p, "pPr");
    const level = num(pPr, "lvl");
    const levelSize = isBody ? Math.max(12, base - level * 4) : base;
    const endSize = num(child(p, "endParaRPr"), "sz") / 100;
    const runs: Run[] = [];

    for (const node of children(p)) {
      if (node.localName === "br") { runs.push({ text: "\n", size: levelSize, bold: false, italic: false, color: textColor, font: "Helvetica, Arial, sans-serif" }); continue; }
      if (node.localName !== "r" && node.localName !== "fld") continue;
      const rPr = child(node, "rPr");
      const text = child(node, "t")?.textContent ?? "";
      if (!text) continue;
      const face = child(rPr, "latin")?.getAttribute("typeface");
      runs.push({
        text,
        size: num(rPr, "sz") / 100 || levelSize,
        bold: rPr?.getAttribute("b") === "1",
        italic: rPr?.getAttribute("i") === "1",
        color: colorOf(deck, child(rPr, "solidFill")) ?? textColor,
        font: face && !face.startsWith("+") ? `"${face.replace(/"/g, "")}", Helvetica, Arial, sans-serif` : "Helvetica, Arial, sans-serif",
      });
    }

    const hasText = runs.some((r) => r.text.trim());
    const explicitBullet = child(pPr, "buChar")?.getAttribute("char") ?? (child(pPr, "buAutoNum") ? "•" : null);
    const bullet = !hasText || child(pPr, "buNone") ? "" : explicitBullet ?? (isBody ? "•" : "");
    if (!runs.length) runs.push({ text: "", size: endSize || levelSize, bold: false, italic: false, color: textColor, font: "Helvetica, Arial, sans-serif" });

    paras.push({
      runs,
      align: pPr?.getAttribute("algn") ?? inheritedAlign ?? (kind === "ctrTitle" || kind === "subTitle" ? "ctr" : "l"),
      bullet,
      indent: level,
    });
  }
  return paras;
}

function layoutLines(ctx: CanvasRenderingContext2D, paras: Para[], maxWidth: number, scale: number): Line[] {
  const lines: Line[] = [];
  for (const para of paras) {
    const first = para.runs[0];
    const indentPx = (para.indent * 0.4 + (para.bullet ? 0.35 : 0)) * DPI * scale;
    const width = Math.max(40, maxWidth - indentPx);
    let line: Line = { runs: [], width: 0, height: first.size * scale * PT_TO_PX * 1.2, para, first: true };
    const push = () => { lines.push(line); line = { runs: [], width: 0, height: first.size * scale * PT_TO_PX * 1.2, para, first: false }; };

    for (const run of para.runs) {
      if (run.text === "\n") { push(); continue; }
      ctx.font = fontOf(run, scale);
      const lineHeight = run.size * scale * PT_TO_PX * 1.2;
      // Split into words but keep the spaces so widths add up.
      for (const token of run.text.split(/(\s+)/)) {
        if (!token) continue;
        let piece = token;
        let w = ctx.measureText(piece).width;
        if (line.width + w > width && line.runs.length && piece.trim()) push();
        // A single word wider than the box (long URLs, scripts without spaces): break by character.
        while (w > width && piece.length > 1) {
          let cut = piece.length - 1;
          while (cut > 1 && ctx.measureText(piece.slice(0, cut)).width > width - line.width) cut--;
          const head = piece.slice(0, cut);
          line.runs.push({ run, text: head, width: ctx.measureText(head).width });
          line.height = Math.max(line.height, lineHeight);
          push();
          piece = piece.slice(cut);
          w = ctx.measureText(piece).width;
        }
        if (!line.runs.length && !piece.trim()) continue; // no leading spaces on a wrapped line
        line.runs.push({ run, text: piece, width: w });
        line.width += w;
        line.height = Math.max(line.height, lineHeight);
      }
    }
    lines.push(line);
  }
  return lines;
}

function drawText(
  deck: Deck, ctx: CanvasRenderingContext2D, txBody: Element, box: Box, kind: string,
  inherited: Element | null, cellSize?: number,
) {
  const paras = readParagraphs(deck, txBody, kind, inherited, cellSize);
  if (!paras.some((p) => p.runs.some((r) => r.text.trim()))) return;

  const bodyPr = child(txBody, "bodyPr");
  const inheritedBodyPr = path(inherited, "txBody", "bodyPr");
  const inset = (attr: string, fallback: number) =>
    (bodyPr?.hasAttribute(attr) ? num(bodyPr, attr) : inheritedBodyPr?.hasAttribute(attr) ? num(inheritedBodyPr, attr) : fallback) * PX;
  const padL = inset("lIns", 91440), padR = inset("rIns", 91440), padT = inset("tIns", 45720), padB = inset("bIns", 45720);
  const anchor = bodyPr?.getAttribute("anchor") ?? inheritedBodyPr?.getAttribute("anchor") ?? (kind === "title" || kind === "ctrTitle" ? "ctr" : "t");
  const innerW = Math.max(40, box.w - padL - padR);
  const innerH = Math.max(10, box.h - padT - padB);

  // Honour PowerPoint's own shrink factor, then shrink further if text still overflows.
  let scale = num(child(bodyPr, "normAutofit"), "fontScale", 100000) / 100000;
  let lines = layoutLines(ctx, paras, innerW, scale);
  let total = lines.reduce((a, l) => a + l.height, 0);
  for (let i = 0; i < 8 && total > innerH && scale > 0.45; i++) {
    scale *= 0.9;
    lines = layoutLines(ctx, paras, innerW, scale);
    total = lines.reduce((a, l) => a + l.height, 0);
  }

  let y = box.y + padT + (anchor === "ctr" ? Math.max(0, (innerH - total) / 2) : anchor === "b" ? Math.max(0, innerH - total) : 0);
  ctx.textBaseline = "alphabetic";
  for (const line of lines) {
    const para = line.para;
    const size = para.runs[0].size * scale * PT_TO_PX;
    const indentPx = (para.indent * 0.4 + (para.bullet ? 0.35 : 0)) * DPI * scale;
    const free = innerW - indentPx - line.width;
    let x = box.x + padL + indentPx + (para.align === "ctr" ? free / 2 : para.align === "r" ? free : 0);
    const baseline = y + line.height * 0.8;
    if (para.bullet && line.first) {
      ctx.font = `${size}px Helvetica, Arial, sans-serif`;
      ctx.fillStyle = para.runs[0].color;
      ctx.fillText(para.bullet, x - 0.3 * DPI * scale, baseline);
    }
    for (const seg of line.runs) {
      ctx.font = fontOf(seg.run, scale);
      ctx.fillStyle = seg.run.color;
      ctx.fillText(seg.text, x, baseline);
      x += seg.width;
    }
    y += line.height;
  }
}

// ─── Pictures ────────────────────────────────────────────────────────────────

async function imageFor(deck: Deck, part: Part, blip: Element | null): Promise<ImageBitmap | null> {
  const id = blip?.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "embed") ?? blip?.getAttribute("r:embed");
  const target = id ? part.rels.get(id)?.target : undefined;
  if (!target) return null;
  if (deck.images.has(target)) return deck.images.get(target) ?? null;
  let bitmap: ImageBitmap | null = null;
  const file = deck.zip.file(target);
  const ext = target.split(".").pop()?.toLowerCase() ?? "";
  const mime: Record<string, string> = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", bmp: "image/bmp", webp: "image/webp", svg: "image/svg+xml" };
  if (file && mime[ext]) {
    try {
      bitmap = await createImageBitmap(new Blob([await file.async("arraybuffer")], { type: mime[ext] }));
    } catch { bitmap = null; }
  }
  if (!bitmap) deck.skipped++; // EMF/WMF and other formats browsers cannot decode
  deck.images.set(target, bitmap);
  return bitmap;
}

// ─── Shape tree ──────────────────────────────────────────────────────────────

interface TreeOptions { part: Part; layout: Part | null; master: Part | null; placeholders: boolean }

async function drawTree(deck: Deck, ctx: CanvasRenderingContext2D, tree: Element | null, t: Transform, o: TreeOptions) {
  for (const node of children(tree)) {
    const ph = placeholderOf(node);
    // On layouts and masters, placeholders are just prompts ("Click to add title"): skip them.
    if (ph && !o.placeholders) continue;

    if (node.localName === "grpSp") {
      await drawTree(deck, ctx, node, groupTransform(child(node, "grpSpPr"), t), o);
      continue;
    }

    if (node.localName === "pic") {
      const box = boxOf(path(node, "spPr", "xfrm"), t);
      const bitmap = await imageFor(deck, o.part, path(node, "blipFill", "blip"));
      if (box && bitmap) withRotation(ctx, box, () => ctx.drawImage(bitmap, box.x, box.y, box.w, box.h));
      continue;
    }

    if (node.localName === "sp" || node.localName === "cxnSp") {
      const spPr = child(node, "spPr");
      const fromLayout = ph ? findPlaceholder(o.layout, ph) : null;
      const fromMaster = ph ? findPlaceholder(o.master, ph) : null;
      const box =
        boxOf(child(spPr, "xfrm"), t) ??
        boxOf(path(fromLayout, "spPr", "xfrm"), IDENTITY) ??
        boxOf(path(fromMaster, "spPr", "xfrm"), IDENTITY);
      if (!box) continue;
      const kind = ph ? (ph.getAttribute("type") ?? "body") : "";
      const normalizedKind = kind === "" ? "" : ["title", "ctrTitle", "subTitle"].includes(kind) ? kind : ["dt", "ftr", "sldNum"].includes(kind) ? "other" : "body";

      withRotation(ctx, box, () => {
        const fill = child(spPr, "noFill") ? null : colorOf(deck, child(spPr, "solidFill"));
        const stroke = colorOf(deck, path(spPr, "ln", "solidFill"));
        const shape = child(spPr, "prstGeom")?.getAttribute("prst") ?? "rect";
        if (fill || stroke) {
          ctx.beginPath();
          if (shape === "ellipse") ctx.ellipse(box.x + box.w / 2, box.y + box.h / 2, box.w / 2, box.h / 2, 0, 0, Math.PI * 2);
          else if (shape === "line" || node.localName === "cxnSp") { ctx.moveTo(box.x, box.y); ctx.lineTo(box.x + box.w, box.y + box.h); }
          else if (shape === "roundRect") ctx.roundRect(box.x, box.y, box.w, box.h, Math.min(box.w, box.h) * 0.12);
          else ctx.rect(box.x, box.y, box.w, box.h);
          if (fill && shape !== "line") { ctx.fillStyle = fill; ctx.fill(); }
          if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = Math.max(1, num(child(spPr, "ln"), "w", 9525) * PX);
            ctx.stroke();
          }
        }
        const txBody = child(node, "txBody");
        if (txBody) drawText(deck, ctx, txBody, box, normalizedKind, fromLayout ?? fromMaster);
      });
      continue;
    }

    if (node.localName === "graphicFrame") {
      const box = boxOf(child(node, "xfrm"), t);
      const tbl = node.getElementsByTagNameNS("*", "tbl")[0];
      if (!box || !tbl) { deck.skipped++; continue; } // chart, SmartArt, embedded object
      const cols = children(child(tbl, "tblGrid"), "gridCol").map((c) => num(c, "w") * t.sx * PX);
      let y = box.y;
      for (const tr of children(tbl, "tr")) {
        const h = num(tr, "h") * t.sy * PX;
        let x = box.x;
        children(tr, "tc").forEach((tc, i) => {
          const w = cols[i] ?? 0;
          const cell: Box = { x, y, w, h, rot: 0 };
          const fill = colorOf(deck, path(tc, "tcPr", "solidFill"));
          if (fill) { ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); }
          ctx.strokeStyle = "#BFBFBF"; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
          const txBody = child(tc, "txBody");
          if (txBody && w > 0) drawText(deck, ctx, txBody, cell, "", null, 14);
          x += w;
        });
        y += h;
      }
    }
  }
}

async function drawBackground(deck: Deck, ctx: CanvasRenderingContext2D, parts: (Part | null)[], w: number, h: number) {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, w, h);
  for (const part of parts) {
    const bg = part?.doc.getElementsByTagNameNS("*", "bg")[0];
    if (!part || !bg) continue;
    const bgPr = child(bg, "bgPr");
    const bitmap = await imageFor(deck, part, path(bgPr, "blipFill", "blip"));
    if (bitmap) { ctx.drawImage(bitmap, 0, 0, w, h); return; }
    const color = colorOf(deck, child(bgPr, "solidFill")) ?? colorOf(deck, child(bg, "bgRef"));
    if (color) { ctx.fillStyle = color; ctx.fillRect(0, 0, w, h); return; }
  }
}

// ─── Entry point ─────────────────────────────────────────────────────────────

export async function pptxToPdf(
  file: File,
  onProgress?: (done: number, total: number) => void,
): Promise<PptxToPdfResult> {
  const [{ default: JSZip }, { PDFDocument }] = await Promise.all([import("jszip"), import("pdf-lib")]);

  let zip: Zip;
  try {
    zip = await JSZip.loadAsync(await file.arrayBuffer());
  } catch {
    throw new Error("This file could not be opened. Older .ppt files are not supported: save the presentation as .pptx first.");
  }
  const deck: Deck = { zip, theme: new Map(), clrMap: new Map(), parts: new Map(), images: new Map(), skipped: 0 };

  const presentation = await loadPart(deck, "ppt/presentation.xml");
  if (!presentation) throw new Error("This does not look like a PowerPoint .pptx file.");
  const size = presentation.doc.getElementsByTagNameNS("*", "sldSz")[0] ?? null;
  const widthEmu = num(size, "cx", 12192000);
  const heightEmu = num(size, "cy", 6858000);
  const R_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
  const slidePaths = Array.from(presentation.doc.getElementsByTagNameNS("*", "sldId"))
    .map((s) => presentation.rels.get(s.getAttributeNS(R_NS, "id") ?? s.getAttribute("r:id") ?? "")?.target)
    .filter((p): p is string => !!p);
  if (!slidePaths.length) throw new Error("No slides were found in this presentation.");

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(widthEmu * PX);
  canvas.height = Math.round(heightEmu * PX);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not create a drawing surface.");

  const pdf = await PDFDocument.create();
  pdf.setTitle(file.name.replace(/\.[^.]+$/, ""));
  let preview = "";

  for (let i = 0; i < slidePaths.length; i++) {
    const slide = await loadPart(deck, slidePaths[i]);
    if (!slide) continue;
    const layoutPath = relOfType(slide, "/slideLayout");
    const layout = layoutPath ? await loadPart(deck, layoutPath) : null;
    const masterPath = relOfType(layout, "/slideMaster");
    const master = masterPath ? await loadPart(deck, masterPath) : null;
    if (i === 0 || !deck.theme.size) await loadTheme(deck, master);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    await drawBackground(deck, ctx, [slide, layout, master], canvas.width, canvas.height);

    const treeOf = (p: Part | null) => p?.doc.getElementsByTagNameNS("*", "spTree")[0] ?? null;
    const showMaster = layout?.doc.documentElement.getAttribute("showMasterSp") !== "0"
      && slide.doc.documentElement.getAttribute("showMasterSp") !== "0";
    if (master && showMaster) await drawTree(deck, ctx, treeOf(master), IDENTITY, { part: master, layout: null, master: null, placeholders: false });
    if (layout) await drawTree(deck, ctx, treeOf(layout), IDENTITY, { part: layout, layout: null, master: null, placeholders: false });
    await drawTree(deck, ctx, treeOf(slide), IDENTITY, { part: slide, layout, master, placeholders: true });

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    if (i === 0) preview = dataUrl;
    const jpg = await pdf.embedJpg(dataUrl);
    const page = pdf.addPage([widthEmu / EMU_PER_POINT, heightEmu / EMU_PER_POINT]);
    page.drawImage(jpg, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });

    onProgress?.(i + 1, slidePaths.length);
    await new Promise((r) => setTimeout(r, 0)); // let the page repaint between slides
  }

  for (const bitmap of deck.images.values()) bitmap?.close();
  const bytes = await pdf.save();
  return {
    blob: new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
    slideCount: slidePaths.length,
    preview,
    skipped: deck.skipped,
  };
}
