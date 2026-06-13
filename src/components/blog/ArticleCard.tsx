import Link from "next/link";
import type { BlogPost } from "@/types/blog";

interface Props {
  post: BlogPost;
  showCategory?: boolean;
}

export function ArticleCard({ post, showCategory = false }: Props) {
  const href = `/blog/${post.category}/${post.slug}/`;

  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
    >
      {showCategory && (
        <span className="text-xs font-medium text-primary uppercase tracking-wide">
          {post.category.replace(/-/g, " ")}
        </span>
      )}
      <h3 className="font-semibold text-base leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
        {post.h1}
      </h3>
      <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{post.excerpt}</p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>{post.readingTime} min read</span>
        {post.isPillar && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary font-medium">
            Guide
          </span>
        )}
      </div>
    </Link>
  );
}
