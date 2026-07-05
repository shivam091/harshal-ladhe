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


// Props for the home page's TrendingTags block.
export interface TrendingTagsProps {
  tags: TrendingTag[];
}

/*
  One trending tag: display name, slug, raw post count within the ranking
  window, and the (optionally normalized) recency-weighted score used to rank.
*/
export interface TrendingTag {
  tag: string;
  slug: string;
  count: number;
  score: number;
}

/*
  One aggregated tag: its display name, URL slug, post count, and the newest
  last-modified date across its posts (used for the sitemap `lastmod`).
*/
export interface TagSummary {
  tag: string;
  slug: string;
  count: number;
  lastModifiedAt: string | null;
}
