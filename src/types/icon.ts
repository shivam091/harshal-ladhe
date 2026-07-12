import { ReactNode, SVGProps } from "react";
import { icons } from "@/icons/icons";

// Shape of every entry in the icons registry — viewBox required; svgProps overrides defaults; children is the SVG markup.
export type IconDefinition = {
  viewBox: string;
  svgProps?: SVGProps<SVGSVGElement>;
  children: ReactNode;
};

// Represents the animation phase of the hamburger ↔ close icon transition
export type IconHamburgerStatus = "closed" | "opening" | "open" | "closing";

// Union of every valid icon key — derived automatically from the registry so it stays in sync.
export type IconName = keyof typeof icons;
