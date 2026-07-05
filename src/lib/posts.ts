/*
  Server-only post helpers. Reads git history at build time (during static
  generation) for the posts list and OG metadata. The detail page gets its
  dates + read time via the remark-post-meta plugin instead; this covers the
  server contexts (list page, generateMetadata) that aren't part of MDX compilation.
*/
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createDatedLookup, type ContentDates } from "@/lib/content-dates";
import { posts } from "@/data/posts";
import { siteConfig } from "@/config/site";
import type { DatedPost } from "@/interfaces/post";

export type { DatedPost };

// Directory containing each post's route folder (slug) and its page.mdx source.
const POST_DIR = join(process.cwd(), "src", "app", "(site)", "(internal)", "(post)", "post");
// Out-of-process script that counts words in an MDX file via the real remark/mdx parser.
// Resolved relative to this file (not process.cwd()) so bundlers can statically trace and
// include it in the server output — a cwd-joined path isn't traceable and fails to resolve.
const WORD_COUNT_SCRIPT = join(fileURLToPath(import.meta.url), "..", "word-count-cli.mjs");

// Resolves a post's slug to its page.mdx source file on disk.
function postFilePath(slug: string): string {
  return join(POST_DIR, slug, "page.mdx");
}

// Git-derived publish/update dates for a single post.
export type PostDates = ContentDates;

/*
  Word count for the /posts list, run out-of-process via word-count-cli.mjs so
  the list page agrees exactly with the detail page's reading time (both use
  the same countWords over a real remark/mdx-parsed tree). A prior regex-based
  approximation drifted from the real parser on punctuation-dense inline code
  (`+`, `-`, `**`, `&&`, …) and on markdown structure (headings, list bullets) —
  whack-a-mole that a hand-rolled stand-in for MDX parsing can't fully close.
  Memoised since each call spawns a subprocess.
*/
const wordCountCache = new Map<string, number>();

// Runs word-count-cli.mjs against a post's MDX file and caches the result;
// returns 0 if the subprocess fails.
function countWordsInFile(filePath: string): number {
  const cached = wordCountCache.get(filePath);
  if (cached !== undefined) return cached;

  const { status, stdout } = spawnSync("node", [WORD_COUNT_SCRIPT, filePath], { encoding: "utf-8" });
  const words = status === 0 ? parseInt(stdout, 10) || 0 : 0;
  wordCountCache.set(filePath, words);
  return words;
}

// Converts a post's word count into a whole-minute reading time estimate (minimum 1).
function estimateReadingMinutes(filePath: string): number {
  const words = countWordsInFile(filePath);
  return Math.max(1, Math.round(words / siteConfig.readTime.wordsPerMinute));
}

// Looks up a post's git-derived publish/last-modified dates by slug.
export const getPostDates = createDatedLookup(postFilePath);

// Returns all posts newest-first by git publish date.
// Undated (uncommitted) entries sort last; ties break alphabetically by title.
export function getSortedPosts(): DatedPost[] {
  return posts
    .map((post) => ({
      ...post,
      ...getPostDates(post.slug),
      readingMinutes: estimateReadingMinutes(postFilePath(post.slug)),
    }))
    .sort((a, b) => {
      if (!a.publishedAt && !b.publishedAt) return a.title.localeCompare(b.title);
      if (!a.publishedAt) return 1;
      if (!b.publishedAt) return -1;
      if (a.publishedAt === b.publishedAt) return a.title.localeCompare(b.title);
      return a.publishedAt < b.publishedAt ? 1 : -1;
    });
}

// Posts flagged `pinned: true` in the registry, newest-first. Drives the home
// "Pinned Posts" section; empty (and thus hidden) when the block is disabled.
export function getPinnedPosts(): DatedPost[] {
  if (!siteConfig.home.pinnedPosts.enabled) return [];
  return getSortedPosts().filter((post) => post.pinned);
}

// Posts flagged `featured: true` in the registry, newest-first. Drives the home
// "Featured Posts" section; empty when the block is disabled.
export function getFeaturedPosts(): DatedPost[] {
  if (!siteConfig.home.featuredPosts.enabled) return [];
  return getSortedPosts().filter((post) => post.featured);
}

// The most recently-updated posts, newest last-modified first, capped at the
// configured limit. Undated (uncommitted) posts are omitted.
export function getRecentlyUpdatedPosts(): DatedPost[] {
  const config = siteConfig.home.recentlyUpdatedPosts;
  if (!config.enabled) return [];

  return getSortedPosts()
    .filter((post) => post.lastModifiedAt)
    .sort((a, b) => (a.lastModifiedAt! < b.lastModifiedAt! ? 1 : -1))
    .slice(0, config.limit);
}
