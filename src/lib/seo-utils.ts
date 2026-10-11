import type { Tool, ToolCategory_Data, BreadcrumbItem } from "@/types";
import { getApplicationCategory } from "@/lib/tool-content-gen";

const SITE_NAME = "AllConverter.tools";
const SITE_URL = "https://allconverter.tools";
const SITE_TAGLINE = "250+ Free Tools — PDF, Images, Audio, AI & More";

export const siteConfig = {
  name: SITE_NAME,
  url: SITE_URL,
  tagline: SITE_TAGLINE,
  description:
    "250+ free online tools for PDF, images, audio, AI, developer & business tasks. 100% browser-based — no sign-up, no file uploads, no limits. Works on any device.",
  twitter: "@allconvertertools",
  locale: "en_US",
  /**
   * Date of the last site-wide content change. Used as the sitemap
   * lastModified for tool and category pages — bump it when you ship changes
   * to them, rather than stamping every URL with the build time.
   */
  lastUpdated: "2026-10-11",
};

/** Shared 1200×630 social preview image (public/og-default.png). */
export const defaultOgImages = [
  {
    url: `${SITE_URL}/og-default.png`,
    width: 1200,
    height: 630,
    alt: `${SITE_NAME} — 250+ Free Online Tools`,
  },
];

/**
 * Removes a trailing "| AllConverter.tools" from a title. The root layout's
 * title template appends the brand once, so page titles must not include it.
 */
export function stripBrand(title: string): string {
  return title.replace(/\s*\|\s*AllConverter\.tools\s*$/i, "").trim();
}

