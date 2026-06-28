import type { Metadata } from "next";
import { buildContentMetadata } from "@/utils/build-content-metadata";
import type { ContentMetadataImage } from "@/utils/build-content-metadata";
import type { ContentDates } from "@/lib/content-dates";

// Minimal shape createContentMetadataBuilder needs from a registry entry.
interface MetadataSource {
  slug: string;
  title: string;
  description: string;
  // Series have no tags — omitted entries skip `keywords` / OpenGraph `tags`.
  tags?: string[];
  image?: ContentMetadataImage;
}

/*
  Builds a build<Type>Metadata(slug) function for any content type — posts,
  snippets, tutorials, and series — given its own getBySlug + getDates lookups
  and a resolver for the entry's canonical URL. The single path from a registry
  entry + git dates to buildContentMetadata.
*/
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
