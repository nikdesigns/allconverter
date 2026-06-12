"use client";

import Link from "next/link";
import {
  FileText, FileDown, FilePlus2, ScissorsLineDashed, FileOutput, FileImage, FilePlus,
  ImageDown, Maximize2, RefreshCw, RefreshCcw, Zap, Crop, Layers, Shapes,
  Hash, CaseSensitive, Eraser, AlignLeft, FileCode,
  Braces, Binary, Link as LinkIcon, Fingerprint, ScanSearch, Palette, Code, Minimize2,
  Tags, Bot, BarChart2, Map, Share2,
  Activity, Calendar, Percent, TrendingUp, CreditCard, ShieldCheck, KeyRound,
  Ruler, Scale, Thermometer, Square, Gauge,
  FileSpreadsheet, Sparkles, SpellCheck, Image, ArrowRight, CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ToolCard } from "./ToolCard";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { ToolInterface } from "./ToolInterface";
import type { Tool, ToolCategory_Data, BreadcrumbItem } from "@/types";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, FileDown, FilePlus2, ScissorsLineDashed, FileOutput, FileImage, FilePlus,
  ImageDown, Maximize2, RefreshCw, RefreshCcw, Zap, Crop, Layers, Shapes,
  Hash, CaseSensitive, Eraser, AlignLeft, FileCode,
  Braces, Binary, Link: LinkIcon, Fingerprint, ScanSearch, Palette, Code, Minimize2,
  Tags, Bot, BarChart2, Map, Share2,
  Activity, Calendar, Percent, TrendingUp, CreditCard, ShieldCheck, KeyRound,
  Ruler, Scale, Thermometer, Square, Gauge,
  FileSpreadsheet, Sparkles, SpellCheck, Image,
};

interface ToolPageClientProps {
  tool: Tool;
  category: ToolCategory_Data;
  relatedTools: Tool[];
  breadcrumbs: BreadcrumbItem[];
}

export function ToolPageClient({
  tool,
  category,
  relatedTools,
  breadcrumbs,
}: ToolPageClientProps) {
  const Icon = iconMap[tool.icon] || FileText;

  return (
    <div className="min-h-screen pt-16">
      {/* Tool header */}
      <section className="border-b border-border py-8 bg-muted/20">
        <div className="container-lg">
          <Breadcrumbs items={breadcrumbs} className="mb-5" />

          <div className="flex items-start gap-4">
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br",
                category.gradient
              )}
            >
              <Icon className={cn("w-6 h-6", category.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {tool.name}
                </h1>
                {tool.isNew && (
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                    NEW
                  </Badge>
                )}
                {tool.isTrending && (
                  <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs">
                    TRENDING
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{tool.tagline}</p>

              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  Free
                </Badge>
                <Badge variant="outline" className="text-xs">
                  No sign-up
                </Badge>
                <Link
                  href={`/${tool.category}/`}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  {category.name} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-lg py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8">
          {/* Main content */}
          <div className="space-y-8 min-w-0 overflow-hidden">
            {/* Introduction */}
            <div className="prose-tool">
              <p className="text-base leading-relaxed">{tool.description}</p>
            </div>

            {/* Tool interface */}
            <div>
              <ToolInterface tool={tool} />
            </div>

            {/* How to use */}
            {tool.howTo && tool.howTo.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  How to use {tool.name}
                </h2>
                <div className="space-y-3">
                  {tool.howTo.map((step, i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-4 rounded-xl border border-border bg-card"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">
                          {i + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold mb-0.5">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Use cases */}
            {tool.useCases && tool.useCases.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Use Cases</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tool.useCases.map((uc, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      {uc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {tool.benefits && tool.benefits.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Key Benefits</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tool.benefits.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FAQs */}
            {tool.faqs && tool.faqs.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Frequently Asked Questions
                </h2>
                <Accordion className="space-y-2">
                  {tool.faqs.map((faq, i) => (
                    <AccordionItem
                      key={i}
                      className="border border-border rounded-xl bg-card px-5 py-1"
                    >
                      <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Ad placeholder */}
            <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4 text-center min-h-[250px] flex flex-col items-center justify-center">
              <p className="text-xs text-muted-foreground">Advertisement</p>
            </div>

            {/* Related tools */}
            {relatedTools.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Related Tools</h3>
                  <Link
                    href={`/${tool.category}/`}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    See all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-2">
                  {relatedTools.map((rt) => (
                    <ToolCard key={rt.slug} tool={rt} compact />
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {tool.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-muted border border-border text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
