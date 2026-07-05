import { getSeriesBySlug } from "@/data/series";
import { getSeriesDates } from "@/lib/series";
import { createContentMetadataBuilder } from "@/utils/content-metadata";

// Canonical URL mirrors the /series/<slug> route so share links match where the page actually lives.
export const buildSeriesMetadata = createContentMetadataBuilder(
  (series) => `/series/${series.slug}`,
  getSeriesBySlug,
  getSeriesDates
);
