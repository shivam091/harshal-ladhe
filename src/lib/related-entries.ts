/*
  Reads only the static registries so it can run in the browser inside the content layouts;
  the recent-entries fallback relies on registry order since git dates aren't available there.
*/
import { siteConfig } from "@/config/site";

/*
  Derived from the changelog because git dates aren't available in the browser; its earliest
  entry matches the git publish date shown on lists.
*/
export function getPublishedDate(entry: { changelog?: { date: string }[] }): string | null {
  if (!entry.changelog?.length) return null;
  return entry.changelog.reduce(
    (earliest, change) => (change.date < earliest ? change.date : earliest),
    entry.changelog[0].date
  );
}

// Jaccard normalises for tag count so heavily tagged posts don't dominate; empty sets count as no overlap.
function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;

  let intersection = 0;
  for (const value of a) {
    if (b.has(value)) intersection += 1;
  }
  const union = new Set([...a, ...b]).size;

  return union === 0 ? 0 : intersection / union;
}

// The fields ranking reads, so posts, snippets and tutorials can all share one ranking.
interface RankableEntry {
  slug: string;
  tags: string[];
  category: string[];
}

// Tops up with registry neighbours so the block stays full even when few entries share tags or categories.
export function getRelatedEntries<T extends RankableEntry>(slug: string, entries: T[]): T[] {
  const config = siteConfig.relatedEntries;
  if (!config.enabled) return [];

  const current = entries.find((entry) => entry.slug === slug);
  if (!current) return [];

  const currentTags = new Set(current.tags);
  const currentCategories = new Set(current.category);

  const related = entries
    .filter((entry) => entry.slug !== slug)
    .map((entry) => {
      const tagScore = jaccardSimilarity(currentTags, new Set(entry.tags));
      const categoryScore = jaccardSimilarity(currentCategories, new Set(entry.category));
      const score = tagScore * config.tagWeight + categoryScore * config.categoryWeight;
      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.entry);

  if (related.length < config.limit && config.fallbackToRecent) {
    const recent = entries.filter(
      (entry) => entry.slug !== slug && !related.includes(entry)
    );
    related.push(...recent.slice(0, config.limit - related.length));
  }

  return related.slice(0, config.limit);
}
