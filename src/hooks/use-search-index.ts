import { useMemo } from "react";
import Fuse, { type FuseResultMatch } from "fuse.js";
import { posts } from "@/data/posts";
import { snippets } from "@/data/snippets";
import { series } from "@/data/series";
import { getPostUrl } from "@/utils/post-url";

// Which registry a search result was sourced from — drives the "Snippet:"/"Series:" prefix and href prefix.
export type SearchContentType = "post" | "snippet" | "series";

// Flattened, searchable shape both posts and snippets get normalised into before indexing with Fuse.
export interface SearchableItem {
  // Unique key for the item, prefixed by content type (e.g. `post-my-slug`) so ids never collide across registries.
  id: string;
  // Which registry this item came from — drives SearchResult's "Snippet:"/"Series:" title prefix.
  contentType: SearchContentType;
  // Full title, searched at the highest Fuse weight and rendered (with match highlights) as the result's headline.
  title: string;
  // Trimmed description shown under the title in SearchResult; also indexed by Fuse so a query can match body copy, not just the title.
  excerpt: string;
  // Single-entry category label rendered as the eyebrow above the title; also indexed by Fuse, at the lowest weight.
  category: string;
  // Tags indexed by Fuse for matching; not rendered in the result row itself.
  tags: string[];
  // Route the result links to, e.g. `/post/css/my-slug`.
  pathname: string;
}

// One ranked hit returned from the search index, ready for SearchResult to render.
export interface SearchHit {
  // The matched item itself, as normalised for indexing.
  item: SearchableItem;
  // Character ranges within `item.title` that matched the query, used to render <mark> highlights.
  titleMatches: [number, number][];
  // Character ranges within `item.excerpt` that matched the query, used to render <mark> highlights.
  excerptMatches: [number, number][];
  // Which of the item's tags the query matched, if any — rendered as chips so a tag-only hit is visibly explained.
  matchedTags: string[];
  // True for near-exact substring matches (low Fuse score) — via the title or the tags — only these get the highlighted mark badge.
  isExactMatch: boolean;
}

// Fuse field weights — title matches rank highest, then tags, then category/excerpt.
const FUSE_OPTIONS = {
  keys: [
    { name: "title", weight: 0.5 },
    { name: "tags", weight: 0.25 },
    { name: "excerpt", weight: 0.15 },
    { name: "category", weight: 0.1 }
  ],
  threshold: 0.35,
  ignoreLocation: true,
  includeMatches: true,
  minMatchCharLength: 2,
  useExtendedSearch: true,
  findAllMatches: true
};

// Normalises the static posts + snippets + series registries into the flat shape Fuse indexes over.
function buildSearchableItems(): SearchableItem[] {
  // Blog posts, flattened to the searchable shape — falls back to `description` when a post has no dedicated excerpt.
  const postItems: SearchableItem[] = posts.map((post) => ({
    id: `post-${post.slug}`,
    contentType: "post",
    title: post.title,
    excerpt: post.excerpt ?? post.description,
    category: post.category[0] ?? "",
    tags: post.tags,
    pathname: getPostUrl(post)
  }));

  // Code snippets, flattened to the same searchable shape as posts.
  const snippetItems: SearchableItem[] = snippets.map((snippet) => ({
    id: `snippet-${snippet.slug}`,
    contentType: "snippet",
    title: snippet.title,
    excerpt: snippet.excerpt,
    category: snippet.category[0] ?? "",
    tags: snippet.tags,
    pathname: `/snippet/${snippet.slug}`
  }));

  // Series have no category/tags of their own — they're a collection of posts, not tagged content.
  const seriesItems: SearchableItem[] = series.map((oneSeries) => ({
    id: `series-${oneSeries.slug}`,
    contentType: "series",
    title: oneSeries.title,
    excerpt: oneSeries.excerpt ?? oneSeries.description,
    category: "",
    tags: [],
    pathname: `/series/${oneSeries.slug}`
  }));

  return [...postItems, ...snippetItems, ...seriesItems];
}

