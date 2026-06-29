import { createContentLookup, type ContentEntry } from "@/data/content";

// Tutorial registry entries share their shape with snippets — see @/data/content.
export type Tutorial = ContentEntry;

/*
  Registry of every tutorial. Each entry has a matching content file at
  app/(site)/(internal)/tutorial/<slug>/page.mdx. This drives the /tutorials list,
  the detail chrome, and prev/next nav.

  Note: publish / last-modified dates come from git history at build time
  (lib/tutorials.ts for the list; the remark-content-metadata plugin for the detail).
  Prev/next nav follows this array's order (declare newest-first).
*/
export const tutorials: Tutorial[] = [

];

/*
  getTutorialBySlug looks up a single tutorial by its slug. getTutorialNavigation
  returns its previous/next neighbours by this array's order (client-safe —
  used by the tutorial layout, which can't read git dates in the browser). The
  registry is oldest-first (new tutorials appended to the end), so "previous"
  is the entry just before (older) and "next" is the one just after (newer).
*/
export const { getBySlug: getTutorialBySlug, getNavigation: getTutorialNavigation } = createContentLookup(tutorials);
