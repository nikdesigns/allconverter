export type BlogCategorySlug =
  | "pdf-tools"
  | "image-tools"
  | "developer-tools"
  | "seo-tools"
  | "finance"
  | "business"
  | "ai-tools"
  | "audio-tools"
  | "text-tools";

export type ArticleType =
  | "pillar"        // Long-form comprehensive guide (1500+ words)
  | "tutorial"      // How-to guide with numbered steps
  | "comparison"    // X vs Y comparisons
  | "educational"   // What is X? explainers
  | "troubleshoot"  // Fix / debug guides
  | "use-case"      // Industry or scenario-based articles
  | "glossary";     // Definition / reference

export type SearchIntent = "informational" | "navigational" | "commercial" | "transactional";

// ─── Content Blocks (rendered by ArticleBody component) ───────────────────────

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; variant: "tip" | "warning" | "info" | "note"; heading?: string; text: string }
  | { type: "cta"; heading: string; text: string; href: string; label: string }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  | { type: "ad"; slot: string };

export interface TOCItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  category: BlogCategorySlug;
  type: ArticleType;
  intent: SearchIntent;
  priorityScore: number;       // 1–10 for content calendar ordering
  publishedAt: string;         // ISO date
  updatedAt?: string;
  readingTime: number;         // minutes
  isFeatured?: boolean;
  isPillar?: boolean;

  // SEO
  seoTitle: string;            // <title> tag
  metaDescription: string;     // max 160 chars
  h1: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  tags: string[];

  // Rendering
  excerpt: string;             // 1-2 sentences shown on cards
  tableOfContents: TOCItem[];
  content: ContentBlock[];
  faqs: BlogFAQ[];

  // Internal linking
  relatedToolSlugs: string[];   // links to tool pages
  relatedArticleSlugs: string[]; // links to other blog posts
  pillarSlug?: string;          // parent pillar (for cluster articles)
}

export interface BlogCategoryMeta {
  slug: BlogCategorySlug;
  name: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  icon: string;
  color: string;
  gradient: string;
  toolCategorySlug?: string;   // maps to a /[category]/ tool page
  featuredArticleSlug?: string;
}
