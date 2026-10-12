"use client";

import { useCallback, useEffect, useState } from "react";

const PREFIX = "tool-settings:";

/**
 * useState that remembers its value in this browser, so a tool reopens with the
 * settings the visitor last used. The saved value is applied after mount to
 * keep server and client markup identical.
 */
export function usePersistentState<T>(key: string, initial: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      // Reading saved settings is exactly the "sync with an external system" case effects exist for.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // storage unavailable or corrupted: keep the default
    }
  }, [key]);

  const set = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      try { window.localStorage.setItem(PREFIX + key, JSON.stringify(resolved)); } catch { /* ignore */ }
      return resolved;
    });
  }, [key]);

  return [value, set];
}
