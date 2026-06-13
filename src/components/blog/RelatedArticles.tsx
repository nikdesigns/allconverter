import Link from "next/link";
import type { BlogPost } from "@/types/blog";

interface Props {
  posts: BlogPost[];
  heading?: string;
}

export function RelatedArticles({ posts, heading = "Related Articles" }: Props) {
  if (!posts.length) return null;

  return (
    <section>
      <h2 className="text-lg font-bold text-foreground mb-4">{heading}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.category}/${post.slug}/`}
            className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:shadow-sm transition-all"
          >
            <span className="text-xs font-medium text-primary uppercase tracking-wide">
              {post.category.replace(/-/g, " ")}
            </span>
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {post.h1}
            </p>
            <span className="text-xs text-muted-foreground">{post.readingTime} min read</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
