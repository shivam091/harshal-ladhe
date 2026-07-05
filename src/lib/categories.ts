/*
  Server-only category helpers — the Next.js port of the Jekyll CategoryGenerator.

  Aggregates the `category` arrays declared on each post in the registry into one
  archive entry per unique category slug, driving the /categories accordion index,
  the per-category /category/<slug> archive pages, and their sitemap entries.
  Categories are keyed by their slug so casing/punctuation variants collapse together.

  Reads git-derived dates via getSortedPosts, so this runs at build time only.
*/
import { categoryMeta } from "@/data/categories";
import type {DatedPost } from "@/lib/posts";
import { getAllTaxonomyTerms, getPostsByTaxonomyTerm, getTaxonomyTermBySlug } from "@/lib/taxonomy";
import { siteConfig } from "@/config/site";
import type { CategoryMeta, CategorySummary } from "@/interfaces/category";

/*
  Every unique category across all posts, keyed by slug, sorted alphabetically by
  display name. The first-seen raw category string wins as the display name.
*/
export function getAllCategories(): CategorySummary[] {
  return getAllTaxonomyTerms((post) => post.category).map(({ name, ...rest }) => ({
    category: name,
    ...rest,
  }));
}

/*
  Categories ranked by total post count (ties broken alphabetically), capped at
  the configured limit. Drives the home "Popular Categories" section; empty when
  the block is disabled.
*/
export function getPopularCategories(): CategorySummary[] {
  const config = siteConfig.home.popularCategories;
  if (!config.enabled) return [];

  return [...getAllCategories()]
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category))
    .slice(0, config.limit);
}

// Posts filed under the given category slug, newest-first (matches the /posts list order).
export function getPostsByCategory(slug: string): DatedPost[] {
  return getPostsByTaxonomyTerm((post) => post.category, slug);
}

// Display name for a category slug, or null when no post uses it (→ 404).
export function getCategoryBySlug(slug: string): string | null {
  return getTaxonomyTermBySlug((post) => post.category, slug);
}

/*
  Title + description for a category archive, sourced from the data/categories.ts
  registry. Falls back to the category name as the title and a generated,
  count-aware description for any slug not yet listed there, so every archive
  still has sensible metadata.
*/
export function getCategoryMeta(slug: string, category: string): CategoryMeta {
  const meta = categoryMeta[slug];
  if (meta) return meta;

  const count = getPostsByCategory(slug).length;
  return {
    title: category,
    description: `Browse ${count} post${count === 1 ? "" : "s"} in the "${category}" category — focused reading on a single topic.`,
  };
}
