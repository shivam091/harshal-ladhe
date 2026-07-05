/*
  One aggregation shared by tags and categories so both archives count, sort, and date posts,
  snippets, and tutorials the same way, while each keeps its own public types.
*/
import { posts } from "@/data/posts";
import { snippets } from "@/data/snippets";
import { tutorials } from "@/data/tutorials";
import { estimateReadingMinutes, getSortedPosts, type DatedPost } from "@/lib/posts";
import { getSortedSnippets, type DatedSnippet } from "@/lib/snippets";
import { getSortedTutorials, type DatedTutorial } from "@/lib/tutorials";
import { compareByDateDesc, createContentFilePath } from "@/lib/content-dates";
import { slugify } from "@/utils/string";
import { siteConfig } from "@/config/site";

export interface TaxonomyTerm {
  name: string;
  slug: string;
  count: number;
  lastModifiedAt: string | null;
}

// Discriminated by `type` so archive cards can link each entry; every type carries a read time so cards look alike.
export type TaxonomyEntry =
  | (DatedPost & { type: "post" })
  | (DatedSnippet & { type: "snippet"; readingMinutes: number })
  | (DatedTutorial & { type: "tutorial"; readingMinutes: number });

// Resolved once so read-time lookups don't rebuild the content directory for every entry.
const snippetFilePath = createContentFilePath("snippet");
const tutorialFilePath = createContentFilePath("tutorial");

// Every content type keeps its terms on the same two fields, so one picker fits them all.
type TaxonomyValues = (entry: { category: string[]; tags: string[] }) => string[];

// One newest-first timeline so a topic archive interleaves formats by date rather than grouping them.
export function getSortedTaxonomyEntries(): TaxonomyEntry[] {
  return [
    ...getSortedPosts().map((post) => ({ ...post, type: "post" as const })),
    ...getSortedSnippets().map((snippet) => ({
      ...snippet,
      type: "snippet" as const,
      readingMinutes: estimateReadingMinutes(snippetFilePath(snippet.slug))
    })),
    ...getSortedTutorials().map((tutorial) => ({
      ...tutorial,
      type: "tutorial" as const,
      readingMinutes: estimateReadingMinutes(tutorialFilePath(tutorial.slug))
    }))
  ].sort(compareByDateDesc());
}

// Alphabetical for scanning; the first-seen spelling wins, and lastModifiedAt tracks the newest contributing entry.
export function getAllTaxonomyTerms(getValues: TaxonomyValues): TaxonomyTerm[] {
  const map = new Map<string, TaxonomyTerm>();

  for (const entry of getSortedTaxonomyEntries()) {
    for (const value of getValues(entry)) {
      const slug = slugify(value);
      if (!slug) continue;

      const existing = map.get(slug);
      if (existing) {
        existing.count += 1;
        if (
          entry.lastModifiedAt &&
          (!existing.lastModifiedAt || entry.lastModifiedAt > existing.lastModifiedAt)
        ) {
          existing.lastModifiedAt = entry.lastModifiedAt;
        }
      } else {
        map.set(slug, { name: value, slug, count: 1, lastModifiedAt: entry.lastModifiedAt });
      }
    }
  }

  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

// Entries whose `getValues(entry)` contains a value matching the given slug, newest-first.
export function getEntriesByTaxonomyTerm(getValues: TaxonomyValues, slug: string): TaxonomyEntry[] {
  return getSortedTaxonomyEntries().filter((entry) =>
    getValues(entry).some((value) => slugify(value) === slug)
  );
}

/*
  Spans posts, tutorials, and snippets so a revised snippet surfaces as readily as a post;
  undated (uncommitted) entries are left out since they have no update to report.
*/
export function getRecentlyUpdatedEntries(): TaxonomyEntry[] {
  const config = siteConfig.home.recentlyUpdatedEntries;
  if (!config.enabled) return [];

  return getSortedTaxonomyEntries()
    .filter((entry) => entry.lastModifiedAt)
    .sort(compareByDateDesc("lastModifiedAt"))
    .slice(0, config.limit);
}

// Display name for a slug within `getValues`, or null when nothing uses it (→ 404); skips git so metadata stays cheap.
export function getTaxonomyTermBySlug(getValues: TaxonomyValues, slug: string): string | null {
  for (const entry of [...posts, ...snippets, ...tutorials]) {
    const match = getValues(entry).find((value) => slugify(value) === slug);
    if (match) return match;
  }
  return null;
}
