import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug, getRelatedTools, getAllSlugs, tools } from "@/lib/tools-data";
import { getCategoryBySlug } from "@/lib/categories";
import {
  generateToolMetadata,
  generateBreadcrumbs,
  generateToolSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema,
  siteConfig,
} from "@/lib/seo-utils";
import { getEnrichedTool } from "@/lib/tool-content-gen";
import { ToolPageClient } from "@/components/tools/ToolPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  const meta = generateToolMetadata(tool);
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: `${siteConfig.url}/tools/${tool.slug}/` },
    openGraph: meta.openGraph,
    twitter: meta.twitter,
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const rawTool = getToolBySlug(slug);
  if (!rawTool) notFound();

  // Enrich with generated FAQs, howTo, benefits, useCases, introduction
  const tool = getEnrichedTool(rawTool, tools);

  const category    = getCategoryBySlug(tool.category);
  const relatedTools = getRelatedTools(tool, 4);
  const breadcrumbs  = generateBreadcrumbs(tool, category);

  const schemas = [
    generateToolSchema(tool),
    generateBreadcrumbSchema(breadcrumbs),
    ...(tool.faqs?.length ? [generateFAQSchema(tool.faqs)] : []),
    ...(tool.howTo?.length ? [generateHowToSchema(tool)] : []),
  ].filter(Boolean);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ToolPageClient
        tool={tool}
        category={category!}
        relatedTools={relatedTools}
        breadcrumbs={breadcrumbs}
      />
    </>
  );
}
