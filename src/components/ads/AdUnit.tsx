"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

const PUB_ID = "ca-pub-6648091987919638";

type AdFormat = "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";

interface AdUnitProps {
  /** Get this from AdSense → Ads → By ad unit → create unit → copy the data-ad-slot value */
  slot: string;
  format?: AdFormat;
  responsive?: boolean;
  className?: string;
  /** Fixed pixel height so the container never causes CLS before the ad loads */
  minHeight?: number;
  label?: boolean;
}

export function AdUnit({
  slot,
  format = "auto",
  responsive = true,
  className,
  minHeight,
  label = true,
}: AdUnitProps) {
  const insRef   = useRef<HTMLModElement>(null);
  const pushed   = useRef(false);

  useEffect(() => {
    // Prevent double-push in React Strict Mode and on re-renders
    if (pushed.current) return;
    // Skip if already initialised by AdSense itself
    if (insRef.current?.getAttribute("data-adsbygoogle-status")) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // Ad blocker or dev environment — fail silently
    }
  }, []);

  // In dev: render a clearly-labelled placeholder so layout is visible
  if (process.env.NODE_ENV === "development") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-xs text-muted-foreground",
          className
        )}
        style={{ minHeight: minHeight ?? 100 }}
      >
        <span className="opacity-50">Ad Unit</span>
        <span className="font-mono opacity-30 text-[10px] mt-1">slot: {slot}</span>
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-hidden", className)}>
      {label && (
        <p className="text-center text-[10px] text-muted-foreground/50 mb-1 select-none">
          Advertisement
        </p>
      )}
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{
          display: "block",
          minHeight: minHeight ? `${minHeight}px` : undefined,
        }}
        data-ad-client={PUB_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(responsive ? { "data-full-width-responsive": "true" } : {})}
      />
    </div>
  );
}
