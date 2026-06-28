import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { stripInlineMarkdown } from "@/utils/markdown";
import { truncate } from "@/utils/string";

// Roughly where Google truncates a desktop search snippet.
const META_DESCRIPTION_MAX = 160;

// Cover image used for OpenGraph and Twitter share previews.
export interface ContentMetadataImage {
  // Relative or absolute image path — relative paths resolve via `metadataBase` (root layout).
  path: string;
  width?: number;
  height?: number;
  // Required so the share-preview image is never announced without a description.
  alt: string;
}

// Limited to fields every content type can provide, so one builder serves them all.
interface ContentMetadataInput {
  title: string;
  description: string;
  // Canonical URL for the page; also used as the OpenGraph `url`.
  url: string;
  // Series has no tags field — omit to skip `keywords` / OpenGraph `tags`.
  tags?: string[];
  // Optional because not every page has a cover image.
  image?: ContentMetadataImage;
  // Git-derived publish date, or null if the content has no publish history yet.
  publishedAt: string | null;
  // Git-derived last-modified date, or null if unavailable.
  lastModifiedAt: string | null;
}

/*
  One builder so every content page emits the same OpenGraph/Twitter share preview.
  Relative image paths are fine — `metadataBase` in the root layout makes them absolute.
*/

// Optional fields are spread in conditionally so Next.js never receives null or `undefined` keys.
export function buildContentMetadata({
  title: rawTitle,
  description: rawDescription,
  url,
  tags,
  image,
  publishedAt,
  lastModifiedAt
}: ContentMetadataInput): Metadata {
  const title = stripInlineMarkdown(rawTitle);
  // Google cuts snippets at about 160 characters, so a long description is ended at a word break rather than mid-word.
  const description = truncate(stripInlineMarkdown(rawDescription), META_DESCRIPTION_MAX);

  // Width/height are spread in only when set so unset dimensions never reach Next.js as `undefined` keys.
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
      // Next.js rejects null here, so an absent git date has to become undefined.
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
