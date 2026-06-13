import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo-utils";
import { AllToolsClient } from "@/components/tools/AllToolsClient";

export const metadata: Metadata = {
  title: `All Free Online Tools — PDF, Image, Developer, SEO & More | ${siteConfig.name}`,
  description:
    "Browse 250+ free online tools: PDF compressor, image converter, JSON formatter, UUID generator, word counter, and more. No sign-up, no limits, all browser-based.",
  alternates: { canonical: `${siteConfig.url}/tools/` },
  openGraph: {
    title: `All Free Online Tools | ${siteConfig.name}`,
    description:
      "250+ free online tools for PDF, images, developer utilities, SEO, audio, AI, and more. No account needed.",
    url: `${siteConfig.url}/tools/`,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function AllToolsPage() {
  return <AllToolsClient />;
}
