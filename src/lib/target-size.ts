/**
 * Compress an image to fit under a byte limit.
 *
 * Strategy: keep the resolution and search for the highest quality that fits.
 * Only when even a low quality is too big does it start reducing the
 * dimensions, so the result is always the best-looking file under the limit.
 */

export interface TargetOptions {
  /** Upper limit in bytes. */
  maxBytes: number;
  /** Optional lower limit in bytes (some forms reject files that are too small). */
  minBytes?: number;
  /** Output type. PNG cannot be tuned by quality, so only lossy types are allowed. */
  mime?: "image/jpeg" | "image/webp";
  /** Exact output size in pixels. The image is centre-cropped to this shape. */
  width?: number;
  height?: number;
  /** Longest side allowed when no exact size is given. */
  maxDimension?: number;
  /** Crop zoom for exact-size output, 1 = fill the frame. */
  zoom?: number;
  /** Where the crop window sits, 0-1 on each axis (0.5 = centred). */
  focusX?: number;
  focusY?: number;
  /** Background used where the source is transparent. */
  background?: string;
}

export interface TargetResult {
  blob: Blob;
  width: number;
  height: number;
  /** Quality actually used, 0-100. */
  quality: number;
  /** False when the limit could not be reached even at the smallest setting. */
  met: boolean;
  /** True when the pixel dimensions had to be reduced to fit. */
  downscaled: boolean;
}

type Source = ImageBitmap | HTMLImageElement | HTMLCanvasElement;

const sizeOf = (s: Source) =>
  s instanceof HTMLImageElement ? { w: s.naturalWidth, h: s.naturalHeight } : { w: s.width, h: s.height };

interface Crop { zoom: number; focusX: number; focusY: number }

function render(source: Source, outW: number, outH: number, crop: Crop | null, background: string): HTMLCanvasElement {
  const { w, h } = sizeOf(source);
  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, outW, outH);
  ctx.imageSmoothingQuality = "high";
  if (crop) {
    // Cover: scale to fill, then crop the overflow equally from both sides.
    const scale = Math.max(outW / w, outH / h) * Math.max(1, crop.zoom);
    const sw = outW / scale, sh = outH / scale;
    ctx.drawImage(source, (w - sw) * crop.focusX, (h - sh) * crop.focusY, sw, sh, 0, 0, outW, outH);
  } else {
    ctx.drawImage(source, 0, 0, outW, outH);
  }
  return canvas;
}

const encode = (canvas: HTMLCanvasElement, mime: string, quality: number) =>
  new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Encoding failed"))), mime, quality));

/** Highest quality in [lo, hi] whose output fits, or null when even `lo` is too big. */
async function bestQuality(canvas: HTMLCanvasElement, mime: string, maxBytes: number, lo: number, hi: number) {
  const top = await encode(canvas, mime, hi);
  if (top.size <= maxBytes) return { blob: top, quality: hi };
  let best: { blob: Blob; quality: number } | null = null;
  let low = lo, high = hi;
  for (let i = 0; i < 7; i++) {
    const mid = (low + high) / 2;
    const blob = await encode(canvas, mime, mid);
    if (blob.size <= maxBytes) { best = { blob, quality: mid }; low = mid; } else { high = mid; }
  }
  if (!best) {
    const floor = await encode(canvas, mime, lo);
    if (floor.size <= maxBytes) best = { blob: floor, quality: lo };
  }
  return best;
}

export async function compressToTarget(source: Source, options: TargetOptions): Promise<TargetResult> {
  const mime = options.mime ?? "image/jpeg";
  const background = options.background ?? "#ffffff";
  const natural = sizeOf(source);
  const exact = !!(options.width && options.height);

  let outW = options.width ?? natural.w;
  let outH = options.height ?? natural.h;
  if (!exact && options.maxDimension) {
    const s = Math.min(1, options.maxDimension / Math.max(outW, outH));
    outW = Math.max(1, Math.round(outW * s));
    outH = Math.max(1, Math.round(outH * s));
  }

  // Exact-size output (form photos) is never shrunk: the pixel size is part of the requirement.
  const MIN_QUALITY = exact ? 0.05 : 0.45;
  let scale = 1;
  let last: { blob: Blob; quality: number; w: number; h: number } | null = null;

  for (let attempt = 0; attempt < 12; attempt++) {
    const w = Math.max(1, Math.round(outW * scale));
    const h = Math.max(1, Math.round(outH * scale));
    const crop = exact ? { zoom: options.zoom ?? 1, focusX: options.focusX ?? 0.5, focusY: options.focusY ?? 0.5 } : null;
    const canvas = render(source, w, h, crop, background);
    const fit = await bestQuality(canvas, mime, options.maxBytes, MIN_QUALITY, 0.95);
    if (fit) {
      let { blob, quality } = fit;
      // Too small for the form's lower limit: spend the spare bytes on quality.
      if (options.minBytes && blob.size < options.minBytes && quality < 1) {
        const max = await encode(canvas, mime, 1);
        if (max.size <= options.maxBytes) { blob = max; quality = 1; }
      }
      canvas.width = canvas.height = 0;
      return { blob, width: w, height: h, quality: Math.round(quality * 100), met: true, downscaled: scale < 1 };
    }
    const smallest = await encode(canvas, mime, MIN_QUALITY);
    last = { blob: smallest, quality: MIN_QUALITY, w, h };
    canvas.width = canvas.height = 0;
    if (exact || Math.min(w, h) <= 32) break;
    // File size is roughly proportional to pixel count: jump most of the way, then refine.
    scale *= Math.max(0.5, Math.min(0.9, Math.sqrt(options.maxBytes / smallest.size) * 0.95));
  }

  return {
    blob: last!.blob, width: last!.w, height: last!.h,
    quality: Math.round(last!.quality * 100), met: false, downscaled: scale < 1,
  };
}

/** Decode a file for use with compressToTarget, honouring EXIF rotation. */
export async function loadImage(file: Blob): Promise<ImageBitmap> {
  return createImageBitmap(file, { imageOrientation: "from-image" });
}
