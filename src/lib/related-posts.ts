/*
  Reads only the static registry so it can run in the browser inside the post layout; the
  recent-posts fallback relies on registry order since git dates aren't available there.
*/
import { posts } from "@/data/posts";
import { siteConfig } from "@/config/site";
import type { Post } from "@/data/posts";

/*
  Derived from the changelog because git dates aren't available in the browser; its earliest
  entry matches the git publish date shown on lists.
*/
export function getPublishedDate(post: Post): string | null {
  if (!post.changelog?.length) return null;
  return post.changelog.reduce(
    (earliest, entry) => (entry.date < earliest ? entry.date : earliest),
    post.changelog[0].date
  );
}

// Jaccard normalises for tag count so heavily tagged posts don't dominate; empty sets count as no overlap.
function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;

  let intersection = 0;
  for (const value of a) {
    if (b.has(value)) intersection += 1;
  }
  const union = new Set([...a, ...b]).size;

  return union === 0 ? 0 : intersection / union;
}

// Tops up with recent posts so the block stays full even when few posts share tags or categories.
export function getRelatedPosts(slug: string): Post[] {
  const config = siteConfig.relatedPosts;
  if (!config.enabled) return [];

  const current = posts.find((post) => post.slug === slug);
  if (!current) return [];

  const currentTags = new Set(current.tags);
  const currentCategories = new Set(current.category);

  const related = posts
    .filter((post) => post.slug !== slug)
    .map((post) => {
      const tagScore = jaccardSimilarity(currentTags, new Set(post.tags));
      const categoryScore = jaccardSimilarity(currentCategories, new Set(post.category));
      const score = tagScore * config.tagWeight + categoryScore * config.categoryWeight;
      return { post, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.post);

  if (related.length < config.limit && config.fallbackToRecent) {
    const recent = posts.filter(
      (post) => post.slug !== slug && !related.includes(post)
    );
    related.push(...recent.slice(0, config.limit - related.length));
  }

  return related.slice(0, config.limit);
}
