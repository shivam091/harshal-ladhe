import { gitLastModified, gitPublishedAt } from "./git-dates.mjs";
import { estimateReadingTime } from "./remark-word-count.ts";

/*
  Remark plugin — runs at build for each snippet's content file
  (app/(site)/(internal)/snippet/<slug>/page.mdx) and prepends a
  <SnippetMeta /> element carrying the git publish / last-modified dates and an
  estimated read time.

  This keeps the page.mdx files as pure prose (no boilerplate) while computing
  the dates + read time at build time — no extra script, no generated JSON.
  <SnippetMeta /> is resolved via mdx-components.tsx and rendered as the meta row
  at the top of the snippet body.
*/

/*
  Matches .../snippet/<slug>/page.mdx — narrows the plugin to snippet detail
  pages only, skipping the snippets list page and any other MDX files.
*/
const SNIPPET_FILE = /[\\/]snippet[\\/][^\\/]+[\\/]page\.mdx$/;

// Remark plugin factory — returns the transformer function.
export default function remarkSnippetMeta() {
  return (tree, vfile) => {
    // vfile.path is the preferred source; history[0] is the fallback for some remark runners.
    const filePath = vfile.path ?? vfile.history?.at(0);
    if (!filePath || !SNIPPET_FILE.test(filePath)) return;

    const { words, readingMinutes } = estimateReadingTime(tree);
    const publishedAt = gitPublishedAt(filePath);
    const lastModifiedAt = gitLastModified(filePath);

    // All props are serialised as strings — SnippetMeta coerces them back via Number().
    const attributes = [
      { type: "mdxJsxAttribute", name: "readingMinutes", value: String(readingMinutes) },
      { type: "mdxJsxAttribute", name: "words", value: String(words) },
    ];
    /*
      Date attributes are omitted entirely when git returns null (uncommitted file),
      so SnippetMeta can conditionally render each date field.
    */
    if (publishedAt) {
      attributes.push({ type: "mdxJsxAttribute", name: "publishedAt", value: publishedAt });
    }
    if (lastModifiedAt) {
      attributes.push({ type: "mdxJsxAttribute", name: "lastModifiedAt", value: lastModifiedAt });
    }

    // Prepend the <SnippetMeta /> JSX node so it appears before all prose content.
    tree.children.unshift({
      type: "mdxJsxFlowElement",
      name: "SnippetMeta",
      attributes,
      children: [],
    });
  };
}
