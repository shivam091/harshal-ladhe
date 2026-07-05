/*
  One aggregation shared by tags and categories so both archives count, sort, and date posts
  the same way, while each keeps its own public types.
*/
import { posts } from "@/data/posts";
import { getSortedPosts, type DatedPost } from "@/lib/posts";
import { slugify } from "@/utils/string";

export interface TaxonomyTerm {
  name: string;
  slug: string;
  count: number;
  lastModifiedAt: string | null;
}

// Alphabetical for scanning; the first-seen spelling wins, and lastModifiedAt tracks the newest contributing post.
export function getAllTaxonomyTerms(getValues: (post: DatedPost) => string[]): TaxonomyTerm[] {
  const map = new Map<string, TaxonomyTerm>();

  for (const post of getSortedPosts()) {
    for (const value of getValues(post)) {
      const slug = slugify(value);
      if (!slug) continue;

      const existing = map.get(slug);
      if (existing) {
        existing.count += 1;
        if (
          post.lastModifiedAt &&
          (!existing.lastModifiedAt || post.lastModifiedAt > existing.lastModifiedAt)
        ) {
          existing.lastModifiedAt = post.lastModifiedAt;
        }
      } else {
        map.set(slug, { name: value, slug, count: 1, lastModifiedAt: post.lastModifiedAt });
      }
    }
  }

  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

// Posts whose `getValues(post)` contains a value matching the given slug, newest-first.
export function getPostsByTaxonomyTerm(
  getValues: (post: DatedPost) => string[],
  slug: string
): DatedPost[] {
  return getSortedPosts().filter((post) => getValues(post).some((value) => slugify(value) === slug));
}

// Display name for a slug within `getValues`, or null when no post uses it (→ 404).
export function getTaxonomyTermBySlug(
  getValues: (post: (typeof posts)[number]) => string[],
  slug: string
): string | null {
  for (const post of posts) {
    const match = getValues(post).find((value) => slugify(value) === slug);
    if (match) return match;
  }
  return null;
}
