import type { JSX } from "react";
import RelatedContent from "@/components/RelatedContent";
import { getPublishedDate } from "@/lib/related-posts";
import { getPostUrl } from "@/utils/post-url";
import type { Post } from "@/data/posts";

// Props for the related-posts block shown at the foot of a post.
interface RelatedPostsProps {
  // Ranked related posts to render as cards, in the order given.
  posts: Post[];
}

// Posts route under their category, so they map onto the shared cards here rather than in the generic component.
export default function RelatedPosts({ posts }: RelatedPostsProps): JSX.Element | null {
  return (
    <RelatedContent
      label="Posts"
      itemLabel="post"
      items={posts.map((post) => ({
        slug: post.slug,
        href: getPostUrl(post),
        title: post.title,
        excerpt: post.excerpt,
        description: post.description,
        publishedAt: getPublishedDate(post)
      }))}
    />
  );
}

RelatedPosts.displayName = "RelatedPosts";
