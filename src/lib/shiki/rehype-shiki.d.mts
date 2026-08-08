import type { Root } from "hast";

// Rehype plugin that replaces every pre>code node with Shiki-highlighted HTML at MDX build time.
export default function rehypeShiki(): (tree: Root) => Promise<void>;
