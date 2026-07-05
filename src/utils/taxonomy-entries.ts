/*
  No server-only imports so the client-side category accordion can share these labels and
  URLs with the server-rendered archives.
*/
import { getPostUrl } from "@/utils/post-url";

// Series have no tags or categories of their own — their parts already appear under them.
export type TaxonomyEntryType = "post" | "snippet" | "tutorial";

// Fixed order so count summaries and filter chips list content types the same way.
export const TAXONOMY_ENTRY_TYPES: TaxonomyEntryType[] = ["post", "tutorial", "snippet"];

// One lookup so cards, counts, and accessible labels name a content type identically.
export const TAXONOMY_ENTRY_LABELS: Record<TaxonomyEntryType, { singular: string; plural: string }> = {
  post: { singular: "Post", plural: "Posts" },
  snippet: { singular: "Snippet", plural: "Snippets" },
  tutorial: { singular: "Tutorial", plural: "Tutorials" }
};

// Posts are filed under their category, while snippets and tutorials sit at a flat /<type>/<slug>.
export function getTaxonomyEntryUrl(entry: { type: TaxonomyEntryType; slug: string; category: string[] }): string {
  return entry.type === "post" ? getPostUrl(entry) : `/${entry.type}/${entry.slug}`;
}

// Per-type phrases such as ["3 posts", "1 tutorial"], so a mixed archive says what it holds.
export function getEntryCountParts(entries: { type: TaxonomyEntryType }[]): string[] {
  return TAXONOMY_ENTRY_TYPES.flatMap((type) => {
    const count = entries.filter((entry) => entry.type === type).length;
    if (count === 0) return [];

    const { singular, plural } = TAXONOMY_ENTRY_LABELS[type];
    return [`${count} ${(count === 1 ? singular : plural).toLowerCase()}`];
  });
}
