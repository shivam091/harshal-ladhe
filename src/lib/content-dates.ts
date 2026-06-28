/*
  Git lookups are slow and each slug's dates are needed by both list pages and
  generateMetadata, so every content type shares one per-slug memoised lookup.
*/
import { join } from "node:path";
import { gitLastModified, gitPublishedAt } from "@/lib/git-dates.mjs";

export interface ContentDates {
  publishedAt: string | null;
  lastModifiedAt: string | null;
}

// Takes a path resolver so each content type keeps its own folder layout while sharing the cache.
export function createDatedLookup(resolvePath: (slug: string) => string) {
  const cache = new Map<string, ContentDates>();

  return function getDates(slug: string): ContentDates {
    const cached = cache.get(slug);
    if (cached) return cached;

    const filePath = resolvePath(slug);
    const dates: ContentDates = {
      publishedAt: gitPublishedAt(filePath),
      lastModifiedAt: gitLastModified(filePath)
    };

    cache.set(slug, dates);
    return dates;
  };
}

// Only fits the flat (<segment>)/<segment>/<slug>/page.mdx layout — content that nests deeper needs its own resolver.
export function createContentFilePath(segment: string): (slug: string) => string {
  const dir = join(process.cwd(), "src", "app", "(site)", "(internal)", `(${segment})`, segment);
  return (slug: string) => join(dir, slug, "page.mdx");
}

// Merged so list views get an entry and its dates as one value.
export type DatedContent<T> = T & ContentDates;

/*
  One shared ordering so every dated list agrees. Undated (uncommitted) entries sink
  to the end, and title breaks ties so the order is deterministic across builds.
*/
export function compareByDateDesc(sortBy: keyof ContentDates = "publishedAt") {
  return function compare(
    a: Partial<ContentDates> & { title: string },
    b: Partial<ContentDates> & { title: string }
  ): number {
    const aDate = a[sortBy];
    const bDate = b[sortBy];
    if (!aDate && !bDate) return a.title.localeCompare(b.title);
    if (!aDate) return 1;
    if (!bDate) return -1;
    if (aDate === bDate) return a.title.localeCompare(b.title);
    return aDate < bDate ? 1 : -1;
  };
}

// Pairs date lookup with the shared ordering so no list can sort its entries differently.
export function createSortedContentLookup<T extends { slug: string; title: string }>(
  entries: T[],
  getDates: (slug: string) => ContentDates,
  sortBy: keyof ContentDates = "publishedAt"
) {
  return function getSorted(): DatedContent<T>[] {
    return entries
      .map((entry) => ({ ...entry, ...getDates(entry.slug) }))
      .sort(compareByDateDesc(sortBy));
  };
}
