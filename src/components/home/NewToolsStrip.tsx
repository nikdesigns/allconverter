import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { getNewTools } from "@/lib/tools-data";

export function NewToolsStrip() {
  const newTools = getNewTools(8);

  if (newTools.length === 0) return null;

  return (
    <section className="py-16 lg:py-20">
      <div className="container-xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-(--fg-brand)" />
              <span className="text-xs font-semibold text-(--fg-brand) uppercase tracking-wider">
                New This Week
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--heading)">
              Fresh tools, just shipped
            </h2>
            <p className="text-(--body-subtle) text-sm mt-1">
              The latest additions to our growing collection of free tools
            </p>
          </div>
          <Link href="/tools/">
            <Button variant="secondary" size="sm" className="gap-2 shrink-0">
              View all tools
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
        <ToolGrid tools={newTools} columns={4} />
      </div>
    </section>
  );
}
