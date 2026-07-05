import type { ChangelogEntry } from "@/components/Changelog/Changelog.types";

// One image serves both the post page and share previews, so each field has to suit readers as well as social cards.
export interface PostImage {
  // Relative or absolute image path.
  path: string;
  width: number;
  height: number;
  type?: string;
  // Required so the visible cover is never announced to screen readers as a bare file name.
  alt: string;
  // Written for sighted readers, so it adds to the image instead of repeating its alt description.
  caption: string;
}

// Per-post table-of-contents configuration.
export interface PostTocConfig {
  // Set false to hide the ToC sidebar entirely for this post. Defaults to true.
  show?: boolean;
  // Deepest heading level to include (2 = h2 only, 3 = h2+h3, 4 = h2+h3+h4). Defaults to 3.
  maxLevel?: 2 | 3 | 4;
}

// Single source of truth for a post, so list cards, prev/next nav, and the page header can't drift apart.
export interface Post {
  slug: string;
  title: string;
  // Short lead shown in the post header and list cards.
  excerpt?: string;
  // Longer SEO description shown in list cards and OG metadata.
  description: string;
  // Category slugs this post belongs to.
  category: string[];
  // Freeform tag slugs for this post.
  tags: string[];
  // Social share / OG cover image.
  image?: PostImage;
  // Table-of-contents display options; omit to use defaults.
  toc?: PostTocConfig;
  // Per-post closing message; overrides the built-in PageSignOff default.
  // Set to `false` to suppress the closing text — renders a bare divider instead.
  signoff?: string | false;
  // Surface this post in pinned / featured sections.
  pinned?: boolean;
  featured?: boolean;
  // History of substantive edits after initial publish; drives the "last modified" date shown to readers.
  changelog?: ChangelogEntry[];
}

// Trimmed to what a nav link shows so neighbours don't carry whole entries around.
export interface PostNavLink {
  slug: string;
  title: string;
  category: string[];
}

// Previous (older) and next (newer) neighbours for a given post.
export interface PostNavigation {
  previous: PostNavLink | null;
  next: PostNavLink | null;
}

/*
  Each entry needs a matching app/(site)/(internal)/(post)/post/<category-slug>/<slug>/page.mdx,
  where <category-slug> is the slugified first `category`. Dates are deliberately absent — they
  come from git history at build time. Keep it oldest-first (append new posts), since prev/next
  nav follows array order.
*/
export const posts: Post[] = [
];

// Look up a single post by its slug.
export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

// Array-order based rather than git-dated so it stays client-safe — git can't be read in the browser.
export function getPostNavigation(slug: string): PostNavigation {
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { previous: null, next: null };

  const previous = index > 0 ? posts[index - 1] : null;
  const next = index < posts.length - 1 ? posts[index + 1] : null;

  return {
    previous: previous ? { slug: previous.slug, title: previous.title, category: previous.category } : null,
    next: next ? { slug: next.slug, title: next.title, category: next.category } : null
  };
}
