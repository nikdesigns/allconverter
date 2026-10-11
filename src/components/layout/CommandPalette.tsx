"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, CornerDownLeft } from "lucide-react";
import { searchTools, getPopularTools } from "@/lib/tools-data";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = query.trim() ? searchTools(query).slice(0, 8) : getPopularTools(8);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function goTo(slug: string) {
    setOpen(false);
    router.push(`/tools/${slug}/`);
  }

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const tool = results[activeIndex];
      if (tool) goTo(tool.slug);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center pt-[12vh] px-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative w-full max-w-lg rounded-2xl bg-(--neutral-primary) border border-(--border-default) shadow-(--shadow-xl) overflow-hidden">
        <div className="flex items-center gap-3 px-4 border-b border-(--border-default)">
          <Search className="w-4 h-4 text-(--body-subtle) shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search 250+ tools..."
            className="flex-1 bg-transparent py-3.5 text-sm text-(--heading) placeholder:text-(--body-subtle) outline-none"
          />
          <kbd className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded border border-(--border-default) text-(--body-subtle)">
            Esc
          </kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="text-sm text-(--body-subtle) text-center py-8">
              No tools found for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <>
              {!query.trim() && (
                <p className="text-[11px] font-semibold uppercase tracking-wider text-(--body-subtle) px-3 pt-2 pb-1">
                  Popular tools
                </p>
              )}
              {results.map((tool, i) => (
                <button
                  key={tool.slug}
                  onClick={() => goTo(tool.slug)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                    i === activeIndex ? "bg-brand-soft" : "hover:bg-(--neutral-secondary-soft)"
                  )}
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-(--heading) truncate">
                      {tool.name}
                    </span>
                    <span className="block text-xs text-(--body-subtle) truncate">
                      {tool.tagline}
                    </span>
                  </span>
                  {i === activeIndex ? (
                    <CornerDownLeft className="w-3.5 h-3.5 text-(--fg-brand) shrink-0" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 text-(--body-subtle) shrink-0" />
                  )}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
