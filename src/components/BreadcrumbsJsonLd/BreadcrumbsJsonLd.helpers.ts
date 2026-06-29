import { pageNames } from "@/config/page-names";
import type { Crumb } from "@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd.types";

// Normalised so a trailing slash can't yield a different slug for the same page.
function slugFromPath(pathname: string, prefix: string): string {
  return pathname.slice(prefix.length).replace(/\/$/, "");
}

// Kept flat (Home → page) since the site has no deeper hierarchy worth exposing to search results.
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
