import { createContentLookup, type ContentEntry } from "@/data/content";

// Aliased so snippet code reads in its own terms while sharing the common content shape.
export type Snippet = ContentEntry;

/*
  Each entry needs a matching app/(site)/(internal)/(snippet)/snippet/<slug>/page.mdx.
  Dates are deliberately absent — they come from git history at build time.
  Keep it oldest-first (append new snippets), since prev/next nav follows array order.
*/
export const snippets: Snippet[] = [
];

// Array-order based rather than git-dated so the lookups stay client-safe — git can't be read in the browser.
export const { getBySlug: getSnippetBySlug, getNavigation: getSnippetNavigation } = createContentLookup(snippets);
