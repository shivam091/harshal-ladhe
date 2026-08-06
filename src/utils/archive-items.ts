import { ArchiveItem, ArchiveItemsByYear } from "@/interfaces/archives";

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
