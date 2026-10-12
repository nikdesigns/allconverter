export interface ZipItem {
  name: string;
  /** The file itself, or an object/data URL that resolves to it. */
  blob?: Blob;
  url?: string;
}

/**
 * Bundle several results into one ZIP and download it. Browsers block or
 * prompt on a burst of separate downloads, so every multi-file tool uses this.
 */
export async function downloadZip(items: ZipItem[], zipName: string): Promise<void> {
  if (!items.length) return;
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const used = new Set<string>();
  for (const item of items) {
    const blob = item.blob ?? (item.url ? await (await fetch(item.url)).blob() : null);
    if (!blob) continue;
    let name = item.name;
    for (let n = 2; used.has(name.toLowerCase()); n++) name = item.name.replace(/(\.[^.]+)?$/, `-${n}$1`);
    used.add(name.toLowerCase());
    zip.file(name, blob);
  }
  // Images, PDFs and audio are already compressed: storing is faster and no larger.
  const out = await zip.generateAsync({ type: "blob", compression: "STORE" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(out);
  a.download = zipName.endsWith(".zip") ? zipName : `${zipName}.zip`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
}
