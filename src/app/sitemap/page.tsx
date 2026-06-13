import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText, Image, Type, Code2, Search, Calculator,
  ArrowLeftRight, Sparkles, Briefcase, Music,
  Globe, Palette, Map, ExternalLink, BookOpen,
} from "lucide-react";
import { tools } from "@/lib/tools-data";
import { categories } from "@/lib/categories";
import { siteConfig } from "@/lib/seo-utils";
import { allBlogPosts } from "@/data/blog-posts";
import { blogCategories } from "@/data/blog-categories";

export const metadata: Metadata = {
  title: "Sitemap — All Tools & Pages",
  description:
    "Complete sitemap of AllConverter.tools — browse all 100+ free online tools organized by category: PDF, image, text, developer, SEO, business, audio, AI tools and more.",
  alternates: { canonical: `${siteConfig.url}/sitemap/` },
  robots: { index: true, follow: true },
};

const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "pdf-tools": FileText,
  "image-tools": Image,
  "text-tools": Type,
  "developer-tools": Code2,
  "seo-tools": Search,
  "calculators": Calculator,
  "unit-converters": ArrowLeftRight,
  "ai-tools": Sparkles,
  "business-tools": Briefcase,
  "audio-tools": Music,
  "color-tools": Palette,
  "network-tools": Globe,
};

const categoryColorMap: Record<string, string> = {
  "pdf-tools": "text-red-500",
  "image-tools": "text-violet-500",
  "text-tools": "text-blue-500",
  "developer-tools": "text-emerald-500",
  "seo-tools": "text-orange-500",
  "calculators": "text-sky-500",
  "unit-converters": "text-teal-500",
  "ai-tools": "text-purple-500",
  "business-tools": "text-amber-500",
  "audio-tools": "text-pink-500",
  "color-tools": "text-fuchsia-500",
  "network-tools": "text-cyan-500",
};

const staticPages = [
  { href: "/",           label: "Home",            desc: "Convert anything — all in one place" },
  { href: "/tools/",     label: "All Tools",        desc: "Browse every tool on the platform" },
  { href: "/blog/",      label: "Blog",             desc: "Guides, comparisons & tutorials" },
  { href: "/about/",     label: "About",            desc: "The story behind AllConverter.tools" },
  { href: "/changelog/", label: "Changelog",        desc: "Release history and what's new" },
  { href: "/contact/",   label: "Contact",          desc: "Get in touch with us" },
  { href: "/security/",  label: "Security",         desc: "How we protect your data and privacy" },
  { href: "/privacy/",   label: "Privacy Policy",   desc: "What we collect and how we use it" },
  { href: "/terms/",     label: "Terms of Service", desc: "Usage terms and conditions" },
  { href: "/cookies/",   label: "Cookie Policy",    desc: "Our approach to cookies" },
];

