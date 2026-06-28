import type { Metadata } from "next";
import { buildContentMetadata } from "@/utils/build-content-metadata";
import type { ContentMetadataImage } from "@/utils/build-content-metadata";
import type { ContentDates } from "@/lib/content-dates";

// Structural rather than ContentEntry so every registry fits, including ones with a different shape.
interface MetadataSource {
  slug: string;
  title: string;
  description: string;
  // Series have no tags — omitted entries skip `keywords` / OpenGraph `tags`.
  tags?: string[];
  image?: ContentMetadataImage;
}

// The single path from registry entry + git dates to metadata, so no content type builds its own.
export function createContentMetadataBuilder<T extends MetadataSource>(
  getUrl: (entry: T) => string,
  getBySlug: (slug: string) => T | undefined,
  getDates: (slug: string) => ContentDates
) {
  return function buildMetadata(slug: string): Metadata {
    const entry = getBySlug(slug);
    if (!entry) return {};

    const { publishedAt, lastModifiedAt } = getDates(slug);

    return buildContentMetadata({
      title: entry.title,
      description: entry.description,
      url: getUrl(entry),
      tags: entry.tags,
      image: entry.image,
      publishedAt,
      lastModifiedAt
    });
  };
}
