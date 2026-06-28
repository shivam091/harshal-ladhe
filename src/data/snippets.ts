import type { Snippet, SnippetNavigation } from "@/interfaces/snippet";

/*
  Registry of every snippet. Each entry has a matching content file at
  app/(site)/(internal)/snippet/<slug>/page.mdx. This drives the /snippets list,
  the detail chrome, and prev/next nav.

  Note: publish / last-modified dates come from git history at build time
  (lib/snippets.ts for the list; the remark-snippet-meta plugin for the detail).
  Prev/next nav follows this array's order (declare newest-first).
*/
export const snippets: Snippet[] = [
  {
    slug: "deep-freeze-objects",
    title: "Deep Freeze Objects in JavaScript",
    excerpt: "Recursively lock every object level for true immutability",
    description: "Lock objects and their children immutably — prevent accidental mutations and enforce deep immutability in strict mode.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "Object.freeze",
      "deep-freeze",
      "immutability",
      "secure-coding",
      "strict-mode",
    ],
    image: {
      path: "/assets/img/goodies/snippets/deep-freeze-objects/cover.png",
      width: 1536,
      height: 1024,
      alt: "Promotional digital graphic showing the phrase ‘JavaScript deepFreeze()’ with code-themed visuals and design elements aligned to the left.",
    },
    changelog: [
      { date: "2026-07-12", change: "Initial publication" }
    ],
  }
];

// Look up a single snippet by its slug.
export function getSnippetBySlug(slug: string): Snippet | undefined {
  return snippets.find((snippet) => snippet.slug === slug);
}

// Previous/next neighbours by this array's order (client-safe — used by the
// snippet layout, which can't read git dates in the browser). The registry is
// oldest-first (new snippets appended to the end), so "previous" is the entry
// just before (older) and "next" is the one just after (newer).
export function getSnippetNavigation(slug: string): SnippetNavigation {
  const index = snippets.findIndex((snippet) => snippet.slug === slug);
  if (index === -1) return { previous: null, next: null };

  const previous = index > 0 ? snippets[index - 1] : null;
  const next = index < snippets.length - 1 ? snippets[index + 1] : null;

  return {
    previous: previous ? { slug: previous.slug, title: previous.title } : null,
    next: next ? { slug: next.slug, title: next.title } : null,
  };
}
