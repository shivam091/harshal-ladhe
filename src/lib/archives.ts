/*
  Server-only archive helper — normalizes posts, snippets, tutorials, and
  series into one flat, sorted list for the /archives timeline. Reads
  git-derived dates via getSortedPosts/getSortedSnippets/getSortedTutorials/
  getSortedSeriesWithDates, so this runs at build time only.

  Grouping/display types and the pure by-year grouping logic live in
  utils/archive-items.ts instead of here, since that module also needs to be
  importable from the client-side filter — see that file's header comment for why.
*/
import { getSortedPosts } from "@/lib/posts";
import { getSortedSnippets } from "@/lib/snippets";
import { getSortedTutorials } from "@/lib/tutorials";
import { getSortedSeriesWithDates } from "@/lib/series";
import { compareByDateDesc } from "@/lib/content-dates";
import { getPostUrl } from "@/utils/post-url";
import type { ArchiveItem } from "@/utils/archive-items";

/*
  Every post, snippet, tutorial, and series as one flat list, sorted
  newest-first (ties broken alphabetically by title). Undated
  (never-committed) entries sort last — grouping by year (see
  groupArchiveItemsByYear) drops them entirely, since an archive is
  inherently about publish dates.
*/
export function getArchiveItems(): ArchiveItem[] {
  const postItems: ArchiveItem[] = getSortedPosts().map((post) => ({
    id: `post-${post.slug}`,
    type: "post",
    title: post.title,
    slug: post.slug,
    pathname: getPostUrl(post),
    publishedAt: post.publishedAt
  }));

  const snippetItems: ArchiveItem[] = getSortedSnippets().map((snippet) => ({
    id: `snippet-${snippet.slug}`,
    type: "snippet",
    title: snippet.title,
    slug: snippet.slug,
    pathname: `/snippet/${snippet.slug}`,
    publishedAt: snippet.publishedAt
  }));

  const tutorialItems: ArchiveItem[] = getSortedTutorials().map((tutorial) => ({
    id: `tutorial-${tutorial.slug}`,
    type: "tutorial",
    title: tutorial.title,
    slug: tutorial.slug,
    pathname: `/tutorial/${tutorial.slug}`,
    publishedAt: tutorial.publishedAt
  }));

  const seriesItems: ArchiveItem[] = getSortedSeriesWithDates().map((oneSeries) => ({
    id: `series-${oneSeries.slug}`,
    type: "series",
    title: oneSeries.title,
    slug: oneSeries.slug,
    pathname: `/series/${oneSeries.slug}`,
    publishedAt: oneSeries.publishedAt
  }));

  return [...postItems, ...snippetItems, ...tutorialItems, ...seriesItems].sort(compareByDateDesc());
}
