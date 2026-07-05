/*
  Server-only tag helpers — the Next.js port of the Jekyll TagGenerator.

  Aggregates the flat `tags` arrays declared on each post in the registry into
  one archive entry per unique tag slug, driving the /tags index, the per-tag
  /tag/<slug> archive pages, and their sitemap entries. Tags are keyed by their
  slug so casing/punctuation variants (e.g. "ES6+" and "es6") collapse together.

  Reads git-derived dates via getSortedPosts, so this runs at build time only.
*/
import { tagMeta } from "@/data/tags";
import { getSortedPosts, type DatedPost } from "@/lib/posts";
import { getAllTaxonomyTerms, getPostsByTaxonomyTerm, getTaxonomyTermBySlug } from "@/lib/taxonomy";
import { siteConfig } from "@/config/site";
import { slugify } from "@/utils/string";
import type { TagMeta, TagSummary, TrendingTag } from "@/interfaces/tag";

/*
  Every unique tag across all posts, keyed by slug, sorted alphabetically by
  display name. The first-seen raw tag string wins as the display name.
*/
export function getAllTags(): TagSummary[] {
  return getAllTaxonomyTerms((post) => post.tags).map(({ name, ...rest }) => ({ tag: name, ...rest }));
}

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

// Posts carrying the given tag slug, newest-first (matches the /posts list order).
export function getPostsByTag(slug: string): DatedPost[] {
  return getPostsByTaxonomyTerm((post) => post.tags, slug);
}

// Display name for a tag slug, or null when no post uses it (→ 404).
export function getTagBySlug(slug: string): string | null {
  return getTaxonomyTermBySlug((post) => post.tags, slug);
}

/*
  Title + description for a tag archive, sourced from the data/tags.ts registry.
  Falls back to a "#<tag>" title and a generated, count-aware description for any
  tag slug not yet listed there, so every archive still has sensible metadata.
*/
export function getTagMeta(slug: string, tag: string): TagMeta {
  const meta = tagMeta[slug];
  if (meta) return meta;

  const count = getPostsByTag(slug).length;
  return {
    title: `#${tag}`,
    description: `Browse ${count} post${count === 1 ? "" : "s"} tagged "${tag}" — quick topic navigation across the blog.`
  };
}
