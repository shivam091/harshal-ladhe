import type { Metadata } from "next";
import { buildContentMetadata } from "@/utils/build-content-metadata";
import type { ContentMetadataImage } from "@/utils/build-content-metadata";
import type { ContentDates } from "@/lib/content-dates";
import { OG_IMAGE_SIZE } from "@/constants/og-image";

// Structural rather than ContentEntry so every registry fits, including ones with a different shape.
interface MetadataSource {
  slug: string;
  title: string;
  description: string;
  // Series have no tags — omitted entries skip `keywords` / OpenGraph `tags`.
  tags?: string[];
  image?: ContentMetadataImage;
}

/*
  Every content URL starts with its type segment (/post, /snippet, …), which is how
  app/og/[type]/[slug] keys its sources, so the card's address follows from the page URL.
*/
function generatedImage(url: string, entry: MetadataSource): ContentMetadataImage {
  const type = url.split("/")[1];
  return {
    path: `/og/${type}/${entry.slug}`,
    ...OG_IMAGE_SIZE,
    alt: `Share card for “${entry.title}”`
  };
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
    const url = getUrl(entry);

    return buildContentMetadata({
      title: entry.title,
      description: entry.description,
      url,
      tags: entry.tags,
      image: entry.image ?? generatedImage(url, entry),
      publishedAt,
      lastModifiedAt
    });
  };
}
