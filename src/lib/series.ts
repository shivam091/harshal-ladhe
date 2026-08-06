/*
  Server-only series date helpers. Read git history at build time (during static
  generation) for a series' publish / last-modified dates — consumed by the
  metadata builder (utils/series-metadata) and the sitemap. The detail page and
  its in-series post list are driven by the client-safe data/series.ts registry.

  Git helpers are shared with the MDX plugins via lib/git-dates.mjs.
*/
import { join } from "node:path";
import { createDatedLookup, type ContentDates } from "@/lib/content-dates";

// Directory holding one sub-folder per series slug, each with a page.mdx intro.
const SERIES_DIR = join(
  process.cwd(), "src", "app", "(site)", "(internal)", "(series)", "series",
);

// Resolves the MDX intro path for a slug — the file git-dates reads for a series.
function seriesFilePath(slug: string): string {
  return join(SERIES_DIR, slug, "page.mdx");
}

// ISO date strings sourced from git history; null when the file has never been committed.
export type SeriesDates = ContentDates;

// Git-derived publish / last-modified dates for a series' intro MDX file.
export const getSeriesDates = createDatedLookup(seriesFilePath);
