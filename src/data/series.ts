import type { ChangelogEntry } from "@/components/Changelog/Changelog.types";
import type { Post } from "@/data/posts";
import { getPostBySlug } from "@/data/posts";

/*
  Social share / OG cover image for a series. Width/height are optional because
  series covers are only used for share previews, not rendered in the page body.
*/
export interface SeriesImage {
  path: string;
  width?: number;
  height?: number;
  type?: string;
  alt: string;
}

/*
  Single source of truth for a series, so list cards, navigation, and per-post badges can't
  drift apart; `parts` alone decides membership and order.
*/
export interface Series {
  // URL slug / id; also the content file name at src/content/series/<slug>.mdx.
  slug: string;
  title: string;
  // Sort key for series-to-series navigation (ascending); the /series list sorts by publish date instead.
  order: number;
  // Short lead shown in the series header and list cards.
  excerpt?: string;
  // Longer SEO description shown in list cards and OG metadata.
  description: string;
  // Social share / OG cover image.
  image?: SeriesImage;
  // Ordered list of post slugs that make up the series (Part 1, Part 2, …).
  parts: string[];
  /*
    Per-series closing message; overrides the built-in PageSignOff default.
    Set to `false` to suppress the closing text — renders a bare divider instead.
  */
  signoff?: string | false;
  changelog?: ChangelogEntry[];
}

// Trimmed to what a nav link shows so neighbours don't carry whole entries around.
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
  category: string[];
  // 1-based position of this post within the series (e.g. Part 2).
  index: number;
}

// Null when a post belongs to no series, so callers can skip series UI with one check.
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

/*
  Each entry needs a matching MDX intro file. `parts` is the single source of truth for
  membership — a post belongs to a series iff it appears here. Dates are deliberately absent;
  they come from git history at build time.
*/
export const series: Series[] = [
  {
    slug: "css-grid-fundamentals",
    title: "CSS Grid Fundamentals",
    order: 1,
    excerpt: "Build smarter, responsive layouts—grid made easy",
    description: 'Unlock the power of CSS Grid in this hands-on 3-part series! Go from container fundamentals and DevTools debugging, through named lines, alignment, spanning, and subgrid, to fully responsive layouts with "fr" units, "minmax()", "auto-fill", "auto-fit", and modern media & container queries — no frameworks needed.',
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/series/css-grid-fundamentals/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "CSS Grid Fundamentals infographic showing 2D grid layouts, CSS code, responsive design, and the three-part series covering grid basics, layout control, and responsive techniques."
    },
    parts: [
      "getting-started-with-css-grid",
      "mastering-css-grid",
      "responsive-css-grid-layouts"
    ],
    signoff: "Three parts, one continuous thread — from your very first grid container to layouts that flex without breaking. Thanks for working through all of it with me. Go build something with your new grid. 🧱",
    changelog: [
      { date: "2026-07-12", change: "Initial publication" }
    ]
  },
];

// Curated `order` rather than dates so navigation follows the intended reading sequence; title breaks ties.
export function getSortedSeries(): Series[] {
  return [...series].sort((a, b) => {
    const orderA = a.order ?? 99999;
    const orderB = b.order ?? 99999;
    if (orderA !== orderB) return orderA - orderB;
    return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
  });
}

// Look up a single series by its slug.
export function getSeriesBySlug(slug: string): Series | undefined {
  return series.find((item) => item.slug === slug);
}

/*
  Client-safe because it returns registry posts without git dates; dangling part slugs are
  dropped so a typo can't break the page.
*/
export function getSeriesPosts(slug: string): Post[] {
  const found = getSeriesBySlug(slug);
  if (!found) return [];
  return found.parts
    .map((partSlug) => getPostBySlug(partSlug))
    .filter((post): post is Post => Boolean(post));
}

// Follows curated order so series-to-series navigation reads as a deliberate sequence.
export function getSeriesNavigation(slug: string): SeriesNavigation {
  const sorted = getSortedSeries();
  const index = sorted.findIndex((item) => item.slug === slug);
  if (index === -1) return { previous: null, next: null };

  const previous = index > 0 ? sorted[index - 1] : null;
  const next = index < sorted.length - 1 ? sorted[index + 1] : null;

  return {
    previous: previous ? { slug: previous.slug, title: previous.title } : null,
    next: next ? { slug: next.slug, title: next.title } : null
  };
}

// Null for a dangling `parts` entry so a missing post drops out instead of breaking navigation.
function toPartLink(partSlug: string, zeroBasedIndex: number): SeriesPostLink | null {
  const post = getPostBySlug(partSlug);
  if (!post) return null;
  return { slug: post.slug, title: post.title, category: post.category, index: zeroBasedIndex + 1 };
}

// Derived entirely from the static registries so post pages can show series context without git.
export function getSeriesForPost(postSlug: string): PostSeriesInfo | null {
  const owning = series.find((item) => item.parts.includes(postSlug));
  if (!owning) return null;

  const index = owning.parts.indexOf(postSlug);
  const total = owning.parts.length;

  return {
    slug: owning.slug,
    title: owning.title,
    url: `/series/${owning.slug}`,
    index: index + 1,
    total,
    previousPost: index > 0 ? toPartLink(owning.parts[index - 1], index - 1) : null,
    nextPost: index < total - 1 ? toPartLink(owning.parts[index + 1], index + 1) : null
  };
}
