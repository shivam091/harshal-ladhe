/*
  Server-only: reads git history, so it can't ship to the client. The detail page itself is
  driven by the client-safe registry.
*/
import { join } from "node:path";
import {
  createDatedLookup,
  createSortedContentLookup,
  type ContentDates,
  type DatedContent
} from "@/lib/content-dates";
import { series, getSortedSeries, type Series } from "@/data/series";

// Directory holding one sub-folder per series slug, each with a page.mdx intro.
const SERIES_DIR = join(
  process.cwd(), "src", "app", "(site)", "(internal)", "(series)", "series"
);

// The intro file stands in for the series when reading git dates.
function seriesFilePath(slug: string): string {
  return join(SERIES_DIR, slug, "page.mdx");
}

// ISO date strings sourced from git history; null when the file has never been committed.
export type SeriesDates = ContentDates;

// Memoised because list pages and metadata ask for the same slug's dates repeatedly.
export const getSeriesDates = createDatedLookup(seriesFilePath);

// Lets list views sort and display by date without a second lookup per entry.
export type DatedSeries = DatedContent<Series>;

// Newest-first by git publish date so the list leads with what's fresh; navigation keeps the curated order.
export const getSortedSeriesWithDates = createSortedContentLookup(series, getSeriesDates);

// Keyed by slug so the dates can be handed to client code, which can't read git itself.
export function getSeriesDatesBySlug(): Record<string, SeriesDates> {
  return Object.fromEntries(getSortedSeries().map((item) => [item.slug, getSeriesDates(item.slug)]));
}
