import type { DatedPost } from "@/lib/posts";
import type { DatedContent } from "@/lib/content-dates";
import type { ContentEntry } from "@/data/content";

/*
  Structural so the list works for plain post feeds and for archives that mix formats,
  without depending on any archive's own types; untyped entries are posts.
*/
export type PostListEntry =
  | (DatedPost & { type?: "post" })
  | (DatedContent<ContentEntry> & { type: "snippet" | "tutorial"; readingMinutes: number });

// Kept minimal so post-only feeds and mixed-format archives share one list.
export interface PostListProps {
  // Cards to render in the order given (typically newest first).
  posts: PostListEntry[];
  // Only mixed-format lists need it; on post-only feeds every card would carry the same icon.
  showTypeIcon?: boolean;
}

// One card in either list; `as` lets the animated list wrap it without nesting list items.
export interface PostCardProps {
  post: PostListEntry;
  // Drives the staggered scroll-reveal delay.
  index: number;
  showTypeIcon?: boolean;
  as?: "li" | "div";
}
