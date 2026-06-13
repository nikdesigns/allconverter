import Link from "next/link";
import {
  FileText, Image, Type, Code2, Search, Calculator, ArrowLeftRight,
  Sparkles, Briefcase, ArrowRight,
} from "lucide-react";
import { categories } from "@/lib/categories";
import { getToolsByCategory } from "@/lib/tools-data";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, Image, Type, Code2, Search, Calculator, ArrowLeftRight, Sparkles, Briefcase,
};

export function CategoriesGrid() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3">
            Browse by category
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            From PDF tools to AI-powered utilities — find the right tool for any task.
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Code2;
            const toolCount = getToolsByCategory(cat.slug).length;

            return (
              <Link
                key={cat.slug}
                href={`/${cat.slug}/`}
                className="group relative overflow-hidden rounded-[var(--radius-base)] border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-5 hover:border-[var(--border-brand)] hover:bg-[var(--neutral-secondary-medium)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Subtle accent layer on hover using category gradient for distinction */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-300 bg-gradient-to-br",
                    cat.gradient
                  )}
                />

                <div className="relative z-10">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-[var(--radius-default)] flex items-center justify-center mb-3 bg-[var(--neutral-secondary-soft)] border border-[var(--border-default)] transition-transform duration-200 group-hover:scale-105",
                    )}
                  >
                    <Icon className={cn("w-5 h-5", cat.color)} />
                  </div>

                  <h3 className="font-semibold text-[var(--heading)] text-sm mb-1 group-hover:text-[var(--fg-brand)] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[var(--body-subtle)] leading-relaxed line-clamp-2 mb-3">
                    {cat.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-(--body-subtle)">
                      {toolCount} {toolCount === 1 ? "tool" : "tools"}
                    </span>
                    <span className="text-xs font-medium text-fg-brand opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                      Explore all
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
