// Generated at build time by Next.js so the static export ships a sitemap without an extra package.

import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { join } from "node:path";
import { gitLastModified } from "@/lib/git-dates.mjs";

// Required for `output: "export"` — tells Next.js this route is fully static.
export const dynamic = "force-static";

// Trailing slash stripped so path concatenation never produces a double slash.
const base = siteConfig.url.replace(/\/$/, "");

// Anchors pageDate so entries can name files by their app-relative path.
const APP_DIR = join(process.cwd(), "src", "app");

/*
  Uses git history so lastModified reflects real content edits, not the build time.
  `relativePath` must include route-group folders, e.g. "(site)/(home)/page.tsx".
*/
function pageDate(relativePath: string): Date {
  const raw = gitLastModified(join(APP_DIR, relativePath));
  return raw ? new Date(raw) : new Date();
}

/*
  Hand-maintained — add an entry whenever a new top-level page is created, picking
  changeFrequency/priority by how often that kind of page changes so crawlers revisit
  what actually moves: home weekly/1.0, listings weekly/0.9, other monthly/0.6, legal yearly/0.3.
*/
const staticPages: MetadataRoute.Sitemap = [
  {
    url: `${base}/how-did-i-build-my-blog`,
    lastModified: pageDate("(site)/(internal)/how-did-i-build-my-blog/page.mdx"),
    changeFrequency: "monthly",
    priority: 0.6
  }
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPages
  ];
}
