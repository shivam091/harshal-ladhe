// SEO/display metadata for a single tag archive page, keyed by tag slug in data/tags.ts.
export interface TagMeta {
  // Descriptive <h1> and <title> for the /tag/<slug> archive.
  title: string;
  // Meta description shown in <head> and as the archive's intro paragraph.
  description: string;
}

/*
  Keyed by slug so casing variants share one entry. Unlisted slugs still get an archive with
  fallback copy, and entries may exist ahead of the posts, tutorials, or snippets that use them.
*/
export const tagMeta: Record<string, TagMeta> = {
};
