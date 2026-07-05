import { getSeriesBySlug } from "@/data/series";
import { getSeriesDates } from "@/lib/series";
import { createContentMetadataBuilder } from "@/utils/content-metadata";

// Builds Next.js metadata for a series page from its registry entry (see createContentMetadataBuilder/buildContentMetadata).
export const buildSeriesMetadata = createContentMetadataBuilder(
  (series) => `/series/${series.slug}`,
  getSeriesBySlug,
  getSeriesDates
);
