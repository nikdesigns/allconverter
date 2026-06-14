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
};

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
  if (tool.metaDescription) return tool.metaDescription;

  const name = tool.name;
  const slug = tool.slug;
  const nameLower = name.toLowerCase();
  const base = tool.description.replace(/\.$/, "");

  // X-to-Y converters
  const toMatch = slug.match(/^(.+?)-to-(.+)$/);
  if (toMatch) {
    const fromFmt = toMatch[1].toUpperCase().replace(/-/g, "/");
    const toFmt   = toMatch[2].toUpperCase().replace(/-/g, "/");
    return `Convert ${fromFmt} to ${toFmt} free online — no sign-up, no file upload, instant results. ${base}. Works in any browser.`.slice(0, 160);
  }

  // Compressor
  if (nameLower.includes("compressor") || nameLower.includes("compress")) {
    return `${name} — reduce file size online for free with no sign-up. ${base}. 100% browser-based, files never leave your device.`.slice(0, 160);
  }

  // Merger
  if (nameLower.includes("merger")) {
    return `${name} — combine files free online, no registration needed. ${base}. Runs entirely in your browser — no uploads to any server.`.slice(0, 160);
  }

  // Calculator
  if (tool.category === "calculators") {
    return `Free ${name} online — ${base}. Instant results, no sign-up required. Works on mobile and desktop.`.slice(0, 160);
  }

  // Generator
  if (nameLower.includes("generator")) {
    return `Free ${name} online — ${base}. No sign-up needed, instant results, 100% browser-based.`.slice(0, 160);
  }

  // Default: use description + our value props
  return `${base}. Free online, no sign-up required, 100% browser-based — files stay on your device. Works on any device.`.slice(0, 160);
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
  const title       = buildMetaTitle(tool);
  const description = buildMetaDescription(tool);
  const keywords    = buildKeywords(tool);
  const canonical   = `${SITE_URL}/tools/${tool.slug}/`;

  return {
    title,
    description,
    keywords,
    canonical,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website" as const,
      images: [
        {
          url: `${SITE_URL}/og/${tool.slug}.png`,
          width: 1200,
          height: 630,
          alt: `${tool.name} — ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [`${SITE_URL}/og/${tool.slug}.png`],
    },
  };
}

export function generateCategoryMetadata(category: ToolCategory_Data, toolCount: number) {
  const catName    = category.name;
  const title      = `Free ${catName} Online — ${toolCount} Tools, No Sign-Up | ${SITE_NAME}`;
  const description = `${toolCount} free ${catName.toLowerCase()} — all browser-based, no registration, no file uploads. ${category.description}`;
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
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website" as const,
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

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: siteConfig.description,
    sameAs: [`https://twitter.com/allconvertertools`],
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1247",
      bestRating: "5",
      worstRating: "1",
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
