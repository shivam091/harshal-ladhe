import { gitLastModified, gitPublishedAt } from "./git-dates.mjs";
import { estimateReadingTime } from "./remark-word-count.ts";

/*
  Injects the meta row at build time so page.mdx files stay pure prose, with git
  dates and read time computed without an extra script or generated JSON.
*/

// Captures the slug rather than the category segment so the meta row can resolve the post's series.
const POST_FILE = /[\\/]post[\\/][^\\/]+[\\/]([^\\/]+)[\\/]page\.mdx$/;

// Skips any file outside post detail pages so other MDX pages compile untouched.
export default function remarkPostMeta() {
  return (tree, vfile) => {
    const filePath = vfile.path ?? vfile.history?.at(0);
    const match = filePath && POST_FILE.exec(filePath);
    if (!match) return;

    const slug = match[1];
    const { words, readingMinutes } = estimateReadingTime(tree);
    const publishedAt = gitPublishedAt(filePath);
    const lastModifiedAt = gitLastModified(filePath);

    // MDX attributes must be strings here, so numbers are coerced back on the receiving end.
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
