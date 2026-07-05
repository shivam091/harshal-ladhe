/*
  Shared git-derived date memoisation for posts, snippets, and series. Each of
  those registries resolves a slug to an MDX file path and reads its publish /
  last-modified dates for both the list page and generateMetadata — this
  factors out the per-slug cache + git-dates lookup common to all three.
*/
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
