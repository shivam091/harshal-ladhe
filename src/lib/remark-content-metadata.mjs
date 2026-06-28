import { gitLastModified, gitPublishedAt } from "./git-dates.mjs";
import { estimateReadingTime } from "./remark-word-count.ts";

/*
  Remark plugin — runs at build for snippet and tutorial content files alike
  (.../snippet/<slug>/page.mdx, .../tutorial/<slug>/page.mdx — identically
  laid out) and prepends a <ContentMeta /> element carrying the git publish /
  last-modified dates and an estimated read time.

  This keeps page.mdx files as pure prose (no boilerplate) while computing the
  dates + read time at build time — no extra script, no generated JSON.
  <ContentMeta /> is resolved via mdx-components.tsx and rendered as the meta
  row at the top of the body. To cover another identically-shaped content
  type, add its path segment + label to CONTENT_TYPES below.
*/

// Path segment -> human-readable label, used for ContentMeta's aria-label ("<label> metadata").
const CONTENT_TYPES = {
  snippet: "Snippet",
  tutorial: "Tutorial",
};

// Matches .../<segment>/<slug>/page.mdx for any segment in CONTENT_TYPES, capturing the segment.
const CONTENT_FILE = new RegExp(`[\\\\/](${Object.keys(CONTENT_TYPES).join("|")})[\\\\/][^\\\\/]+[\\\\/]page\\.mdx$`);

// Remark plugin factory — returns the transformer function.
export default function remarkContentMetadata() {
  return (tree, vfile) => {
    // vfile.path is the preferred source; history[0] is the fallback for some remark runners.
    const filePath = vfile.path ?? vfile.history?.at(0);
    const match = filePath && CONTENT_FILE.exec(filePath);
    if (!match) return;

    const contentType = CONTENT_TYPES[match[1]];
    const { words, readingMinutes } = estimateReadingTime(tree);
    const publishedAt = gitPublishedAt(filePath);
    const lastModifiedAt = gitLastModified(filePath);

    // All props are serialised as strings — ContentMeta coerces them back via Number().
    const attributes = [
      { type: "mdxJsxAttribute", name: "contentType", value: contentType },
      { type: "mdxJsxAttribute", name: "readingMinutes", value: String(readingMinutes) },
      { type: "mdxJsxAttribute", name: "words", value: String(words) },
    ];
    /*
      Date attributes are omitted entirely when git returns null (uncommitted file),
      so ContentMeta can conditionally render each date field.
    */
    if (publishedAt) {
      attributes.push({ type: "mdxJsxAttribute", name: "publishedAt", value: publishedAt });
    }
    if (lastModifiedAt) {
      attributes.push({ type: "mdxJsxAttribute", name: "lastModifiedAt", value: lastModifiedAt });
    }

    // Prepend the <ContentMeta /> JSX node so it appears before all prose content.
    tree.children.unshift({
      type: "mdxJsxFlowElement",
      name: "ContentMeta",
      attributes,
      children: [],
    });
  };
}
