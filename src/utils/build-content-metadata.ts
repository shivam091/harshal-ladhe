import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

// Cover image used for OpenGraph and Twitter share previews.
export interface ContentMetadataImage {
  // Relative or absolute image path — relative paths resolve via `metadataBase` (root layout).
  path: string;
  width?: number;
  height?: number;
  // Required alt text for the share-preview image.
  alt: string;
}

// Input to buildContentMetadata — the common fields post/snippet/series pages all provide.
interface ContentMetadataInput {
  title: string;
  description: string;
  // Canonical URL for the page; also used as the OpenGraph `url`.
  url: string;
  // Series has no tags field — omit to skip `keywords` / OpenGraph `tags`.
  tags?: string[];
  // Optional cover image; omitted entirely from metadata when not provided.
  image?: ContentMetadataImage;
  // Git-derived publish date, or null if the content has no publish history yet.
  publishedAt: string | null;
  // Git-derived last-modified date, or null if unavailable.
  lastModifiedAt: string | null;
}

/*
  Builds Next.js metadata — title, description, canonical
  URL, and a cover image wired into both OpenGraph (article) and Twitter
  (summary_large_image) for share previews. Article publish / modified times
  come from git history (see lib/content-dates.ts). Relative image paths
  resolve to absolute URLs via `metadataBase` (root layout).
*/

// Assembles a Next.js `Metadata` object shared by post/snippet/series pages — see file header for scope.
export function buildContentMetadata({
  title,
  description,
  url,
  tags,
  image,
  publishedAt,
  lastModifiedAt
}: ContentMetadataInput): Metadata {
  // Next.js's `images` field wants an array; build a single-entry one only when a cover image was given,
  // spreading width/height in only if present so unset dimensions don't end up as `undefined` keys.
  const images = image
    ? [
        {
          url: image.path,
          ...(image.width && { width: image.width }),
          ...(image.height && { height: image.height }),
          alt: image.alt
        }
      ]
    : [];

  return {
    title,
    description,
    // `keywords` only makes sense when the content has tags (series pages don't).
    ...(tags && { keywords: tags }),
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: siteConfig.name,
      // Next.js rejects null for these fields; ?? undefined converts null (absent git date) to omitted.
      publishedTime: publishedAt ?? undefined,
      modifiedTime: lastModifiedAt ?? undefined,
      ...(tags && { tags }),
      ...(images.length > 0 && { images })
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images.length > 0 && { images })
    }
  };
}
