// Generated at build time by Next.js so the static export ships a sitemap without an extra package.

import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { join } from "node:path";
import { snippets } from "@/data/snippets";
import { getSnippetDates } from "@/lib/snippets";
import { gitLastModified } from "@/lib/git-dates.mjs";
import { getSeriesDates } from "@/lib/series";
import { getAllTags } from "@/lib/tags";
import { tutorials } from "@/data/tutorials";
import { getTutorialDates } from "@/lib/tutorials";
import { getSortedPosts } from "@/lib/posts";
import { getPostUrl } from "@/utils/post-url";
import { getSortedSeries } from "@/data/series";

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
  }
];

// Git dates so lastModified tracks real snippet edits rather than the build time.
const snippetDates = snippets.map(({ slug }) => ({
  slug,
  lastModified: getSnippetDates(slug).lastModifiedAt
}));

// Resolve git last-modified dates for every tutorial at build time.
const tutorialDates = tutorials.map(({ slug }) => ({
  slug,
  lastModified: getTutorialDates(slug).lastModifiedAt
}));

// Individual snippet pages only — the /snippets index lives in staticPages above.
const snippetPages: MetadataRoute.Sitemap = snippetDates.map(({ slug, lastModified }) => ({
  url: `${base}/snippet/${slug}`,
  lastModified: lastModified ? new Date(lastModified) : new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.7
}));

/*
  Individual tutorial pages only — the /tutorials index lives in staticPages above.
*/
const tutorialPages: MetadataRoute.Sitemap = tutorialDates.map(({ slug, lastModified }) => ({
  url: `${base}/tutorial/${slug}`,
  lastModified: lastModified ? new Date(lastModified) : new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.7
}));

// Individual post pages only — the /posts index lives in staticPages above.
const postPages: MetadataRoute.Sitemap = getSortedPosts().map((post) => ({
  url: `${base}${getPostUrl(post)}`,
  lastModified: post.lastModifiedAt ? new Date(post.lastModifiedAt) : new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.7
}));

// Individual series pages only — the /series index lives in staticPages above.
const seriesPages: MetadataRoute.Sitemap = getSortedSeries().map(({ slug }) => {
  const { lastModifiedAt } = getSeriesDates(slug);
  return {
    url: `${base}/series/${slug}`,
    lastModified: lastModifiedAt ? new Date(lastModifiedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7
  };
});

/*
  One archive page per unique tag — mirrors the /tag/<slug> routes generated
  by generateStaticParams. lastModified tracks the newest post carrying the tag.
*/
const tagPages: MetadataRoute.Sitemap = getAllTags().map(({ slug, lastModifiedAt }) => ({
  url: `${base}/tag/${slug}`,
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
    ...tagPages
  ];
}
