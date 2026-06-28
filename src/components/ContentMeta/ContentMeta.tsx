import type { JSX } from "react";
import VisuallyHidden from "@/components/VisuallyHidden";
import Tooltip from "@/components/Tooltip";
import { CalendarIcon, HistoryIcon, ClockIcon } from "@/components/Icon";
import { formatDate, fullTimestamp } from "@/utils/date";
import type { ContentMetaProps } from "@/components/ContentMeta/ContentMeta.types";
import { PageMetaPrimary, PageMetaItem } from "@/components/PageMeta/PageMeta.styles";

// Filled at build from git history and a word count so dates and read time never need hand upkeep.
export default function ContentMeta({
  contentType,
  publishedAt,
  lastModifiedAt,
  readingMinutes,
  words
}: ContentMetaProps): JSX.Element {
  // MDX hands these over as strings; the fallbacks cover NaN and keep "0 min read" from ever showing.
  const minutes = Number(readingMinutes) || 1;
  const wordCount = Number(words) || 0;

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
    </>
  );
}

ContentMeta.displayName = "ContentMeta";
