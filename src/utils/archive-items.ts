/*
  Pure archive-item types and grouping logic — no server-only imports, so this
  is safe to use from both lib/archives.ts (server, git-derived data) and the
  client-side archive filter. Keeping this out of lib/archives.ts matters: that
  file also exports functions that transitively import node:child_process (via
  git-dates.mjs), and JS bundling boundaries are per-file — a client component
  importing anything from that file would drag the whole server-only chain into
  the browser bundle.
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

/*
  Groups archive items by calendar year, newest year and newest item within a
  year first. The /archives page calls this once server-side for the initial
  render, and its client filter component calls it again after narrowing by
  content type.
*/
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
