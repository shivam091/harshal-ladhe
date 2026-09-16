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
  },
  {
    name: "Cron Expression Builder",
    description: "Bidirectional cron builder — per-field mode widgets generate the 5-field string, a plain-English description reads it back, and a live next-5-runs preview with crontab/GitHub Actions/Kubernetes export.",
    icon: "cron",
    href: "/goodies/cron-expression-builder"
  },
  {
    name: "Regex Tester",
    description: "Live regex tester — matches highlight directly in your test string, numbered/named capture groups surface as their own tags, a plain-English explain panel reads the pattern back, and it exports to JavaScript/Python/Java.",
    icon: "regex",
    href: "/goodies/regex-tester"
  },
  {
    name: "Gradient Generator",
    description: "Live gradient builder — the gradient itself is the backdrop, with a large draggable angle dial and position pad, multi-stop color editing with OKLCH/HSL/RGB interpolation, curated presets, and CSS/Tailwind/React export.",
    icon: "gradient",
    href: "/goodies/gradient-generator"
  },
  {
    name: "Box Shadow Generator",
    description: "Layered box-shadow editor — stack, reorder, and duplicate per-layer offset/blur/spread/color/inset shadows, tune the surface and page colors, start from neumorphism/material/neon presets, and export to CSS/Tailwind/React.",
    icon: "boxShadow",
    href: "/goodies/box-shadow-generator"
  },
  {
    name: "Text Effects Generator",
    description: "Live text-effects editor — an oversized preview on its own spotlit stage, a solid or gradient text fill, a stack of text-shadow layers for glow/emboss/outline/3D-extrude looks, curated presets, and CSS/Tailwind/React export.",
    icon: "textEffects",
    href: "/goodies/text-effects-generator"
  }
];
