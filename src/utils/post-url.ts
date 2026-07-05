import { slugify } from "@/utils/string";

/*
  Posts are routed and filed under their category slug — /post/<category>/<slug>,
  backed by app/(site)/(internal)/(post)/post/<category>/<slug>/page.mdx. A post's
  first category decides both, so this is the single place that turns a post's
  `category` array into that path segment.
*/
export function getPostCategorySlug(category: string[]): string {
  return slugify(category[0] ?? "");
}

// Canonical /post/<category>/<slug> URL for a post.
export function getPostUrl(post: { slug: string; category: string[] }): string {
  return `/post/${getPostCategorySlug(post.category)}/${post.slug}`;
}
