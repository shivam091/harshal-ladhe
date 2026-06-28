import type { JSX } from "react";
import VisuallyHidden from "@/components/VisuallyHidden";
import Tooltip from "@/components/Tooltip";
import { CalendarIcon, HistoryIcon, ClockIcon } from "@/components/Icon";
import { formatDate, fullTimestamp } from "@/utils/date";
import type { ContentMetaProps } from "@/components/ContentMeta/ContentMeta.types";
import { PageMetaPrimary, PageMetaItem } from "@/components/PageMeta/PageMeta.styles";

/*
  Content meta row (published + last-modified dates with icons, plus read
  time) — shared by snippets and tutorials, whose bodies are identical in
  shape. Auto-injected at the top of each body by the remark-content-metadata
  plugin, which fills the props from git history + an AST word count at build.
*/
export default function ContentMeta({
  contentType,
  publishedAt,
  lastModifiedAt,
  readingMinutes,
  words
}: ContentMetaProps): JSX.Element {
  /*
    MDX passes these props as strings; Number() coerces them and the || fallback
    guards against NaN (missing frontmatter) — minimum 1 min so "0 min read" never shows.
  */
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
