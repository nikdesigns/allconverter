"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "pwa-install-dismissed";

export function PWAInstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
        // Hand the worker the files this page loaded so the tool works offline
        // next time, even though the worker was not in control during this load.
        const warm = () => {
          const urls = [
            window.location.pathname,
            ...performance.getEntriesByType("resource").map((e) => e.name).filter((u) => u.startsWith(window.location.origin)),
          ];
          navigator.serviceWorker.ready
            .then((reg) => reg.active?.postMessage({ type: "CACHE_URLS", urls }))
            .catch(() => {});
        };
        const timer = window.setTimeout(warm, 4000);
        window.addEventListener("pagehide", () => window.clearTimeout(timer), { once: true });
      } else {
        // Clean up a stray SW from a previous production preview so it can't
        // serve stale chunks and break Turbopack's dev module registry.
        navigator.serviceWorker.getRegistrations().then((regs) => {
          regs.forEach((reg) => reg.unregister());
        });
      }
    }

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      if (window.localStorage.getItem(DISMISSED_KEY)) return;
      setDeferredEvent(e as BeforeInstallPromptEvent);
      setVisible(true);
    }

    const onOffline = () => toast.message("You're offline", { description: "Tools you've opened before still work. Your files never needed the network." });
    const onOnline = () => toast.success("Back online");
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  function dismiss() {
    setVisible(false);
    window.localStorage.setItem(DISMISSED_KEY, "1");
  }

  async function install() {
    if (!deferredEvent) return;
    await deferredEvent.prompt();
    await deferredEvent.userChoice;
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-90 rounded-2xl border border-(--border-default) bg-(--neutral-primary) shadow-(--shadow-xl) p-4">
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute top-3 right-3 text-(--body-subtle) hover:text-(--heading)"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center shrink-0">
          <Download className="w-5 h-5 text-fg-brand" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-(--heading)">Install AllConverter</p>
          <p className="text-xs text-(--body-subtle) mt-0.5">
            Install for one-tap access. Tools you have used keep working offline, and you can share files to it from other apps.
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <Button size="sm" className="flex-1 h-8 text-xs" onClick={install}>
          Install
        </Button>
        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={dismiss}>
          Not now
        </Button>
      </div>
    </div>
  );
}
