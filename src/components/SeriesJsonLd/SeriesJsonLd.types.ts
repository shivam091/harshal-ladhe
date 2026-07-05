import type { Series } from "@/data/series";
import type { Post } from "@/data/posts";

// Takes resolved posts rather than slugs so dangling `parts` entries are already filtered out.
export interface SeriesJsonLdProps {
  series: Series;
  posts: Post[];
  // Null when git has no date yet (uncommitted intro file).
  publishedAt?: string | null;
  lastModifiedAt?: string | null;
}
