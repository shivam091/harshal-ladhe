import type { Goodie } from "@/interfaces/goodie";

// Curated developer goodies rendered as cards on the /goodies page.
export const goodies: Goodie[] = [
  {
    name: "Snippets",
    description: "Concise code fragments to solve discrete challenges.",
    icon: "codeBlock",
    href: "/snippets"
  },
  {
    name: "Clip-Path Generator",
    description: "Draggable clip-path editor with bezier curve points, shape morphing, and multi-format code export.",
    icon: "diamonds",
    href: "/goodies/clip-path-generator"
  },
  {
    name: "Gradient Generator",
    description: "Linear, radial, and conic gradient editor with multi-stop control, OKLCH/HSL/RGB interpolation, and multi-format code export.",
    icon: "gradient",
    href: "/goodies/gradient-generator"
  }
];
