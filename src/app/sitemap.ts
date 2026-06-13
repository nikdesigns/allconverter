import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools-data";
import { categories } from "@/lib/categories";
import { siteConfig } from "@/lib/seo-utils";
import { allBlogPosts } from "@/data/blog-posts";
import { blogCategories } from "@/data/blog-categories";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`,           lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${siteConfig.url}/tools/`,     lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${siteConfig.url}/blog/`,      lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${siteConfig.url}/about/`,     lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/changelog/`, lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${siteConfig.url}/contact/`,   lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/sitemap/`,   lastModified: now, changeFrequency: "weekly",  priority: 0.5 },
    { url: `${siteConfig.url}/privacy/`,   lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${siteConfig.url}/terms/`,     lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${siteConfig.url}/cookies/`,   lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${siteConfig.url}/security/`,  lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${siteConfig.url}/disclaimer/`,lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  const toolCategoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${siteConfig.url}/${cat.slug}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
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
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
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
