import type { Metadata } from "next";
import { CategoryPage } from "@/components/shared/CategoryPage";
import { getCategoryBySlug } from "@/lib/categories";
import { getToolsByCategory } from "@/lib/tools-data";
import { categories } from "@/lib/categories";
import { generateCategoryMetadata, siteConfig } from "@/lib/seo-utils";

const category = getCategoryBySlug("color-tools")!;
const tools = getToolsByCategory("color-tools");
const featuredTools = tools.filter((t) => t.isFeatured);
const meta = generateCategoryMetadata(category, tools.length);

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `${siteConfig.url}/color-tools/` },
  openGraph: meta.openGraph,
};

export default function ColorToolsPage() {
  const related = categories.filter((c) => c.slug !== "color-tools").slice(0, 4);
  return (
    <CategoryPage
      category={category}
      tools={tools}
      featuredTools={featuredTools}
      relatedCategories={related}
    />
  );
}
