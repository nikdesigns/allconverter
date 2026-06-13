"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Menu, X, Sun, Moon, Zap, ChevronDown, Search,
  FileText, Image as ImageIcon, Type, Code2, SearchCheck,
  Calculator, ArrowLeftRight, Sparkles, Briefcase, Palette,
  ArrowRight, LayoutGrid, Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { categories } from "@/lib/categories";
import { cn } from "@/lib/utils";

const catIconMap: Record<string, React.ElementType> = {
  "pdf-tools": FileText,
  "image-tools": ImageIcon,
  "text-tools": Type,
  "developer-tools": Code2,
  "seo-tools": SearchCheck,
  "calculators": Calculator,
  "unit-converters": ArrowLeftRight,
  "ai-tools": Sparkles,
  "business-tools": Briefcase,
  "color-tools": Palette,
};

const quickNavLinks = [
  { href: "/blog/", label: "Blog" },
  { href: "/pdf-tools/", label: "PDF Tools" },
  { href: "/developer-tools/", label: "Developer" },
  { href: "/calculators/", label: "Calculators" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setToolsOpen(true);
  };

  // Delayed close — prevents flicker when mouse briefly crosses the gap
  // between trigger button and dropdown panel
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setToolsOpen(false), 120);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[var(--neutral-primary-soft)]/95 backdrop-blur-xl border-b border-[var(--border-default)] shadow-sm"
          : "bg-[var(--neutral-primary-soft)]/70 backdrop-blur-md border-b border-[var(--border-default)]/50"
      )}
    >
      <div className="container-xl">
        <div className="flex items-center justify-between h-[62px]">

          {/* ── Logo ───────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-[var(--radius-default)] bg-[var(--brand)] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm shadow-[var(--brand)]/30">
              <Zap className="w-4 h-4 text-white fill-current" />
            </div>
            <div className="flex flex-col leading-none gap-[3px]">
              <span className="font-bold text-[14px] tracking-tight text-[var(--heading)] leading-none">
                AllConverter<span className="text-[var(--fg-brand)] font-light">.tools</span>
              </span>
              <span className="text-[9px] text-[var(--body-subtle)] tracking-[0.08em] uppercase font-medium hidden sm:block leading-none">
                Convert Anything. All in One Place.
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-0.5">

            {/* Mega-menu trigger */}
            <div
              className="relative"
              onMouseEnter={openMenu}
              onMouseLeave={scheduleClose}
            >
              <button
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-[var(--radius-default)] transition-all duration-150 leading-none",
                  toolsOpen
                    ? "text-[var(--heading)] bg-[var(--neutral-secondary-medium)]"
                    : "text-[var(--body-subtle)] hover:text-[var(--heading)] hover:bg-[var(--neutral-secondary-soft)]"
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                All Tools
                <ChevronDown
                  className={cn(
                    "w-3 h-3 opacity-50 transition-transform duration-200",
                    toolsOpen && "rotate-180 opacity-100"
                  )}
                />
              </button>

              {/* Dropdown — wrapped in pt-2 so the gap between button and panel
                  stays inside this DOM subtree, preventing onMouseLeave from
                  firing on the parent while the cursor crosses the gap */}
              {toolsOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                  onMouseEnter={openMenu}
                  onMouseLeave={scheduleClose}
                >
                  <div className="w-[640px] bg-[var(--neutral-primary-soft)] border border-[var(--border-default)] rounded-2xl shadow-[var(--shadow-lg)] overflow-hidden">

                    {/* Panel header */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-default)] bg-[var(--neutral-secondary-soft)]/40">
                      <div className="flex items-center gap-2">
                        <LayoutGrid className="w-3.5 h-3.5 text-[var(--fg-brand)]" />
                        <span className="text-xs font-semibold text-[var(--body-subtle)] uppercase tracking-wider">
                          Tool Categories
                        </span>
                      </div>
                      <Link
                        href="/tools/"
                        className="text-xs text-[var(--fg-brand)] hover:underline flex items-center gap-1 font-medium"
                      >
                        View all 100+ tools
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* 2-column category grid */}
                    <div className="p-3 grid grid-cols-2 gap-1">
                      {categories.map((cat) => {
                        const Icon = catIconMap[cat.slug] ?? Zap;
                        return (
                          <Link
                            key={cat.slug}
                            href={`/${cat.slug}/`}
                            className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--neutral-secondary-medium)] transition-colors group"
                          >
                            <div
                              className={cn(
                                "w-9 h-9 rounded-[var(--radius-default)] flex items-center justify-center shrink-0",
                                "bg-[var(--neutral-secondary-soft)] border border-[var(--border-default)]",
                                "group-hover:border-[var(--border-brand-subtle)] group-hover:bg-[var(--brand-softer)] transition-colors"
                              )}
                            >
                              <Icon className={cn("w-4 h-4", cat.color)} />
                            </div>
                            <div className="min-w-0 pt-0.5">
                              <p className="text-[13px] font-semibold text-[var(--heading)] leading-tight">
                                {cat.name}
                              </p>
                              <p className="text-[11px] text-[var(--body-subtle)] mt-0.5 leading-relaxed line-clamp-1">
                                {cat.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Panel footer */}
                    <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--border-default)] bg-[var(--neutral-secondary-soft)]/40">
                      <p className="text-[11px] text-[var(--body-subtle)]">
                        100+ free tools · No sign-up · Browser-based
                      </p>
                      <Link href="/tools/">
                        <Button size="sm" className="h-7 text-[11px] px-3 gap-1">
                          Browse All
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="w-px h-4 bg-[var(--border-default)] mx-1" />

            {quickNavLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 text-[13px] font-medium text-[var(--body-subtle)] hover:text-[var(--heading)] rounded-[var(--radius-default)] hover:bg-[var(--neutral-secondary-soft)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ── Right actions ──────────────────────────────── */}
          <div className="flex items-center gap-1.5">

            {/* Search pill */}
            <Link
              href="/tools/"
              className="hidden md:flex items-center gap-2 px-3 py-[5px] text-[12px] text-[var(--body-subtle)] hover:text-[var(--heading)] rounded-[var(--radius-default)] border border-[var(--border-default)] hover:border-[var(--border-brand)] bg-[var(--neutral-secondary-soft)] hover:bg-[var(--brand-softer)] transition-all"
            >
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span>Search tools…</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] border border-[var(--border-default)] rounded bg-[var(--neutral-primary-soft)] text-[var(--body-subtle)] font-mono leading-none">
                ⌘K
              </kbd>
            </Link>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Donate */}
            <Link
              href="/support/"
              title="Support the project"
              className="hidden sm:flex items-center justify-center w-8 h-8 rounded-(--radius-default) text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
            >
              <Heart className="w-4 h-4" />
            </Link>

            {/* CTA */}
            <Link href="/tools/" className="hidden sm:block">
              <Button size="sm" className="h-8 px-4 text-xs font-semibold gap-1.5">
                Get Started
                <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" />
                }
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile header */}
                  <div className="flex items-center gap-2.5 p-4 border-b border-[var(--border-default)]">
                    <div className="w-7 h-7 rounded-[var(--radius-default)] bg-[var(--brand)] flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-white fill-current" />
                    </div>
                    <span className="font-bold text-[var(--heading)]">
                      AllConverter<span className="text-[var(--fg-brand)] font-light">.tools</span>
                    </span>
                  </div>

                  {/* Mobile search */}
                  <div className="px-4 py-3 border-b border-[var(--border-default)]">
                    <Link
                      href="/tools/"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] text-sm text-[var(--body-subtle)]"
                    >
                      <Search className="w-4 h-4 shrink-0" />
                      Search 100+ tools…
                    </Link>
                  </div>

                  {/* Mobile nav */}
                  <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
                    <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-[var(--body-subtle)]">
                      Categories
                    </p>
                    {categories.map((cat) => {
                      const Icon = catIconMap[cat.slug] ?? Zap;
                      return (
                        <Link
                          key={cat.slug}
                          href={`/${cat.slug}/`}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--neutral-secondary-soft)] transition-colors"
                        >
                          <div className="w-8 h-8 rounded-[var(--radius-default)] flex items-center justify-center shrink-0 border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)]">
                            <Icon className={cn("w-4 h-4", cat.color)} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[var(--heading)]">{cat.name}</p>
                            <p className="text-xs text-[var(--body-subtle)] line-clamp-1">{cat.description}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </nav>

                  <div className="px-3 pb-2 border-t border-(--border-default) pt-2">
                    <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-(--body-subtle)">
                      More
                    </p>
                    <Link
                      href="/blog/"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-(--neutral-secondary-soft) transition-colors"
                    >
                      <div className="w-8 h-8 rounded-(--radius-default) flex items-center justify-center shrink-0 border border-(--border-default) bg-(--neutral-secondary-soft)">
                        <Search className="w-4 h-4 text-fg-brand" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-(--heading)">Blog & Guides</p>
                        <p className="text-xs text-(--body-subtle)">Tips, tutorials, and tool guides</p>
                      </div>
                    </Link>
                  </div>

                  <div className="p-4 border-t border-[var(--border-default)]">
                    <Link href="/tools/" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full gap-2">
                        Browse All 250+ Tools
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
}
