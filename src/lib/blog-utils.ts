import type { BlogPost, BlogCategorySlug } from "@/types/blog";
import { allBlogPosts } from "@/data/blog-posts";
import { blogCategories } from "@/data/blog-categories";

export { blogCategories };

export function getBlogPost(category: BlogCategorySlug, slug: string): BlogPost | undefined {
  return allBlogPosts.find((p) => p.category === category && p.slug === slug);
}

export function getPostsByCategory(category: BlogCategorySlug): BlogPost[] {
  return allBlogPosts
    .filter((p) => p.category === category)
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

export function getFeaturedPosts(limit = 6): BlogPost[] {
  return allBlogPosts
    .filter((p) => p.isFeatured)
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, limit);
}

export function getPillarPosts(): BlogPost[] {
  return allBlogPosts.filter((p) => p.isPillar);
}

export function getRecentPosts(limit = 10): BlogPost[] {
  return [...allBlogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const candidates: Array<{ post: BlogPost; score: number }> = [];

  for (const p of allBlogPosts) {
    if (p.slug === post.slug) continue;

    let score = 0;
    if (p.category === post.category) score += 3;
    if (post.relatedArticleSlugs?.includes(p.slug)) score += 5;
    if (post.pillarSlug === p.slug || p.pillarSlug === post.slug) score += 4;
    for (const tag of post.tags) {
      if (p.tags.includes(tag)) score += 1;
    }

    if (score > 0) candidates.push({ post: p, score });
  }

  return candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((c) => c.post);
}

export function getAllBlogSlugs(): Array<{ category: string; slug: string }> {
  return allBlogPosts.map((p) => ({ category: p.category, slug: p.slug }));
}

export function getBlogCategory(slug: BlogCategorySlug) {
  return blogCategories.find((c) => c.slug === slug);
}

export function getPostsByPillar(pillarSlug: string): BlogPost[] {
  return allBlogPosts.filter((p) => p.pillarSlug === pillarSlug);
}
