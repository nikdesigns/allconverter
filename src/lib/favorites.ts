const STORAGE_KEY = "favorite-tools";
const EVENT = "favorites-changed";

export function getFavoriteSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function isFavorite(slug: string): boolean {
  return getFavoriteSlugs().includes(slug);
}

/** Add or remove a tool; returns the new state. */
export function toggleFavorite(slug: string): boolean {
  const current = getFavoriteSlugs();
  const next = current.includes(slug) ? current.filter((s) => s !== slug) : [slug, ...current];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // storage unavailable: nothing to remember
  }
  return next.includes(slug);
}

/** Subscribe to changes made in this tab or another one. */
export function onFavoritesChange(listener: () => void): () => void {
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
