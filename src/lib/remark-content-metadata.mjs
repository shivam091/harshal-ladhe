import { gitLastModified, gitPublishedAt } from "./git-dates.mjs";
import { estimateReadingTime } from "./remark-word-count.ts";

/*
  Injects the meta row at build time so page.mdx files stay pure prose, with git
  dates and read time computed without an extra script or generated JSON.
*/

// Opt-in list of content types, with the label the meta row's aria-label needs.
const CONTENT_TYPES = {
  snippet: "Snippet",
  tutorial: "Tutorial",
};

// Derived from CONTENT_TYPES so adding a type there is all it takes to enable it.
const CONTENT_FILE = new RegExp(`[\\\\/](${Object.keys(CONTENT_TYPES).join("|")})[\\\\/][^\\\\/]+[\\\\/]page\\.mdx$`);

// Skips any file outside CONTENT_TYPES so other MDX pages compile untouched.
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

    // MDX attributes must be strings here, so numbers are coerced back on the receiving end.
    const attributes = [
      { type: "mdxJsxAttribute", name: "contentType", value: contentType },
      { type: "mdxJsxAttribute", name: "readingMinutes", value: String(readingMinutes) },
      { type: "mdxJsxAttribute", name: "words", value: String(words) },
    ];
    /*
      Omitted rather than empty when git has no date (uncommitted file), so the meta
      row can simply skip that field.
    */
    if (publishedAt) {
      attributes.push({ type: "mdxJsxAttribute", name: "publishedAt", value: publishedAt });
    }
    if (lastModifiedAt) {
      attributes.push({ type: "mdxJsxAttribute", name: "lastModifiedAt", value: lastModifiedAt });
    }

    tree.children.unshift({
      type: "mdxJsxFlowElement",
      name: "ContentMeta",
      attributes,
      children: [],
    });
  };
}
