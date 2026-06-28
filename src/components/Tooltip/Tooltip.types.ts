import type { ReactNode } from "react";

// Reusable Radix tooltip. Wraps a single focusable trigger element (asChild).
export interface TooltipProps {
  // The element the tooltip is anchored to (must accept a ref — e.g. <span>, <time>, <button>).
  children: ReactNode;
  // Tooltip body; if empty/undefined the trigger renders with no tooltip.
  content?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  // Hover delay before the tooltip opens (ms).
  delayDuration?: number;
}
