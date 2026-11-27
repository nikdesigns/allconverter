import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo-utils";

export const dynamic = "force-static";

// One rule for every crawler — search engines, social previews and AI crawlers
// (GPTBot, ClaudeBot, PerplexityBot…) are all welcome. Naming bots individually
// would put them in their own group, where the shared rules below no longer apply.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