/** Shortens text to `max` chars at a sentence or word boundary — never mid-word. */
export function truncateAtWord(text: string, max = 160): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const head = t.slice(0, max);
  if (/[.!?]$/.test(head) && t[max] === " ") return head;
  const sentenceEnd = Math.max(head.lastIndexOf(". "), head.lastIndexOf("! "), head.lastIndexOf("? "));
  if (sentenceEnd >= 90) return head.slice(0, sentenceEnd + 1);
  const cut = t.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${cut.slice(0, space > 0 ? space : cut.length).replace(/[\s,;:—–-]+$/, "")}…`;
}

/**
 * Builds a meta description from sentences in priority order, keeping only
 * the ones that fit within `max` chars so nothing is cut off mid-sentence.
 */
export function fitDescription(sentences: string[], max = 160): string {
  const clean = sentences
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (/[.!?…]$/.test(s) ? s : `${s}.`));
  let out = "";
  for (const s of clean) {
    const next = out ? `${out} ${s}` : s;
    if (next.length <= max) out = next;
    else if (!out) return truncateAtWord(s, max);
  }
  return out;
}

/** Open Graph block for pages that only need the defaults plus their own URL. */
export function baseOpenGraph(path: string) {
  return {
    type: "website" as const,
    locale: "en_US",
    siteName: SITE_NAME,
    url: `${SITE_URL}${path}`,
    images: defaultOgImages,
  };
}

// ── Smart title builder ────────────────────────────────────────────────────────

function buildMetaTitle(tool: Tool): string {
  const name = tool.name;
  const slug = tool.slug;
  const nameLower = name.toLowerCase();

  // Use manual override when present
  if (tool.metaTitle) return tool.metaTitle;

  // X-to-Y converters: "JPG to PDF Converter — Free Online, No Sign-Up"
  const toMatch = slug.match(/^(.+?)-to-(.+)$/);
  if (toMatch && !nameLower.includes("converter")) {
    return `${name} Converter — Free Online, No Sign-Up | ${SITE_NAME}`;
  }
  if (toMatch) {
    return `${name} — Free Online, No Sign-Up | ${SITE_NAME}`;
  }

  // Compressor tools
  if (nameLower.includes("compressor") || nameLower.includes("compress")) {
    return `${name} — Free Online, Reduce Size Instantly | ${SITE_NAME}`;
  }

  // Merger tools
  if (nameLower.includes("merger") || nameLower.includes("merge")) {
    return `${name} — Combine Files Free Online | ${SITE_NAME}`;
  }

  // Splitter tools
  if (nameLower.includes("splitter") || nameLower.includes("split")) {
    return `${name} — Free Online, By Page Range | ${SITE_NAME}`;
  }

  // Generator tools
  if (nameLower.includes("generator") || nameLower.includes("maker")) {
    return `${name} — Free Online Generator, Instant | ${SITE_NAME}`;
  }

  // Formatter / Beautifier
  if (nameLower.includes("formatter") || nameLower.includes("beautifier")) {
    return `${name} & Beautifier — Free Online Tool | ${SITE_NAME}`;
  }

  // Validator / Checker
  if (nameLower.includes("validator") || nameLower.includes("checker")) {
    return `${name} — Free Online, Instant Results | ${SITE_NAME}`;
  }

  // Calculator
  if (tool.category === "calculators") {
    return `Free ${name} Online — Instant & Accurate | ${SITE_NAME}`;
  }

  // Editor / Resizer / Cropper
  if (nameLower.includes("resizer") || nameLower.includes("cropper") || nameLower.includes("editor")) {
    return `${name} — Free Online Image Editor | ${SITE_NAME}`;
  }

  // Remover tools
  if (nameLower.includes("remover")) {
    return `${name} — Free Online, Instant Results | ${SITE_NAME}`;
  }

  // Converter (explicit)
  if (nameLower.includes("converter")) {
    return `${name} — Free Online, No Registration | ${SITE_NAME}`;
  }

  // Default
  return `${name} — Free Online Tool, No Registration | ${SITE_NAME}`;
}

// ── Smart description builder ──────────────────────────────────────────────────

function buildMetaDescription(tool: Tool): string {
  if (tool.metaDescription) return truncateAtWord(tool.metaDescription);

  const name = tool.name;
  const slug = tool.slug;
  const nameLower = name.toLowerCase();
  const base = tool.description.trim().replace(/\.$/, "");

  // Only these categories actually take file input — don't promise
  // "no file upload" on a unit converter or a calculator.
  const handlesFiles = ["pdf-tools", "image-tools", "audio-tools", "video-tools"].includes(tool.category);
  const privacy = handlesFiles
    ? "100% browser-based — files never leave your device"
    : "Runs entirely in your browser";

  // X-to-Y file converters
  const toMatch = slug.match(/^(.+?)-to-(.+)$/);
  if (toMatch && handlesFiles) {
    const fromFmt = toMatch[1].toUpperCase().replace(/-/g, " ");
    const toFmt   = toMatch[2].toUpperCase().replace(/-/g, " ");
    return fitDescription([
      `Convert ${fromFmt} to ${toFmt} free online — no sign-up, no file upload`,
      base,
      "Works in any browser",
      "Instant results",
    ]);
  }

  // Compressor
  if (nameLower.includes("compressor") || nameLower.includes("compress")) {
    return fitDescription([base, "Free online with no sign-up", privacy]);
  }

  // Merger
  if (nameLower.includes("merger")) {
    return fitDescription([base, "Free online, no registration needed", privacy]);
  }

  // Calculator
  if (tool.category === "calculators") {
    return fitDescription([`Free ${name} online — ${base}`, "Instant results, no sign-up required", "Works on mobile and desktop"]);
  }

  // Generator
  if (nameLower.includes("generator")) {
    return fitDescription([`Free ${name} online — ${base}`, "No sign-up needed", privacy]);
  }

  // Default: description + value props
  return fitDescription([base, "Free online, no sign-up required", privacy, "Works on any device"]);
}

// ── Keyword builder ────────────────────────────────────────────────────────────

function buildKeywords(tool: Tool): string[] {
  if (tool.keywords?.length) return tool.keywords;

  const slug = tool.slug;
  const name = tool.name;
  const base = [...tool.tags];

  const toMatch = slug.match(/^(.+?)-to-(.+)$/);
  if (toMatch) {
    const from = toMatch[1].replace(/-/g, " ");
    const to   = toMatch[2].replace(/-/g, " ");
    base.push(
      `${from} to ${to}`,
      `${from} to ${to} converter`,
      `convert ${from} to ${to}`,
      `${from} to ${to} online`,
      `free ${from} to ${to} converter`,
      `${from} to ${to} online free`,
      name.toLowerCase(),
    );
  }

  base.push(
    name.toLowerCase(),
    `free ${name.toLowerCase()}`,
    `${name.toLowerCase()} online`,
    `${name.toLowerCase()} free`,
    `online ${name.toLowerCase()}`,
    "free online tools",
    "allconverter tools",
  );

  return [...new Set(base)];
}

// ── Public API ─────────────────────────────────────────────────────────────────

export function generateToolMetadata(tool: Tool) {
  // Layout template appends the brand to <title>; social titles carry it explicitly.
  const title       = stripBrand(buildMetaTitle(tool));
  const socialTitle = `${title} | ${SITE_NAME}`;
  const description = buildMetaDescription(tool);
  const keywords    = buildKeywords(tool);
  const canonical   = `${SITE_URL}/tools/${tool.slug}/`;

  return {
    title,
    description,
    keywords,
    canonical,
    openGraph: {
      title: socialTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website" as const,
      images: defaultOgImages,
    },
    twitter: {
      card: "summary_large_image" as const,
      site: siteConfig.twitter,
      title: socialTitle,
      description,
      images: defaultOgImages.map((i) => i.url),
    },
  };
}

export function generateCategoryMetadata(category: ToolCategory_Data, toolCount: number) {
  const catName    = category.name;
  const title       = `Free ${catName} Online — ${toolCount} Tools, No Sign-Up`;
  const socialTitle = `${title} | ${SITE_NAME}`;
  const description = fitDescription([
    `${toolCount} free ${catName.toLowerCase()} — all browser-based, no registration`,
    category.description,
  ]);
  const canonical   = `${SITE_URL}/${category.slug}/`;

  return {
    title,
    description,
    keywords: [
      `free ${catName.toLowerCase()}`,
      `online ${catName.toLowerCase()}`,
      `${catName.toLowerCase()} free`,
      `best ${catName.toLowerCase()}`,
      `${catName.toLowerCase()} online free`,
      "free online tools",
    ],
    canonical,
    openGraph: {
      title: socialTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website" as const,
      images: defaultOgImages,
    },
  };
}

export function generateHomepageMetadata() {
  return {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: siteConfig.description,
    canonical: `${SITE_URL}/`,
  };
}

export function generateBreadcrumbs(tool?: Tool, category?: ToolCategory_Data): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

  if (category) {
    crumbs.push({ label: category.name, href: `/${category.slug}/` });
  }

  if (tool) {
    if (!category) {
      crumbs.push({ label: tool.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), href: `/${tool.category}/` });
    }
    crumbs.push({ label: tool.name });
  }

  return crumbs;
}

export function generateToolSchema(tool: Tool) {
  const featureList: string[] = tool.benefits?.length
    ? tool.benefits.slice(0, 6)
    : tool.tags.map(t => t.charAt(0).toUpperCase() + t.slice(1)).slice(0, 6);

  const keywords = tool.keywords?.length
    ? tool.keywords
    : tool.tags;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: `${SITE_URL}/tools/${tool.slug}/`,
    applicationCategory: getApplicationCategory(tool.category),
    operatingSystem: "Any — runs in a web browser (Chrome, Firefox, Safari, Edge)",
    browserRequirements: "Requires JavaScript. Compatible with all modern evergreen browsers.",
    featureList: featureList.join(", "),
    keywords: keywords.join(", "),
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    softwareHelp: {
      "@type": "CreativeWork",
      url: `${SITE_URL}/tools/${tool.slug}/`,
    },
  };
}

export function generateBreadcrumbSchema(crumbs: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: crumb.href ? `${SITE_URL}${crumb.href}` : undefined,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateHowToSchema(tool: Tool) {
  if (!tool.howTo?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${tool.name}`,
    description: tool.tagline,
    step: tool.howTo.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.title,
      text: step.description,
    })),
  };
}
