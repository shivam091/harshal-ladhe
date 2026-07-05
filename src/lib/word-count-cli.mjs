import { readFileSync } from "node:fs";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";

/*
  A separate process because remark-mdx's dependency chain breaks next-with-linaria's babel
  transform when bundled into a Server Component. countWords is duplicated rather than imported
  because a relative import here fails to resolve at runtime, silently zeroing every word count.
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
