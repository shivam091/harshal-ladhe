import type { JSX } from "react";
import Link from "next/link";
import VisuallyHidden from "@/components/VisuallyHidden";
import Categories from "@/components/Categories";
import SeriesBadge from "@/components/SeriesBadge";
import { CalendarIcon, ClockIcon } from "@/components/Icon";
import { PageMetaItem } from "@/components/PageMeta/PageMeta.styles";
import { getSeriesForPost } from "@/data/series";
import { getPostUrl } from "@/utils/post-url";
import { formatDate } from "@/utils/date";
import { inlineMarkdownToHtml } from "@/utils/markdown";
import type { PostListProps } from "@/components/PostList/PostList.types";
import {
  PostFeed,
  PostPreview,
  PostCardHeader,
  PostCardTitle,
  PostCardExcerpt,
  PostCardBody,
  PostCardDescription,
  PostCardFooter
} from "@/components/PostList/PostList.styles";

/*
  The /posts feed: one card per post with title, excerpt, description, series badge
  (if the post belongs to one), published date, categories, and estimated read time.
  Published date and read time come from git history via DatedPost (server-only —
  see SeriesPartList for the client-safe equivalent used on series pages).
*/
export default function PostList({ posts }: PostListProps): JSX.Element {
  return (
    <>
      <PostFeed>
        {posts.map((post, index) => {
          const series = getSeriesForPost(post.slug);

          return (
            <PostPreview
              key={post.slug}
              style={{ "--stagger": String(index) } as React.CSSProperties}
            >
              <PostCardHeader>
                <PostCardTitle>
                  <Link href={getPostUrl(post)} title={post.title}>
                    <span dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(post.title) }} />
                  </Link>
                </PostCardTitle>

                {series && <SeriesBadge series={series} />}

                {post.excerpt && <PostCardExcerpt>{post.excerpt}</PostCardExcerpt>}
              </PostCardHeader>

              {post.description && (
                <PostCardBody>
                  <PostCardDescription title={post.description}>
                    {post.description}
                  </PostCardDescription>
                </PostCardBody>
              )}

              <PostCardFooter>
                {post.publishedAt && (
                  <PageMetaItem className="page-published-date">
                    <CalendarIcon />
                    <VisuallyHidden>Published at:</VisuallyHidden>
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  </PageMetaItem>
                )}

                <Categories categories={post.category} />

                <PageMetaItem className="page-read-time">
                  <ClockIcon />
                  <VisuallyHidden>Estimated reading time:</VisuallyHidden>
                  <span>{post.readingMinutes} min read</span>
                </PageMetaItem>
              </PostCardFooter>
            </PostPreview>
          );
        })}
      </PostFeed>
    </>
  );
}

PostList.displayName = "PostList";
