import type { Metadata } from "next";

// Cover image used for OpenGraph/Twitter share previews — same shape as PostImage/SnippetImage.
export interface GoodieMetadataImage {
  // Relative or absolute image path — relative paths resolve via `metadataBase` (root layout).
  path: string;
  width: number;
  height: number;
  // Required alt text for the share-preview image.
  alt: string;
}

// Input to buildGoodieMetadata — the fields every goodie page provides.
interface GoodieMetadataInput {
  title: string;
  description: string;
  // Canonical URL for the page; also used as the OpenGraph `url`.
  url: string;
  // Optional cover image; omitted entirely from metadata when not provided.
  image?: GoodieMetadataImage;
}

/*
  Builds Next.js metadata for a goodie page. Deliberately separate from buildContentMetadata:
  goodies are standalone tools rather than dated articles, so this stays OpenGraph `type: "website"`
  with no publish/modified dates or tags, but shares the same optional cover-image handling.
*/
export function buildGoodieMetadata({ title, description, url, image }: GoodieMetadataInput): Metadata {
  const images = image
    ? [
        {
          url: image.path,
          width: image.width,
          height: image.height,
          alt: image.alt
        }
      ]
    : [];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      ...(images.length > 0 && { images })
    },
    twitter: {
      card: images.length > 0 ? "summary_large_image" : "summary",
      title,
      description,
      ...(images.length > 0 && { images })
    }
  };
}
