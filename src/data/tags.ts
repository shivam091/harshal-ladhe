// SEO/display metadata for a single tag archive page, keyed by tag slug in data/tags.ts.
export interface TagMeta {
  // Descriptive <h1> and <title> for the /tag/<slug> archive.
  title: string;
  // Meta description shown in <head> and as the archive's intro paragraph.
  description: string;
}

/*
  Per-tag SEO/display metadata, keyed by tag slug (the slugified form of the
  tags declared on each post in data/posts.ts). Drives the <h1>, <title>, and
  meta description of each /tag/<slug> archive.

  Slugs not listed here still generate an archive page — lib/tags.ts falls back
  to a "#<tag>" heading and a generated description. Entries may exist ahead of
  the posts that use them; only tags actually present on a post get a page.
*/
export const tagMeta: Record<string, TagMeta> = {
};
