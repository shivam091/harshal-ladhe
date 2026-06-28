/*
  One estimator so every meta row computes read time the same way; TypeScript so it can
  read the shared wordsPerMinute setting.
*/
import { siteConfig } from "./../config/site.ts";

// Only the fields word counting touches, so it doesn't depend on full mdast types.
interface WordCountNode {
  // Node kind, e.g. "text", "inlineCode", "heading".
  type: string;
  // Raw text content, present on leaf nodes like "text" and "inlineCode".
  value?: string;
  // Nested nodes, present on container nodes (e.g. paragraphs, headings, lists).
  children?: WordCountNode[];
}

// Fenced code is excluded because it's scanned rather than read, so counting it would inflate the estimate.
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

// Clamped to at least one minute so "0 min read" never appears in the UI.
export function estimateReadingTime(tree: WordCountNode): { words: number; readingMinutes: number } {
  const words = countWords(tree);
  const readingMinutes = Math.max(1, Math.round(words / siteConfig.readTime.wordsPerMinute));
  return { words, readingMinutes };
}
