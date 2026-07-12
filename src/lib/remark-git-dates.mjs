import { gitLastModified, gitPublishedAt } from "./git-dates.mjs";

/*
  Remark plugin — injects git-derived date props into <LastModifiedAt /> and
  <PublishedAt /> elements found in an MDX file.

  MDX authors write:
    <PublishedAt />
    <LastModifiedAt />

  The plugin transforms them at build time to:
    <PublishedAt publishedAt="2025-01-01T…" />
    <LastModifiedAt lastModifiedAt="2026-05-28T10:00:00+05:30" />

  If the file has no git history yet the elements are left unchanged and the
  components render nothing.
*/
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
