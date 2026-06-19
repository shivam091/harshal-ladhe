/**
 * Sitemap — generated at build time by Next.js.
 *
 * Next.js calls this function during `next build` and writes the result to
 * `/sitemap.xml` in the static-export output (`out/`). No extra package is
 * needed; `MetadataRoute.Sitemap` is the built-in type.
 */

import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { join } from "node:path";
import { gitLastModified } from "@/lib/git-dates.mjs";

// Required for `output: "export"` — tells Next.js this route is fully static.
export const dynamic = "force-static";

// Normalise: strip any trailing slash so concatenation is consistent.
const base = siteConfig.url.replace(/\/$/, "");

// Root of the Next.js app directory — all pageDate paths are relative to this.
const APP_DIR = join(process.cwd(), "src", "app");

/*
  Returns the git last-commit date for a file under src/app.
  `relativePath` must include route-group folders, e.g. "(site)/(home)/page.tsx".
  Falls back to now() if the file has no git history yet.
*/
function pageDate(relativePath: string): Date {
  const raw = gitLastModified(join(APP_DIR, relativePath));
  return raw ? new Date(raw) : new Date();
}

/*
  Static pages
  Add a new entry here each time a new top-level page is created.
  changeFrequency and priority follow standard SEO conventions:
    home     → weekly  / 1.0   (highest — crawled often)
    index    → weekly  / 0.9   (listing pages — change when new content lands)
    content  → monthly / 0.7   (rarely changes after publish)
    other    → monthly / 0.6
    legal    → yearly  / 0.3   (changes very rarely)
*/
const staticPages: MetadataRoute.Sitemap = [
  {
    url: base,
    lastModified: pageDate("(site)/(home)/page.tsx"),
    changeFrequency: "weekly",
    priority: 1.0
  },
  {
    url: `${base}/about`,
    lastModified: pageDate("(site)/(internal)/about/page.mdx"),
    changeFrequency: "monthly",
    priority: 0.6
  },
  {
    url: `${base}/how-did-i-build-my-blog`,
    lastModified: pageDate("(site)/(internal)/how-did-i-build-my-blog/page.mdx"),
    changeFrequency: "monthly",
    priority: 0.6
  },
  {
    url: `${base}/terms-of-use`,
    lastModified: pageDate("(site)/(internal)/terms-of-use/page.mdx"),
    changeFrequency: "yearly",
    priority: 0.3
  },
  {
    url: `${base}/privacy-policy`,
    lastModified: pageDate("(site)/(internal)/privacy-policy/page.mdx"),
    changeFrequency: "yearly",
    priority: 0.3
  },
  {
    url: `${base}/code-of-conduct`,
    lastModified: pageDate("(site)/(internal)/code-of-conduct/page.mdx"),
    changeFrequency: "yearly",
    priority: 0.3
  }
];

// Dynamic post pages
// Uncomment and adapt when the posts route is ready:
//
// import { getAllPosts } from "@/lib/posts";
//
// const posts = getAllPosts();
// const postPages: MetadataRoute.Sitemap = [
//   // /posts index
//   {
//     url: `${base}/posts`,
//     lastModified: new Date(posts[0]?.lastModified ?? Date.now()),
//     changeFrequency: "weekly",
//     priority: 0.9,
//   },
//   // individual post pages
//   ...posts.map((post) => ({
//     url: `${base}/posts/${post.slug}`,
//     lastModified: new Date(post.lastModified ?? Date.now()),
//     changeFrequency: "monthly" as const,
//     priority: 0.7,
//   })),
// ];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPages
    // ...postPages,   // ← uncomment when posts are live
  ];
}