/*
  Built once at module load — posts/snippets/series are static registries baked in at build
  time, so there's no need to reconstruct the Fuse index on every SearchModal mount.
*/
const searchableItems = buildSearchableItems();
const fuse = new Fuse(searchableItems, FUSE_OPTIONS);

// Pulls one field's match ranges out of a Fuse match list, for <mark> highlighting.
function getFieldMatches(matches: readonly FuseResultMatch[] | undefined, key: string): [number, number][] {
  const fieldMatch = matches?.find((match) => match.key === key);
  return fieldMatch ? fieldMatch.indices.map(([start, end]) => [start, end]) : [];
}

/*
  Pulls every matched tag's own text out of a Fuse match list. Tags are an array-typed key, so a
  single query can match several distinct tags at once — each gets its own match entry (key:
  "tags") carrying that tag's literal string in `.value`, rather than an index into the title.
*/
function getMatchedTags(matches: readonly FuseResultMatch[] | undefined): string[] {
  return (matches ?? [])
    .filter((match) => match.key === "tags" && match.value)
    .map((match) => match.value as string);
}

// Whether every given word is a literal (case-insensitive) substring of `text`.
function everyWordIn(words: string[], text: string): boolean {
  const lowerText = text.toLowerCase();
  return words.every((word) => lowerText.includes(word));
}

/*
  useExtendedSearch treats a leading/embedded ' ^ ! = $ | as a search operator (exact-match,
  negation, prefix, suffix, OR) rather than literal text. This is a plain search box, not an
  advanced-query field, so a user typing a literal "!important" or "it's" should search for
  that text — not have it silently reinterpreted (or, for "!", inverted) as an operator.
  Stripping these before the query ever reaches Fuse keeps every word literal.
*/
const EXTENDED_SEARCH_OPERATORS = /['^!=$|]/g;

/*
  Returns ranked search hits for `query` across posts + snippets + series. Empty/short
  queries (< 2 chars) return no results, matching the "don't show noise" behaviour of the
  reference implementation's Algolia-backed search.
*/
export function useSearchIndex(query: string): SearchHit[] {
  return useMemo(() => {
    // Whitespace-only input shouldn't count toward the 2-character minimum below.
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) return [];

    const sanitizedQuery = trimmedQuery.replace(EXTENDED_SEARCH_OPERATORS, " ").trim();
    if (sanitizedQuery.length < 2) return [];

    // Split into words once up front so isExactMatch below can check each one independently,
    // matching useExtendedSearch's own per-word (not whole-phrase) matching semantics.
    const queryWords = sanitizedQuery.toLowerCase().split(/\s+/).filter(Boolean);

    return fuse.search(sanitizedQuery, { limit: 20 }).map((result) => {
      const matchedTags = getMatchedTags(result.matches);

      return {
        item: result.item,
        titleMatches: getFieldMatches(result.matches, "title"),
        excerptMatches: getFieldMatches(result.matches, "excerpt"),
        matchedTags,
        /*
          Whether every typed word is literally present — in the title, the excerpt, or across
          the item's tags — deliberately not based on Fuse's own `score`, which blends title/
          tags/excerpt/category weights and factors in the whole field's length. That holistic
          score rarely dips below a tight threshold for multi-word queries even when every word
          matches exactly, which made the highlight badge only ever show up for short
          single-word queries. Checked per-word (not as one contiguous phrase) since
          useExtendedSearch matches — and highlights — each word independently: "CSS
          Fundamentals" against "CSS Grid Fundamentals" has both words present even though
          "Grid" breaks up the phrase. Every field is checked (not just whichever one Fuse
          happened to match on) so a perfect hit gets the same badge regardless of which field
          it landed in. The tags branch reuses `matchedTags` rather than re-scanning every tag,
          since a query word can only ever surface here by already having matched one of them.
        */
        isExactMatch:
          everyWordIn(queryWords, result.item.title) ||
          everyWordIn(queryWords, result.item.excerpt) ||
          (matchedTags.length > 0 &&
            queryWords.every((word) => matchedTags.some((tag) => tag.toLowerCase().includes(word))))
      };
    });
  }, [query]);
}
