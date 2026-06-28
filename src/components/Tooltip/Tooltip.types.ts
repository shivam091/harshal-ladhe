import type { ReactNode } from "react";

// The trigger is a single child so Radix can merge its handlers and ref onto it instead of adding a wrapper.
export interface TooltipProps {
  // The element the tooltip is anchored to (must accept a ref — e.g. <span>, <time>, <button>).
  children: ReactNode;
  // Optional so a trigger can render without tooltip wiring when there's nothing to say.
  content?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  // In ms — long enough that sweeping the cursor across the page doesn't flash tooltips.
  delayDuration?: number;
  // For programmatic hints that must show without waiting for hover or focus.
  forceOpen?: boolean;
}
