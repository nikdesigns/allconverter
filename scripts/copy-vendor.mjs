// Copies the WebAssembly engines out of node_modules into public/vendor so they
// are served from this site (and cached for offline use) instead of a CDN.
// Runs automatically before `npm run dev` and `npm run build`.
import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const jobs = [
  {
    name: "FFmpeg (video tools)",
    from: "node_modules/@ffmpeg/core/dist/umd",
    to: "public/vendor/ffmpeg",
    files: ["ffmpeg-core.js", "ffmpeg-core.wasm"],
  },
  {
    name: "QPDF (PDF password tools)",
    from: "node_modules/@neslinesli93/qpdf-wasm/dist",
    to: "public/vendor/qpdf",
    files: null, // everything in dist
  },
];

let missing = false;
for (const job of jobs) {
  const src = join(root, job.from);
  if (!existsSync(src)) {
    console.warn(`[copy-vendor] ${job.name}: ${job.from} not found. Run "npm install" — the tools that need it will not work until you do.`);
    missing = true;
    continue;
  }
  const dest = join(root, job.to);
  mkdirSync(dest, { recursive: true });
  for (const file of job.files ?? readdirSync(src)) {
    if (!existsSync(join(src, file))) { console.warn(`[copy-vendor] ${job.name}: ${file} missing in ${job.from}`); missing = true; continue; }
    cpSync(join(src, file), join(dest, file), { recursive: true });
  }
  console.log(`[copy-vendor] ${job.name} → ${job.to}`);
}
if (missing) process.exitCode = 0; // warn, never block the build
