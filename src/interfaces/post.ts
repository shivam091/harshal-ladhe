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

// Per-post table-of-contents configuration.
export interface PostTocConfig {
  // Set false to hide the ToC sidebar entirely for this post. Defaults to true.
  show?: boolean;
  // Deepest heading level to include (2 = h2 only, 3 = h2+h3, 4 = h2+h3+h4). Defaults to 3.
  maxLevel?: 2 | 3 | 4;
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
