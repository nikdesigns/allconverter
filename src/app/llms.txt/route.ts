import { tools } from "@/lib/tools-data";
import { categories } from "@/lib/categories";
import { allBlogPosts } from "@/data/blog-posts";
import { siteConfig } from "@/lib/seo-utils";

export const dynamic = "force-static";

/**
 * /llms.txt — a plain-text map of the site for AI assistants and crawlers
 * (https://llmstxt.org). Built from the same data as the pages, so it stays
 * in sync with the catalogue.
 */
export function GET() {
  const url = siteConfig.url;
  const lines: string[] = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "All tools are free, need no account, and run in the visitor's browser.",
    "",
    "## Tool categories",
    "",
  ];

  for (const cat of categories) {
    const inCategory = tools.filter((t) => t.category === cat.slug && !t.unavailable);
    lines.push(`- [${cat.name}](${url}/${cat.slug}/): ${cat.description} (${inCategory.length} tools)`);
  }

  for (const cat of categories) {
    const inCategory = tools.filter((t) => t.category === cat.slug && !t.unavailable);
    if (inCategory.length === 0) continue;
    lines.push("", `## ${cat.name}`, "");
    for (const tool of inCategory) {
      lines.push(`- [${tool.name}](${url}/tools/${tool.slug}/): ${tool.tagline}`);
    }
  }

  lines.push("", "## Guides", "");
  for (const post of allBlogPosts) {
    lines.push(`- [${post.h1}](${url}/blog/${post.category}/${post.slug}/): ${post.excerpt}`);
  }

  lines.push(
    "",
    "## About",
    "",
    `- [About](${url}/about/)`,
    `- [Contact](${url}/contact/)`,
    `- [Privacy](${url}/privacy/)`,
    ""
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
