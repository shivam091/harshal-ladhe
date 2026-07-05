"use client";

import { JSX } from "react";
import { usePathname, notFound } from "next/navigation";
import Changelog from "@/components/Changelog";
import PageNavigation from "@/components/PageNavigation";
import HitCounter from "@/components/HitCounter";
import { PageTitle } from "@/components/PageHeading/PageHeading.styles";
import { inlineMarkdownToHtml } from "@/utils/markdown";
import { getSeriesBySlug, getSeriesNavigation, getSeriesPosts } from "@/data/series";
import SeriesPartList from "@/app/(site)/(internal)/(series)/SeriesPartList";
import { siteConfig } from "@/config/site";
import { SeriesDetailLayoutClientProps } from "@/interfaces/series";
import {
  Article,
  SeriesHeader,
  PageExcerpt,
  SeriesContent,
  PostsHeading
} from "@/app/(site)/(internal)/(series)/layout.styles";

/*
  Client half of the /series section layout — kept separate from layout.tsx so that
  file can stay a Server Component and compute readingMinutesBySlug via lib/posts.ts
  (server-only: shells out to git/word-count-cli). Every /series/<slug> detail page
  gets registry-driven chrome: title, excerpt, changelog, the ordered list of posts
  (parts) in the series, and series-to-series nav. The slug comes from the pathname
  (a static per-folder page can't pass params to a layout); all data here besides
  readingMinutesBySlug is from the client-safe registry, and the parts list derives
  its published dates from each post's changelog.
*/
export default function SeriesDetailLayoutClient({ children, readingMinutesBySlug }: SeriesDetailLayoutClientProps): JSX.Element {
  const pathname = usePathname();
  const slug = pathname.replace(/^\/series\//, "").replace(/\/$/, "");

  /*
    The /series index shares this folder (and therefore this layout) with the
    per-series detail pages. It carries no slug, so render it plainly — the
    detail chrome below only applies to /series/<slug> pages.
  */
  if (!slug || slug === pathname) {
    return <>{children}</>;
  }

  const series = getSeriesBySlug(slug);
  if (!series) notFound();

  const posts = getSeriesPosts(slug);
  const { previous, next } = getSeriesNavigation(slug);

  return (
    <>
      <Article aria-labelledby="page-title">
        <PageTitle id="page-title" dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(series.title) }} />

        <SeriesHeader>
          {series.excerpt && <PageExcerpt>{series.excerpt}</PageExcerpt>}
        </SeriesHeader>

        <SeriesContent>{children}</SeriesContent>

        <PostsHeading>Posts</PostsHeading>
        <SeriesPartList posts={posts} readingMinutesBySlug={readingMinutesBySlug} />

        <PageNavigation
          ariaLabel="Series navigation"
          previousLabel="Previous"
          nextLabel="Next"
          previous={previous ? { href: `/series/${previous.slug}`, title: previous.title } : null}
          next={next ? { href: `/series/${next.slug}`, title: next.title } : null}
        />

        <Changelog entries={series.changelog ?? []} />

        {siteConfig.hitCounter && <HitCounter />}
      </Article>
    </>
  );
}

SeriesDetailLayoutClient.displayName = "SeriesDetailLayoutClient";
