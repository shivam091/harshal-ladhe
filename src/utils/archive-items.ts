/*
  No server-only imports so client code can use it — bundling boundaries are per file, so
  importing from the git-backed archive module would drag its server-only chain into the browser.
*/

export type ArchiveItemType = "post" | "snippet" | "tutorial" | "series";

// One post, snippet, tutorial, or series, normalized enough to share a single timeline row.
export interface ArchiveItem {
  id: string;
  type: ArchiveItemType;
  title: string;
  slug: string;
  pathname: string;
  publishedAt: string | null;
}

// Archive items published in a single calendar year, newest-first.
export interface ArchiveItemsByYear {
  year: string;
  items: ArchiveItem[];
}

// Newest year and item first; pure so the server render and the client filter group identically.
export function groupArchiveItemsByYear(items: ArchiveItem[]): ArchiveItemsByYear[] {
  const groups = new Map<string, ArchiveItem[]>();

  for (const item of items) {
    if (!item.publishedAt) continue;

    const year = item.publishedAt.slice(0, 4);
    const bucket = groups.get(year);
    if (bucket) {
      bucket.push(item);
    } else {
      groups.set(year, [item]);
    }
  }

  return [...groups.entries()]
    .map(([year, yearItems]) => ({ year, items: yearItems }))
    .sort((a, b) => b.year.localeCompare(a.year));
}
