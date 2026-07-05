import { JSX, ReactNode } from "react";
import { getSortedPosts } from "@/lib/posts";
import SeriesDetailLayoutClient from "@/app/(site)/(internal)/(series)/SeriesDetailLayoutClient";

/*
  Server half of the /series section layout — exists only to compute
  readingMinutesBySlug via lib/posts.ts (server-only: shells out to git/word-count-cli)
  and hand it down to SeriesDetailLayoutClient, which needs "use client" for
  usePathname() and so can't call lib/posts.ts itself. See that file for the actual chrome.
*/
export default function SeriesDetailLayout({ children }: { children: ReactNode }): JSX.Element {
  const readingMinutesBySlug = Object.fromEntries(
    getSortedPosts().map((post) => [post.slug, post.readingMinutes])
  );

  return (
    <SeriesDetailLayoutClient readingMinutesBySlug={readingMinutesBySlug}>
      {children}
    </SeriesDetailLayoutClient>
  );
}

SeriesDetailLayout.displayName = "SeriesDetailLayout";
