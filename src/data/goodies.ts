import type { IconName } from "@/icons/icons";

// Every goodie is a card linking to a section, so each needs an icon, a blurb, and a route.
interface Goodie {
  name: string;
  description: string;
  // Typed to the icon registry so a misspelt name fails at build time.
  icon: IconName;
  href: string;
}

// Hand-curated rather than derived so the page controls order and wording.
export const goodies: Goodie[] = [
  {
    name: "Snippets",
    description: "Concise code fragments to solve discrete challenges.",
    icon: "codeBlock",
    href: "/snippets"
  }
];
