import type { JSX } from "react";
import Link from "next/link";
import VisuallyHidden from "@/components/VisuallyHidden";
import { CalendarIcon } from "@/components/Icon";
import { PageMetaItem } from "@/components/PageMeta/PageMeta.styles";
import { getPublishedDate } from "@/lib/related-posts";
import { getPostUrl } from "@/utils/post-url";
import { formatDate } from "@/utils/date";
import type { Post } from "@/data/posts";
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
} from "@/app/(site)/(internal)/(post)/RelatedPosts/RelatedPosts.styles";
import { inlineMarkdownToHtml } from "@/utils/markdown";

/*
  Keeps readers moving to similar posts once they finish one; renders nothing when no
  posts relate.
*/
// Props for the related-posts block shown at the foot of a post.
interface RelatedPostsProps {
  // Ranked related posts to render as cards, in the order given.
  posts: Post[];
}

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
                      href={getPostUrl(post)}
                      title={post.title}
                      aria-label={`Read post: ${post.title}`}
                      dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(post.title) }}
                    />
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
