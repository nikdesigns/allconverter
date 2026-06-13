import type { Metadata } from "next";
import Link from "next/link";
import { blogCategories } from "@/data/blog-categories";
import { getFeaturedPosts, getRecentPosts } from "@/lib/blog-utils";
import { FeaturedCard } from "@/components/blog/FeaturedCard";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { AdUnit } from "@/components/ads/AdUnit";

const SITE_URL = "https://allconverter.tools";
const SITE_NAME = "AllConverter.tools";

export const metadata: Metadata = {
  title: `Blog — Tools Guides, Tutorials & Tips | ${SITE_NAME}`,
  description:
    "Expert guides on PDF tools, image formats, developer utilities, SEO, finance, business, AI writing, and audio tools. Free tutorials from the team behind 250+ free tools.",
  alternates: { canonical: `${SITE_URL}/blog/` },
  openGraph: {
    title: `Blog | ${SITE_NAME}`,
    description: "Expert guides on PDF tools, image formats, developer utilities, SEO, finance, business, AI writing, and audio tools.",
    url: `${SITE_URL}/blog/`,
    siteName: SITE_NAME,
    type: "website",
  },
};

export default function BlogPage() {
  const featured = getFeaturedPosts(3);
  const recent = getRecentPosts(12);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog/` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 flex-wrap">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Blog</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Guides & Tutorials
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            In-depth guides on PDF tools, image formats, developer utilities, SEO, finance, AI writing, and more — from the team behind {SITE_NAME}.
          </p>
        </div>

        {/* Featured Articles */}
        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-bold text-foreground mb-4">Featured Guides</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {featured.map((post) => (
                <FeaturedCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-foreground mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {blogCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog/${cat.slug}/`}
                className="group flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
                <span className="text-xs text-muted-foreground line-clamp-2">{cat.description}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* In-feed ad — between categories and recent articles */}
        <AdUnit slot="1096054855" format="auto" responsive minHeight={100} className="mb-12" />

        {/* Recent Articles */}
        {recent.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-foreground mb-4">Recent Articles</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((post) => (
                <ArticleCard key={post.slug} post={post} showCategory />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
