/*
  Server-only: reads git history, so it can't ship to the client. Exists for the contexts
  outside MDX compilation, where the remark plugin can't supply dates and read time.
*/
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { compareByDateDesc, createDatedLookup, type ContentDates, type DatedContent } from "@/lib/content-dates";
import { posts, type Post } from "@/data/posts";
import { siteConfig } from "@/config/site";
import { getPostCategorySlug } from "@/utils/post-url";

// Merged so list views get a post, its dates and read time as one value.
export type DatedPost = DatedContent<Post> & { readingMinutes: number };

// Directory containing each post's route folder (slug) and its page.mdx source.
const POST_DIR = join(process.cwd(), "src", "app", "(site)", "(internal)", "(post)", "post");
/*
  Resolved via fileURLToPath rather than `import.meta.dirname`, which Turbopack's ESM shim leaves
  undefined, or `new URL(…, import.meta.url)`, which Turbopack rewrites to a static-asset URL that
  silently spawns nothing and zeroes every word count.
*/
const WORD_COUNT_SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "word-count-cli.mjs");

// Resolves a post's slug to its page.mdx source file on disk (filed under its category slug).
function postFilePath(slug: string): string {
  const post = posts.find((candidate) => candidate.slug === slug);
  const categorySlug = post ? getPostCategorySlug(post.category) : "";
  return join(POST_DIR, categorySlug, slug, "page.mdx");
}

// Git-derived publish/update dates for a single post.
export type PostDates = ContentDates;

/*
  Counted with the real remark/mdx parser so the list agrees with the detail page's read time —
  a regex approximation drifted on punctuation-dense inline code and markdown structure.
  Memoised since each call spawns a subprocess.
*/
const wordCountCache = new Map<string, number>();

// Falls back to 0 so a failed count never breaks the build.
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

// At least one minute so a short entry never shows "0 min read"; shared so every content type's cards agree.
export function estimateReadingMinutes(filePath: string): number {
  const words = countWordsInFile(filePath);
  return Math.max(1, Math.round(words / siteConfig.readTime.wordsPerMinute));
}

// Memoised because list pages and metadata ask for the same slug's dates repeatedly.
export const getPostDates = createDatedLookup(postFilePath);

// Newest-first by git publish date so the list leads with what's fresh.
export function getSortedPosts(): DatedPost[] {
  return posts
    .map((post) => ({
      ...post,
      ...getPostDates(post.slug),
      readingMinutes: estimateReadingMinutes(postFilePath(post.slug))
    }))
    .sort(compareByDateDesc());
}

// Empty when the block is disabled so the section hides itself without extra checks.
export function getPinnedPosts(): DatedPost[] {
  if (!siteConfig.home.pinnedPosts.enabled) return [];
  return getSortedPosts().filter((post) => post.pinned);
}

// Empty when the block is disabled so the section hides itself without extra checks.
export function getFeaturedPosts(): DatedPost[] {
  if (!siteConfig.home.featuredPosts.enabled) return [];
  return getSortedPosts().filter((post) => post.featured);
}
