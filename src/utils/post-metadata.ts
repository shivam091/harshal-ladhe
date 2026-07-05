import type { Metadata } from "next";
import { getPostBySlug } from "@/data/posts";
import { getPostDates } from "@/lib/posts";
import { buildContentMetadata } from "@/utils/build-content-metadata";
import { getPostUrl } from "@/utils/post-url";

// Builds Next.js metadata for a post page from its registry entry (see buildContentMetadata).
export function buildPostMetadata(slug: string): Metadata {
  const post = getPostBySlug(slug);
  if (!post) return {};

  const { publishedAt, lastModifiedAt } = getPostDates(slug);

  return buildContentMetadata({
    title: post.title,
    description: post.description,
    url: getPostUrl(post),
    tags: post.tags,
    image: post.image,
    publishedAt,
    lastModifiedAt
  });
}
