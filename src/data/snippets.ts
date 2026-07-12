import { createContentLookup, type ContentEntry } from "@/data/content";

// Aliased so snippet code reads in its own terms while sharing the common content shape.
export type Snippet = ContentEntry;

/*
  Each entry needs a matching app/(site)/(internal)/(snippet)/snippet/<slug>/page.mdx.
  Dates are deliberately absent — they come from git history at build time.
  Keep it oldest-first (append new snippets), since prev/next nav follows array order.
*/
export const snippets: Snippet[] = [
  {
    slug: "deep-freeze-objects",
    title: "Deep Freeze Objects in JavaScript",
    excerpt: "Recursively lock every object level for true immutability",
    description: "Lock objects and their children immutably — prevent accidental mutations and enforce deep immutability in strict mode.",
    category: ["JavaScript"],
    tags: ["javascript", "Object.freeze", "deep-freeze", "immutability", "secure-coding", "strict-mode"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/deep-freeze-objects/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Promotional digital graphic showing the phrase ‘JavaScript deepFreeze()’ with code-themed visuals and design elements aligned to the left."
    },
    changelog: [
      { date: "2026-07-12", change: "Initial publication" }
    ]
  },
  {
    slug: "encapsulation-closure",
    title: "Encapsulation with Closures",
    excerpt: "Encapsulate private variables using JavaScript closure patterns.",
    description: "Master the functional approach to data encapsulation in JavaScript by leveraging lexical scoping to create immutable private variables.",
    category: ["JavaScript"],
    tags: ["javascript", "closures", "encapsulation", "design-patterns", "functional-programming", "private-state", "clean-code", "factory-pattern"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/encapsulation-closure/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover image illustrating private state encapsulation in JavaScript using closures, symbolized by a shield protecting internal variables."
    },
    changelog: [
      { date: "2026-07-12", change: "Initial publication." }
    ]
  },
  {
    slug: "encapsulation-private-class-fields",
    title: "Encapsulation with Private Class Fields",
    excerpt: "Use native #private syntax to protect class properties in JavaScript.",
    description: "Implement native engine-level privacy in your OOP structures using ES2022+ private class fields and memory-efficient prototype methods.",
    category: ["JavaScript"],
    tags: ["javascript", "oop", "encapsulation", "classes", "clean-code"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/encapsulation-private-class-fields/cover.png",
      width: 1536,
      height: 1024,
      type: "image/webp",
      alt: "Representation of a JavaScript Class with a locked vault icon for private fields."
    },
    changelog: [
      { date: "2026-07-12", change: "Initial publication." }
    ]
  }
];

// Array-order based rather than git-dated so the lookups stay client-safe — git can't be read in the browser.
export const { getBySlug: getSnippetBySlug, getNavigation: getSnippetNavigation } = createContentLookup(snippets);
