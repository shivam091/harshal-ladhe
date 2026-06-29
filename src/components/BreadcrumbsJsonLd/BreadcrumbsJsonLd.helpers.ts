import { pageNames } from "@/config/page-names";
import type { Crumb } from "@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd.types";

// Normalised so a trailing slash can't yield a different slug for the same page.
function slugFromPath(pathname: string, prefix: string): string {
  return pathname.slice(prefix.length).replace(/\/$/, "");
}

/*
  Detail pages get a Home → index → title trail so search results show which section they
  belong to; every other page stays flat.
*/
export function buildCrumbs(pathname: string): Crumb[] {
  const crumbs: Crumb[] = [{ title: "Home", url: "/" }];

  if (pathname === "/") return crumbs;

  const title =
    pageNames[pathname] ??
    pathname.split("/").pop()?.replace(/-/g, " ") ??
    "Page";

  crumbs.push({ title, url: pathname });
  return crumbs;
}
