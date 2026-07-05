import type { JSX } from "react";
import VisuallyHidden from "@/components/VisuallyHidden";
import Tooltip from "@/components/Tooltip";
import SeriesBadge from "@/components/SeriesBadge";
import { CalendarIcon, HistoryIcon, ClockIcon } from "@/components/Icon";
import { formatDate, fullTimestamp } from "@/utils/date";
import { getSeriesForPost } from "@/data/series";
import { getPostBySlug } from "@/data/posts";
import { getPostUrl } from "@/utils/post-url";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import type { PostMetaProps } from "@/components/PostMeta/PostMeta.types";
import { PageMetaPrimary, PageMetaItem } from "@/components/PageMeta/PageMeta.styles";

// Injected at build so dates and read time come from git and the text, never hand-kept frontmatter.
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
  const post = slug ? getPostBySlug(slug) : undefined;

  return (
    <>
      {post && (
        <ArticleJsonLd
          type="BlogPosting"
          title={post.title}
          description={post.description}
          url={getPostUrl(post)}
          image={post.image}
          publishedAt={publishedAt}
          lastModifiedAt={lastModifiedAt}
          tags={post.tags}
          words={words}
          series={series ?? undefined}
        />
      )}

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
