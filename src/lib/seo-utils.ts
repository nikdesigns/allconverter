import type { Tool, ToolCategory_Data, BreadcrumbItem } from "@/types";

const SITE_NAME = "AllConverter.tools";
const SITE_URL = "https://allconverter.tools";
const SITE_TAGLINE = "Convert Anything. All in One Place.";

export const siteConfig = {
  name: SITE_NAME,
  url: SITE_URL,
  tagline: SITE_TAGLINE,
  description:
    "Free online tools for PDF, images, text, developer utilities, SEO, and more. 100+ tools — no sign-up, no limits, all in one place.",
  twitter: "@allconvertertools",
  locale: "en_US",
};

export function generateToolMetadata(tool: Tool) {
  const title = `${tool.name} — Free Online ${tool.name} | ${SITE_NAME}`;
  const description = `${tool.description.slice(0, 155)}`;
  const canonical = `${SITE_URL}/tools/${tool.slug}/`;

  return {
    title,
    description,
    canonical,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
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
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og/${tool.slug}.png`],
    },
  };
}

export function generateCategoryMetadata(category: ToolCategory_Data, toolCount: number) {
  const title = `${category.name} — Free Online ${category.name} | ${SITE_NAME}`;
  const description = `${category.description} ${toolCount} free tools available. No registration required.`;
  const canonical = `${SITE_URL}/${category.slug}/`;

  return {
    title,
    description,
    canonical,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
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
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: `${SITE_URL}/tools/${tool.slug}/`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
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
