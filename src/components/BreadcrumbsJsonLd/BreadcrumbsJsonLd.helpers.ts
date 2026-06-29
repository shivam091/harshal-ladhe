import { getSnippetBySlug } from "@/data/snippets";
import { pageNames } from "@/config/page-names";
import { Crumb } from "@/types/breadcrumb";

/*
  Constructs the ordered breadcrumb trail for the current pathname.
  Snippet detail pages get a two-step trail (Home → Snippets → title);
  all other pages get a flat two-item trail (Home → page title).
*/
export function buildCrumbs(pathname: string): Crumb[] {
  const crumbs: Crumb[] = [{ title: "Home", url: "/" }];

  if (pathname === "/") return crumbs;

  if (pathname.startsWith("/snippet/")) {
    const slug = pathname.replace(/^\/snippet\//, "").replace(/\/$/, "");
    const snippet = getSnippetBySlug(slug);
    crumbs.push({ title: "Snippets", url: "/snippets" });
    if (snippet) crumbs.push({ title: snippet.title, url: pathname });
    return crumbs;
  }

  const title =
    pageNames[pathname] ??
    pathname.split("/").pop()?.replace(/-/g, " ") ??
    "Page";

  crumbs.push({ title, url: pathname });
  return crumbs;
}
