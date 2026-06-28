import type { ComponentType } from "react";
import type { IconBoopProps } from "@/icons/icons";
import IconCodeBlock from "@/icons/IconCodeBlock";

// Every goodie is a card linking to a section, so each needs an icon, a blurb, and a route.
export interface Goodie {
  name: string;
  description: string;
  // A component rather than a registry name so each goodie can bring its own boop animation.
  iconComponent: ComponentType<IconBoopProps>;
  href: string;
}

// Hand-curated rather than derived so the page controls order and wording.
export const goodies: Goodie[] = [
  {
    name: "Snippets",
    description: "Concise code fragments to solve discrete challenges.",
    iconComponent: IconCodeBlock,
    href: "/snippets"
  }
];
