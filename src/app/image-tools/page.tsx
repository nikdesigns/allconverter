import type { Metadata } from "next";
import { CategoryPage } from "@/components/shared/CategoryPage";
import { getCategoryBySlug } from "@/lib/categories";
import { getToolsByCategory } from "@/lib/tools-data";
import { categories } from "@/lib/categories";
import { generateCategoryMetadata, siteConfig } from "@/lib/seo-utils";

const category = getCategoryBySlug("image-tools")!;
const tools = getToolsByCategory("image-tools");
const featuredTools = tools.filter((t) => t.isFeatured);
const meta = generateCategoryMetadata(category, tools.length);

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `${siteConfig.url}/image-tools/` },
  openGraph: meta.openGraph,
};

export default function CategoryPageRoute() {
  const related = categories.filter((c) => c.slug !== "image-tools").slice(0, 4);
  return (
    <CategoryPage
      category={category}
      tools={tools}
      featuredTools={featuredTools}
      relatedCategories={related}
    />
  );
}
