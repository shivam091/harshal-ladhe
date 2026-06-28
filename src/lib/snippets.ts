/*
  Server-only snippet date helpers. Read git history at build time (during static
  generation) for the snippets list and OG metadata. The detail page gets its
  dates via the remark-snippet-meta plugin instead; this covers the server
  contexts (list page, generateMetadata) that aren't part of MDX compilation.

  Git helpers are shared with the MDX plugins via lib/git-dates.mjs.
*/
import { join } from "node:path";
import { createDatedLookup, type ContentDates } from "@/lib/content-dates";
import { snippets } from "@/data/snippets";
import type { Snippet } from "@/interfaces/snippet";

// Absolute path to the directory that contains one sub-folder per snippet slug.
const SNIPPET_DIR = join(process.cwd(), "src", "app", "(site)", "(internal)", "(snippet)", "snippet");

// Resolves the MDX entry-point path for a given slug — the file git-dates reads.
function snippetFilePath(slug: string): string {
  return join(SNIPPET_DIR, slug, "page.mdx");
}

// ISO date strings sourced from git history; null when the file has never been committed.
export type SnippetDates = ContentDates;

/*
  Returns the git-derived publish and last-modified dates for a snippet slug,
  reading from cache on subsequent calls to avoid redundant git invocations.
*/
export const getSnippetDates = createDatedLookup(snippetFilePath);

/*
  Snippet registry entry merged with its git-derived dates — used by the list page
  and any consumer that needs both content metadata and publication timestamps.
*/
export interface DatedSnippet extends Snippet, SnippetDates {}

/*
  Returns all snippets newest-first by git publish date.
  Undated (uncommitted) entries sort last; ties between equal dates break
  alphabetically by title for a stable, deterministic order.
*/
export function getSortedSnippets(): DatedSnippet[] {
  return snippets
    .map((snippet) => ({ ...snippet, ...getSnippetDates(snippet.slug) }))
    .sort((a, b) => {
      if (!a.publishedAt && !b.publishedAt) return a.title.localeCompare(b.title);
      if (!a.publishedAt) return 1;
      if (!b.publishedAt) return -1;
      if (a.publishedAt === b.publishedAt) return a.title.localeCompare(b.title);
      return a.publishedAt < b.publishedAt ? 1 : -1;
    });
}
