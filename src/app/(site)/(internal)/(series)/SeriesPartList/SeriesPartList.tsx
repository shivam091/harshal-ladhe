import type { JSX } from "react";
import Link from "next/link";
import VisuallyHidden from "@/components/VisuallyHidden";
import Categories from "@/components/Categories";
import { BookOpenIcon, CalendarIcon, ClockIcon } from "@/components/Icon";
import { PageMetaItem } from "@/components/PageMeta/PageMeta.styles";
import { getPublishedDate } from "@/lib/related-posts";
import { getPostUrl } from "@/utils/post-url";
import { formatDate } from "@/utils/date";
import { inlineMarkdownToHtml } from "@/utils/markdown";
import type { SeriesPartListProps } from "@/interfaces/series";
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
  The ordered list of posts (parts) that make up a series, shown on the series
  detail page. Mirrors the /posts feed cards (reusing PostList's styles), but
  published dates are derived from each post's changelog rather than git
  history (this list lives in a "use client" tree — see layout.tsx/
  SeriesDetailLayoutClient.tsx); read time is threaded down as
  readingMinutesBySlug since it's computed server-side via git history in
  layout.tsx and can't be recomputed here. No series badge is shown — every
  card already belongs to the series being viewed.
*/
export default function SeriesPartList({ posts, readingMinutesBySlug }: SeriesPartListProps): JSX.Element {
  return (
    <>
      <PostFeed>
        {posts.map((post, index) => {
          const publishedAt = getPublishedDate(post);
          const readingMinutes = readingMinutesBySlug[post.slug];

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
                {publishedAt && (
                  <PageMetaItem className="page-published-date">
                    <CalendarIcon />
                    <VisuallyHidden>Published at:</VisuallyHidden>
                    <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
                  </PageMetaItem>
                )}

                <Categories categories={post.category} />

                {readingMinutes !== undefined && (
                  <PageMetaItem className="page-read-time">
                    <ClockIcon />
                    <VisuallyHidden>Estimated reading time:</VisuallyHidden>
                    <span>{readingMinutes} min read</span>
                  </PageMetaItem>
                )}
              </PostCardFooter>
            </PostPreview>
          );
        })}
      </PostFeed>
    </>
  );
}

SeriesPartList.displayName = "SeriesPartList";
