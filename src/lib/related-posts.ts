/*
  Client-safe related-posts ranking. Port of the Jekyll RelatedPostsGenerator:
  scores every other post against the current one by tag/category overlap
  (Jaccard similarity), weights the two scores, and returns the top matches.

  Unlike the server helpers in lib/posts.ts, this reads only the static registry
  (tags/categories live there), so it runs in the browser inside the post layout.
  The "recent" fallback leans on the registry being declared newest-first rather
  than on git dates, which aren't available client-side.
*/
import { posts } from "@/data/posts";
import { siteConfig } from "@/config/site";
import type { Post } from "@/interfaces/post";

/*
  Published date for a post, derived client-side from its changelog. The
  earliest entry is the "Initial publication", which matches the git-derived
  publishedAt used on the /posts list — git dates aren't available in the
  browser, so the changelog is the client-safe source. Dates are ISO
  (YYYY-MM-DD) strings, so lexicographic comparison is chronological.
*/
export function getPublishedDate(post: Post): string | null {
  if (!post.changelog?.length) return null;
  return post.changelog.reduce(
    (earliest, entry) => (entry.date < earliest ? entry.date : earliest),
    post.changelog[0].date
  );
}

/*
  Jaccard similarity: size of the intersection over size of the union.
  Two empty sets are treated as no overlap (matches the Jekyll generator).
*/
function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;

  let intersection = 0;
  for (const value of a) {
    if (b.has(value)) intersection += 1;
  }
  const union = new Set([...a, ...b]).size;

  return union === 0 ? 0 : intersection / union;
}

/*
  Ranks posts related to `slug` by weighted tag + category similarity, topping
  up with recent posts when fewer than `limit` share any tags or categories.
*/
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
