import type { ChangelogEntry } from "@/components/Changelog/Changelog.types";

// Snippets and tutorials share one record shape so their registries, lookups, and pages stay interchangeable.

// Aliased so content entries don't depend on a component's types directly.
export type ContentChangelogEntry = ChangelogEntry;

// One image serves both the page and share previews, so its alt is written for readers, not social cards.
export interface ContentImage {
  path: string;
  width: number;
  height: number;
  type?: string;
  alt: string;
  caption: string;
}

// Points readers to a fuller treatment of the same topic, e.g. a post that expands on a snippet.
export interface ContentLink {
  label: string;
  href: string;
}

// Single source of truth for an entry, so list cards, prev/next nav, and the page header can't drift apart.
export interface ContentEntry {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  // Optional because most entries have no related post or page to point to.
  link?: ContentLink;
  category: string[];
  tags: string[];
  // Entries without one get a generated card from app/og/[type]/[slug].
  image?: ContentImage;
  changelog: ContentChangelogEntry[];
}

// Trimmed to what a nav link shows so neighbours don't carry whole entries around.
export interface ContentNavLink {
  slug: string;
  title: string;
}

// Either side is null at the ends of the list, where there's no neighbour to link.
export interface ContentNavigation {
  previous: ContentNavLink | null;
  next: ContentNavLink | null;
}

/*
  One factory so every registry gets identical slug lookup and prev/next behaviour.
  Navigation follows the array's own oldest-first order, so registries must stay
  sorted that way for "previous" to mean older.
*/
export function createContentLookup<T extends ContentEntry>(entries: T[]) {
  function getBySlug(slug: string): T | undefined {
    return entries.find((entry) => entry.slug === slug);
  }

  function getNavigation(slug: string): ContentNavigation {
    const index = entries.findIndex((entry) => entry.slug === slug);
    if (index === -1) return { previous: null, next: null };

    const previous = index > 0 ? entries[index - 1] : null;
    const next = index < entries.length - 1 ? entries[index + 1] : null;

    return {
      previous: previous ? { slug: previous.slug, title: previous.title } : null,
      next: next ? { slug: next.slug, title: next.title } : null
    };
  }

  return { getBySlug, getNavigation };
}
