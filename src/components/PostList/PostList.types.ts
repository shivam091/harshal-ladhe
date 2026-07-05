import type { DatedPost } from "@/lib/posts";

// Props for the /posts feed list.
export interface PostListProps {
  // Posts to render as cards, in the order given (typically newest first).
  posts: DatedPost[];
}
