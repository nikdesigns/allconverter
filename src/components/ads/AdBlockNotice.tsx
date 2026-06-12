"use client";

import { useEffect, useState } from "react";
import { X, Heart, ShieldOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const KEY_DISMISSED = "allconverter_adb_dismissed";
const KEY_EXPIRES   = "allconverter_adb_expires";

const TTL_WHITELISTED = 60 * 24 * 60 * 60 * 1000; // 60 days
const TTL_LATER       =  3 * 24 * 60 * 60 * 1000; //  3 days

function isDismissedByStorage(): boolean {
  try {
    if (localStorage.getItem(KEY_DISMISSED) !== "1") return false;
    const exp = parseInt(localStorage.getItem(KEY_EXPIRES) ?? "0", 10);
    if (Date.now() > exp) {
      localStorage.removeItem(KEY_DISMISSED);
      localStorage.removeItem(KEY_EXPIRES);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function saveChoice(ttl: number) {
  try {
    localStorage.setItem(KEY_DISMISSED, "1");
    localStorage.setItem(KEY_EXPIRES, String(Date.now() + ttl));
  } catch { /* storage unavailable */ }
}

/**
 * Detects an active ad blocker via a bait element.
 * baitOnly=true skips the adsbygoogle check — use this for re-verification
 * on the same page (the script won't be present mid-session even after
 * a user disables their blocker, so that check would give a false positive).
 */
function detectAdBlocker(baitOnly = false): Promise<boolean> {
  return new Promise(resolve => {
    const bait = document.createElement("div");
    bait.setAttribute("class", [
      "adsbox", "pub_300x250", "pub_300x250m", "pub_728x90",
      "ad-banner", "advertisement", "ad-placeholder",
    ].join(" "));
    bait.style.cssText =
      "position:absolute;top:-9999px;left:-9999px;width:300px;height:250px;opacity:0;pointer-events:none;";
    document.body.appendChild(bait);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const baitBlocked =
            bait.offsetParent === null ||
            bait.offsetHeight === 0 ||
            bait.offsetWidth  === 0 ||
            bait.clientHeight === 0;

          // adsbygoogle check only valid on initial page load
          const adsBlocked = baitOnly ? false : (
            typeof window.adsbygoogle === "undefined" ||
            !Array.isArray(window.adsbygoogle)
          );

          if (document.body.contains(bait)) document.body.removeChild(bait);
          resolve(baitBlocked || adsBlocked);
        }, 250);
      });
    });
  });
}

export function AdBlockNotice() {
  const [visible, setVisible]     = useState(false);
  const [leaving, setLeaving]     = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [failed, setFailed]       = useState(false);

  useEffect(() => {
    if (isDismissedByStorage()) return;
    const timer = setTimeout(async () => {
      const blocked = await detectAdBlocker();
      if (blocked) setVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  async function handleWhitelisted() {
    setVerifying(true);
    setFailed(false);
    // Give CSS-filter changes a moment to settle (no page reload needed)
    await new Promise(r => setTimeout(r, 600));
    const stillBlocked = await detectAdBlocker(true /* baitOnly */);
    setVerifying(false);

    if (stillBlocked) {
      // Ad blocker still active — surface the failure, keep banner open
      setFailed(true);
      return;
    }

    // Confirmed unblocked — save long TTL and slide out
    saveChoice(TTL_WHITELISTED);
    setLeaving(true);
    setTimeout(() => setVisible(false), 300);
  }

  function handleLater() {
    setLeaving(true);
    saveChoice(TTL_LATER);
    setTimeout(() => setVisible(false), 300);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Ad blocker detected"
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 9999,
        maxWidth: 360,
        width: "calc(100vw - 40px)",
        animation: leaving
          ? "adb-slide-out 0.3s ease-in forwards"
          : "adb-slide-in 0.35s ease-out both",
      }}
    >
      <style>{`
        @keyframes adb-slide-in  { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes adb-slide-out { from { opacity:1; transform:translateY(0)    } to { opacity:0; transform:translateY(20px) } }
        @keyframes adb-shake     { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
      `}</style>

      <div
        style={{
          background: "var(--card, #1a1a2e)",
          border: failed
            ? "1px solid rgba(239,68,68,0.45)"
            : "1px solid var(--border, rgba(255,255,255,0.1))",
          borderRadius: 16,
          padding: "16px 20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(99,102,241,0.15)",
          position: "relative",
          overflow: "hidden",
          animation: failed ? "adb-shake 0.35s ease-in-out" : undefined,
        }}
      >
        {/* Accent stripe */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: failed
            ? "linear-gradient(90deg,#ef4444,#f97316)"
            : "linear-gradient(90deg,#6366f1,#0099DD)",
        }} />

        {/* Dismiss × */}
        <button
          onClick={handleLater}
          title="Close"
          disabled={verifying}
          style={{
            position: "absolute", top: 12, right: 12,
            background: "transparent", border: "none",
            cursor: verifying ? "not-allowed" : "pointer",
            padding: 4, lineHeight: 0,
            color: "var(--muted-foreground, #888)",
            opacity: verifying ? 0.4 : 1,
          }}
        >
          <X style={{ width: 14, height: 14 }} />
        </button>

        {/* Icon + heading */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: failed ? "rgba(239,68,68,0.12)" : "rgba(99,102,241,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ShieldOff style={{ width: 18, height: 18, color: failed ? "#ef4444" : "#6366f1" }} />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "var(--foreground, #fff)", lineHeight: 1.3 }}>
              {failed ? "Ad blocker still active" : "Ad blocker detected"}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--muted-foreground, #888)", lineHeight: 1.5 }}>
              {failed
                ? "We still see an ad blocker. If you just whitelisted us, try refreshing the page first."
                : "AllConverter.tools is free and ad-supported. Ads keep all tools free and without sign-up. Please consider whitelisting us 🙏"}
            </p>
          </div>
        </div>

        {/* How-to hint (normal state) */}
        {!failed && (
          <p style={{ margin: "0 0 12px", fontSize: 11, color: "var(--muted-foreground, #888)", lineHeight: 1.5, paddingLeft: 48 }}>
            In your ad blocker, click the icon in the address bar and choose&nbsp;
            <strong style={{ color: "var(--foreground, #fff)" }}>"Always allow on this site"</strong>
            &nbsp;or add&nbsp;
            <strong style={{ color: "var(--foreground, #fff)" }}>allconverter.tools</strong>&nbsp;to the whitelist.
          </p>
        )}

        {/* Refresh nudge (failed state) */}
        {failed && (
          <p style={{ margin: "0 0 12px", fontSize: 11, lineHeight: 1.5, paddingLeft: 48, color: "rgba(239,68,68,0.85)" }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "none", border: "none", padding: 0, cursor: "pointer",
                color: "inherit", textDecoration: "underline", fontSize: "inherit",
              }}
            >
              Refresh the page
            </button>
            &nbsp;after whitelisting, then click the button again.
          </p>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, paddingLeft: 48 }}>
          <Button
            size="sm"
            onClick={handleWhitelisted}
            disabled={verifying}
            style={{ flex: 1, gap: 6, fontSize: 12 }}
          >
            {verifying ? (
              <>
                <Loader2 style={{ width: 12, height: 12 }} className="animate-spin" />
                Verifying…
              </>
            ) : (
              <>
                <Heart style={{ width: 12, height: 12 }} />
                I&apos;ve whitelisted it ✓
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleLater}
            disabled={verifying}
            style={{ fontSize: 12, color: "var(--muted-foreground, #888)" }}
          >
            Maybe later
          </Button>
        </div>
      </div>
    </div>
  );
}
