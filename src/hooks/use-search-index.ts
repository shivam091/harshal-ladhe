import { useEffect, useMemo, useState } from "react";
import Fuse, { type FuseResultMatch } from "fuse.js";
import { searchableItems, type SearchableItem } from "@/utils/search-items";

export type { SearchContentType, SearchableItem } from "@/utils/search-items";

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
  // Set only when the hit came from article text, so a result whose title and excerpt don't match still shows why it's listed.
  bodySnippet?: BodySnippet;
}

// A short window of article text around the first matched word, with the matched words' ranges for <mark> highlighting.
export interface BodySnippet {
  text: string;
  matches: [number, number][];
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

// Built once at module load because the registries are static, so the index isn't rebuilt on every open.
const fuse = new Fuse(searchableItems, FUSE_OPTIONS);

// Article text keyed by SearchableItem id, prerendered by app/search-index.json/route.ts.
type BodyIndex = Record<string, string>;

/*
  Fetched rather than imported so article text stays out of the bundle; shared across opens so the
  file is requested once per page load, and reset on failure so a later open can retry.
*/
let bodyIndexPromise: Promise<BodyIndex> | null = null;

function loadBodyIndex(): Promise<BodyIndex> {
  bodyIndexPromise ??= fetch("/search-index.json")
    .then((response) => (response.ok ? (response.json() as Promise<BodyIndex>) : {}))
    .catch(() => {
      bodyIndexPromise = null;
      return {};
    });
  return bodyIndexPromise;
}

// Characters of context kept either side of the first match, sized to fit the result row's line clamp.
const SNIPPET_LEAD = 60;
const SNIPPET_LENGTH = 180;

// Every case-insensitive occurrence of each word, merged and sorted so overlapping words highlight once.
function findWordRanges(text: string, words: string[]): [number, number][] {
  const lowerText = text.toLowerCase();
  const ranges: [number, number][] = [];

  for (const word of words) {
    let index = lowerText.indexOf(word);
    while (index !== -1) {
      ranges.push([index, index + word.length - 1]);
      index = lowerText.indexOf(word, index + word.length);
    }
  }

  ranges.sort((a, b) => a[0] - b[0]);
  return ranges.reduce<[number, number][]>((merged, range) => {
    const last = merged[merged.length - 1];
    if (last && range[0] <= last[1] + 1) last[1] = Math.max(last[1], range[1]);
    else merged.push([...range]);
    return merged;
  }, []);
}

// Starts at a word boundary near the first match so the snippet never opens mid-word.
function buildBodySnippet(body: string, words: string[]): BodySnippet | undefined {
  const lowerBody = body.toLowerCase();
  const firstIndex = Math.min(...words.map((word) => lowerBody.indexOf(word)).filter((index) => index !== -1));
  if (!Number.isFinite(firstIndex)) return undefined;

  let start = Math.max(0, firstIndex - SNIPPET_LEAD);
  if (start > 0) start = body.indexOf(" ", start) + 1 || start;
  let end = Math.min(body.length, start + SNIPPET_LENGTH);
  if (end < body.length) end = body.lastIndexOf(" ", end) > firstIndex ? body.lastIndexOf(" ", end) : end;

  const text = `${start > 0 ? "…" : ""}${body.slice(start, end)}${end < body.length ? "…" : ""}`;
  return { text, matches: findWordRanges(text, words) };
}

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

// Caps the panel at a scannable length; body-only hits only fill whatever metadata hits leave free.
const SEARCH_LIMIT = 20;

// Queries under 2 characters return nothing, so a single keystroke doesn't flood the panel with noise.
export function useSearchIndex(query: string): SearchHit[] {
  // Null until loaded, so results fall back to metadata-only matching instead of waiting on the fetch.
  const [bodies, setBodies] = useState<BodyIndex | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadBodyIndex().then((index) => {
      if (!cancelled) setBodies(index);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => {
    // Whitespace-only input shouldn't count toward the 2-character minimum below.
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) return [];

    const sanitizedQuery = trimmedQuery.replace(EXTENDED_SEARCH_OPERATORS, " ").trim();
    if (sanitizedQuery.length < 2) return [];

    // Split into words once up front so isExactMatch below can check each one independently,
    // matching useExtendedSearch's own per-word (not whole-phrase) matching semantics.
    const queryWords = sanitizedQuery.toLowerCase().split(/\s+/).filter(Boolean);

    const metadataHits: SearchHit[] = fuse.search(sanitizedQuery, { limit: SEARCH_LIMIT }).map((result) => {
      const matchedTags = getMatchedTags(result.matches);

      return {
        item: result.item,
        titleMatches: getFieldMatches(result.matches, "title"),
        excerptMatches: getFieldMatches(result.matches, "excerpt"),
        matchedTags,
        /*
          Literal per-word presence rather than Fuse's blended score, which rarely dips low enough
          for multi-word queries even when every word matches. Checked per word, like extended
          search, and across every field so a perfect hit gets the badge wherever it landed.
        */
        isExactMatch:
          everyWordIn(queryWords, result.item.title) ||
          everyWordIn(queryWords, result.item.excerpt) ||
          (matchedTags.length > 0 &&
            queryWords.every((word) => matchedTags.some((tag) => tag.toLowerCase().includes(word))))
      };
    });

    if (!bodies || metadataHits.length >= SEARCH_LIMIT) return metadataHits;

    /*
      Literal rather than fuzzy: Fuse over thousands of characters of prose finds a near-miss for
      almost any word, which would bury real hits. Body-only hits rank after metadata hits, most
      occurrences first, since matching only in the text is the weaker signal.
    */
    const bodyWords = queryWords.filter((word) => word.length >= 2);
    if (bodyWords.length === 0) return metadataHits;

    const listedIds = new Set(metadataHits.map((hit) => hit.item.id));
    const bodyHits = searchableItems
      .filter((item) => !listedIds.has(item.id))
      .flatMap((item) => {
        const body = bodies[item.id];
        if (!body || !everyWordIn(bodyWords, body)) return [];
        const bodySnippet = buildBodySnippet(body, bodyWords);
        return [{ item, occurrences: findWordRanges(body, bodyWords).length, bodySnippet }];
      })
      .sort((a, b) => b.occurrences - a.occurrences)
      .slice(0, SEARCH_LIMIT - metadataHits.length)
      .map(({ item, bodySnippet }) => ({
        item,
        titleMatches: [],
        excerptMatches: [],
        matchedTags: [],
        isExactMatch: false,
        bodySnippet
      }));

    return [...metadataHits, ...bodyHits];
  }, [query, bodies]);
}
