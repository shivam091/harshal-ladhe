import { JSX } from "react";
import VisuallyHidden from "@/components/VisuallyHidden";
import Tooltip from "@/components/Tooltip";
import { CalendarIcon, HistoryIcon, ClockIcon } from "@/components/Icon";
import { formatDate, fullTimestamp } from "@/utils/date";
import type { SnippetMetaProps } from "@/interfaces/snippet-meta";
import { PageMetaPrimary, PageMetaItem } from "@/components/PageMeta/PageMeta.styles";

/*
  Snippet meta row (published + last-modified dates with icons, plus read time).
  Auto-injected at the top of each snippet body by the remark-snippet-meta
  plugin, which fills the props from git history + an AST word count at build.
*/
export default function SnippetMeta({
  publishedAt,
  lastModifiedAt,
  readingMinutes,
  words
}: SnippetMetaProps): JSX.Element {
  /*
    MDX passes these props as strings; Number() coerces them and the || fallback
    guards against NaN (missing frontmatter) — minimum 1 min so "0 min read" never shows.
  */
  const minutes = Number(readingMinutes) || 1;
  const wordCount = Number(words) || 0;

  return (
    <>
      <PageMetaPrimary role="group" aria-label="Snippet metadata">
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

SnippetMeta.displayName = "SnippetMeta";
