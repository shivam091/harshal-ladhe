/*
  Server-only because content dates come from git. Keyed by slug so casing/punctuation variants
  (e.g. "ES6+" and "es6") collapse into one archive.
*/
import { tagMeta, type TagMeta } from "@/data/tags";
import { getAllTaxonomyTerms, getEntriesByTaxonomyTerm, getTaxonomyTermBySlug, type TaxonomyEntry } from "@/lib/taxonomy";
import { getEntryCountParts } from "@/utils/taxonomy-entries";

// Carries the newest last-modified date so the sitemap can report when an archive changed.
export interface TagSummary {
  tag: string;
  slug: string;
  count: number;
  lastModifiedAt: string | null;
}

// Alphabetical so the index is easy to scan; the first-seen spelling wins as the display name.
export function getAllTags(): TagSummary[] {
  return getAllTaxonomyTerms((entry) => entry.tags).map(({ name, ...rest }) => ({ tag: name, ...rest }));
}

// Newest-first across posts, snippets, and tutorials so a topic reads as one timeline.
export function getEntriesByTag(slug: string): TaxonomyEntry[] {
  return getEntriesByTaxonomyTerm((entry) => entry.tags, slug);
}

// Display name for a tag slug, or null when no entry uses it (→ 404).
export function getTagBySlug(slug: string): string | null {
  return getTaxonomyTermBySlug((entry) => entry.tags, slug);
}

// Falls back to generated copy so tags not yet in the registry still get sensible metadata.
export function getTagMeta(slug: string, tag: string): TagMeta {
  const meta = tagMeta[slug];
  if (meta) return meta;

  const counts = getEntryCountParts(getEntriesByTag(slug)).join(", ");
  return {
    title: `#${tag}`,
    description: `Browse ${counts} tagged "${tag}" — quick topic navigation across the blog.`,
  };
}
