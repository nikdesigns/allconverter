import { ToolCard } from "./ToolCard";
import type { Tool } from "@/types";
import { cn } from "@/lib/utils";

interface ToolGridProps {
  tools: Tool[];
  columns?: 2 | 3 | 4;
  compact?: boolean;
  className?: string;
}

export function ToolGrid({ tools, columns = 3, compact = false, className }: ToolGridProps) {
  const gridClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }[columns];

  return (
    <div className={cn(`grid ${gridClass} gap-4`, className)}>
      {tools.map((tool) => (
        <ToolCard key={tool.slug} tool={tool} compact={compact} />
      ))}
    </div>
  );
}
