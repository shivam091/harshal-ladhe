import type { JSX } from "react";
import VisuallyHidden from "@/components/VisuallyHidden";
import Tooltip from "@/components/Tooltip";
import SeriesBadge from "@/components/SeriesBadge";
import { CalendarIcon, HistoryIcon, ClockIcon } from "@/components/Icon";
import { formatDate, fullTimestamp } from "@/utils/date";
import { getSeriesForPost } from "@/data/series";
import type { PostMetaProps } from "@/components/PostMeta/PostMeta.types";
import { PageMetaPrimary, PageMetaItem } from "@/components/PageMeta/PageMeta.styles";

/*
  Post meta row (published + last-modified dates with icons, read time, and — when
  the post belongs to a series — a series badge). Auto-injected at the top of each
  post body by the remark-post-meta plugin, which fills the props (including the
  slug) from git history + an AST word count at build.
*/
export default function PostMeta({
  slug,
  publishedAt,
  lastModifiedAt,
  readingMinutes,
  words
}: PostMetaProps): JSX.Element {
  const minutes = Number(readingMinutes) || 1;
  const wordCount = Number(words) || 0;
  const series = slug ? getSeriesForPost(slug) : null;

  return (
    <>
      <PageMetaPrimary role="group" aria-label="Post metadata">
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

        {series && <SeriesBadge series={series} />}
      </PageMetaPrimary>
    </>
  );
}

PostMeta.displayName = "PostMeta";
