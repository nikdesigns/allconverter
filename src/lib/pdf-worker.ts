/**
 * URL of the pdf.js worker bundled with this site. The worker parses users'
 * private PDFs, so it must be served from our own origin rather than fetched
 * from a public CDN at runtime.
 */
export function localPdfWorkerUrl(): string {
  return new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();
}
