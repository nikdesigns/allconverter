"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/tools/shared/FileUploadZone";
import { Download, Crop, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── types ────────────────────────────────────────────────────────────────────

/** Crop rect as fractions of the natural image (0–1 on both axes). */
interface CropRect { x: number; y: number; w: number; h: number; }

/** Which part of the crop box the user grabbed. */
type Handle = "move" | "n" | "s" | "e" | "w" | "nw" | "ne" | "sw" | "se";

interface DragSession {
  handle: Handle;
  startMouseX: number;   // px in container
  startMouseY: number;
  startCrop: CropRect;
  imgBounds: { x: number; y: number; w: number; h: number }; // captured at drag start
  aspectRatio: number | null; // pixel aspect, null = free
  naturalW: number;
  naturalH: number;
}

// ─── constants ────────────────────────────────────────────────────────────────

const ASPECT_PRESETS: { label: string; ratio: number | null }[] = [
  { label: "Free", ratio: null },
  { label: "1:1",  ratio: 1 },
  { label: "4:3",  ratio: 4 / 3 },
  { label: "16:9", ratio: 16 / 9 },
  { label: "3:2",  ratio: 3 / 2 },
  { label: "2:3",  ratio: 2 / 3 },
  { label: "9:16", ratio: 9 / 16 },
];

const CURSORS: Record<Handle, string> = {
  move: "move",
  n: "n-resize",  s: "s-resize",
  e: "e-resize",  w: "w-resize",
  nw: "nw-resize", ne: "ne-resize",
  sw: "sw-resize", se: "se-resize",
};

const MIN_FRAC = 0.03; // minimum crop size as fraction of image

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Compute new crop rect from a drag delta (in normalised image coordinates). */
function applyDrag(
  handle: Handle,
  dx: number,       // normalised delta (relative to image width)
  dy: number,       // normalised delta (relative to image height)
  sc: CropRect,     // crop rect at drag start
  aspectRatio: number | null, // pixel aspect (w/h), null = free
  naturalW: number,
  naturalH: number,
): CropRect {
  let { x, y, w, h } = sc;

  if (handle === "move") {
    return {
      x: clamp(x + dx, 0, 1 - w),
      y: clamp(y + dy, 0, 1 - h),
      w, h,
    };
  }

  // ── resize ──
  // We work in normalised units (fraction of image).
  // targetNormRatio = (pixel aspect) * (naturalH / naturalW)
  //   because: normW / normH = pixelW / pixelH  *  naturalH / naturalW
  const targetNormRatio = aspectRatio ? aspectRatio * (naturalH / naturalW) : null;

  if (handle.includes("w")) {
    const newX = clamp(x + dx, 0, x + w - MIN_FRAC);
    w = x + w - newX;
    x = newX;
  }
  if (handle.includes("e")) {
    w = clamp(w + dx, MIN_FRAC, 1 - x);
  }
  if (handle.includes("n")) {
    const newY = clamp(y + dy, 0, y + h - MIN_FRAC);
    h = y + h - newY;
    y = newY;
  }
  if (handle.includes("s")) {
    h = clamp(h + dy, MIN_FRAC, 1 - y);
  }

  // ── aspect-ratio enforcement ──
  if (targetNormRatio) {
    const primaryIsWidth = handle === "e" || handle === "w";
    const primaryIsHeight = handle === "n" || handle === "s";

    if (primaryIsWidth) {
      const newH = w / targetNormRatio;
      h = clamp(newH, MIN_FRAC, 1 - y);
      w = h * targetNormRatio; // re-clamp in case h was clipped
    } else if (primaryIsHeight) {
      const newW = h * targetNormRatio;
      w = clamp(newW, MIN_FRAC, 1 - x);
      h = w / targetNormRatio;
    } else {
      // Corner: use width as primary, adjust height; anchor opposite corner
      const newH = w / targetNormRatio;
      if (handle.includes("n")) {
        const oldBottom = sc.y + sc.h;
        h = clamp(newH, MIN_FRAC, oldBottom);
        y = oldBottom - h;
      } else {
        h = clamp(newH, MIN_FRAC, 1 - y);
      }
      w = h * targetNormRatio;
      // Keep left/right anchor
      if (handle.includes("w")) x = sc.x + sc.w - w;
    }
  }

  return { x: clamp(x, 0, 1 - MIN_FRAC), y: clamp(y, 0, 1 - MIN_FRAC), w, h };
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

// ─── component ────────────────────────────────────────────────────────────────

export function ImageCropperTool() {
  const [file, setFile]         = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState("");
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [aspectIdx, setAspectIdx] = useState(0);
  const [crop, setCrop]         = useState<CropRect>({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
  const [outputUrl, setOutputUrl] = useState("");
  const [outputSize, setOutputSize] = useState({ w: 0, h: 0 });
  const [imgBounds, setImgBounds] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef       = useRef<HTMLImageElement>(null);
  // Ref version so drag closures always see current bounds without stale capture
  const imgBoundsRef = useRef(imgBounds);
  const sessionRef   = useRef<DragSession | null>(null);

  // ── image bounds ──────────────────────────────────────────────────────────

  function recalcBounds(nw = naturalW, nh = naturalH) {
    if (!containerRef.current || !nw || !nh) return;
    const cw = containerRef.current.offsetWidth;
    const ch = containerRef.current.offsetHeight;
    const scale = Math.min(cw / nw, ch / nh);
    const iw = nw * scale, ih = nh * scale;
    const bounds = { x: (cw - iw) / 2, y: (ch - ih) / 2, w: iw, h: ih };
    imgBoundsRef.current = bounds;
    setImgBounds(bounds);
  }

  useEffect(() => {
    const obs = new ResizeObserver(() => recalcBounds());
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [naturalW, naturalH]); // eslint-disable-line react-hooks/exhaustive-deps

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    setNaturalW(img.naturalWidth);
    setNaturalH(img.naturalHeight);
    setCrop({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
    recalcBounds(img.naturalWidth, img.naturalHeight);
  }

  // ── file ──────────────────────────────────────────────────────────────────

  function handleFile(files: File[]) {
    const f = files[0];
    setFile(f);
    setOutputUrl("");
    setImageSrc(URL.createObjectURL(f));
  }

  // ── drag ──────────────────────────────────────────────────────────────────

  function startDrag(handle: Handle) {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = containerRef.current!.getBoundingClientRect();
      sessionRef.current = {
        handle,
        startMouseX: e.clientX - rect.left,
        startMouseY: e.clientY - rect.top,
        startCrop: { ...crop },
        imgBounds: { ...imgBoundsRef.current },
        aspectRatio: ASPECT_PRESETS[aspectIdx].ratio,
        naturalW,
        naturalH,
      };

      function onMove(me: MouseEvent) {
        const s = sessionRef.current;
        if (!s || !containerRef.current) return;
        const cr = containerRef.current.getBoundingClientRect();
        const mx = me.clientX - cr.left;
        const my = me.clientY - cr.top;
        const dx = (mx - s.startMouseX) / s.imgBounds.w;
        const dy = (my - s.startMouseY) / s.imgBounds.h;
        setCrop(applyDrag(s.handle, dx, dy, s.startCrop, s.aspectRatio, s.naturalW, s.naturalH));
      }

      function onUp() {
        sessionRef.current = null;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      }

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    };
  }

  // ── aspect ratio button ───────────────────────────────────────────────────

  function selectAspect(idx: number) {
    setAspectIdx(idx);
    const ratio = ASPECT_PRESETS[idx].ratio;
    if (!ratio || !naturalW || !naturalH) return;
    // Snap current crop to chosen aspect ratio (keep centre)
    const normRatio = ratio * (naturalH / naturalW);
    setCrop(prev => {
      let w = prev.w, h = w / normRatio;
      if (h > 1) { h = 1; w = h * normRatio; }
      const cx = prev.x + prev.w / 2, cy = prev.y + prev.h / 2;
      return {
        x: clamp(cx - w / 2, 0, 1 - w),
        y: clamp(cy - h / 2, 0, 1 - h),
        w, h,
      };
    });
  }

  // ── apply crop ────────────────────────────────────────────────────────────

  function applyCrop() {
    if (!imgRef.current || !file || !naturalW) return;
    const canvas = document.createElement("canvas");
    const px = Math.round(crop.x * naturalW);
    const py = Math.round(crop.y * naturalH);
    const pw = Math.round(crop.w * naturalW);
    const ph = Math.round(crop.h * naturalH);
    canvas.width = pw;
    canvas.height = ph;
    canvas.getContext("2d")!.drawImage(imgRef.current, px, py, pw, ph, 0, 0, pw, ph);
    canvas.toBlob(
      blob => {
        if (blob) {
          setOutputUrl(URL.createObjectURL(blob));
          setOutputSize({ w: pw, h: ph });
        }
      },
      file.type || "image/jpeg",
      0.95,
    );
  }

  // ── derived display values ────────────────────────────────────────────────

  const { x: bx, y: by, w: bw, h: bh } = imgBounds;
  const box = {
    left:   bx + crop.x * bw,
    top:    by + crop.y * bh,
    width:  crop.w * bw,
    height: crop.h * bh,
  };
  const selW = Math.round(crop.w * naturalW);
  const selH = Math.round(crop.h * naturalH);
  const outputName = file ? file.name.replace(/\.[^.]+$/, "_cropped$&") : "";

  // ── handle definitions ────────────────────────────────────────────────────

  const HS = 10; // handle square size px
  const ES = 22; // edge handle length px

  const handles: { id: Handle; style: React.CSSProperties }[] = [
    // Corners
    { id: "nw", style: { top: -HS/2, left: -HS/2, width: HS, height: HS, cursor: "nw-resize" } },
    { id: "ne", style: { top: -HS/2, right: -HS/2, width: HS, height: HS, cursor: "ne-resize" } },
    { id: "sw", style: { bottom: -HS/2, left: -HS/2, width: HS, height: HS, cursor: "sw-resize" } },
    { id: "se", style: { bottom: -HS/2, right: -HS/2, width: HS, height: HS, cursor: "se-resize" } },
    // Edges
    { id: "n",  style: { top: -HS/2, left: "50%", transform: "translateX(-50%)", width: ES, height: HS, cursor: "n-resize" } },
    { id: "s",  style: { bottom: -HS/2, left: "50%", transform: "translateX(-50%)", width: ES, height: HS, cursor: "s-resize" } },
    { id: "w",  style: { left: -HS/2, top: "50%", transform: "translateY(-50%)", width: HS, height: ES, cursor: "w-resize" } },
    { id: "e",  style: { right: -HS/2, top: "50%", transform: "translateY(-50%)", width: HS, height: ES, cursor: "e-resize" } },
  ];

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Crop className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Image Cropper</span>
      </div>

      <div className="p-5 space-y-4">
        {!file ? (
          <FileUploadZone accept="image/*" onFiles={handleFile} label="Drop an image to crop" />
        ) : (
          <>
            {/* Aspect ratio presets */}
            <div className="flex flex-wrap gap-1.5">
              {ASPECT_PRESETS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => selectAspect(i)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg border text-xs font-medium transition-all",
                    aspectIdx === i
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* ── Cropper stage ── */}
            <div
              ref={containerRef}
              className="relative select-none rounded-xl overflow-hidden border border-border"
              style={{ height: 380, background: "#111", touchAction: "none" }}
            >
              {/* Source image */}
              <img
                ref={imgRef}
                src={imageSrc}
                alt="crop source"
                draggable={false}
                onLoad={onImageLoad}
                style={{
                  position: "absolute",
                  left: bx, top: by, width: bw, height: bh,
                  pointerEvents: "none", userSelect: "none",
                }}
              />

              {/* Dark overlay — four panels around the crop box */}
              {bw > 0 && (
                <>
                  {/* top */}
                  <div style={{ position: "absolute", left: bx, top: by, width: bw, height: box.top - by, background: "rgba(0,0,0,0.55)", pointerEvents: "none" }} />
                  {/* bottom */}
                  <div style={{ position: "absolute", left: bx, top: box.top + box.height, width: bw, height: (by + bh) - (box.top + box.height), background: "rgba(0,0,0,0.55)", pointerEvents: "none" }} />
                  {/* left */}
                  <div style={{ position: "absolute", left: bx, top: box.top, width: box.left - bx, height: box.height, background: "rgba(0,0,0,0.55)", pointerEvents: "none" }} />
                  {/* right */}
                  <div style={{ position: "absolute", left: box.left + box.width, top: box.top, width: (bx + bw) - (box.left + box.width), height: box.height, background: "rgba(0,0,0,0.55)", pointerEvents: "none" }} />
                </>
              )}

              {/* Crop box */}
              {bw > 0 && (
                <div
                  style={{
                    position: "absolute",
                    left: box.left, top: box.top,
                    width: box.width, height: box.height,
                    cursor: CURSORS.move,
                    boxSizing: "border-box",
                  }}
                  onMouseDown={startDrag("move")}
                >
                  {/* Border */}
                  <div style={{ position: "absolute", inset: 0, border: "2px solid rgba(99,102,241,0.95)", boxSizing: "border-box", pointerEvents: "none" }} />

                  {/* Rule-of-thirds grid */}
                  {([1/3, 2/3] as number[]).map(f => (
                    <div key={`v${f}`} style={{ position: "absolute", left: `${f * 100}%`, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.18)", pointerEvents: "none" }} />
                  ))}
                  {([1/3, 2/3] as number[]).map(f => (
                    <div key={`h${f}`} style={{ position: "absolute", top: `${f * 100}%`, left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.18)", pointerEvents: "none" }} />
                  ))}

                  {/* Resize handles */}
                  {handles.map(({ id, style }) => (
                    <div
                      key={id}
                      style={{
                        position: "absolute",
                        background: "white",
                        border: "2px solid rgba(99,102,241,0.9)",
                        borderRadius: 2,
                        zIndex: 10,
                        ...style,
                      }}
                      onMouseDown={e => { e.stopPropagation(); startDrag(id)(e); }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Live dimensions */}
            <p className="text-xs text-muted-foreground text-center">
              Selection: <strong>{selW} × {selH} px</strong>
              &ensp;·&ensp;
              Position: {Math.round(crop.x * naturalW)}, {Math.round(crop.y * naturalH)}
              &ensp;·&ensp;
              Drag to move &nbsp;·&nbsp; Drag corners/edges to resize
            </p>

            <div className="flex gap-2">
              <Button onClick={applyCrop} className="flex-1 gap-2">
                <Crop className="w-4 h-4" />Apply Crop
              </Button>
              <Button
                variant="outline"
                onClick={() => { setFile(null); setOutputUrl(""); setCrop({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 }); }}
                className="gap-1.5"
                title="Load a different image"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {outputUrl && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center gap-4">
                <img src={outputUrl} alt="Cropped preview" className="w-16 h-16 object-cover rounded-lg border" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    Cropped: {outputSize.w} × {outputSize.h} px
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{file?.name}</p>
                </div>
                <a href={outputUrl} download={outputName}>
                  <Button size="sm" className="gap-1.5">
                    <Download className="w-3.5 h-3.5" />Download
                  </Button>
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
