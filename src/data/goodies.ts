import type { IconName } from "@/icons/icons";

// A single entry in the Goodies grid — an icon, a name, a blurb, and where it links.
interface Goodie {
  name: string;
  description: string;
  // Icon registry key rendered inside the goodie card.
  icon: IconName;
  // Destination route for the card link.
  href: string;
}

// Curated developer goodies rendered as cards on the /goodies page.
export const goodies: Goodie[] = [
  {
    name: "Snippets",
    description: "Concise code fragments to solve discrete challenges.",
    icon: "codeBlock",
    href: "/snippets"
  }
];
