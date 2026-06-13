import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  Package,
  Sparkles,
  Bug,
  Palette,
  ShieldCheck,
  TrendingUp,
  Bot,
  Server,
  Clock,
  RefreshCw,
  CheckCircle2,
  Mail,
  Lightbulb,
  ArrowRight,
  GitCommitHorizontal,
} from "lucide-react";
import { releases, roadmap } from "@/data/changelog";
import type { ChangeType } from "@/data/changelog";
import { siteConfig } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "Changelog — Release History & Updates | AllConverter.tools",
  description:
    "Full release history for AllConverter.tools — every new tool, feature, performance improvement, bug fix, and SEO enhancement since v1.0. Updated with every release.",
  alternates: { canonical: `${siteConfig.url}/changelog/` },
  openGraph: {
    title: "Changelog | AllConverter.tools",
    description: "Every update, new tool, and improvement to AllConverter.tools — documented in full since May 2025.",
    url: `${siteConfig.url}/changelog/`,
    siteName: siteConfig.name,
    type: "website",
  },
};

// ─── Badge configuration per change type ────────────────────────────────────

const typeConfig: Record<
  ChangeType,
  { icon: React.ComponentType<{ className?: string }>; label: string; color: string; bg: string; border: string }
> = {
  tool:     { icon: Package,     label: "New Tool",      color: "text-[var(--fg-brand)]", bg: "bg-[var(--brand-soft)]",      border: "border-[var(--border-brand)]" },
  feature:  { icon: Sparkles,    label: "Feature",       color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  perf:     { icon: Zap,         label: "Performance",   color: "text-amber-600 dark:text-amber-400",   bg: "bg-amber-500/10",  border: "border-amber-500/20" },
  bug:      { icon: Bug,         label: "Bug Fix",       color: "text-red-600 dark:text-red-400",       bg: "bg-red-500/10",    border: "border-red-500/20" },
  design:   { icon: Palette,     label: "Design",        color: "text-pink-600 dark:text-pink-400",     bg: "bg-pink-500/10",   border: "border-pink-500/20" },
  security: { icon: ShieldCheck, label: "Security",      color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  seo:      { icon: TrendingUp,  label: "SEO",           color: "text-sky-600 dark:text-sky-400",       bg: "bg-sky-500/10",    border: "border-sky-500/20" },
  ai:       { icon: Bot,         label: "AI",            color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  infra:    { icon: Server,      label: "Infrastructure",color: "text-slate-600 dark:text-slate-400",   bg: "bg-slate-500/10",  border: "border-slate-500/20" },
};

// Group change items by type for structured rendering inside a release card
function groupByType(changes: { type: ChangeType; text: string }[]) {
  const order: ChangeType[] = ["tool", "feature", "ai", "perf", "design", "seo", "security", "infra", "bug"];
  const map = new Map<ChangeType, string[]>();
  for (const item of changes) {
    if (!map.has(item.type)) map.set(item.type, []);
    map.get(item.type)!.push(item.text);
  }
  return order.filter((t) => map.has(t)).map((t) => ({ type: t, items: map.get(t)! }));
}

// Count total changes by type across all releases (for the hero stats)
function countByType(type: ChangeType) {
  return releases.reduce((n, r) => n + r.changes.filter((c) => c.type === type).length, 0);
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",      item: siteConfig.url + "/" },
    { "@type": "ListItem", position: 2, name: "Changelog", item: siteConfig.url + "/changelog/" },
  ],
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ChangelogPage() {
  const totalTools   = countByType("tool");
  const totalBugFixes = countByType("bug");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen pt-20">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="border-b border-[var(--border-default)] bg-[var(--neutral-primary-soft)] py-16">
          <div className="container-xl max-w-4xl">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-[var(--radius-base)] bg-[var(--brand)] flex items-center justify-center">
                <GitCommitHorizontal className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-brand)]">
                Changelog
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--heading)] mb-4 leading-tight">
              Every update, documented.
            </h1>
            <p className="text-base text-[var(--body-subtle)] leading-relaxed max-w-2xl mb-8">
              A complete history of every release, new tool, improvement, and fix to AllConverter.tools
              since launch in May 2025. Updated with every release.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-3">
              {[
                { value: releases.length,  label: "releases" },
                { value: totalTools,       label: "tools shipped" },
                { value: totalBugFixes,    label: "bugs fixed" },
                { value: "May 2025",       label: "first release" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-2 rounded-[var(--radius-default)] border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] px-4 py-2"
                >
                  <span className="text-sm font-bold text-[var(--heading)] tabular-nums">{s.value}</span>
                  <span className="text-xs text-[var(--body-subtle)]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Legend strip ─────────────────────────────────────────────────── */}
        <div className="border-b border-[var(--border-default)] bg-[var(--neutral-primary-soft)]">
          <div className="container-xl max-w-4xl py-3 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              <span className="text-[11px] text-[var(--body-subtle)] mr-1 shrink-0">Key:</span>
              {(Object.entries(typeConfig) as [ChangeType, typeof typeConfig[ChangeType]][]).map(([, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <span
                    key={cfg.label}
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cfg.color} ${cfg.bg} ${cfg.border}`}
                  >
                    <Icon className="w-3 h-3" />
                    {cfg.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="container-xl max-w-4xl py-12">
          <div className="grid lg:grid-cols-[260px_1fr] gap-10">

            {/* ── Sidebar: version jump nav ─────────────────────────────── */}
            <aside className="hidden lg:block">
              <div className="sticky top-20">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--body-subtle)] mb-4">
                  Versions
                </p>
                <nav className="space-y-1">
                  {releases.map((r) => (
                    <a
                      key={r.version}
                      href={`#${r.version}`}
                      className={`flex items-center gap-2 rounded-[var(--radius-default)] px-3 py-2 text-sm transition-colors hover:bg-[var(--neutral-secondary-soft)] hover:text-[var(--fg-brand)] ${
                        r.isMajor
                          ? "font-semibold text-[var(--heading)]"
                          : "text-[var(--body-subtle)]"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${r.isMajor ? "bg-[var(--fg-brand)]" : "bg-[var(--border-default)]"}`} />
                      <span className="font-mono">{r.version}</span>
                      {r.codename && (
                        <span className="text-[10px] text-[var(--body-subtle)]">— {r.codename}</span>
                      )}
                    </a>
                  ))}
                </nav>

                <div className="mt-8 pt-6 border-t border-[var(--border-default)]">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--body-subtle)] mb-3">
                    Suggest a change
                  </p>
                  <a
                    href="mailto:feedback@allconverter.tools"
                    className="flex items-center gap-2 text-xs text-[var(--fg-brand)] hover:opacity-80 transition-opacity"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    feedback@allconverter.tools
                  </a>
                </div>
              </div>
            </aside>

            {/* ── Timeline ─────────────────────────────────────────────────── */}
            <main className="min-w-0">
              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-[7px] top-3 bottom-3 w-px bg-[var(--border-default)]" aria-hidden="true" />

                <div className="space-y-10">
                  {releases.map((release) => {
                    const groups = groupByType(release.changes);
                    return (
                      <div key={release.version} id={release.version} className="relative pl-8 scroll-mt-24">
                        {/* Timeline dot */}
                        <div
                          className={`absolute left-0 top-[14px] w-[15px] h-[15px] rounded-full border-2 ${
                            release.isMajor
                              ? "bg-[var(--brand)] border-[var(--brand)]"
                              : "bg-[var(--neutral-primary-soft)] border-[var(--border-default)]"
                          }`}
                          aria-hidden="true"
                        />

                        {/* Release card */}
                        <div
                          className={`rounded-[var(--radius-base)] border overflow-hidden ${
                            release.isMajor
                              ? "border-[var(--border-brand)] shadow-sm"
                              : "border-[var(--border-default)]"
                          }`}
                        >
                          {/* Card header */}
                          <div
                            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-[var(--border-default)] ${
                              release.isMajor
                                ? "bg-[var(--brand-soft)]"
                                : "bg-[var(--neutral-primary-soft)]"
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-wrap">
                              <span
                                className={`font-mono font-bold text-sm ${
                                  release.isMajor ? "text-[var(--fg-brand)]" : "text-[var(--heading)]"
                                }`}
                              >
                                {release.version}
                              </span>
                              {release.codename && (
                                <span className="rounded-full bg-[var(--brand)] px-2.5 py-0.5 text-[11px] font-semibold text-white">
                                  {release.codename}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-[var(--body-subtle)]">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{release.date}</span>
                            </div>
                          </div>

                          {/* Summary */}
                          <div className="px-6 py-4 border-b border-[var(--border-default)] bg-[var(--neutral-primary-soft)]">
                            <p className="text-sm text-[var(--body-subtle)] leading-relaxed">
                              {release.summary}
                            </p>
                          </div>

                          {/* Highlight callout */}
                          {release.highlight && (
                            <div className="px-6 py-3 border-b border-[var(--border-brand)] bg-[var(--brand-soft)]">
                              <p className="text-xs text-[var(--fg-brand)] leading-relaxed font-medium">
                                {release.highlight}
                              </p>
                            </div>
                          )}

                          {/* Change groups */}
                          <div className="px-6 py-5 bg-[var(--neutral-secondary-soft)] space-y-5">
                            {groups.map(({ type, items }) => {
                              const cfg = typeConfig[type];
                              const Icon = cfg.icon;
                              return (
                                <div key={type}>
                                  <div className="flex items-center gap-2 mb-2.5">
                                    <span
                                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cfg.color} ${cfg.bg} ${cfg.border}`}
                                    >
                                      <Icon className="w-3 h-3" />
                                      {cfg.label}
                                    </span>
                                  </div>
                                  <ul className="space-y-1.5">
                                    {items.map((text, i) => (
                                      <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--body-subtle)]">
                                        <span className="mt-[7px] w-1 h-1 rounded-full bg-[var(--body-subtle)] opacity-50 shrink-0" />
                                        {text}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            })}
                          </div>

                          {/* Change count footer */}
                          <div className="px-6 py-3 border-t border-[var(--border-default)] bg-[var(--neutral-primary-soft)]">
                            <span className="text-[11px] text-[var(--body-subtle)]">
                              {release.changes.length} change{release.changes.length !== 1 ? "s" : ""} in this release
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </main>
          </div>

          {/* ── Roadmap ───────────────────────────────────────────────────── */}
          <div className="mt-20 pt-12 border-t border-[var(--border-default)]">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-[var(--fg-brand)]" />
              <h2 className="text-xl font-bold text-[var(--heading)]">Public Roadmap</h2>
            </div>
            <p className="text-sm text-[var(--body-subtle)] mb-8 max-w-2xl leading-relaxed">
              What's being worked on, what's planned, and what's already shipped. This roadmap is shaped
              by user requests — if you want something on it, email{" "}
              <a href="mailto:feedback@allconverter.tools" className="text-[var(--fg-brand)] hover:underline">
                feedback@allconverter.tools
              </a>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Planned */}
              <div className="rounded-[var(--radius-base)] border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[var(--border-default)] bg-[var(--neutral-secondary-soft)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                  <span className="text-sm font-semibold text-[var(--heading)]">Planned</span>
                  <span className="ml-auto text-[11px] text-[var(--body-subtle)] font-mono">
                    {roadmap.planned.length}
                  </span>
                </div>
                <ul className="px-5 py-4 space-y-3">
                  {roadmap.planned.map((item) => (
                    <li key={item.text} className="flex items-start gap-2.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-[var(--body-subtle)] leading-relaxed">
                        {item.text}
                        {item.priority === "high" && (
                          <span className="ml-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] px-1.5 py-0.5 font-medium">
                            high
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* In Progress */}
              <div className="rounded-[var(--radius-base)] border border-amber-500/30 bg-[var(--neutral-primary-soft)] overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-amber-500/20 bg-amber-500/5">
                  <RefreshCw className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                  <span className="text-sm font-semibold text-[var(--heading)]">In Progress</span>
                  <span className="ml-auto text-[11px] text-[var(--body-subtle)] font-mono">
                    {roadmap.inProgress.length}
                  </span>
                </div>
                <ul className="px-5 py-4 space-y-3">
                  {roadmap.inProgress.map((item) => (
                    <li key={item.text} className="flex items-start gap-2.5">
                      <div className="w-3.5 h-3.5 shrink-0 mt-0.5 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      </div>
                      <span className="text-xs text-[var(--body-subtle)] leading-relaxed">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Completed */}
              <div className="rounded-[var(--radius-base)] border border-emerald-500/30 bg-[var(--neutral-primary-soft)] overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-emerald-500/20 bg-emerald-500/5">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                  <span className="text-sm font-semibold text-[var(--heading)]">Completed</span>
                  <span className="ml-auto text-[11px] text-[var(--body-subtle)] font-mono">
                    {roadmap.completed.length}
                  </span>
                </div>
                <ul className="px-5 py-4 space-y-3">
                  {roadmap.completed.map((item) => (
                    <li key={item.text} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-[var(--body-subtle)] leading-relaxed line-through decoration-[var(--body-subtle)]/30">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Feature Request ───────────────────────────────────────────── */}
          <div className="mt-16 pt-10 border-t border-[var(--border-default)]">
            <div className="grid sm:grid-cols-2 gap-4">
              <a
                href="mailto:feedback@allconverter.tools?subject=Feature Request"
                className="group flex flex-col gap-3 p-5 rounded-[var(--radius-base)] border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] hover:border-[var(--border-brand)] hover:bg-[var(--brand-soft)] transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-500 shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-[var(--heading)] group-hover:text-[var(--fg-brand)] transition-colors">
                      Suggest a tool or feature
                    </p>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--body-subtle)] opacity-0 group-hover:opacity-60 -translate-x-1 group-hover:translate-x-0 transition-all" />
                  </div>
                  <p className="text-xs text-[var(--body-subtle)] mt-1 leading-relaxed">
                    Have a tool idea or improvement in mind? Most of the roadmap is driven by user requests.
                    Describe what you need and why — specific ideas get built faster.
                  </p>
                  <p className="text-xs font-mono text-[var(--fg-brand)] mt-2">feedback@allconverter.tools</p>
                </div>
              </a>

              <a
                href="mailto:bugs@allconverter.tools?subject=Bug Report"
                className="group flex flex-col gap-3 p-5 rounded-[var(--radius-base)] border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] hover:border-[var(--border-brand)] hover:bg-[var(--brand-soft)] transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                  <Bug className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-[var(--heading)] group-hover:text-[var(--fg-brand)] transition-colors">
                      Report a bug
                    </p>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--body-subtle)] opacity-0 group-hover:opacity-60 -translate-x-1 group-hover:translate-x-0 transition-all" />
                  </div>
                  <p className="text-xs text-[var(--body-subtle)] mt-1 leading-relaxed">
                    Something not working as expected? Bug reports are prioritised. Include the tool name,
                    your browser, and what you expected vs what happened.
                  </p>
                  <p className="text-xs font-mono text-[var(--fg-brand)] mt-2">bugs@allconverter.tools</p>
                </div>
              </a>
            </div>
          </div>

          {/* ── Footer CTA ───────────────────────────────────────────────── */}
          <div className="mt-12">
            <div className="rounded-[var(--radius-base)] border border-[var(--border-brand)] bg-[var(--brand-soft)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-[var(--heading)]">
                  Everything on this changelog is live and free to use.
                </p>
                <p className="text-sm text-[var(--body-subtle)] mt-1">
                  250+ tools across 12 categories — no account, no payment, no limits.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0 flex-wrap">
                <Link
                  href="/tools/"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Browse all tools
                </Link>
                <Link
                  href="/contact/"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] text-sm font-medium text-[var(--heading)] hover:border-[var(--border-brand)] transition-colors"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
