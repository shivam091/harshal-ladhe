/*
  Server-only because it reads git-derived dates. Grouping lives in a separate pure module so
  the client-side filter can import it.
*/
import { getSortedPosts } from "@/lib/posts";
import { getSortedSnippets } from "@/lib/snippets";
import { getSortedTutorials } from "@/lib/tutorials";
import { getSortedSeriesWithDates } from "@/lib/series";
import { compareByDateDesc } from "@/lib/content-dates";
import { getPostUrl } from "@/utils/post-url";
import type { ArchiveItem } from "@/utils/archive-items";

// Undated (never-committed) entries sort last and drop out of the year grouping, since an archive is about publish dates.
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
