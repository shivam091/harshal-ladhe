import { JSX } from "react";
import Link from "next/link";
import VisuallyHidden from "@/components/VisuallyHidden";
import { CalendarIcon } from "@/components/Icon";
import { PageMetaItem } from "@/components/PageMeta/PageMeta.styles";
import { getPublishedDate } from "@/lib/related-posts";
import { formatDate } from "@/utils/date";
import type { RelatedPostsProps } from "@/interfaces/post";
import {
  RelatedPostsSection,
  RelatedPostsHeading,
  RelatedPostsGrid,
  RelatedPost,
  RelatedPostHeader,
  RelatedPostTitle,
  RelatedPostExcerpt,
  RelatedPostBody,
  RelatedPostDescription,
  RelatedPostFooter
} from "@/app/(site)/(internal)/(post)/RelatedPosts.styles";

/*
  Related-posts block rendered at the foot of a post. Ranking comes from
  lib/related-posts (tag/category similarity over the registry); this presents
  the results as a responsive grid of cards mirroring the /posts list card —
  title, excerpt, description, and published date. Renders nothing when there
  are no related posts.
*/
export default function RelatedPosts({ posts }: RelatedPostsProps): JSX.Element | null {
  if (posts.length === 0) return null;

  return (
    <>
      <RelatedPostsSection aria-labelledby="related-posts-heading">
        <RelatedPostsHeading id="related-posts-heading">Related Posts</RelatedPostsHeading>

        <RelatedPostsGrid>
          {posts.map((post) => {
            const publishedAt = getPublishedDate(post);

            return (
              <RelatedPost key={post.slug}>
                <RelatedPostHeader>
                  <RelatedPostTitle>
                    <Link
                      href={`/post/${post.slug}`}
                      title={post.title}
                      aria-label={`Read post: ${post.title}`}
                    >
                      {post.title}
                    </Link>
                  </RelatedPostTitle>

                  {post.excerpt && <RelatedPostExcerpt>{post.excerpt}</RelatedPostExcerpt>}
                </RelatedPostHeader>

                {post.description && (
                  <RelatedPostBody>
                    <RelatedPostDescription title={post.description}>
                      {post.description}
                    </RelatedPostDescription>
                  </RelatedPostBody>
                )}

                {publishedAt && (
                  <RelatedPostFooter>
                    <PageMetaItem className="page-published-date">
                      <CalendarIcon />
                      <VisuallyHidden>Published at:</VisuallyHidden>
                      <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
                    </PageMetaItem>
                  </RelatedPostFooter>
                )}
              </RelatedPost>
            );
          })}
        </RelatedPostsGrid>
      </RelatedPostsSection>
    </>
  );
}

RelatedPosts.displayName = "RelatedPosts";
