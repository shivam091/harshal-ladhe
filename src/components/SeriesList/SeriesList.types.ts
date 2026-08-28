import type { DatedSeries } from "@/lib/series";

// Props for the /series index feed.
export interface SeriesListProps {
  // Series to render as cards, in the order given (typically curated order).
  series: DatedSeries[];
}
