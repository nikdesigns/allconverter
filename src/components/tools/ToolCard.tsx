import Link from "next/link";
import {
  FileText, FileDown, FilePlus2, ScissorsLineDashed, FileOutput, FileImage, FilePlus,
  ImageDown, Maximize2, RefreshCw, RefreshCcw, Zap, Crop, Layers, Shapes,
  Hash, CaseSensitive, Eraser, AlignLeft, FileCode,
  Braces, Binary, Link as LinkIcon, Fingerprint, ScanSearch, Palette, Code, Minimize2,
  Tags, Bot, BarChart2, Map, Share2,
  Activity, Calendar, Percent, TrendingUp, CreditCard, ShieldCheck, KeyRound,
  Ruler, Scale, Thermometer, Square, Gauge,
  FileSpreadsheet, Sparkles, SpellCheck, Image,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Tool } from "@/types";
import { cn } from "@/lib/utils";
import { getCategoryBySlug } from "@/lib/categories";

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

interface ToolCardProps {
  tool: Tool;
  compact?: boolean;
  className?: string;
}

export function ToolCard({ tool, compact = false, className }: ToolCardProps) {
  const IconComponent = iconMap[tool.icon] || FileText;
  const category = getCategoryBySlug(tool.category);

  return (
    <Link href={`/tools/${tool.slug}/`} className={cn("group block", className)}>
      <div className="tool-card h-full flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <div
            className={cn(
              "w-10 h-10 rounded-[var(--radius-default)] flex items-center justify-center shrink-0 transition-all duration-200 bg-[var(--neutral-secondary-soft)] border border-[var(--border-default)]",
              "group-hover:scale-110"
            )}
          >
            <IconComponent
              className={cn("w-5 h-5", category?.color || "text-[var(--fg-brand)]")}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-sm font-semibold text-[var(--heading)] group-hover:text-[var(--fg-brand)] transition-colors leading-tight">
                {tool.name}
              </h3>
              {tool.isNew && (
                <Badge variant="success" size="default" className="text-[9px] px-1.5 py-0 h-4 font-semibold">NEW</Badge>
              )}
              {tool.isTrending && !tool.isNew && (
                <Badge variant="warning" size="default" className="text-[9px] px-1.5 py-0 h-4 font-semibold">HOT</Badge>
              )}
            </div>
            {!compact && (
              <p className="text-xs text-[var(--body-subtle)] mt-0.5 line-clamp-2 leading-relaxed">
                {tool.tagline}
              </p>
            )}
          </div>
        </div>

        {!compact && (
          <div className="mt-auto flex items-center gap-1.5 flex-wrap">
            {tool.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--neutral-tertiary-soft)] text-[var(--body-subtle)] border border-[var(--border-default)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
