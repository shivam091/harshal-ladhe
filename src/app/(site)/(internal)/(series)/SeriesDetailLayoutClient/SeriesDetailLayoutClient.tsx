"use client";

import type { JSX, ReactNode } from "react";
import { usePathname, notFound } from "next/navigation";
import PageSignOff from "@/components/SignOff/PageSignOff";
import Changelog from "@/components/Changelog";
import PageNavigation from "@/components/PageNavigation";
import HitCounter from "@/components/HitCounter";
import VisuallyHidden from "@/components/VisuallyHidden";
import Tooltip from "@/components/Tooltip";
import { CalendarIcon, HistoryIcon, BookOpenIcon } from "@/components/Icon";
import { PageTitle } from "@/components/PageHeading/PageHeading.styles";
import { PageMetaPrimary, PageMetaItem } from "@/components/PageMeta/PageMeta.styles";
import { inlineMarkdownToHtml } from "@/utils/markdown";
import { formatDate, fullTimestamp } from "@/utils/date";
import { getSeriesBySlug, getSeriesNavigation, getSeriesPosts } from "@/data/series";
import type { SeriesDates } from "@/lib/series";
import SeriesPartList from "@/app/(site)/(internal)/(series)/SeriesPartList";
import { siteConfig } from "@/config/site";
import {
  Article,
  SeriesHeader,
  PageExcerpt,
  SeriesContent,
  PostsHeading
} from "@/app/(site)/(internal)/(series)/layout.styles";

/*
  Client half of the /series section layout — kept separate from layout.tsx so that
  file can stay a Server Component and compute readingMinutesBySlug/seriesDatesBySlug
  via lib/posts.ts and lib/series.ts (server-only: shell out to git/word-count-cli).
  Every /series/<slug> detail page gets registry-driven chrome: title, excerpt,
  published/last-modified dates, part count, changelog, the ordered list of posts
  (parts) in the series, and series-to-series nav. The slug comes from the pathname (a static
  per-folder page can't pass params to a layout); all data here besides
  readingMinutesBySlug/seriesDatesBySlug is from the client-safe registry, and the
  parts list derives its published dates from each post's changelog.
*/
// Props for the client half of the /series section layout.
interface SeriesDetailLayoutClientProps {
  children: ReactNode;
  // Read time (minutes) by post slug — computed server-side by layout.tsx via
  // lib/posts.ts (git history), since this component can't do that itself.
  readingMinutesBySlug: Record<string, number>;
  // Published / last-modified dates by series slug — computed server-side by
  // layout.tsx via lib/series.ts (git history), for the same reason.
  seriesDatesBySlug: Record<string, SeriesDates>;
}

export default function SeriesDetailLayoutClient({ children, readingMinutesBySlug, seriesDatesBySlug }: SeriesDetailLayoutClientProps): JSX.Element {
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
  const { publishedAt, lastModifiedAt } = seriesDatesBySlug[slug] ?? { publishedAt: null, lastModifiedAt: null };
  const partCount = posts.length;

  return (
    <>
      <Article aria-labelledby="page-title">
        <PageTitle id="page-title" dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(series.title) }} />

        <SeriesHeader>
          {series.excerpt && <PageExcerpt>{series.excerpt}</PageExcerpt>}
        </SeriesHeader>

        <PageMetaPrimary role="group" aria-label="Series metadata">
          {publishedAt && (
            <PageMetaItem className="page-published-date">
              <CalendarIcon />
              <VisuallyHidden>Published at:</VisuallyHidden>
              <Tooltip content={`Published on ${fullTimestamp(publishedAt)}`}>
                <time dateTime={publishedAt} tabIndex={0}>
                  {formatDate(publishedAt)}
                </time>
              </Tooltip>
            </PageMetaItem>
          )}

          {lastModifiedAt && (
            <PageMetaItem className="page-last-modified-date">
              <HistoryIcon />
              <VisuallyHidden>Last updated:</VisuallyHidden>
              <Tooltip content={`Last updated on ${fullTimestamp(lastModifiedAt)}`}>
                <time dateTime={lastModifiedAt} tabIndex={0}>
                  {formatDate(lastModifiedAt)}
                </time>
              </Tooltip>
            </PageMetaItem>
          )}

          <PageMetaItem className="series-parts">
            <BookOpenIcon />
            <VisuallyHidden>Parts:</VisuallyHidden>
            {partCount} part{partCount !== 1 ? "s" : ""}
          </PageMetaItem>
        </PageMetaPrimary>

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

        <PageSignOff showText metadata={series} />

        <Changelog entries={series.changelog ?? []} />

        {siteConfig.hitCounter && <HitCounter />}
      </Article>
    </>
  );
}

SeriesDetailLayoutClient.displayName = "SeriesDetailLayoutClient";
