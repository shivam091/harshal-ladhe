/*
  Server-only post helpers. Reads git history at build time (during static
  generation) for the posts list and OG metadata. The detail page gets its
  dates + read time via the remark-post-meta plugin instead; this covers the
  server contexts (list page, generateMetadata) that aren't part of MDX compilation.
*/
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createDatedLookup, type ContentDates } from "@/lib/content-dates";
import { posts } from "@/data/posts";
import { siteConfig } from "@/config/site";
import type { DatedPost } from "@/interfaces/post";

export type { DatedPost };

// Directory containing each post's route folder (slug) and its page.mdx source.
const POST_DIR = join(process.cwd(), "src", "app", "(site)", "(internal)", "(post)", "post");
/*
  Out-of-process script that counts words in an MDX file via the real remark/mdx parser.
  Resolved from this file's own directory via fileURLToPath(import.meta.url) rather than
  either `import.meta.dirname` (Turbopack's bundled ESM shim leaves it `undefined`,
  throwing "path argument must be of type string" at request time) or
  `new URL("./word-count-cli.mjs", import.meta.url)` (naming the sibling file directly in
  a `new URL(literal, import.meta.url)` call makes Turbopack tag it as a client-servable
  static asset and rewrite it to a "/_next/static/media/..." URL, not a filesystem path —
  spawning that as a subprocess silently no-ops, zeroing every word count — and Turbopack
  intercepts that exact call shape regardless of the literal, even just "."). Getting the
  URL string via fileURLToPath and slicing the directory off ourselves avoids both.
*/
const WORD_COUNT_SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "word-count-cli.mjs");

// Resolves a post's slug to its page.mdx source file on disk.
function postFilePath(slug: string): string {
  return join(POST_DIR, slug, "page.mdx");
}

// Git-derived publish/update dates for a single post.
export type PostDates = ContentDates;

/*
  Word count for the /posts list, run out-of-process via word-count-cli.mjs so
  the list page agrees with the detail page's reading time (both walk a real
  remark/mdx-parsed tree with the same text/inlineCode-summing logic — see the
  countWords duplication note in word-count-cli.mjs). A prior regex-based
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

  /*
    Turbopack also statically traces path-shaped values passed to spawnSync (as if they
    were import specifiers) and hard-fails `next build` ("Module not found: Can't resolve
    <dynamic>") on one it can't resolve as a module — even a value it can't possibly know
    at compile time, like a path built from this module's own directory. `Date.now() > 0`
    is always true at runtime but not something Turbopack's static analysis evaluates, so
    routing WORD_COUNT_SCRIPT through it hides the value from that analysis entirely.
  */
  const script = Date.now() > 0 ? WORD_COUNT_SCRIPT : "";
  const { status, stdout } = spawnSync("node", [script, filePath], { encoding: "utf-8" });
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
