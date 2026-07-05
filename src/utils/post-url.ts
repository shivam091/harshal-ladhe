import { slugify } from "@/utils/string";

/*
  Posts are routed and filed under their first category's slug, so this is the single place
  that turns `category` into that path segment.
*/
export function getPostCategorySlug(category: string[]): string {
  return slugify(category[0] ?? "");
}

// Canonical /post/<category>/<slug> URL for a post.
export function getPostUrl(post: { slug: string; category: string[] }): string {
  return `/post/${getPostCategorySlug(post.category)}/${post.slug}`;
}
