import type { ChangelogEntry } from "@/components/Changelog/Changelog.types";

// Snippet changelog entries reuse the shared changelog entry shape.
export type SnippetChangelogEntry = ChangelogEntry;

// Cover image used for social/OG/Twitter share previews (not rendered in the body).
export interface SnippetImage {
  // Public path, e.g. /assets/img/goodies/snippets/<slug>/cover.png
  path: string;
  width: number;
  height: number;
  alt: string;
}

// Registry record describing one snippet — drives the /snippets list, prev/next nav, and the detail header.
export interface Snippet {
  // URL slug; also the content file name at src/content/snippets/<slug>.mdx.
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  category: string[];
  tags: string[];
  // Social share / OG cover image.
  image: SnippetImage;
  changelog: SnippetChangelogEntry[];
}

// Minimal shape used for the previous/next navigation links.
export interface SnippetNavLink {
  slug: string;
  title: string;
}

// Previous (older) and next (newer) neighbours for a given snippet.
export interface SnippetNavigation {
  previous: SnippetNavLink | null;
  next: SnippetNavLink | null;
}

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
  },
  {
    slug: "encapsulation-closure",
    title: "Encapsulation with Closures",
    excerpt: "Encapsulate private variables using JavaScript closure patterns.",
    description:
      "Master the functional approach to data encapsulation in JavaScript by leveraging lexical scoping to create immutable private variables.",
    category: ["JavaScript"],
    tags: [
      "javascript",
      "closures",
      "encapsulation",
      "design-patterns",
      "functional-programming",
      "private-state",
      "clean-code",
      "factory-pattern",
    ],
    image: {
      path: "/assets/img/goodies/snippets/encapsulation-closure/cover.png",
      width: 1536,
      height: 1024,
      alt: "Cover image illustrating private state encapsulation in JavaScript using closures, symbolized by a shield protecting internal variables.",
    },
    changelog: [
      { date: "2026-07-12", change: "Initial publication." }
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
