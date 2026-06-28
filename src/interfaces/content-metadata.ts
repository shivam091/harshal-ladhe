// Cover image used for OpenGraph and Twitter share previews.
interface ContentMetadataImage {
  // Relative or absolute image path — relative paths resolve via `metadataBase` (root layout).
  path: string;
  width?: number;
  height?: number;
  // Required alt text for the share-preview image.
  alt: string;
}

// Input to buildContentMetadata — the common fields post/snippet/series pages all provide.
export interface ContentMetadataInput {
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
