import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogCategories } from "@/data/blog-categories";
import { allBlogPosts } from "@/data/blog-posts";
import { getBlogPost, getRelatedPosts, getBlogCategory } from "@/lib/blog-utils";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { AuthorBox } from "@/components/blog/AuthorBox";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { BlogBreadcrumbs } from "@/components/blog/BlogBreadcrumbs";
import { AdUnit } from "@/components/ads/AdUnit";
import type { BlogCategorySlug } from "@/types/blog";

const SITE_URL = "https://allconverter.tools";
const SITE_NAME = "AllConverter.tools";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  return allBlogPosts.map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const post = getBlogPost(category as BlogCategorySlug, slug);
  if (!post) return {};

  return {
    title: post.seoTitle,
    description: post.metaDescription,
    keywords: [post.primaryKeyword, ...post.secondaryKeywords].join(", "),
    alternates: { canonical: `${SITE_URL}/blog/${category}/${slug}/` },
    openGraph: {
      title: post.seoTitle,
      description: post.metaDescription,
      url: `${SITE_URL}/blog/${category}/${slug}/`,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      tags: post.tags,
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { category, slug } = await params;
  const post = getBlogPost(category as BlogCategorySlug, slug);
  if (!post) notFound();

  const cat = getBlogCategory(category as BlogCategorySlug);
  const related = getRelatedPosts(post, 3);

  // Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": post.type === "pillar" || post.type === "educational" ? "Article" : "HowTo",
    headline: post.h1,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${category}/${slug}/` },
    keywords: [post.primaryKeyword, ...post.secondaryKeywords].join(", "),
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog/` },
      { "@type": "ListItem", position: 3, name: cat?.name ?? category, item: `${SITE_URL}/blog/${category}/` },
      { "@type": "ListItem", position: 4, name: post.h1, item: `${SITE_URL}/blog/${category}/${slug}/` },
    ],
  };

  // FAQ Schema
  const faqSchema = post.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  const schemas = [articleSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
          {/* Main Content */}
          <main className="min-w-0">
            <BlogBreadcrumbs category={cat} articleTitle={post.h1} />

            <div className="mt-4 mb-6">
              {post.isPillar && (
                <span className="inline-block mb-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wide">
                  Ultimate Guide
                </span>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                {post.h1}
              </h1>
              <p className="mt-3 text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
            </div>

            <AuthorBox
              publishedAt={post.publishedAt}
              updatedAt={post.updatedAt}
              readingTime={post.readingTime}
            />

            {/* In-article ad — high viewability slot directly below author box */}
            <AdUnit slot="1096054855" format="auto" responsive minHeight={100} className="mt-6" />

            {/* Mobile TOC */}
            {post.tableOfContents.length > 0 && (
              <div className="lg:hidden mt-6 rounded-xl border border-border bg-muted/30 p-4">
                <TableOfContents items={post.tableOfContents} />
              </div>
            )}

            {/* Article Body */}
            <div className="mt-8">
              <ArticleBody content={post.content} />
            </div>

            {/* FAQs */}
            {post.faqs.length > 0 && (
              <section className="mt-12">
                <h2 className="text-base font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
                <div className="space-y-5">
                  {post.faqs.map((faq, i) => (
                    <div key={i} className="rounded-xl border border-border p-5">
                      <h3 className="text-sm font-semibold text-foreground mb-2">{faq.question}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related Tools */}
            {post.relatedToolSlugs.length > 0 && (
              <section className="mt-10">
                <h2 className="text-lg font-bold text-foreground mb-3">Related Tools</h2>
                <div className="flex flex-wrap gap-2">
                  {post.relatedToolSlugs.map((toolSlug) => (
                    <Link
                      key={toolSlug}
                      href={`/tools/${toolSlug}/`}
                      className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                    >
                      {toolSlug.replace(/-/g, " ")} →
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Related Articles */}
            {related.length > 0 && (
              <div className="mt-10">
                <RelatedArticles posts={related} />
              </div>
            )}
          </main>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 flex flex-col gap-5">
              {post.tableOfContents.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-5">
                  <TableOfContents items={post.tableOfContents} />
                </div>
              )}
              {/* Sidebar rectangle ad — 300×250, sits below TOC */}
              <AdUnit
                slot="8443766688"
                format="rectangle"
                responsive={false}
                minHeight={250}
                className="w-full"
              />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
