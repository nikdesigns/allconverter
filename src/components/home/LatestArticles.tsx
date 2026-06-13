import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { allBlogPosts } from "@/data/blog-posts";

const featured = allBlogPosts
  .filter((p) => p.isFeatured || p.isPillar)
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  .slice(0, 6);

const categoryColors: Record<string, string> = {
  "pdf-tools":       "bg-red-500/10 text-red-500",
  "image-tools":     "bg-violet-500/10 text-violet-500",
  "developer-tools": "bg-sky-500/10 text-sky-500",
  "seo-tools":       "bg-emerald-500/10 text-emerald-500",
  "ai-tools":        "bg-amber-500/10 text-amber-500",
  "finance":         "bg-teal-500/10 text-teal-500",
  "business":        "bg-orange-500/10 text-orange-500",
  "audio-tools":     "bg-pink-500/10 text-pink-500",
  "text-tools":      "bg-indigo-500/10 text-indigo-500",
};

const categoryLabel: Record<string, string> = {
  "pdf-tools":       "PDF",
  "image-tools":     "Images",
  "developer-tools": "Developer",
  "seo-tools":       "SEO",
  "ai-tools":        "AI Tools",
  "finance":         "Finance",
  "business":        "Business",
  "audio-tools":     "Audio",
  "text-tools":      "Text",
};

export function LatestArticles() {
  return (
    <section className="py-16 lg:py-20 border-t border-(--border-default)">
      <div className="container-xl">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-fg-brand" />
              <span className="text-xs font-semibold text-fg-brand uppercase tracking-wider">
                Learn & Guide
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--heading)">
              Latest guides & articles
            </h2>
            <p className="text-(--body-subtle) text-sm mt-1">
              In-depth tutorials to get the most out of every tool
            </p>
          </div>
          <Link
            href="/blog/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-brand hover:underline shrink-0"
          >
            View all articles
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((post) => {
            const colorClass = categoryColors[post.category] ?? "bg-gray-500/10 text-gray-500";
            const label = categoryLabel[post.category] ?? post.category;
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.category}/${post.slug}/`}
                className="group flex flex-col gap-3 rounded-(--radius-base) border border-(--border-default) bg-(--neutral-primary-soft) p-5 hover:border-(--border-brand) hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${colorClass}`}>
                    {label}
                  </span>
                  {post.isPillar && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-(--brand-soft) text-fg-brand">
                      Pillar
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-(--heading) leading-snug group-hover:text-fg-brand transition-colors line-clamp-2">
                  {post.h1}
                </h3>

                <p className="text-xs text-(--body-subtle) leading-relaxed line-clamp-2 flex-1">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-(--border-default)">
                  <div className="flex items-center gap-1 text-[11px] text-(--body-subtle)">
                    <Clock className="w-3 h-3" />
                    {post.readingTime} min read
                  </div>
                  <span className="text-[11px] font-medium text-fg-brand group-hover:underline flex items-center gap-1">
                    Read article
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Category quick links */}
        <div className="flex flex-wrap gap-2 mt-6">
          {Object.entries(categoryLabel).map(([slug, label]) => (
            <Link
              key={slug}
              href={`/blog/${slug}/`}
              className="text-xs px-3 py-1.5 rounded-full border border-(--border-default) bg-(--neutral-secondary-soft) text-(--body-subtle) hover:border-(--border-brand) hover:text-fg-brand transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
