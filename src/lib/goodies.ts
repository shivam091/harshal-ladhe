/*
  Server-only: reads git history, so it can't ship to the client. Feeds the sitemap and Atom feed,
  which sit outside the goodie pages themselves and so can't take dates from the registry.
*/
import { join } from "node:path";
import { createDatedLookup, createSortedContentLookup, type ContentDates, type DatedContent } from "@/lib/content-dates";
import { goodies, getGoodieSlug, type Goodie } from "@/data/goodies";

// Route-group folder holding one sub-folder per goodie slug, each with a page.tsx.
const GOODIE_DIR = join(process.cwd(), "src", "app", "(site)", "(internal)", "goodies", "(goodie)");

// A goodie's page.tsx stands in for it when reading git dates, since goodies have no MDX file.
function goodieFilePath(slug: string): string {
  return join(GOODIE_DIR, slug, "page.tsx");
}

// ISO date strings sourced from git history; null when the file has never been committed.
export type GoodieDates = ContentDates;

// Memoised because the sitemap and the feed ask for the same slug's dates.
export const getGoodieDates = createDatedLookup(goodieFilePath);

// A registry entry plus its slug and dates, so feed and sitemap code treats goodies like any other content.
export type DatedGoodie = DatedContent<Goodie & { slug: string; title: string }>;

// Only entries with their own /goodies/<slug> page — the registry also lists Snippets and Tutorials, which are indexes elsewhere.
const goodiePages = goodies
  .filter((goodie) => getGoodieSlug(goodie) !== null)
  .map((goodie) => ({ ...goodie, slug: getGoodieSlug(goodie) as string, title: goodie.name }));

// Newest-first by git publish date, matching how every other content list is ordered.
export const getSortedGoodies = createSortedContentLookup(goodiePages, getGoodieDates);
