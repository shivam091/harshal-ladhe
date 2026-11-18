import type { ComponentType } from "react";
import type { IconBoopProps, IconName } from "@/icons/icons";
import type { ChangelogEntry } from "@/components/Changelog/Changelog.types";

// Every goodie is a card linking to a section, so each needs an icon, a blurb, and a route.
export interface Goodie {
  name: string;
  description: string;
  // Typed to the icon registry so a misspelt name fails at build time.
  icon: IconName;
  // Takes over from `icon` when a goodie has its own boop animation.
  iconComponent?: ComponentType<IconBoopProps>;
  href: string;
  // Kept on the record, like posts and snippets, but not rendered on the goodie pages; omitted for the Snippets and Tutorials cards, which are indexes rather than goodies.
  changelog?: ChangelogEntry[];
}

// Hand-curated rather than derived so the page controls order and wording.
export const goodies: Goodie[] = [
  {
    name: "Snippets",
    description: "Concise code fragments to solve discrete challenges.",
    icon: "codeBlock",
    href: "/snippets"
  },
  {
    name: "Tutorials",
    description: "In-depth, step-by-step guides for building things from scratch.",
    icon: "bulb",
    href: "/tutorials"
  },
];

// Only the /goodies/<slug> entries have a detail page of their own; the rest link to other sections.
export function getGoodieSlug(goodie: Goodie): string | null {
  const prefix = "/goodies/";
  return goodie.href.startsWith(prefix) ? goodie.href.slice(prefix.length) : null;
}

// Looks a goodie up by its route slug, so breadcrumbs and layouts share one definition of "the goodie at this URL".
export function getGoodieBySlug(slug: string): Goodie | undefined {
  return goodies.find((goodie) => getGoodieSlug(goodie) === slug);
}
