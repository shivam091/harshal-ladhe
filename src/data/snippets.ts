import { createContentLookup, type ContentEntry } from "@/data/content";

// Snippet registry entries share their shape with tutorials — see @/data/content.
export type Snippet = ContentEntry;

/*
  Registry of every snippet. Each entry has a matching content file at
  app/(site)/(internal)/snippet/<slug>/page.mdx. This drives the /snippets list,
  the detail chrome, and prev/next nav.

  Note: publish / last-modified dates come from git history at build time
  (lib/snippets.ts for the list; the remark-content-metadata plugin for the detail).
  Prev/next nav follows this array's order (declare newest-first).
*/
export const snippets: Snippet[] = [
];

/*
  getSnippetBySlug looks up a single snippet by its slug. getSnippetNavigation
  returns its previous/next neighbours by this array's order (client-safe —
  used by the snippet layout, which can't read git dates in the browser). The
  registry is oldest-first (new snippets appended to the end), so "previous"
  is the entry just before (older) and "next" is the one just after (newer).
*/
export const { getBySlug: getSnippetBySlug, getNavigation: getSnippetNavigation } = createContentLookup(snippets);
