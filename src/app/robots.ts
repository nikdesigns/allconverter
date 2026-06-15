import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo-utils";

export const dynamic = "force-static";

const allowedBots: string[] = [
  // Search engines
  "Googlebot",
  "Googlebot-Image",
  "Googlebot-Video",
  "Googlebot-News",
  "bingbot",
  "Slurp",            // Yahoo
  "DuckDuckBot",
  "Baiduspider",
  "YandexBot",
  "Sogou",
  "Exabot",           // Google France
  "ia_archiver",      // Internet Archive / Wayback Machine
  // Social crawlers
  "facebookexternalhit",
  "Twitterbot",
  "LinkedInBot",
  "WhatsApp",
  "Discordbot",
  "Slackbot",
  "TelegramBot",
  // AI crawlers
  "GPTBot",           // OpenAI
  "ChatGPT-User",
  "ClaudeBot",        // Anthropic
  "Claude-Web",
  "PerplexityBot",
  "Applebot",
  "Amazonbot",
  // SEO tools
  "AhrefsBot",
  "SemrushBot",
  "MJ12bot",          // Majestic
  "DotBot",           // Moz
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...allowedBots.map((bot) => ({
        userAgent: bot,
        allow: "/",
      })),
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
