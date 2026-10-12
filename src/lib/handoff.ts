"use client";

import { useEffect, useRef } from "react";

/**
 * Passing a result from one tool straight into another.
 *
 * The files live in memory only, for the single client-side navigation between
 * the two tool pages. Nothing is written to storage or sent anywhere.
 */
let pending: File[] = [];

export function setHandoff(files: File[]) {
  pending = files;
}

export function hasHandoff() {
  return pending.length > 0;
}

function matches(file: File, accept: string): boolean {
  if (!accept || accept === "*") return true;
  const name = file.name.toLowerCase();
  return accept.split(",").map((a) => a.trim().toLowerCase()).some((rule) => {
    if (!rule) return false;
    if (rule.startsWith(".")) return name.endsWith(rule);
    if (rule.endsWith("/*")) return file.type.startsWith(rule.slice(0, -1));
    return file.type === rule;
  });
}

/** Take the waiting files that this tool can open. Others stay for nobody: the hand-off is one-shot. */
export function takeHandoff(accept = "*", multiple = true): File[] {
  const files = pending.filter((f) => matches(f, accept));
  pending = [];
  return multiple ? files : files.slice(0, 1);
}

/** Call `onFiles` once, on mount, with any files another tool sent here. */
export function useHandoff(accept: string, multiple: boolean, onFiles: (files: File[]) => void) {
  const handler = useRef(onFiles);
  useEffect(() => { handler.current = onFiles; });
  useEffect(() => {
    if (!hasHandoff()) return;
    const files = takeHandoff(accept, multiple);
    if (files.length) handler.current(files);
    // Runs once per mount: a hand-off is consumed by the first upload zone on the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
