import type { ChangelogEntry } from "@/components/Changelog/Changelog.types";

// Shared registry record shape for snippets and tutorials — identical fields, just different content and routes. See @/data/snippets and @/data/tutorials.

// Content changelog entries reuse the shared changelog entry shape.
export type ContentChangelogEntry = ChangelogEntry;

// Cover image used for social/OG/Twitter share previews (not rendered in the body).
export interface ContentImage {
  path: string;
  width: number;
  height: number;
  type?: string;
  alt: string;
}

// Optional CTA link rendered at the top of a content page, e.g. a full post that expands on it.
export interface ContentLink {
  label: string;
  href: string;
}

// Registry record describing one snippet or tutorial — drives its list page, prev/next nav, and detail header.
export interface ContentEntry {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  // Shown under the excerpt when set — omit when there's no related post/page to link to.
  link?: ContentLink;
  category: string[];
  tags: string[];
  // Social share / OG cover image.
  image: ContentImage;
  changelog: ContentChangelogEntry[];
}

// Minimal shape used for the previous/next navigation links.
export interface ContentNavLink {
  slug: string;
  title: string;
}

// Previous (older) and next (newer) neighbours for a given content entry.
export interface ContentNavigation {
  previous: ContentNavLink | null;
  next: ContentNavLink | null;
}

/*
  Builds the getBySlug/getNavigation pair shared by every content registry
  (snippets, tutorials, ...) — a lookup by slug, and its previous/next
  neighbours by the entries array's own order (oldest-first, so "previous" is
  the entry just before and "next" is the one just after).
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
