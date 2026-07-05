import { gitLastModified, gitPublishedAt } from "./git-dates.mjs";
import { estimateReadingTime } from "./remark-word-count.ts";

/*
  Remark plugin — runs at build for each post's content file
  (app/(site)/(internal)/(post)/post/<category>/<slug>/page.mdx) and prepends
  a <PostMeta /> element carrying the git publish / last-modified dates and an
  estimated read time.

  This keeps the page.mdx files as pure prose (no boilerplate) while computing
  the dates + read time at build time — no extra script, no generated JSON.
  <PostMeta /> is resolved via mdx-components.tsx and rendered as the meta row
  at the top of the post body.
*/

/*
  Matches .../post/<category>/<slug>/page.mdx — narrows the plugin to post
  detail pages only, and captures the slug (not the category segment) so
  PostMeta can resolve the post's series.
*/
const POST_FILE = /[\\/]post[\\/][^\\/]+[\\/]([^\\/]+)[\\/]page\.mdx$/;

// Remark plugin factory — returns the transformer function.
export default function remarkPostMeta() {
  return (tree, vfile) => {
    const filePath = vfile.path ?? vfile.history?.at(0);
    const match = filePath && POST_FILE.exec(filePath);
    if (!match) return;

    const slug = match[1];
    const { words, readingMinutes } = estimateReadingTime(tree);
    const publishedAt = gitPublishedAt(filePath);
    const lastModifiedAt = gitLastModified(filePath);

    // All props are serialised as strings — PostMeta coerces them back via Number().
    // `slug` lets PostMeta resolve the post's series for the primary-meta badge.
    const attributes = [
      { type: "mdxJsxAttribute", name: "slug", value: slug },
      { type: "mdxJsxAttribute", name: "readingMinutes", value: String(readingMinutes) },
      { type: "mdxJsxAttribute", name: "words", value: String(words) },
    ];

    if (publishedAt) {
      attributes.push({ type: "mdxJsxAttribute", name: "publishedAt", value: publishedAt });
    }
    if (lastModifiedAt) {
      attributes.push({ type: "mdxJsxAttribute", name: "lastModifiedAt", value: lastModifiedAt });
    }

    // Prepend the <PostMeta /> JSX node so it appears before all prose content.
    tree.children.unshift({
      type: "mdxJsxFlowElement",
      name: "PostMeta",
      attributes,
      children: [],
    });
  };
}
