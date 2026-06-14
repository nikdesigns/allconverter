"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight, Zap, FileText, Image, Code2, Music, BrainCircuit, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { tools, searchTools } from "@/lib/tools-data";
import { cn } from "@/lib/utils";

const stats = [
  { value: "250+", label: "Free Tools" },
  { value: "13", label: "Categories" },
  { value: "100%", label: "Free Forever" },
  { value: "0", label: "Sign-ups" },
  { value: "Weekly", label: "New Tools" },
];

const quickLinks = [
  { label: "PDF Compressor", href: "/tools/pdf-compressor/", icon: FileText },
  { label: "Image Compressor", href: "/tools/image-compressor/", icon: Image },
  { label: "AI Cover Letter", href: "/tools/ai-cover-letter/", icon: BrainCircuit },
  { label: "GST Calculator", href: "/tools/gst-calculator/", icon: Calculator },
  { label: "MP3 Cutter", href: "/tools/mp3-cutter/", icon: Music },
  { label: "JSON Formatter", href: "/tools/json-formatter/", icon: Code2 },
];

export function HeroSection() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof tools>([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.trim()) {
      setResults(searchTools(query).slice(0, 6));
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      router.push(`/tools/${results[0].slug}/`);
    } else if (query) {
      router.push(`/tools/`);
    }
  };

  return (
    <section className="relative pt-28 pb-20 overflow-hidden hero-gradient">
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

      {/* Glow orbs */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-175 h-105 bg-[#00BFFF]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-32 right-1/4 w-65 h-65 bg-[#4B0082]/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-50 h-50 bg-[#00897B]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="container-xl relative z-10">

        {/* Eyebrow badge */}
        <div className="flex justify-center mb-7">
          <Link href="/tools/">
            <Badge
              variant="brand"
              className="px-4 py-1.5 text-xs font-medium cursor-pointer gap-2"
            >
              <Zap className="w-3 h-3 fill-current" />
              New: 50+ tools added — audio, PDF conversion, AI, business docs &amp; more
              <ArrowRight className="w-3 h-3" />
            </Badge>
          </Link>
        </div>

        {/* Main headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-center mb-5 leading-[1.08] text-(--heading)">
          Convert Anything.{" "}
          <br className="hidden sm:block" />
          <span className="gradient-text">All in One Place.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-(--body-subtle) text-center max-w-2xl mx-auto mb-10 leading-relaxed">
          250+ free tools for PDF, images, audio, AI content, SEO, developer utilities,
          business documents, calculators, and more. No sign-up. No uploads. No limits.
        </p>

        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-8 relative">
          <form onSubmit={handleSubmit}>
            <div
              className={cn(
                "relative flex items-center rounded-2xl border bg-(--neutral-primary) transition-all duration-200 shadow-md",
                focused
                  ? "border-border-brand ring-2 ring-(--brand)/30"
                  : "border-(--border-default) hover:border-(--border-default-strong)"
              )}
            >
              <Search className="absolute left-4 w-4 h-4 text-(--body-subtle) pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                placeholder='Search 250+ tools… try "compress PDF", "AI cover letter" or "GST calculator"'
                className="flex-1 pl-11 pr-4 py-4 text-sm bg-transparent outline-none text-(--heading) placeholder:text-(--body-subtle)"
              />
              <div className="pr-2">
                <Button type="submit" size="sm" className="rounded-full h-9 px-5">
                  Search
                </Button>
              </div>
            </div>
          </form>

          {/* Search results dropdown */}
          {results.length > 0 && focused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-(--neutral-primary-soft) border border-(--border-default) rounded-2xl shadow-lg overflow-hidden z-50">
              {results.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}/`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-(--neutral-secondary-medium) transition-colors"
                >
                  <div className="w-7 h-7 rounded-(--radius-default) bg-brand-softer flex items-center justify-center shrink-0">
                    <Zap className="w-3.5 h-3.5 text-fg-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-(--heading)">{tool.name}</p>
                    <p className="text-xs text-(--body-subtle)">{tool.tagline}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-(--body-subtle) ml-auto shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <Link href="/pdf-tools/">
            <Button size="lg" className="gap-2 h-11 px-6 text-sm font-semibold">
              <FileText className="w-4 h-4" />
              Try PDF Tools
            </Button>
          </Link>
          <Link href="/tools/">
            <Button size="lg" variant="outline" className="gap-2 h-11 px-6 text-sm font-semibold">
              Browse All 250+ Tools
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Trust line */}
        <p className="text-center text-xs text-(--body-subtle) mb-12 tracking-wide">
          Trusted by thousands&nbsp;&nbsp;·&nbsp;&nbsp;Secure &amp; Private&nbsp;&nbsp;·&nbsp;&nbsp;Works on any device
        </p>

        {/* Quick links */}
        <div className="flex flex-wrap justify-center gap-2 mb-14">
          {quickLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              <Badge
                variant="secondary"
                className="px-3 py-1.5 text-xs hover:bg-neutral-tertiary-soft hover:border-(--border-brand-subtle) transition-all cursor-pointer gap-1.5"
              >
                <item.icon className="w-3 h-3 opacity-60" />
                {item.label}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Stats — 5 across */}
        <div className="grid grid-cols-5 gap-4 max-w-lg mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl sm:text-2xl font-bold tracking-tight gradient-text">
                {stat.value}
              </p>
              <p className="text-[10px] text-(--body-subtle) mt-0.5 leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
