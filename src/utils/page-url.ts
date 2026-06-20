import { siteConfig } from "@/config/site";

// Built from the canonical site URL, not the request host, so localhost and preview deploys never write their own domain.
export function getPageUrl(pathname: string): string {
  return `${siteConfig.url.replace(/\/$/, "")}${pathname}`;
}

// Feeds and structured data are read outside the site, so relative paths need the origin; already-absolute ones (CDN images) pass through.
export function getAbsoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return getPageUrl(path.startsWith("/") ? path : `/${path}`);
}
