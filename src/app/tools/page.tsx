"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { tools } from "@/lib/tools-data";
import { categories } from "@/lib/categories";
import { cn } from "@/lib/utils";

export default function AllToolsPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    let result = tools;
    if (activeCategory !== "all") {
      result = result.filter((t) => t.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.tagline.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.includes(q))
      );
    }
    return result;
  }, [query, activeCategory]);

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="border-b border-border py-10 bg-muted/20">
        <div className="container-xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            All Tools
          </h1>
          <p className="text-muted-foreground mb-6">
            {tools.length}+ free online tools. No sign-up required.
          </p>

          {/* Search */}
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools..."
              className="pl-9 h-10 bg-background"
            />
          </div>
        </div>
      </section>

      <div className="container-xl py-8">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
              activeCategory === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            )}
          >
            All
            <span className="ml-1.5 text-xs opacity-70">({tools.length})</span>
          </button>
          {categories.map((cat) => {
            const count = tools.filter((t) => t.category === cat.slug).length;
            return (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                  activeCategory === cat.slug
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                )}
              >
                {cat.name}
                <span className="ml-1.5 text-xs opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Results */}
        {filtered.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {filtered.length} {filtered.length === 1 ? "tool" : "tools"} found
            </p>
            <ToolGrid tools={filtered} columns={4} />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No tools found for &ldquo;{query}&rdquo;</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setQuery("");
                setActiveCategory("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
