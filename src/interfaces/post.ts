import type { ChangelogEntry } from "@/interfaces/changelog";

// Post registry entry merged with git-derived dates and estimated reading time.
export interface DatedPost extends Post {
  publishedAt: string | null;
  lastModifiedAt: string | null;
  readingMinutes: number;
}

// Props for the /posts feed list.
export interface PostListProps {
  // Posts to render as cards, in the order given (typically newest first).
  posts: DatedPost[];
}

/*
  Props for the PostMeta row. Values are injected at build by the
  remark-post-meta plugin (string attributes from the MDX AST).
*/
export interface PostMetaProps {
  // Post slug (injected by the plugin) — used to resolve the post's series for
  // the primary-meta series badge.
  slug?: string;
  publishedAt?: string;
  lastModifiedAt?: string;
  // Read time in minutes, passed as a string attribute from the remark plugin.
  readingMinutes?: string | number;
  // Total word count, shown as the read-time tooltip.
  words?: string | number;
}

// Per-post table-of-contents configuration.
export interface PostTocConfig {
  // Set false to hide the ToC sidebar entirely for this post. Defaults to true.
  show?: boolean;
  // Deepest heading level to include (2 = h2 only, 3 = h2+h3, 4 = h2+h3+h4). Defaults to 3.
  maxLevel?: 2 | 3 | 4;
}

// Props for the related-posts block shown at the foot of a post.
export interface RelatedPostsProps {
  // Ranked related posts to render as cards, in the order given.
  posts: Post[];
}

// Cover image used for social share previews and OG metadata.
export interface PostImage {
  // Relative or absolute image path.
  path: string;
  width: number;
  height: number;
  // Required alt text for the share-preview image.
  alt: string;
}

// Registry record describing one post — drives the /posts list, prev/next nav, and the detail layout.
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
  // Per-post closing message; overrides the built-in PostSignOff default.
  // Set to `false` to suppress the closing text — renders a bare PageSignOff instead.
  signoff?: string | false;
  // Surface this post in pinned / featured sections.
  pinned?: boolean;
  featured?: boolean;
  // History of substantive edits after initial publish; drives the "last modified" date shown to readers.
  changelog?: ChangelogEntry[];
}

// Minimal shape used for prev/next navigation links.
export interface PostNavLink {
  slug: string;
  title: string;
}

// Previous (older) and next (newer) neighbours for a given post.
export interface PostNavigation {
  previous: PostNavLink | null;
  next: PostNavLink | null;
}

// One post as surfaced in the list — trimmed to what a row renders.
interface RecentlyUpdatedPost {
  slug: string;
  title: string;
}

// Props for the home page's RecentlyUpdatedPosts block.
export interface RecentlyUpdatedPostsProps {
  posts: RecentlyUpdatedPost[];
}
