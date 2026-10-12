"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { getFavoriteSlugs, onFavoritesChange } from "@/lib/favorites";
import type { Tool } from "@/types";

/** The visitor's starred tools, shown first on the home page. Renders nothing until they star one. */
export function FavoriteTools() {
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      const slugs = getFavoriteSlugs();
      if (slugs.length === 0) { setTools([]); return; }
      // Only visitors with favourites pay for the tool catalogue download.
      import("@/lib/tools-data").then(({ getToolBySlug }) => {
        if (cancelled) return;
        setTools(slugs.map((s) => getToolBySlug(s)).filter((t): t is Tool => !!t));
      });
    };
    load();
    const off = onFavoritesChange(load);
    return () => { cancelled = true; off(); };
  }, []);

  if (tools.length === 0) return null;

  return (
    <section className="py-12 lg:py-16">
      <div className="container-xl">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-(--fg-brand)" />
          <span className="text-xs font-semibold text-(--fg-brand) uppercase tracking-wider">Your favourites</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--heading) mb-6">Pinned tools</h2>
        <ToolGrid tools={tools} columns={4} />
      </div>
    </section>
  );
}
