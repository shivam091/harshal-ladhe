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
  Registry record describing one series — drives the /series list, the detail
  page chrome, series-to-series nav, and the per-post series badge / in-series nav.
  The `parts` array (ordered post slugs) is the single source of truth for which
  posts belong to the series and in what order.
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
  category: string[];
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

/*
  Registry of every series. Each entry has a matching MDX intro file at
  src/content/series/<slug>.mdx (registered in src/content/series/index.ts) and
  drives the /series list, the /series/<slug> detail page, series-to-series nav,
  and the per-post series badge + in-series navigation.

  `parts` (ordered post slugs) is the single source of truth for series
  membership — a post belongs to a series iff it appears here. Dates come from
  git history at build time (lib/series.ts for the list/detail/sitemap). The /series
  list is newest-first by publish date (lib/series.ts); prev/next follows `order`
  ascending, ties broken alphabetically by title.
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
  {
    slug: "git-from-basics-to-advanced",
    title: "Git: From Basics to Advanced",
    order: 2,
    excerpt: "Everyday Git commands, plus advanced recovery workflows.",
    description: "A 2-part Git series — start with the everyday staging/commit/branch/merge loop, then move on to rebasing, Git internals, and disaster-recovery workflows with reflog.",
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/series/git-from-basics-to-advanced/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover image for the “Git: From Basics to Advanced” series, featuring a glowing Git branch graph with main, feature, and release branches, plus two sections covering Git basics, advanced workflows, internals, rebasing, recovery, and real-world Git usage."
    },
    parts: [
      "git-basics-for-beginners",
      "advanced-git-techniques-and-workflows",
    ],
    signoff: "From your first commit to rebasing with confidence — that's the whole arc this series was built to cover. Thanks for sticking with it through both parts. Go put it to use. 🌱",
    changelog: [
      { date: "2026-08-15", change: "Initial publication" }
    ]
  },
];

/*
  All series ordered for display: by `order` ascending, ties broken
  alphabetically by title (mirrors the Jekyll SeriesGenerator sort).
*/
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
  The posts belonging to a series, in curated `parts` order (Part 1, Part 2, …).
  Client-safe: returns registry posts (no git dates) — the detail page derives
  published dates from each post's changelog. Dangling part slugs are dropped.
*/
export function getSeriesPosts(slug: string): Post[] {
  const found = getSeriesBySlug(slug);
  if (!found) return [];
  return found.parts
    .map((partSlug) => getPostBySlug(partSlug))
    .filter((post): post is Post => Boolean(post));
}

/*
  Previous/next neighbouring series in sorted (curated) order — drives the
  series-to-series navigation on the detail page. "previous" reads as the
  lower-ordered series, "next" as the higher-ordered one.
*/
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

/*
  Resolves a part slug to a nav link carrying its 1-based part number, or null
  when the referenced post isn't in the registry (a dangling `parts` entry).
*/
function toPartLink(partSlug: string, zeroBasedIndex: number): SeriesPostLink | null {
  const post = getPostBySlug(partSlug);
  if (!post) return null;
  return { slug: post.slug, title: post.title, category: post.category, index: zeroBasedIndex + 1 };
}

/*
  Given a post slug, returns its place within the series it belongs to
  (part number, total, and the previous/next parts), or null if it's in none.
  Client-safe: derived entirely from the static registries.
*/
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
