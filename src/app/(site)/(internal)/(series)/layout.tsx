import type { JSX, ReactNode } from "react";
import { getSortedPosts } from "@/lib/posts";
import { getSeriesDatesBySlug } from "@/lib/series";
import SeriesDetailLayoutClient from "@/app/(site)/(internal)/(series)/SeriesDetailLayoutClient";

/*
  Server half of the /series section layout — exists only to compute
  readingMinutesBySlug (lib/posts.ts) and seriesDatesBySlug (lib/series.ts), both
  server-only (shell out to git/word-count-cli), and hand them down to
  SeriesDetailLayoutClient, which needs "use client" for usePathname() and so
  can't call either module itself. See that file for the actual chrome.
*/
export default function SeriesDetailLayout({ children }: { children: ReactNode }): JSX.Element {
  const readingMinutesBySlug = Object.fromEntries(
    getSortedPosts().map((post) => [post.slug, post.readingMinutes])
  );
  const seriesDatesBySlug = getSeriesDatesBySlug();

  return (
    <SeriesDetailLayoutClient readingMinutesBySlug={readingMinutesBySlug} seriesDatesBySlug={seriesDatesBySlug}>
      {children}
    </SeriesDetailLayoutClient>
  );
}

SeriesDetailLayout.displayName = "SeriesDetailLayout";
