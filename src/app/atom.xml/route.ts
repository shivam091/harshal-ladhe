// Generated at build time so the static export ships an Atom feed without an extra package.

import { getSortedPosts } from "@/lib/posts";
import { getSortedTutorials } from "@/lib/tutorials";
import { getSortedSnippets } from "@/lib/snippets";
import { getSortedSeriesWithDates } from "@/lib/series";
import { compareByDateDesc, type ContentDates } from "@/lib/content-dates";
import type { ArchiveItemType } from "@/utils/archive-items";
import { siteConfig } from "@/config/site";
import { escapeXml, truncate } from "@/utils/string";
import { getPostUrl } from "@/utils/post-url";
import { stripInlineMarkdown } from "@/utils/markdown";
import { getAbsoluteUrl } from "@/utils/page-url";

// Required for `output: "export"` — tells Next.js this route is fully static.
export const dynamic = "force-static";

// Normalise: strip any trailing slash so URL concatenation is consistent.
const base = siteConfig.url.replace(/\/$/, "");

// Series aren't archive rows, so the feed widens the archive's type with its own.
type FeedItemType = ArchiveItemType | "series";

// Posts, tutorials, snippets, and series differ in shape, so each is flattened to just what an entry renders.
type FeedItem = ContentDates & {
  type: FeedItemType;
  title: string;
  pathname: string;
  description: string;
  excerpt?: string;
  category?: string[];
  tags?: string[];
  image?: { path: string; width: number; height: number };
};

// One newest-first stream so subscribers hear about every kind of content, including new series, not just posts.
function getFeedItems(): FeedItem[] {
  return [
    ...getSortedPosts().map((post) => ({ ...post, type: "post" as const, pathname: getPostUrl(post) })),
    ...getSortedTutorials().map((tutorial) => ({ ...tutorial, type: "tutorial" as const, pathname: `/tutorial/${tutorial.slug}` })),
    ...getSortedSnippets().map((snippet) => ({ ...snippet, type: "snippet" as const, pathname: `/snippet/${snippet.slug}` })),
    ...getSortedSeriesWithDates().map((item) => ({ ...item, type: "series" as const, pathname: `/series/${item.slug}` }))
  ].sort(compareByDateDesc());
}

// Same fields as the old Jekyll feed so existing subscribers see no change, plus a type category to filter on.
function renderEntry(item: FeedItem): string {
  const url = getAbsoluteUrl(item.pathname);
  const published = item.publishedAt ?? item.lastModifiedAt ?? "";
  const updated = item.lastModifiedAt ?? item.publishedAt ?? "";

  const thumbnail = item.image
    ? `    <media:thumbnail url="${escapeXml(getAbsoluteUrl(item.image.path))}" width="${item.image.width}" height="${item.image.height}" />\n`
    : "";

  const categories = [
    `    <category term="${item.type}" scheme="urn:taxonomy:type" />`,
    ...(item.tags ?? []).map(
      (tag) => `    <category term="${escapeXml(tag)}" scheme="urn:taxonomy:tag" />`
    ),
    ...(item.category ?? []).map(
      (category) => `    <category term="${escapeXml(category)}" scheme="urn:taxonomy:category" />`
    )
  ].join("\n");

  const summary = truncate(item.description || item.excerpt || "", 160);
  const content = item.description || item.excerpt || "";

  return `  <entry xml:lang="${siteConfig.lang}">
    <title>${escapeXml(stripInlineMarkdown(item.title))}</title>
    <link rel="alternate" type="text/html" href="${escapeXml(url)}" />
    <id>${escapeXml(url)}</id>

    <published>${published}</published>
    <updated>${updated}</updated>

${thumbnail}    <summary type="html">${escapeXml(summary)}</summary>
    <content type="html">${escapeXml(content)}</content>

${categories}
  </entry>`;
}

export function GET(): Response {
  const items = getFeedItems();

  // Latest change across every entry, so an edit to an older item still tells readers the feed moved.
  const feedUpdated =
    items
      .map((item) => item.lastModifiedAt ?? item.publishedAt)
      .filter((date): date is string => Boolean(date))
      .sort()
      .at(-1) ?? new Date().toISOString();

  const year = new Date().getFullYear();

  const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xml:lang="${siteConfig.lang}">
  <generator uri="https://nextjs.org" version="15">Next.js</generator>
  <title>${escapeXml(siteConfig.name)}</title>
  <subtitle>${escapeXml(siteConfig.description)}</subtitle>
  <id>${base}/</id>
  <icon>${getAbsoluteUrl("/assets/img/icons/favicon.png")}</icon>
  <updated>${feedUpdated}</updated>
  <rights>© ${year} ${escapeXml(siteConfig.name)}</rights>

  <link rel="alternate" type="text/html" href="${base}" />
  <link rel="self" type="application/atom+xml" href="${getAbsoluteUrl("/atom.xml")}" />

  <author>
    <name>${escapeXml(siteConfig.author.name)}</name>
    <email>${escapeXml(siteConfig.author.email)}</email>
    <uri>${escapeXml(siteConfig.author.url)}</uri>
  </author>

${items.map(renderEntry).join("\n\n")}
</feed>
`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8"
    }
  });
}
