/**
 * Generates all favicon assets from the brand SVG:
 *   public/favicon.ico        — 16, 32, 48 px multi-res (PNG-in-ICO)
 *   public/apple-touch-icon.png — 180 × 180
 *   public/icon-192.png       — PWA 192 × 192
 *   public/icon-512.png       — PWA 512 × 512
 *
 * Run: node scripts/generate-favicon.mjs
 */

import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Brand SVG — white Zap on #0099DD rounded square
const SVG = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#0099DD"/>
  <polygon points="17,6 7,18 16,18 15,26 25,14 16,14" fill="white"/>
</svg>`);

async function png(size) {
  return sharp(SVG).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
}

/**
 * Assembles a .ico file from an ordered list of PNG buffers.
 * Each buffer is embedded as-is (PNG-in-ICO, supported by all modern browsers).
 */
function buildIco(pngBuffers) {
  const n = pngBuffers.length;
  const HEADER = 6;
  const DIR_ENTRY = 16;

  // Calculate per-image offsets (data starts after header + all directory entries)
  let dataOffset = HEADER + DIR_ENTRY * n;
  const offsets = pngBuffers.map((buf) => {
    const off = dataOffset;
    dataOffset += buf.length;
    return off;
  });

  const out = Buffer.alloc(dataOffset);
  let p = 0;

  // ICO header
  out.writeUInt16LE(0, p);     p += 2; // reserved
  out.writeUInt16LE(1, p);     p += 2; // type: 1 = ICO
  out.writeUInt16LE(n, p);     p += 2; // image count

  // Directory entries
  pngBuffers.forEach((buf, i) => {
    const sz = SIZES[i];
    out.writeUInt8(sz >= 256 ? 0 : sz, p);  p += 1; // width  (0 means 256)
    out.writeUInt8(sz >= 256 ? 0 : sz, p);  p += 1; // height
    out.writeUInt8(0, p);                    p += 1; // colour count (0 = truecolour)
    out.writeUInt8(0, p);                    p += 1; // reserved
    out.writeUInt16LE(1, p);                 p += 2; // colour planes
    out.writeUInt16LE(32, p);                p += 2; // bits per pixel
    out.writeUInt32LE(buf.length, p);        p += 4; // data size
    out.writeUInt32LE(offsets[i], p);        p += 4; // data offset
  });

  // PNG image data
  pngBuffers.forEach((buf) => {
    buf.copy(out, p);
    p += buf.length;
  });

  return out;
}

const SIZES = [16, 32, 48];

async function main() {
  console.log("Generating brand favicons…");

  // All sizes in parallel
  const [p16, p32, p48, p180, p192, p512] = await Promise.all([
    png(16), png(32), png(48),
    png(180), png(192), png(512),
  ]);

  // favicon.ico — 3-size multi-res
  const ico = buildIco([p16, p32, p48]);
  writeFileSync(join(ROOT, "public", "favicon.ico"), ico);
  console.log("  ✓  public/favicon.ico  (16 + 32 + 48 px)");

  // Apple touch icon
  writeFileSync(join(ROOT, "public", "apple-touch-icon.png"), p180);
  console.log("  ✓  public/apple-touch-icon.png  (180 × 180)");

  // PWA / manifest icons
  writeFileSync(join(ROOT, "public", "icon-192.png"), p192);
  console.log("  ✓  public/icon-192.png  (192 × 192)");

  writeFileSync(join(ROOT, "public", "icon-512.png"), p512);
  console.log("  ✓  public/icon-512.png  (512 × 512)");

  console.log("\nDone. Rebuild the site (`npm run build`) to apply.");
}

main().catch((err) => { console.error(err); process.exit(1); });
