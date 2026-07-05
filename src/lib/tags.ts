/*
  Server-only tag helpers — the Next.js port of the Jekyll TagGenerator.

  Aggregates the flat `tags` arrays declared on each post in the registry into
  one archive entry per unique tag slug, driving the /tags index, the per-tag
  /tag/<slug> archive pages, and their sitemap entries. Tags are keyed by their
  slug so casing/punctuation variants (e.g. "ES6+" and "es6") collapse together.

  Reads git-derived dates via getSortedPosts (through lib/taxonomy.ts), so this
  runs at build time only. Trending tags live in lib/trending-tags.ts.
*/
import { tagMeta, type TagMeta } from "@/data/tags";
import type { DatedPost } from "@/lib/posts";
import { getAllTaxonomyTerms, getPostsByTaxonomyTerm, getTaxonomyTermBySlug } from "@/lib/taxonomy";

/*
  One aggregated tag: its display name, URL slug, post count, and the newest
  last-modified date across its posts (used for the sitemap `lastmod`).
*/
export interface TagSummary {
  tag: string;
  slug: string;
  count: number;
  lastModifiedAt: string | null;
}

/*
  Every unique tag across all posts, keyed by slug, sorted alphabetically by
  display name. The first-seen raw tag string wins as the display name.
*/
export function getAllTags(): TagSummary[] {
  return getAllTaxonomyTerms((post) => post.tags).map(({ name, ...rest }) => ({ tag: name, ...rest }));
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
    description: `Browse ${count} post${count === 1 ? "" : "s"} tagged "${tag}" — quick topic navigation across the blog.`,
  };
}
