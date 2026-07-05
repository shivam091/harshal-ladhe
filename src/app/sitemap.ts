// Generated at build time by Next.js so the static export ships a sitemap without an extra package.

import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { join } from "node:path";
import { snippets } from "@/data/snippets";
import { getSnippetDates } from "@/lib/snippets";
import { gitLastModified } from "@/lib/git-dates.mjs";
import { getSeriesDates } from "@/lib/series";
import { getAllTags } from "@/lib/tags";
import { getAllCategories } from "@/lib/categories";
import { tutorials } from "@/data/tutorials";
import { getTutorialDates } from "@/lib/tutorials";
import { getSortedPosts } from "@/lib/posts";
import { getPostUrl } from "@/utils/post-url";
import { getSortedSeries } from "@/data/series";

// Required for `output: "export"` — tells Next.js this route is fully static.
export const dynamic = "force-static";

// Trailing slash stripped so path concatenation never produces a double slash.
const base = siteConfig.url.replace(/\/$/, "");

// Resolved once so page entries can name their source files by app-relative path.
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
  Cover images are hosted on Vercel Blob, a different host from the pages, so listing them here
  is how Google ties each image to the page it belongs to. Spread in only when an entry has one,
  so pages without a cover never emit an empty <image:image>.
*/
function coverImages(image?: { path: string }): Pick<MetadataRoute.Sitemap[number], "images"> {
  return image ? { images: [new URL(image.path, base).href] } : {};
}

/*
  Hand-maintained — add an entry whenever a new top-level page is created, picking
  changeFrequency/priority by how often that kind of page changes so crawlers revisit
  what actually moves: home weekly/1.0, listings weekly/0.9, other monthly/0.6, legal yearly/0.3.
*/
const staticPages: MetadataRoute.Sitemap = [
  {
    url: `${base}/about`,
    lastModified: pageDate("(site)/(internal)/about/page.mdx"),
    changeFrequency: "monthly",
    priority: 0.6
  },
  {
    url: `${base}/contact`,
    lastModified: pageDate("(site)/(internal)/contact/page.tsx"),
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
  },
  {
    url: `${base}/goodies`,
    lastModified: pageDate("(site)/(internal)/goodies/page.tsx"),
    changeFrequency: "weekly",
    priority: 0.9
  },
  {
    url: `${base}/snippets`,
    lastModified: pageDate("(site)/(internal)/snippets/page.tsx"),
    changeFrequency: "weekly",
    priority: 0.9
  },
  {
    url: `${base}/tutorials`,
    lastModified: pageDate("(site)/(internal)/tutorials/page.tsx"),
    changeFrequency: "weekly",
    priority: 0.9
  },
  {
    url: `${base}/posts`,
    lastModified: pageDate("(site)/(internal)/posts/page.tsx"),
    changeFrequency: "weekly",
    priority: 0.9
  },
  {
    url: `${base}/series`,
    lastModified: pageDate("(site)/(internal)/series/page.tsx"),
    changeFrequency: "weekly",
    priority: 0.9
  },
  {
    url: `${base}/tags`,
    lastModified: pageDate("(site)/(internal)/tags/page.tsx"),
    changeFrequency: "weekly",
    priority: 0.9
  },
  {
    url: `${base}/categories`,
    lastModified: pageDate("(site)/(internal)/categories/page.tsx"),
    changeFrequency: "weekly",
    priority: 0.9
  }
];

// Git dates so lastModified tracks real snippet edits rather than the build time.
const snippetDates = snippets.map(({ slug, image }) => ({
  slug,
  image,
  lastModified: getSnippetDates(slug).lastModifiedAt
}));

// Git dates so lastModified tracks real tutorial edits rather than the build time.
const tutorialDates = tutorials.map(({ slug, image }) => ({
  slug,
  image,
  lastModified: getTutorialDates(slug).lastModifiedAt
}));

// Detail pages only, so the index isn't listed twice.
const snippetPages: MetadataRoute.Sitemap = snippetDates.map(({ slug, image, lastModified }) => ({
  url: `${base}/snippet/${slug}`,
  lastModified: lastModified ? new Date(lastModified) : new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.7,
  ...coverImages(image)
}));

// Detail pages only, so the index isn't listed twice.
const tutorialPages: MetadataRoute.Sitemap = tutorialDates.map(({ slug, image, lastModified }) => ({
  url: `${base}/tutorial/${slug}`,
  lastModified: lastModified ? new Date(lastModified) : new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.7,
  ...coverImages(image)
}));

// Detail pages only, so the index isn't listed twice.
const postPages: MetadataRoute.Sitemap = getSortedPosts().map((post) => ({
  url: `${base}${getPostUrl(post)}`,
  lastModified: post.lastModifiedAt ? new Date(post.lastModifiedAt) : new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.7,
  ...coverImages(post.image)
}));

// Detail pages only, so the index isn't listed twice.
const seriesPages: MetadataRoute.Sitemap = getSortedSeries().map(({ slug, image }) => {
  const { lastModifiedAt } = getSeriesDates(slug);
  return {
    url: `${base}/series/${slug}`,
    lastModified: lastModifiedAt ? new Date(lastModifiedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    ...coverImages(image)
  };
});

// lastModified tracks the newest post carrying the tag, so crawlers revisit archives when they change.
const tagPages: MetadataRoute.Sitemap = getAllTags().map(({ slug, lastModifiedAt }) => ({
  url: `${base}/tag/${slug}`,
  lastModified: lastModifiedAt ? new Date(lastModifiedAt) : new Date(),
  changeFrequency: "weekly" as const,
  priority: 0.7
}));

// lastModified tracks the newest post in the category, so crawlers revisit archives when they change.
const categoryPages: MetadataRoute.Sitemap = getAllCategories().map(({ slug, lastModifiedAt }) => ({
  url: `${base}/category/${slug}`,
  lastModified: lastModifiedAt ? new Date(lastModifiedAt) : new Date(),
  changeFrequency: "weekly" as const,
  priority: 0.7
}));

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPages,
    ...snippetPages,
    ...tutorialPages,
    ...postPages,
    ...seriesPages,
    ...tagPages,
    ...categoryPages
  ];
}
