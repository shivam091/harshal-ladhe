import type { JSX } from "react";
import Link from "next/link";
import VisuallyHidden from "@/components/VisuallyHidden";
import Categories from "@/components/Categories";
import { BookOpenIcon, CalendarIcon, ClockIcon } from "@/components/Icon";
import { PageMetaItem } from "@/components/PageMeta/PageMeta.styles";
import { getPublishedDate } from "@/lib/related-entries";
import { getPostUrl } from "@/utils/post-url";
import { formatDate } from "@/utils/date";
import { inlineMarkdownToHtml } from "@/utils/markdown";
import type { Post } from "@/data/posts";
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
  Published dates come from each post's changelog because this list renders in a client tree
  without git access; no series badge, since every card already belongs to this series.
*/
// Props for the series parts list.
interface SeriesPartListProps {
  // Posts belonging to the series, in part order.
  posts: Post[];
  // Passed down because read time can only be computed server-side.
  readingMinutesBySlug: Record<string, number>;
}

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
