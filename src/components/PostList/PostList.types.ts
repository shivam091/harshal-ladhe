import type { DatedPost } from "@/lib/posts";
import type { TaxonomyEntry } from "@/lib/taxonomy";

// Props for the post feeds and the mixed tag/category archives.
export interface PostListProps {
  // Cards to render in the order given (typically newest first); untyped entries are posts.
  posts: (DatedPost | TaxonomyEntry)[];
}
