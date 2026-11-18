// Generated at build time so the static export ships an Atom feed without an extra package.

import { getSortedPosts, type DatedPost } from "@/lib/posts";
import { siteConfig } from "@/config/site";
import { escapeXml, truncate } from "@/utils/string";
import { getPostUrl } from "@/utils/post-url";
import { getSortedGoodies, type DatedGoodie } from "@/lib/goodies";

// Required for `output: "export"` — tells Next.js this route is fully static.
export const dynamic = "force-static";

// Normalise: strip any trailing slash so URL concatenation is consistent.
const base = siteConfig.url.replace(/\/$/, "");

// Feed readers need absolute URLs, since they fetch entries outside the site.
function absoluteUrl(path: string): string {
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

// One shape for every content type, so posts and goodies render through the same entry template.
interface FeedEntry {
  title: string;
  url: string;
  published: string;
  updated: string;
  description: string;
  image?: { path: string; width: number; height: number };
  tags: string[];
  categories: string[];
}

// Posts keep the exact fields the old Jekyll feed carried, so existing subscribers see no change.
function postToEntry(post: DatedPost): FeedEntry {
  return {
    title: post.title,
    url: absoluteUrl(getPostUrl(post)),
    published: post.publishedAt ?? post.lastModifiedAt ?? "",
    updated: post.lastModifiedAt ?? post.publishedAt ?? "",
    description: post.description || post.excerpt || "",
    image: post.image,
    tags: post.tags,
    categories: post.category
  };
}

// Goodies are tools rather than articles, so they carry no tags and share a single "Goodies" category.
function goodieToEntry(goodie: DatedGoodie): FeedEntry {
  return {
    title: goodie.name,
    url: absoluteUrl(goodie.href),
    published: goodie.publishedAt ?? goodie.lastModifiedAt ?? "",
    updated: goodie.lastModifiedAt ?? goodie.publishedAt ?? "",
    description: goodie.description,
    tags: [],
    categories: ["Goodies"]
  };
}

// Same markup as before the feed carried goodies, so only the data source changed.
function renderEntry(entry: FeedEntry): string {
  const thumbnail = entry.image
    ? `    <media:thumbnail url="${escapeXml(absoluteUrl(entry.image.path))}" width="${entry.image.width}" height="${entry.image.height}" />\n`
    : "";

  const categories = [
    ...entry.tags.map(
      (tag) => `    <category term="${escapeXml(tag)}" scheme="urn:taxonomy:tag" />`
    ),
    ...entry.categories.map(
      (category) => `    <category term="${escapeXml(category)}" scheme="urn:taxonomy:category" />`
    )
  ].join("\n");

  const summary = truncate(entry.description, 160);

  return `  <entry xml:lang="${siteConfig.lang}">
    <title>${escapeXml(entry.title)}</title>
    <link rel="alternate" type="text/html" href="${escapeXml(entry.url)}" />
    <id>${escapeXml(entry.url)}</id>

    <published>${entry.published}</published>
    <updated>${entry.updated}</updated>

${thumbnail}    <summary type="html">${escapeXml(summary)}</summary>
    <content type="html">${escapeXml(entry.description)}</content>

${categories}
  </entry>`;
}

export function GET(): Response {
  // Newest-first across both kinds, so a fresh goodie lands at the top of the feed rather than after every post.
  const entries = [...getSortedPosts().map(postToEntry), ...getSortedGoodies().map(goodieToEntry)].sort((a, b) =>
    a.published < b.published ? 1 : a.published > b.published ? -1 : 0
  );

  // Tracks the most recent change to any entry so feed readers can tell when anything changed.
  const feedUpdated = entries.map((entry) => entry.updated).filter(Boolean).sort().at(-1) ?? new Date().toISOString();

  const year = new Date().getFullYear();

  const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xml:lang="${siteConfig.lang}">
  <generator uri="https://nextjs.org" version="15">Next.js</generator>
  <title>${escapeXml(siteConfig.name)}</title>
  <subtitle>${escapeXml(siteConfig.description)}</subtitle>
  <id>${base}/</id>
  <icon>${absoluteUrl("/assets/img/icons/favicon.png")}</icon>
  <updated>${feedUpdated}</updated>
  <rights>© ${year} ${escapeXml(siteConfig.name)}</rights>

  <link rel="alternate" type="text/html" href="${base}" />
  <link rel="self" type="application/atom+xml" href="${absoluteUrl("/atom.xml")}" />

  <author>
    <name>${escapeXml(siteConfig.author.name)}</name>
    <email>${escapeXml(siteConfig.author.email)}</email>
    <uri>${escapeXml(siteConfig.author.url)}</uri>
  </author>

${entries.map(renderEntry).join("\n\n")}
</feed>
`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8"
    }
  });
}
