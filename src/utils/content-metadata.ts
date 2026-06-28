import type { Metadata } from "next";
import { buildContentMetadata } from "@/utils/build-content-metadata";
import type { ContentImage } from "@/data/content";

// Minimal shape createContentMetadataBuilder needs from a registry entry.
interface MetadataSource {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  image: ContentImage;
}

/*
  Builds a build<Type>Metadata(slug) function for a content type whose
  registry entry has the fields buildContentMetadata needs — shared by
  snippets and tutorials (see @/data/content), given their own getBySlug +
  getDates lookups and route segment.
*/
export function createContentMetadataBuilder<T extends MetadataSource>(
  routeSegment: string,
  getBySlug: (slug: string) => T | undefined,
  getDates: (slug: string) => { publishedAt: string | null; lastModifiedAt: string | null }
) {
  return function buildMetadata(slug: string): Metadata {
    const entry = getBySlug(slug);
    if (!entry) return {};

    const { publishedAt, lastModifiedAt } = getDates(slug);

    return buildContentMetadata({
      title: entry.title,
      description: entry.description,
      url: `/${routeSegment}/${entry.slug}`,
      tags: entry.tags,
      image: entry.image,
      publishedAt,
      lastModifiedAt
    });
  };
}
