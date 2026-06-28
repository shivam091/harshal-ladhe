import type { IconName } from "@/types/icon";

// A single entry in the Goodies grid — an icon, a name, a blurb, and where it links.
export interface Goodie {
  name: string;
  description: string;
  // Icon registry key rendered inside the goodie card.
  icon: IconName;
  // Destination route for the card link.
  href: string;
  // Extra pathname prefixes that should also mark this goodie as active (e.g. singular sub-routes).
  activePatterns?: string[];
}
