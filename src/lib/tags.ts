/*
  Server-only because post dates come from git. Keyed by slug so casing/punctuation variants
  (e.g. "ES6+" and "es6") collapse into one archive.
*/
import { tagMeta, type TagMeta } from "@/data/tags";
import type { DatedPost } from "@/lib/posts";
import { getAllTaxonomyTerms, getPostsByTaxonomyTerm, getTaxonomyTermBySlug } from "@/lib/taxonomy";

// Carries the newest last-modified date so the sitemap can report when an archive changed.
export interface TagSummary {
  tag: string;
  slug: string;
  count: number;
  lastModifiedAt: string | null;
}

// Alphabetical so the index is easy to scan; the first-seen spelling wins as the display name.
export function getAllTags(): TagSummary[] {
  return getAllTaxonomyTerms((post) => post.tags).map(({ name, ...rest }) => ({ tag: name, ...rest }));
}

// Newest-first to match the main post list.
export function getPostsByTag(slug: string): DatedPost[] {
  return getPostsByTaxonomyTerm((post) => post.tags, slug);
}

// Display name for a tag slug, or null when no post uses it (→ 404).
export function getTagBySlug(slug: string): string | null {
  return getTaxonomyTermBySlug((post) => post.tags, slug);
}

// Falls back to generated copy so tags not yet in the registry still get sensible metadata.
export function getTagMeta(slug: string, tag: string): TagMeta {
  const meta = tagMeta[slug];
  if (meta) return meta;

  const count = getPostsByTag(slug).length;
  return {
    title: `#${tag}`,
    description: `Browse ${count} post${count === 1 ? "" : "s"} tagged "${tag}" — quick topic navigation across the blog.`,
  };
}
