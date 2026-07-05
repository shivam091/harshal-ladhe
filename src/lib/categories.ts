/*
  Server-only because post dates come from git. Keyed by slug so casing/punctuation variants
  collapse into one archive.
*/
import { categoryMeta } from "@/data/categories";
import type { CategoryMeta } from "@/data/categories";
import type {DatedPost } from "@/lib/posts";
import { getAllTaxonomyTerms, getPostsByTaxonomyTerm, getTaxonomyTermBySlug } from "@/lib/taxonomy";
import { siteConfig } from "@/config/site";

// Carries the newest last-modified date so the sitemap can report when an archive changed.
export interface CategorySummary {
  category: string;
  slug: string;
  count: number;
  lastModifiedAt: string | null;
}

// Alphabetical so the index is easy to scan; the first-seen spelling wins as the display name.
export function getAllCategories(): CategorySummary[] {
  return getAllTaxonomyTerms((post) => post.category).map(({ name, ...rest }) => ({
    category: name,
    ...rest
  }));
}

// Empty when the block is disabled so the section hides itself without extra checks.
export function getPopularCategories(): CategorySummary[] {
  const config = siteConfig.home.popularCategories;
  if (!config.enabled) return [];

  return [...getAllCategories()]
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category))
    .slice(0, config.limit);
}

// Newest-first to match the main post list.
export function getPostsByCategory(slug: string): DatedPost[] {
  return getPostsByTaxonomyTerm((post) => post.category, slug);
}

// Display name for a category slug, or null when no post uses it (→ 404).
export function getCategoryBySlug(slug: string): string | null {
  return getTaxonomyTermBySlug((post) => post.category, slug);
}

// Falls back to generated copy so categories not yet in the registry still get sensible metadata.
export function getCategoryMeta(slug: string, category: string): CategoryMeta {
  const meta = categoryMeta[slug];
  if (meta) return meta;

  const count = getPostsByCategory(slug).length;
  return {
    title: category,
    description: `Browse ${count} post${count === 1 ? "" : "s"} in the "${category}" category — focused reading on a single topic.`
  };
}
