import type { Post, PostNavigation } from "@/interfaces/post";

/*
  Registry of every post. Each entry has a matching content file at
  app/(site)/(internal)/(post)/post/<slug>/page.mdx. This drives the /posts list,
  the detail chrome, and prev/next nav.

  Dates come from git history at build time (lib/posts.ts for the list;
  remark-post-meta for the detail). New posts are appended to the end, so the
  registry reads oldest-first: "previous" is the entry just before (older),
  "next" is the one just after (newer).
*/
export const posts: Post[] = [
];

// Look up a single post by its slug.
export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

/*
  Previous/next neighbours by this array's order (client-safe — used by the
  post layout, which can't read git dates in the browser). The registry is
  oldest-first (new posts appended to the end), so "previous" is the entry
  just before (older) and "next" is the one just after (newer).
*/
export function getPostNavigation(slug: string): PostNavigation {
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { previous: null, next: null };

  const previous = index > 0 ? posts[index - 1] : null;
  const next = index < posts.length - 1 ? posts[index + 1] : null;

  return {
    previous: previous ? { slug: previous.slug, title: previous.title } : null,
    next: next ? { slug: next.slug, title: next.title } : null,
  };
}
