/*
  Server-only archive helper — groups published posts by year for the /archives
  timeline. Reads git-derived dates via getSortedPosts, so this runs at build
  time only.
*/
import { getSortedPosts, type DatedPost } from "@/lib/posts";

// Posts published in a single calendar year, newest-first.
export interface PostsByYear {
  year: string;
  posts: DatedPost[];
}

/*
  All published posts grouped by year, newest year first and newest post first
  within each year (getSortedPosts is already newest-first). Undated (uncommitted)
  posts are omitted — an archive is inherently about publish dates.
*/
export function getPostsByYear(): PostsByYear[] {
  const groups = new Map<string, DatedPost[]>();

  for (const post of getSortedPosts()) {
    if (!post.publishedAt) continue;

    const year = post.publishedAt.slice(0, 4);
    const bucket = groups.get(year);
    if (bucket) bucket.push(post);
    else groups.set(year, [post]);
  }

  return [...groups.entries()]
    .map(([year, posts]) => ({ year, posts }))
    .sort((a, b) => b.year.localeCompare(a.year));
}
