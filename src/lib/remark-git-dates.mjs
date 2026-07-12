import { gitLastModified, gitPublishedAt } from "./git-dates.mjs";

// Fills <PublishedAt /> and <LastModifiedAt /> from git at build time so authors never hand-maintain dates; files with no history render nothing.
export default function remarkGitDates() {
  return (tree, vfile) => {
    const filePath = vfile.path ?? vfile.history?.at(0);
    if (!filePath) return;

    let lastModified = null;
    let publishedAt  = null;
    let fetched      = false;

    function walk(node) {
      const isJsx =
        node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";

      if (isJsx && (node.name === "LastModifiedAt" || node.name === "PublishedAt")) {
        if (!fetched) {
          lastModified = gitLastModified(filePath);
          publishedAt  = gitPublishedAt(filePath);
          fetched      = true;
        }

        if (node.name === "LastModifiedAt" && lastModified && !node.attributes?.some((a) => a.name === "lastModifiedAt")) {
          node.attributes = [
            ...(node.attributes ?? []),
            { type: "mdxJsxAttribute", name: "lastModifiedAt", value: lastModified }
          ];
        }

        if (node.name === "PublishedAt" && publishedAt && !node.attributes?.some((a) => a.name === "publishedAt")) {
          node.attributes = [
            ...(node.attributes ?? []),
            { type: "mdxJsxAttribute", name: "publishedAt", value: publishedAt }
          ];
        }
      }

      node.children?.forEach(walk);
    }

    walk(tree);
  };
}