function CategorySection({
  slug,
  name,
  description,
  toolList,
}: {
  slug: string;
  name: string;
  description: string;
  toolList: { slug: string; name: string }[];
}) {
  const Icon = categoryIconMap[slug] ?? Code2;
  const color = categoryColorMap[slug] ?? "text-[var(--fg-brand)]";

  return (
    <section id={slug} className="scroll-mt-24 py-8 border-b border-[var(--border-default)] last:border-0">
      {/* Section header */}
      <div className="flex items-start gap-3 mb-5">
        <div className="shrink-0 w-9 h-9 rounded-lg bg-[var(--neutral-secondary-soft)] border border-[var(--border-default)] flex items-center justify-center">
          <Icon className={`w-4.5 h-4.5 ${color}`} />
        </div>
        <div>
          <Link
            href={`/${slug}/`}
            className="group inline-flex items-center gap-1.5 font-semibold text-[var(--heading)] hover:text-[var(--fg-brand)] transition-colors"
          >
            {name}
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
          </Link>
          <p className="text-xs text-[var(--body-subtle)] mt-0.5">{description}</p>
        </div>
        <span className="ml-auto shrink-0 text-xs text-[var(--body-subtle)] bg-[var(--neutral-secondary-soft)] border border-[var(--border-default)] rounded-full px-2.5 py-0.5">
          {toolList.length} tools
        </span>
      </div>

      {/* Tool links grid */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 pl-12">
        {toolList.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/tools/${tool.slug}/`}
              className="text-sm text-[var(--body-subtle)] hover:text-[var(--fg-brand)] transition-colors py-0.5 inline-block leading-snug"
            >
              {tool.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function SitemapPage() {
  const toolsByCategory = categories.map((cat) => ({
    ...cat,
    toolList: tools.filter((t) => t.category === cat.slug),
  }));

  const quickNavOrder = [
    "pdf-tools", "image-tools", "text-tools", "developer-tools",
    "seo-tools", "calculators", "unit-converters", "ai-tools",
    "business-tools", "audio-tools", "color-tools", "network-tools",
  ];

  const orderedCategories = [
    ...quickNavOrder
      .map((s) => toolsByCategory.find((c) => c.slug === s))
      .filter(Boolean),
    ...toolsByCategory.filter((c) => !quickNavOrder.includes(c.slug)),
  ] as typeof toolsByCategory;

  return (
    <div className="min-h-screen pt-20">

      {/* Hero */}
      <section className="border-b border-[var(--border-default)] bg-[var(--neutral-primary-soft)] py-12">
        <div className="container-xl max-w-4xl">
          <div className="flex items-center gap-2 mb-3">
            <Map className="w-5 h-5 text-[var(--fg-brand)]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--fg-brand)]">Site Map</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--heading)] mb-3">
            Everything on AllConverter.tools
          </h1>
          <p className="text-sm text-[var(--body-subtle)] leading-relaxed max-w-2xl">
            {tools.length} free online tools across {categories.length} categories — no sign-up, no limits,
            all browser-based. Use the quick links below to jump to any section.
          </p>

          {/* Quick-nav chips */}
          <div className="flex flex-wrap gap-2 mt-6">
            {orderedCategories.map((cat) => {
              const Icon = categoryIconMap[cat.slug] ?? Code2;
              const color = categoryColorMap[cat.slug] ?? "text-[var(--fg-brand)]";
              return (
                <a
                  key={cat.slug}
                  href={`#${cat.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] hover:border-[var(--border-brand)] hover:text-[var(--fg-brand)] transition-colors"
                >
                  <Icon className={`w-3 h-3 ${color}`} />
                  {cat.name}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <div className="container-xl max-w-4xl">

        {/* Static pages */}
        <section className="py-8 border-b border-[var(--border-default)]">
          <h2 className="text-sm font-semibold text-[var(--heading)] uppercase tracking-widest mb-4">
            Main Pages
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {staticPages.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="flex flex-col gap-0.5 p-3 rounded-lg border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] hover:border-[var(--border-brand)] hover:bg-[var(--brand-soft)] transition-colors group"
                >
                  <span className="text-sm font-medium text-[var(--heading)] group-hover:text-[var(--fg-brand)] transition-colors">
                    {page.label}
                  </span>
                  <span className="text-xs text-[var(--body-subtle)]">{page.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Blog section */}
        <section className="py-8 border-b border-[var(--border-default)]">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-fg-brand" />
            <h2 className="text-sm font-semibold text-(--heading) uppercase tracking-widest">
              Blog &amp; Guides
            </h2>
            <span className="ml-auto text-xs text-(--body-subtle) bg-(--neutral-secondary-soft) border border-(--border-default) rounded-full px-2.5 py-0.5">
              {allBlogPosts.length} articles
            </span>
          </div>
          {blogCategories.map((cat) => {
            const posts = allBlogPosts.filter((p) => p.category === cat.slug);
            if (!posts.length) return null;
            return (
              <div key={cat.slug} className="mb-5">
                <Link
                  href={`/blog/${cat.slug}/`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-fg-brand hover:underline mb-2"
                >
                  {cat.name}
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </Link>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
                  {posts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.category}/${post.slug}/`}
                        className="text-sm text-(--body-subtle) hover:text-fg-brand transition-colors py-0.5 inline-block leading-snug"
                      >
                        {post.h1}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>

        {/* Tool categories */}
        <section>
          <h2 className="text-sm font-semibold text-[var(--heading)] uppercase tracking-widest mt-8 mb-2">
            Tools by Category
          </h2>
          {orderedCategories.map((cat) => (
            <CategorySection
              key={cat.slug}
              slug={cat.slug}
              name={cat.name}
              description={cat.description}
              toolList={cat.toolList}
            />
          ))}
        </section>

      </div>

      {/* Footer note */}
      <div className="border-t border-[var(--border-default)] bg-[var(--neutral-primary-soft)] mt-6">
        <div className="container-xl max-w-4xl py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-[var(--body-subtle)]">
            {tools.length} tools indexed &mdash; updated automatically when new tools are added.
          </p>
          <a
            href={`${siteConfig.url}/sitemap.xml`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--fg-brand)] hover:opacity-80 transition-opacity"
          >
            <ExternalLink className="w-3 h-3" />
            XML Sitemap for search engines
          </a>
        </div>
      </div>

    </div>
  );
}
