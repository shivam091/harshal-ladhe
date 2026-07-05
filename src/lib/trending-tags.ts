import { getSortedPosts } from "@/lib/posts";
import { getAllTags } from "@/lib/tags";
import { siteConfig } from "@/config/site";
import { slugify } from "@/utils/string";

// Carries the all-time count so the pill matches the archive it links to.
export interface TrendingTag {
  tag: string;
  slug: string;
  count: number;
  score: number;
}

// Newer posts weigh more so the cloud reflects current writing, not all-time totals.
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
  Ranked by recency-weighted frequency so the cloud tracks current interests; keyed by slug so
  casing variants collapse and links line up with the tag archives.
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
        stat.score += weight;
      } else {
        stats.set(slug, { tag, slug, count: 0, score: weight });
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

  // The window only decides ranking; the displayed count is the tag's full total.
  const totals = new Map(getAllTags().map(({ slug, count }) => [slug, count]));
  for (const stat of stats.values()) {
    stat.count = totals.get(stat.slug) ?? 0;
  }

  return [...stats.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, config.limit);
}
