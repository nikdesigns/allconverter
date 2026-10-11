"use client";

import { useEffect, useState } from "react";
import { History } from "lucide-react";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { getRecentSlugs } from "@/lib/recently-used";
import { getToolBySlug } from "@/lib/tools-data";
import type { Tool } from "@/types";

export function RecentlyUsedTools() {
  const [tools, setTools] = useState<Tool[] | null>(null);

  useEffect(() => {
    const recent = getRecentSlugs()
      .map((slug) => getToolBySlug(slug))
      .filter((t): t is Tool => !!t)
      .slice(0, 4);
    setTools(recent);
  }, []);

  if (!tools || tools.length === 0) return null;

  return (
    <section className="py-16 lg:py-20 bg-(--neutral-secondary-soft)">
      <div className="container-xl">
        <div className="flex items-center gap-2 mb-2">
          <History className="w-4 h-4 text-(--fg-brand)" />
          <span className="text-xs font-semibold text-(--fg-brand) uppercase tracking-wider">
            Continue Where You Left Off
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--heading) mb-6">
          Recently used tools
        </h2>
        <ToolGrid tools={tools} columns={4} />
      </div>
    </section>
  );
}
