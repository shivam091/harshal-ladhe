import { getSnippetBySlug } from "@/data/snippets";
import { getPostBySlug, posts } from "@/data/posts";
import { getSeriesBySlug } from "@/data/series";
import { pageNames } from "@/config/page-names";
import { slugify } from "@/utils/string";
import type { Crumb } from "@/types/breadcrumb";
import type { Post } from "@/interfaces/post";

// Strips the detail-route prefix and any trailing slash to get the bare slug.
function slugFromPath(pathname: string, prefix: string): string {
  return pathname.slice(prefix.length).replace(/\/$/, "");
}

/*
  Display name for a tag/category slug, or null when no post uses it.
  Local clone of lib/taxonomy's getTaxonomyTermBySlug — that module can't be
  imported here because it transitively pulls node:child_process (git dates)
  into this client component; this only needs the pure post registry.
*/
function findTermBySlug(getValues: (post: Post) => string[], slug: string): string | null {
  for (const post of posts) {
    const match = getValues(post).find((value) => slugify(value) === slug);
    if (match) return match;
  }
  return null;
}

/*
  Constructs the ordered breadcrumb trail for the current pathname.
  Detail pages (post, snippet, series, tag, category) get a two-step trail
  (Home → index → title); all other pages get a flat two-item trail
  (Home → page title).
*/
export function buildCrumbs(pathname: string): Crumb[] {
  const crumbs: Crumb[] = [{ title: "Home", url: "/" }];

  if (pathname === "/") return crumbs;

  if (pathname.startsWith("/post/")) {
    // /post/<category>/<slug> — the post's own slug is the last path segment.
    const postSlug = pathname.replace(/\/$/, "").split("/").pop() ?? "";
    const post = getPostBySlug(postSlug);
    crumbs.push({ title: "Posts", url: "/posts" });
    if (post) crumbs.push({ title: post.title, url: pathname });
    return crumbs;
  }

  if (pathname.startsWith("/snippet/")) {
    const snippet = getSnippetBySlug(slugFromPath(pathname, "/snippet/"));
    crumbs.push({ title: "Snippets", url: "/snippets" });
    if (snippet) crumbs.push({ title: snippet.title, url: pathname });
    return crumbs;
  }

  if (pathname.startsWith("/series/")) {
    const series = getSeriesBySlug(slugFromPath(pathname, "/series/"));
    crumbs.push({ title: "Series", url: "/series" });
    if (series) crumbs.push({ title: series.title, url: pathname });
    return crumbs;
  }

  if (pathname.startsWith("/tag/")) {
    const tag = findTermBySlug((post) => post.tags, slugFromPath(pathname, "/tag/"));
    crumbs.push({ title: "Tags", url: "/tags" });
    if (tag) crumbs.push({ title: tag, url: pathname });
    return crumbs;
  }

  if (pathname.startsWith("/category/")) {
    const category = findTermBySlug((post) => post.category, slugFromPath(pathname, "/category/"));
    crumbs.push({ title: "Categories", url: "/categories" });
    if (category) crumbs.push({ title: category, url: pathname });
    return crumbs;
  }

  const title =
    pageNames[pathname] ??
    pathname.split("/").pop()?.replace(/-/g, " ") ??
    "Page";

  crumbs.push({ title, url: pathname });
  return crumbs;
}
