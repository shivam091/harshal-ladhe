import type { JSX } from "react";
import VisuallyHidden from "@/components/VisuallyHidden";
import Tooltip from "@/components/Tooltip";
import { CalendarIcon, HistoryIcon, ClockIcon } from "@/components/Icon";
import { formatDate, fullTimestamp } from "@/utils/date";
import type { ContentMetaProps } from "@/components/ContentMeta/ContentMeta.types";
import { PageMetaPrimary, PageMetaItem } from "@/components/PageMeta/PageMeta.styles";
import CoverImage from "@/components/CoverImage";
import type { ContentEntry } from "@/data/content";

// Keyed by route segment so a new content type only needs its registry lookup added here.
const ENTRY_LOOKUPS: Record<string, (slug: string) => ContentEntry | undefined> = {};

// Filled at build from git history and a word count so dates and read time never need hand upkeep.
export default function ContentMeta({
  contentType,
  routeSegment,
  slug,
  publishedAt,
  lastModifiedAt,
  readingMinutes,
  words
}: ContentMetaProps): JSX.Element {
  // MDX hands these over as strings; the fallbacks cover NaN and keep "0 min read" from ever showing.
  const minutes = Number(readingMinutes) || 1;
  const wordCount = Number(words) || 0;
  const entry = routeSegment && slug ? ENTRY_LOOKUPS[routeSegment]?.(slug) : undefined;

  return (
    <>
      <PageMetaPrimary role="group" aria-label={`${contentType} metadata`}>
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

        <PageMetaItem className="page-read-time">
          <ClockIcon />
          <VisuallyHidden>Estimated reading time:</VisuallyHidden>
          <Tooltip content={`${wordCount} words`}>
            <span tabIndex={0}>{minutes} min read</span>
          </Tooltip>
        </PageMetaItem>
      </PageMetaPrimary>

      {entry?.image && <CoverImage image={entry.image} />}
    </>
  );
}

ContentMeta.displayName = "ContentMeta";
