import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools-data";
import { categories } from "@/lib/categories";
import { siteConfig } from "@/lib/seo-utils";
import { allBlogPosts } from "@/data/blog-posts";
import { blogCategories } from "@/data/blog-categories";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Stable dates — avoids signalling "everything changed" on every deploy,
  // which teaches crawlers to ignore lastmod. Bump siteConfig.lastUpdated
  // when tool/category pages actually change.
  const d = (s: string) => new Date(s);
  const now = d(siteConfig.lastUpdated);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`,           lastModified: now,              changeFrequency: "daily",   priority: 1.0 },
    { url: `${siteConfig.url}/tools/`,     lastModified: now,              changeFrequency: "daily",   priority: 0.9 },
    { url: `${siteConfig.url}/blog/`,      lastModified: now,              changeFrequency: "daily",   priority: 0.9 },
    { url: `${siteConfig.url}/about/`,     lastModified: d("2025-01-01"),  changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/changelog/`, lastModified: now,              changeFrequency: "weekly",  priority: 0.6 },
    { url: `${siteConfig.url}/contact/`,   lastModified: d("2025-01-01"),  changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/sitemap/`,   lastModified: now,              changeFrequency: "weekly",  priority: 0.5 },
    { url: `${siteConfig.url}/workflows/`,     lastModified: now,          changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/security/`,      lastModified: d("2025-01-01"), changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteConfig.url}/support/`,       lastModified: d("2025-01-01"), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/author/nitin/`,  lastModified: d("2025-01-01"), changeFrequency: "monthly", priority: 0.5 },
    // privacy/terms/cookies/disclaimer excluded — boilerplate, consume crawl budget without ranking value
  ];

  const toolCategoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${siteConfig.url}/${cat.slug}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Dedupe by slug so a repeated entry in tools-data can't emit a URL twice.
  const uniqueTools = [...new Map(tools.map((t) => [t.slug, t])).values()].filter((t) => !t.unavailable);
  const toolPages: MetadataRoute.Sitemap = uniqueTools.map((tool) => ({
    url: `${siteConfig.url}/tools/${tool.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: tool.isFeatured ? 0.8 : tool.isPopular ? 0.75 : 0.7,
  }));

  const blogCategoryPages: MetadataRoute.Sitemap = blogCategories.map((cat) => ({
    url: `${siteConfig.url}/blog/${cat.slug}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const blogPostPages: MetadataRoute.Sitemap = allBlogPosts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.category}/${post.slug}/`,
    lastModified: d(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly",
    priority: post.isPillar ? 0.8 : post.isFeatured ? 0.75 : 0.65,
  }));

  return [
    ...staticPages,
    ...toolCategoryPages,
    ...toolPages,
    ...blogCategoryPages,
    ...blogPostPages,
  ];
}
