import { readFileSync } from "node:fs";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";

/*
  Standalone CLI, invoked via spawnSync from lib/posts.ts (see countWordsInFile).
  Parses an MDX file with the real remark/mdx parser and prints its word count
  to stdout.

  Kept as a separate process rather than imported directly into lib/posts.ts:
  remark-mdx's dependency chain isn't safe to bundle into a Next.js Server
  Component — it broke the /posts page when imported there directly (crashes
  next-with-linaria's babel transform on a transitive dependency). Running it
  out-of-process avoids that entirely, the same way git-dates.mjs shells out
  to `git` instead of linking a git library into the bundle.

  countWords is duplicated from remark-word-count.ts rather than imported: this
  file is located via `new URL("./word-count-cli.mjs", import.meta.url)`, which
  Turbopack treats as a static-asset reference and copies verbatim to a hashed
  path under .next — without resolving its relative imports. A same-project
  relative import here would 404 in dev (ERR_MODULE_NOT_FOUND), silently
  zeroing every word count and pinning read time at the 1-minute floor.
*/
function countWords(node) {
  let words = 0;

  function walk(n) {
    if (n.type === "text" || n.type === "inlineCode") {
      const value = n.value?.trim();
      if (value) words += value.split(/\s+/).length;
    }
    n.children?.forEach(walk);
  }

  walk(node);
  return words;
}

const filePath = process.argv[2];
const content = readFileSync(filePath, "utf-8");
const tree = unified().use(remarkParse).use(remarkMdx).parse(content);
process.stdout.write(String(countWords(tree)));
