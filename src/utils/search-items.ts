import { posts } from "@/data/posts";
import { snippets } from "@/data/snippets";
import { tutorials } from "@/data/tutorials";
import { series } from "@/data/series";
import { getPostUrl } from "@/utils/post-url";

// Which registry a search result was sourced from — drives the "Snippet:"/"Tutorial:"/"Series:" prefix and href prefix.
export type SearchContentType = "post" | "snippet" | "tutorial" | "series";

// Flattened, searchable shape posts/snippets/tutorials/series all get normalised into before indexing with Fuse.
export interface SearchableItem {
  // Unique key for the item, prefixed by content type (e.g. `post-my-slug`) so ids never collide across registries.
  id: string;
  // Which registry this item came from — drives SearchResult's "Snippet:"/"Tutorial:"/"Series:" title prefix.
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

// Normalises the static posts + snippets + tutorials + series registries into the flat shape Fuse indexes over.
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

  // Tutorials, flattened to the same searchable shape as snippets.
  const tutorialItems: SearchableItem[] = tutorials.map((tutorial) => ({
    id: `tutorial-${tutorial.slug}`,
    contentType: "tutorial",
    title: tutorial.title,
    excerpt: tutorial.excerpt,
    category: tutorial.category[0] ?? "",
    tags: tutorial.tags,
    pathname: `/tutorial/${tutorial.slug}`
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

  return [...postItems, ...snippetItems, ...tutorialItems, ...seriesItems];
}

/*
  Kept apart from the search hook so the prerendered body-text route can share the same ids and
  paths without importing React hooks, which a route handler can't load.
*/
export const searchableItems = buildSearchableItems();
