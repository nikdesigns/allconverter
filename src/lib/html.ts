/** Escapes text for safe insertion into HTML markup or attribute values. */
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const BLOCKED_TAGS = "script,iframe,object,embed,link,meta,base,form,style";
const URL_ATTRS = ["href", "src", "xlink:href", "action", "formaction"];

/**
 * Removes anything that can execute from an HTML fragment produced from a
 * user-supplied file (for example a converted .docx): script-capable
 * elements, inline event handlers and javascript:/data: URLs on links.
 * Browser only — it relies on DOMParser.
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") return "";
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  doc.querySelectorAll(BLOCKED_TAGS).forEach((el) => el.remove());
  doc.querySelectorAll("*").forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      const value = attr.value.replace(/[\u0000-\u0020]/g, "").toLowerCase();
      if (name.startsWith("on")) {
        el.removeAttribute(attr.name);
      } else if (URL_ATTRS.includes(name)) {
        const isImageData = name === "src" && el.tagName === "IMG" && value.startsWith("data:image/");
        if (!isImageData && /^(javascript|vbscript|data):/.test(value)) el.removeAttribute(attr.name);
      }
    }
  });
  return doc.body.firstElementChild?.innerHTML ?? "";
}
