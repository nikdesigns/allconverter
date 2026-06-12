import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { PopularTools } from "@/components/home/PopularTools";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { FAQSection } from "@/components/home/FAQSection";
import { SEOContentBlock } from "@/components/home/SEOContentBlock";
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  siteConfig,
} from "@/lib/seo-utils";

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
      <HeroSection />
      <CategoriesGrid />
      <PopularTools />
      <BenefitsSection />
      <FAQSection />
      <SEOContentBlock />
    </>
  );
}
