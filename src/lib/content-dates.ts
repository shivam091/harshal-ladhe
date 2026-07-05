/*
  Shared git-derived date memoisation for posts, snippets, and series. Each of
  those registries resolves a slug to an MDX file path and reads its publish /
  last-modified dates for both the list page and generateMetadata — this
  factors out the per-slug cache + git-dates lookup common to all three.
*/
import { join } from "node:path";
import { gitLastModified, gitPublishedAt } from "@/lib/git-dates.mjs";

export interface ContentDates {
  publishedAt: string | null;
  lastModifiedAt: string | null;
}

/*
  Builds a memoised `getDates(slug)` function for a content type. `resolvePath`
  maps a slug to the MDX file whose git history backs its dates.
*/
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

/*
  Builds a `resolvePath(slug)` for a content type laid out at
  app/(site)/(internal)/(<segment>)/<segment>/<slug>/page.mdx — the flat
  layout snippets and tutorials both use (unlike posts, which nest under a
  category segment, or series). Pass the result straight to createDatedLookup.
*/
export function createContentFilePath(segment: string): (slug: string) => string {
  const dir = join(process.cwd(), "src", "app", "(site)", "(internal)", `(${segment})`, segment);
  return (slug: string) => join(dir, slug, "page.mdx");
}

// A content entry merged with its git-derived publish/last-modified dates.
export type DatedContent<T> = T & ContentDates;

/*
  Builds a getSorted() function: every entry merged with its dates, newest
  publish date first. Undated (uncommitted) entries sort last; ties between
  equal dates break alphabetically by title for a stable, deterministic order.
*/
export function createSortedContentLookup<T extends { slug: string; title: string }>(
  entries: T[],
  getDates: (slug: string) => ContentDates
) {
  return function getSorted(): DatedContent<T>[] {
    return entries
      .map((entry) => ({ ...entry, ...getDates(entry.slug) }))
      .sort((a, b) => {
        if (!a.publishedAt && !b.publishedAt) return a.title.localeCompare(b.title);
        if (!a.publishedAt) return 1;
        if (!b.publishedAt) return -1;
        if (a.publishedAt === b.publishedAt) return a.title.localeCompare(b.title);
        return a.publishedAt < b.publishedAt ? 1 : -1;
      });
  };
}
