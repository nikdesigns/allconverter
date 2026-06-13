import type { ToolCategory_Data } from "@/types";

export const categories: ToolCategory_Data[] = [
  {
    slug: "pdf-tools",
    name: "PDF Tools",
    description: "Convert, compress, merge, split, and edit PDF files with professional precision.",
    icon: "FileText",
    color: "text-rose-500",
    gradient: "from-rose-500/10 to-orange-500/10",
  },
  {
    slug: "image-tools",
    name: "Image Tools",
    description: "Resize, compress, convert, and optimize images for web and print.",
    icon: "Image",
    color: "text-sky-500",
    gradient: "from-sky-500/10 to-blue-500/10",
  },
  {
    slug: "text-tools",
    name: "Text Tools",
    description: "Count words, convert case, clean text, and analyze content instantly.",
    icon: "Type",
    color: "text-emerald-500",
    gradient: "from-emerald-500/10 to-teal-500/10",
  },
  {
    slug: "developer-tools",
    name: "Developer Tools",
    description: "Format JSON, encode/decode, generate UUIDs, and essential dev utilities.",
    icon: "Code2",
    color: "text-violet-500",
    gradient: "from-violet-500/10 to-purple-500/10",
  },
  {
    slug: "seo-tools",
    name: "SEO Tools",
    description: "Analyze keywords, check meta tags, and optimize your content for search.",
    icon: "Search",
    color: "text-amber-500",
    gradient: "from-amber-500/10 to-yellow-500/10",
  },
  {
    slug: "calculators",
    name: "Calculators",
    description: "Financial, health, math, and scientific calculators for every need.",
    icon: "Calculator",
    color: "text-indigo-500",
    gradient: "from-indigo-500/10 to-blue-500/10",
  },
  {
    slug: "unit-converters",
    name: "Unit Converters",
    description: "Convert length, weight, temperature, currency, and hundreds of units.",
    icon: "ArrowLeftRight",
    color: "text-cyan-500",
    gradient: "from-cyan-500/10 to-sky-500/10",
  },
  {
    slug: "ai-tools",
    name: "AI Tools",
    description: "AI-powered tools for writing, summarizing, and content generation.",
    icon: "Sparkles",
    color: "text-pink-500",
    gradient: "from-pink-500/10 to-rose-500/10",
  },
  {
    slug: "business-tools",
    name: "Business Tools",
    description: "Invoice generators, signature tools, and business productivity utilities.",
    icon: "Briefcase",
    color: "text-orange-500",
    gradient: "from-orange-500/10 to-amber-500/10",
  },
  {
    slug: "color-tools",
    name: "Color & CSS Tools",
    description: "CSS generators, color utilities, Tailwind helpers, and unit converters for designers.",
    icon: "Palette",
    color: "text-fuchsia-500",
    gradient: "from-fuchsia-500/10 to-pink-500/10",
  },
  {
    slug: "audio-tools",
    name: "Audio Tools",
    description: "Cut, join, convert, boost, and transcribe audio files — all in your browser.",
    icon: "Music2",
    color: "text-teal-500",
    gradient: "from-teal-500/10 to-cyan-500/10",
  },
  {
    slug: "network-tools",
    name: "Network & Web Tools",
    description: "Screenshot websites, lookup DNS & IP, check SSL certificates, and analyze page speed.",
    icon: "Globe",
    color: "text-blue-500",
    gradient: "from-blue-500/10 to-indigo-500/10",
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
