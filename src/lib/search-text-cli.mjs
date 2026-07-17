import { readFileSync } from "node:fs";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import remarkGfm from "remark-gfm";

/*
  A separate process for the same reason as word-count-cli.mjs: remark-mdx breaks
  next-with-linaria's babel transform when bundled into a route.
*/

// Code is scanned rather than read and ESM/expressions hold demo source, so matching them would only add noise.
const SKIPPED_NODE_TYPES = new Set(["code", "mdxjsEsm", "mdxFlowExpression", "mdxTextExpression", "html", "yaml"]);

// Block-level nodes get a separator so words from adjacent paragraphs don't fuse together.
function extractText(tree) {
  const parts = [];

  function walk(node) {
    if (SKIPPED_NODE_TYPES.has(node.type)) return;
    if (node.type === "text" || node.type === "inlineCode") {
      parts.push(node.value);
      return;
    }
    node.children?.forEach(walk);
    parts.push(" ");
  }

  walk(tree);
  return parts.join("").replace(/\s+/g, " ").trim();
}

// Cut at a word boundary so the index never ends mid-word, which would spoil literal matching.
function truncateAtWord(text, maxLength) {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
}

const [maxLengthArg, ...filePaths] = process.argv.slice(2);
const maxLength = parseInt(maxLengthArg, 10);
const processor = unified().use(remarkParse).use(remarkMdx).use(remarkGfm);

const texts = filePaths.map((filePath) => {
  try {
    return truncateAtWord(extractText(processor.parse(readFileSync(filePath, "utf-8"))), maxLength);
  } catch {
    return "";
  }
});

process.stdout.write(JSON.stringify(texts));
