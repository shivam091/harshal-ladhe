import type { JSX, ReactNode } from "react";
import { getSortedPosts } from "@/lib/posts";
import { getSeriesDatesBySlug } from "@/lib/series";
import SeriesDetailLayoutClient from "@/app/(site)/(internal)/(series)/SeriesDetailLayoutClient";

// Server half of the layout, existing only to compute git-derived read times and dates the client half can't reach.
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
