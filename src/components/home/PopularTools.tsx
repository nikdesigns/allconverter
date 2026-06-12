import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { getPopularTools, getTrendingTools } from "@/lib/tools-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PopularTools() {
  const popular = getPopularTools(12);
  const trending = getTrendingTools(8);

  return (
    <section className="py-16 lg:py-20 bg-[var(--neutral-secondary-soft)]">
      <div className="container-xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[var(--fg-brand)]" />
              <span className="text-xs font-semibold text-[var(--fg-brand)] uppercase tracking-wider">
                Most Used
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--heading)]">
              Popular tools
            </h2>
            <p className="text-[var(--body-subtle)] text-sm mt-1">
              The tools our users reach for most
            </p>
          </div>
          <Link href="/tools/">
            <Button variant="secondary" size="sm" className="gap-2 shrink-0">
              View all tools
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="popular">
          <TabsList className="mb-6 h-9">
            <TabsTrigger value="popular" className="text-xs">
              Most Popular
            </TabsTrigger>
            <TabsTrigger value="trending" className="text-xs">
              Trending Now
            </TabsTrigger>
          </TabsList>
          <TabsContent value="popular">
            <ToolGrid tools={popular} columns={4} />
          </TabsContent>
          <TabsContent value="trending">
            <ToolGrid tools={trending} columns={4} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
