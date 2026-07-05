/*
  Shared word-count / reading-time estimation for the remark meta plugins
  (remark-post-meta.mjs, remark-snippet-meta.mjs). Both prepend a meta JSX
  element carrying an estimated read time derived from the compiled mdast tree.
  In TS so it can read the shared wordsPerMinute setting from config/site.
*/
import { siteConfig } from "./../config/site.ts";

// Minimal shape of an mdast/unist node needed to walk a parsed MDX tree for word counting.
interface WordCountNode {
  // Node kind, e.g. "text", "inlineCode", "heading".
  type: string;
  // Raw text content, present on leaf nodes like "text" and "inlineCode".
  value?: string;
  // Nested nodes, present on container nodes (e.g. paragraphs, headings, lists).
  children?: WordCountNode[];
}

/*
  Walks the mdast tree and sums words across text and inline-code nodes.
  Fenced code blocks (type "code") are intentionally excluded — they are scanned
  rather than read, so counting them would inflate the estimate.
*/
function countWords(tree: WordCountNode): number {
  let words = 0;

  function walk(node: WordCountNode) {
    if (node.type === "text" || node.type === "inlineCode") {
      const value = node.value?.trim();
      if (value) words += value.split(/\s+/).length;
    }
    node.children?.forEach(walk);
  }

  walk(tree);
  return words;
}

/*
  Word count and reading-time estimate for a compiled mdast tree.
  Reading time is clamped to a minimum of 1 so "0 min read" never appears in the UI.
*/
export function estimateReadingTime(tree: WordCountNode): { words: number; readingMinutes: number } {
  const words = countWords(tree);
  const readingMinutes = Math.max(1, Math.round(words / siteConfig.readTime.wordsPerMinute));
  return { words, readingMinutes };
}
