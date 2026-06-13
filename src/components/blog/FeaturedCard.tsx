import Link from "next/link";
import type { BlogPost } from "@/types/blog";

interface Props {
  post: BlogPost;
}

export function FeaturedCard({ post }: Props) {
  const href = `/blog/${post.category}/${post.slug}/`;

  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-6 transition-shadow hover:shadow-lg"
    >
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wide">
          Featured
        </span>
        {post.isPillar && (
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Ultimate Guide
          </span>
        )}
      </div>
      <h2 className="text-xl font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
        {post.h1}
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{post.excerpt}</p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
        <span>{post.readingTime} min read</span>
        <span>·</span>
        <span>{post.category.replace(/-/g, " ")}</span>
      </div>
    </Link>
  );
}
