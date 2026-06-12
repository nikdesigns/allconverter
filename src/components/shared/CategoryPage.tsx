import Link from "next/link";
import {
  FileText, Image, Type, Code2, Search, Calculator, ArrowLeftRight,
  Sparkles, Briefcase, ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { ToolCard } from "@/components/tools/ToolCard";
import type { ToolCategory_Data, Tool } from "@/types";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, Image, Type, Code2, Search, Calculator, ArrowLeftRight, Sparkles, Briefcase,
};

interface CategoryPageProps {
  category: ToolCategory_Data;
  tools: Tool[];
  featuredTools: Tool[];
  relatedCategories: ToolCategory_Data[];
}

export function CategoryPage({
  category,
  tools,
  featuredTools,
  relatedCategories,
}: CategoryPageProps) {
  const Icon = iconMap[category.icon] || Code2;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className={cn("relative pt-24 pb-14 overflow-hidden bg-gradient-to-br", category.gradient, "from-transparent")}>
        <div className="absolute inset-0 opacity-30 bg-gradient-to-br" style={{ backgroundImage: "none" }} />
        <div className="container-xl relative z-10">
          <Breadcrumbs
            items={[{ label: category.name }]}
            className="mb-6"
          />
          <div className="flex items-start gap-5">
            <div
              className={cn(
                "w-14 h-14 rounded-[var(--radius-base)] flex items-center justify-center shrink-0 bg-[var(--neutral-secondary-soft)] border border-[var(--border-default)]",
              )}
            >
              <Icon className={cn("w-7 h-7", category.color)} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-[var(--heading)]">
                {category.name}
              </h1>
              <p className="text-[var(--body-subtle)] text-base max-w-2xl">
                {category.description}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <Badge variant="secondary" className="text-xs">
                  {tools.length} tools
                </Badge>
                <Badge variant="success" className="text-xs">100% Free</Badge>
                <Badge variant="brand" className="text-xs">No Sign-up</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-xl py-12">
        {/* Featured tools */}
        {featuredTools.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-[var(--fg-brand)]" />
              <h2 className="text-lg font-semibold text-[var(--heading)]">Featured Tools</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        )}

        {/* All tools */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-5 text-[var(--heading)]">
            All {category.name}{" "}
            <span className="text-[var(--body-subtle)] font-normal text-sm">
              ({tools.length})
            </span>
          </h2>
          <ToolGrid tools={tools} columns={3} />
        </div>

        {/* Related categories */}
        {relatedCategories.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-5 text-[var(--heading)]">Related Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {relatedCategories.map((cat) => {
                const CatIcon = iconMap[cat.icon] || Code2;
                return (
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}/`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] hover:border-[var(--border-brand)] hover:bg-[var(--neutral-secondary-medium)] transition-all"
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-[var(--radius-default)] flex items-center justify-center bg-[var(--neutral-secondary-soft)] border border-[var(--border-default)] shrink-0",
                      )}
                    >
                      <CatIcon className={cn("w-4 h-4", cat.color)} />
                    </div>
                    <span className="text-sm font-medium text-[var(--heading)]">{cat.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--body-subtle)] ml-auto shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
