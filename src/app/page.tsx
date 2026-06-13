import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { PopularTools } from "@/components/home/PopularTools";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { FAQSection } from "@/components/home/FAQSection";
import { FounderSection } from "@/components/home/FounderSection";
import { SupportSection } from "@/components/home/SupportSection";
import { SEOContentBlock } from "@/components/home/SEOContentBlock";
import { LatestArticles } from "@/components/home/LatestArticles";
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  siteConfig,
} from "@/lib/seo-utils";

const founderSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nitin Kaushik",
  jobTitle: "Frontend Developer",
  description: "Frontend developer and founder of AllConverter.tools — a free browser-based utility platform with 250+ tools for PDF, image, audio, AI content, SEO, developer, and business tasks.",
  url: `${siteConfig.url}/about/`,
  worksFor: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
  },
  knowsAbout: [
    "Web Development",
    "Frontend Engineering",
    "Online Productivity Tools",
    "Browser-based Applications",
    "Privacy-friendly Software",
  ],
};

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: `${siteConfig.url}/` },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateOrganizationSchema()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateWebsiteSchema()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(founderSchema) }}
      />
      <HeroSection />
      <CategoriesGrid />
      <PopularTools />
      <LatestArticles />
      <BenefitsSection />
      <FAQSection />
      <FounderSection />
      <SupportSection />
      <SEOContentBlock />
    </>
  );
}
