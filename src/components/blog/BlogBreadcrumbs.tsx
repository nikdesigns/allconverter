import Link from "next/link";
import type { BlogCategoryMeta } from "@/types/blog";

interface Props {
  category?: BlogCategoryMeta;
  articleTitle?: string;
}

export function BlogBreadcrumbs({ category, articleTitle }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
      <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
      <span>/</span>
      <Link href="/blog/" className="hover:text-foreground transition-colors">Blog</Link>
      {category && (
        <>
          <span>/</span>
          {articleTitle ? (
            <Link href={`/blog/${category.slug}/`} className="hover:text-foreground transition-colors">
              {category.name}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{category.name}</span>
          )}
        </>
      )}
      {articleTitle && (
        <>
          <span>/</span>
          <span className="text-foreground font-medium line-clamp-1 max-w-[200px]">{articleTitle}</span>
        </>
      )}
    </nav>
  );
}
