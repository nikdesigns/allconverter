import type { PDFDocument, PDFDict, PDFRawStream as RawStream } from "pdf-lib";

export interface ImageCompressOptions {
  /** JPEG quality, 0-1. */
  quality: number;
  /** Longest side, in pixels, that an image is allowed to keep. */
  maxDimension: number;
}

export interface ImageCompressResult {
  /** JPEG images found in the document. */
  found: number;
  /** Images that were replaced by a smaller version. */
  recompressed: number;
  /** Bytes removed from image data. */
  savedBytes: number;
}

async function reencodeJpeg(
  bytes: Uint8Array,
  options: ImageCompressOptions,
): Promise<{ bytes: Uint8Array; width: number; height: number } | null> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(new Blob([new Uint8Array(bytes)], { type: "image/jpeg" }));
  } catch {
    return null; // not decodable by the browser: leave the image untouched
  }
  const scale = Math.min(1, options.maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) { bitmap.close(); return null; }
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", options.quality));
  canvas.width = canvas.height = 0; // release memory early
  if (!blob) return null;
  return { bytes: new Uint8Array(await blob.arrayBuffer()), width, height };
}

/**
 * Re-encode the JPEG images embedded in a PDF at a lower quality and, when they
 * are larger than `maxDimension`, a lower resolution. Text, fonts and vector
 * graphics are not touched, so the document stays searchable and sharp.
 *
 * Only plain RGB and greyscale JPEGs are processed. CMYK images, images with
 * custom decode arrays and non-JPEG images are left exactly as they are.
 */
export async function recompressPdfImages(
  doc: PDFDocument,
  options: ImageCompressOptions,
  onProgress?: (done: number, total: number) => void,
): Promise<ImageCompressResult> {
  const { PDFName, PDFRawStream, PDFArray, PDFNumber, PDFStream } = await import("pdf-lib");
  const name = (n: string) => PDFName.of(n);

  /** Number of colour components, or 0 when the image should be skipped. */
  const components = (dict: PDFDict): number => {
    const cs = dict.lookup(name("ColorSpace"));
    if (cs instanceof PDFName) {
      if (cs === name("DeviceRGB") || cs === name("CalRGB")) return 3;
      if (cs === name("DeviceGray") || cs === name("CalGray")) return 1;
      return 0;
    }
    if (cs instanceof PDFArray) {
      const kind = cs.lookup(0);
      if (kind === name("CalRGB")) return 3;
      if (kind === name("CalGray")) return 1;
      if (kind === name("ICCBased")) {
        const profile = cs.lookup(1);
        const n = profile instanceof PDFStream ? profile.dict.lookup(name("N")) : undefined;
        const count = n instanceof PDFNumber ? n.asNumber() : 0;
        return count === 1 || count === 3 ? count : 0;
      }
    }
    return 0;
  };

  const isPlainJpeg = (dict: PDFDict): boolean => {
    if (dict.lookup(name("Subtype")) !== name("Image")) return false;
    if (dict.has(name("ImageMask")) || dict.has(name("Decode"))) return false;
    const filter = dict.lookup(name("Filter"));
    if (filter === name("DCTDecode")) return true;
    return filter instanceof PDFArray && filter.size() === 1 && filter.lookup(0) === name("DCTDecode");
  };

  const targets = doc.context
    .enumerateIndirectObjects()
    .filter(([, obj]) => obj instanceof PDFRawStream && isPlainJpeg(obj.dict) && components(obj.dict) > 0);

  const result: ImageCompressResult = { found: targets.length, recompressed: 0, savedBytes: 0 };

  for (let i = 0; i < targets.length; i++) {
    const [ref, obj] = targets[i];
    const stream = obj as RawStream;
    const original = stream.contents;
    const next = await reencodeJpeg(original, options);
    // Only swap when it is clearly worth it.
    if (next && next.bytes.length < original.length * 0.9) {
      const dict = stream.dict;
      if (components(dict) === 1) dict.set(name("ColorSpace"), name("DeviceRGB")); // canvas always writes RGB
      dict.set(name("Width"), PDFNumber.of(next.width));
      dict.set(name("Height"), PDFNumber.of(next.height));
      dict.set(name("BitsPerComponent"), PDFNumber.of(8));
      dict.set(name("Filter"), name("DCTDecode"));
      dict.delete(name("DecodeParms"));
      doc.context.assign(ref, PDFRawStream.of(dict, next.bytes));
      result.recompressed++;
      result.savedBytes += original.length - next.bytes.length;
    }
    onProgress?.(i + 1, targets.length);
  }
  return result;
}
