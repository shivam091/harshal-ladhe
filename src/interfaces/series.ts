import type { ChangelogEntry } from "@/interfaces/changelog";

// Props for the series indicator badge.
export interface SeriesBadgeProps {
  // The series this post belongs to, including its title and this post's position.
  series: PostSeriesInfo;
  // When true (default), the badge links to the series page; otherwise it's static.
  link?: boolean;
}

// Social share / OG cover image for a series. Width/height are optional because
// series covers are only used for share previews, not rendered in the page body.
export interface SeriesImage {
  path: string;
  width?: number;
  height?: number;
  type?: string;
  alt: string;
}

// Registry record describing one series — drives the /series list, the detail
// page chrome, series-to-series nav, and the per-post series badge / in-series nav.
// The `parts` array (ordered post slugs) is the single source of truth for which
// posts belong to the series and in what order.
export interface Series {
  // URL slug / id; also the content file name at src/content/series/<slug>.mdx.
  slug: string;
  title: string;
  // Sort key for the /series list and series-to-series navigation (ascending).
  order: number;
  // Short lead shown in the series header and list cards.
  excerpt?: string;
  // Longer SEO description shown in list cards and OG metadata.
  description: string;
  // Social share / OG cover image.
  image?: SeriesImage;
  // Ordered list of post slugs that make up the series (Part 1, Part 2, …).
  parts: string[];
  // Per-series closing message; overrides the built-in PageSignOff default.
  // Set to `false` to suppress the closing text — renders a bare divider instead.
  signoff?: string | false;
  changelog?: ChangelogEntry[];
}

// Minimal shape used for series-to-series navigation links.
export interface SeriesNavLink {
  slug: string;
  title: string;
}

// Previous / next neighbouring series, ordered by `order` then title.
export interface SeriesNavigation {
  previous: SeriesNavLink | null;
  next: SeriesNavLink | null;
}

// A neighbouring post within a series, carrying its 1-based part number.
export interface SeriesPostLink {
  slug: string;
  title: string;
  // 1-based position of this post within the series (e.g. Part 2).
  index: number;
}

// A post's place within its series — powers the on-post series badge and the
// in-series previous/next navigation. Null when a post belongs to no series.
export interface PostSeriesInfo {
  // The owning series' slug, title, and canonical URL.
  slug: string;
  title: string;
  url: string;
  // This post's 1-based part number and the total number of parts.
  index: number;
  total: number;
  // Previous / next parts in the series (null at the ends).
  previousPost: SeriesPostLink | null;
  nextPost: SeriesPostLink | null;
}
