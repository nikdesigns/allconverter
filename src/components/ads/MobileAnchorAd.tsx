"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

const PUB_ID  = "ca-pub-6648091987919638";
const SLOT_ID = "1878358332";

export function MobileAnchorAd() {
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible]     = useState(false);
  const insRef  = useRef<HTMLModElement>(null);
  const pushed  = useRef(false);

  // Delay appearance slightly so it doesn't flash during page load
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible || dismissed || pushed.current) return;
    if (insRef.current?.getAttribute("data-adsbygoogle-status")) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // Ad blocker — fail silently
    }
  }, [visible, dismissed]);

  // Dev placeholder
  if (process.env.NODE_ENV === "development") {
    return (
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-center bg-muted/90 border-t border-border h-[60px]">
        <span className="text-xs text-muted-foreground opacity-50">Mobile Anchor Ad — slot {SLOT_ID}</span>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30"
          aria-label="Close advertisement"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  if (dismissed || !visible) return null;

  return (
    // Only visible below lg breakpoint — desktop uses sidebar ad instead
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--neutral-primary-soft)] border-t border-[var(--border-default)] shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
      <div className="relative w-full flex items-center justify-center py-1 px-8 min-h-[60px]">
        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-[var(--neutral-secondary-soft)] hover:bg-[var(--neutral-secondary-medium)] border border-[var(--border-default)] transition-colors"
          aria-label="Close advertisement"
        >
          <X className="w-3 h-3 text-[var(--body-subtle)]" />
        </button>

        <div className="w-full max-w-sm">
          <p className="text-center text-[9px] text-[var(--body-subtle)] opacity-40 mb-0.5 select-none">
            Advertisement
          </p>
          <ins
            ref={insRef}
            className="adsbygoogle"
            style={{ display: "block", minHeight: "50px" }}
            data-ad-client={PUB_ID}
            data-ad-slot={SLOT_ID}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
}
