import type { Metadata } from "next";
import { getSeriesBySlug } from "@/data/series";
import { getSeriesDates } from "@/lib/series";
import { buildContentMetadata } from "@/utils/build-content-metadata";

// Builds Next.js metadata for a series page from its registry entry (see buildContentMetadata).
export function buildSeriesMetadata(slug: string): Metadata {
  const series = getSeriesBySlug(slug);
  if (!series) return {};

  const { publishedAt, lastModifiedAt } = getSeriesDates(slug);

  return buildContentMetadata({
    title: series.title,
    description: series.description,
    url: `/series/${series.slug}`,
    image: series.image,
    publishedAt,
    lastModifiedAt,
  });
}
