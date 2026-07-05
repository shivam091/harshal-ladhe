// SEO/display metadata for a single tag archive page, keyed by tag slug in data/tags.ts.
export interface TagMeta {
  // Descriptive <h1> and <title> for the /tag/<slug> archive.
  title: string;
  // Meta description shown in <head> and as the archive's intro paragraph.
  description: string;
}

// Props for the /tag/[slug] page and its generateMetadata — params are async per Next.js's dynamic APIs.
export interface TagPageProps {
  params: Promise<{ slug: string }>;
}
