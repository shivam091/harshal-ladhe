/*
  Atom feed — generated at build time by Next.js.

  App-Router route handler served at `/atom.xml`. This is the Next.js
  equivalent of a Jekyll `atom.xml` template: the site/author metadata comes
  from `siteConfig`, and each entry is a post from the registry merged with its
  git-derived publish / last-modified dates (via `getSortedPosts`).

  With `output: "export"`, route handlers must be fully static — hence the
  `force-static` below. The result is written to `out/atom.xml` after `next build`.
*/

import { getSortedPosts, type DatedPost } from "@/lib/posts";
import { siteConfig } from "@/config/site";
import { escapeXml, truncate } from "@/utils/string";
import { getPostUrl } from "@/utils/post-url";

// Required for `output: "export"` — tells Next.js this route is fully static.
export const dynamic = "force-static";

// Normalise: strip any trailing slash so URL concatenation is consistent.
const base = siteConfig.url.replace(/\/$/, "");

// Prefix a site-relative path with the canonical origin.
function absoluteUrl(path: string): string {
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

// Render one <entry> for a post, mirroring the Jekyll template's fields.
function renderEntry(post: DatedPost): string {
  const url = absoluteUrl(getPostUrl(post));
  const published = post.publishedAt ?? post.lastModifiedAt ?? "";
  const updated = post.lastModifiedAt ?? post.publishedAt ?? "";

  const thumbnail = post.image
    ? `    <media:thumbnail url="${escapeXml(absoluteUrl(post.image.path))}" width="${post.image.width}" height="${post.image.height}" />\n`
    : "";

  const categories = [
    ...post.tags.map(
      (tag) => `    <category term="${escapeXml(tag)}" scheme="urn:taxonomy:tag" />`
    ),
    ...post.category.map(
      (category) => `    <category term="${escapeXml(category)}" scheme="urn:taxonomy:category" />`
    )
  ].join("\n");

  const summary = truncate(post.description || post.excerpt || "", 160);
  const content = post.description || post.excerpt || "";

  return `  <entry xml:lang="${siteConfig.lang}">
    <title>${escapeXml(post.title)}</title>
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
  const posts = getSortedPosts();

  // Feed-level <updated> = the most recently modified post, else now.
  const feedUpdated =
    posts.find((post) => post.lastModifiedAt)?.lastModifiedAt ??
    posts[0]?.publishedAt ??
    new Date().toISOString();

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

${posts.map(renderEntry).join("\n\n")}
</feed>
`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8"
    }
  });
}
