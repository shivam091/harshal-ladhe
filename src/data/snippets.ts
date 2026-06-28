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
];
