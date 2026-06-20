import { siteConfig } from "@/config/site";

// Built from the canonical site URL, not the request host, so localhost and preview deploys never write their own domain.
export function getPageUrl(pathname: string): string {
  return `${siteConfig.url.replace(/\/$/, "")}${pathname}`;
}
