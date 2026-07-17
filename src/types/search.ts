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
  // Route the result links to, e.g. `/post/my-slug`.
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
