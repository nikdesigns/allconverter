import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools-data";
import { categories } from "@/lib/categories";
import { siteConfig } from "@/lib/seo-utils";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const homepage: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.url}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/tools/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
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

  return [...homepage, ...categoryPages, ...toolPages];
}
