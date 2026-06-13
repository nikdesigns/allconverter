import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogCategories } from "@/data/blog-categories";
import { getPostsByCategory, getBlogCategory } from "@/lib/blog-utils";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { FeaturedCard } from "@/components/blog/FeaturedCard";
import { BlogBreadcrumbs } from "@/components/blog/BlogBreadcrumbs";
import { AdUnit } from "@/components/ads/AdUnit";
import type { BlogCategorySlug } from "@/types/blog";

const SITE_URL = "https://allconverter.tools";
const SITE_NAME = "AllConverter.tools";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return blogCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getBlogCategory(category as BlogCategorySlug);
  if (!cat) return {};

  return {
    title: cat.metaTitle,
    description: cat.metaDescription,
    alternates: { canonical: `${SITE_URL}/blog/${cat.slug}/` },
    openGraph: {
      title: cat.metaTitle,
      description: cat.metaDescription,
      url: `${SITE_URL}/blog/${cat.slug}/`,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getBlogCategory(category as BlogCategorySlug);
  if (!cat) notFound();

  const posts = getPostsByCategory(category as BlogCategorySlug);
  if (!posts.length) notFound();

  const pillar = posts.find((p) => p.isPillar);
  const rest = posts.filter((p) => !p.isPillar);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog/` },
      { "@type": "ListItem", position: 3, name: cat.name, item: `${SITE_URL}/blog/${cat.slug}/` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="mb-8">
          <BlogBreadcrumbs category={cat} />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-3">
            {cat.name} Guides
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">{cat.description}</p>

          {cat.toolCategorySlug && (
            <Link
              href={`/${cat.toolCategorySlug}/`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Browse {cat.name} tools →
            </Link>
          )}
        </div>

        {/* Pillar Article */}
        {pillar && (
          <section className="mb-10">
            <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Ultimate Guide
            </h2>
            <FeaturedCard post={pillar} />
          </section>
        )}

        {/* In-feed ad — between pillar card and article grid */}
        <AdUnit slot="1096054855" format="auto" responsive minHeight={100} className="mb-10" />

        {/* Cluster Articles */}
        {rest.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-foreground mb-4">Articles</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
