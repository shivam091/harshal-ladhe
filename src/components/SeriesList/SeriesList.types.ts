import type { DatedSeries } from "@/lib/series";

// Takes pre-dated series so the list stays a pure renderer with no data lookups.
export interface SeriesListProps {
  // Series to render as cards, in the order given (typically curated order).
  series: DatedSeries[];
}
