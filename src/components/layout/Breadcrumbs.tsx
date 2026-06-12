import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import type { BreadcrumbItem } from "@/types";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center", className)}>
      <ol className="flex items-center flex-wrap gap-1 text-sm">
        <li>
          <Link
            href="/"
            className="text-[var(--body-subtle)] hover:text-[var(--heading)] transition-colors flex items-center"
            aria-label="Home"
          >
            <Home className="w-3.5 h-3.5" />
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5 text-[var(--body-subtle)]/50 shrink-0" />
            {item.href ? (
              <Link
                href={item.href}
                className="text-[var(--body-subtle)] hover:text-[var(--heading)] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-[var(--heading)] font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
