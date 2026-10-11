const STORAGE_KEY = "recently-used-tools";
const MAX_ENTRIES = 12;

export function addRecentTool(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getRecentSlugs().filter((s) => s !== slug);
    existing.unshift(slug);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, MAX_ENTRIES)));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — ignore
  }
}

export function getRecentSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}
