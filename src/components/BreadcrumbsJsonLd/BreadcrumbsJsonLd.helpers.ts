import { getSnippetBySlug } from "@/data/snippets";
import { getTutorialBySlug } from "@/data/tutorials";
import { getPostBySlug, posts } from "@/data/posts";
import { getSeriesBySlug } from "@/data/series";
import { pageNames } from "@/config/page-names";
import { slugify } from "@/utils/string";
import type { Crumb } from "@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd.types";
import type { Post } from "@/data/posts";

// Normalised so a trailing slash can't yield a different slug for the same page.
function slugFromPath(pathname: string, prefix: string): string {
  return pathname.slice(prefix.length).replace(/\/$/, "");
}

/*
  Duplicated rather than imported because the shared taxonomy helper pulls in git access,
  which can't run in this client component.
*/
function findTermBySlug(getValues: (post: Post) => string[], slug: string): string | null {
  for (const post of posts) {
    const match = getValues(post).find((value) => slugify(value) === slug);
    if (match) return match;
  }
  return null;
}

/*
  Detail pages get a Home → index → title trail so search results show which section they
  belong to; every other page stays flat.
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

  if (pathname.startsWith("/tutorial/")) {
    const tutorial = getTutorialBySlug(slugFromPath(pathname, "/tutorial/"));
    crumbs.push({ title: "Tutorials", url: "/tutorials" });
    if (tutorial) crumbs.push({ title: tutorial.title, url: pathname });
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
