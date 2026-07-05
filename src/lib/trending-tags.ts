import { getSortedPosts } from "@/lib/posts";
import { siteConfig } from "@/config/site";
import { slugify } from "@/utils/string";
import type { TrendingTag } from "@/interfaces/tag";

/*
  Recency decay applied to a post at `index` in the newest-first window.
  Faithful port of the Jekyll TrendingTagsGenerator#compute_weight.
*/
function trendingWeight(index: number, maxPosts: number, strategy: string): number {
  switch (strategy) {
    case "exponential":
      return Math.exp(-(index / maxPosts));
    case "log":
      return Math.log(maxPosts - index + 1);
    default: // linear
      return maxPosts - index;
  }
}

/*
  Tags ranked by recency-weighted frequency across the most recently-updated
  posts — the Next.js port of the Jekyll TrendingTagsGenerator.

  Takes the newest `maxPosts` by last-modified date, weights each post's tag
  contributions by a decay curve (newer posts count for more), sums per tag,
  optionally normalizes the top tag to 100, then returns the top `limit`.
  Tags are keyed by slug so casing/punctuation variants collapse together and
  links line up with the /tag/<slug> archives.
*/
export function getTrendingTags(): TrendingTag[] {
  const config = siteConfig.home.trendingTags;
  if (!config.enabled) return [];

  const recent = getSortedPosts()
    .filter((post) => post.lastModifiedAt)
    .sort((a, b) => (a.lastModifiedAt! < b.lastModifiedAt! ? 1 : -1))
    .slice(0, config.maxPosts);

  if (recent.length === 0) return [];

  const stats = new Map<string, TrendingTag>();

  recent.forEach((post, index) => {
    const weight = trendingWeight(index, config.maxPosts, config.decayStrategy);

    for (const tag of post.tags) {
      const slug = slugify(tag);
      if (!slug) continue;

      const stat = stats.get(slug);
      if (stat) {
        stat.count += 1;
        stat.score += weight;
      } else {
        stats.set(slug, { tag, slug, count: 1, score: weight });
      }
    }
  });

  if (config.normalization) {
    const maxScore = Math.max(...[...stats.values()].map((stat) => stat.score));
    if (maxScore > 0) {
      for (const stat of stats.values()) {
        stat.score = Math.round((stat.score * 100) / maxScore * 100) / 100;
      }
    }
  }

  return [...stats.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, config.limit);
}
