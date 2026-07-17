import type { ReactNode, SVGProps } from "react";
import type { icons } from "@/icons/icons";

// Shape of every entry in the icons registry — viewBox required; svgProps overrides defaults; children is the SVG markup.
export type IconDefinition = {
  viewBox: string;
  svgProps?: SVGProps<SVGSVGElement>;
  children: ReactNode;
};

// Represents the animation phase of the hamburger ↔ close icon transition
export type IconHamburgerStatus = "closed" | "opening" | "open" | "closing";

// Represents the animation phase of the static ✕ dismiss icon — a subset of
// IconHamburgerStatus, since IconDismiss never renders the "closed"/"opening" bar states.
export type IconDismissStatus = "closing" | "open";

// Union of every valid icon key — derived automatically from the registry so it stays in sync.
export type IconName = keyof typeof icons;
