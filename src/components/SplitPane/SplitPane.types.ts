import type { ReactNode } from "react";

// One value drives layout, drag axis and cursor so they can never disagree.
export type SplitPaneDirection = "horizontal" | "vertical";

// A ratio rather than pixel sizes so the initial split holds at any container width.
export interface SplitPaneProps {
  // Optional class applied to the root container for external styling overrides.
  className?: string;
  // Initial size ratio (0-1) allocated to the first pane.
  splitRatio?: number;
  // Whether the pane is currently expanded to fill the viewport.
  isFullscreened?: boolean;
  // Layout axis along which the panes and divider are arranged.
  direction?: SplitPaneDirection;
  // Below this viewport width (px), direction is forced to 'vertical'. Omit to disable.
  mobileBreakpoint?: number;
  // Fires whenever the resolved direction changes; pass a stable (useCallback'd) function.
  onDirectionChange?: (direction: SplitPaneDirection) => void;
  // Exactly two panes to render either side of the divider.
  children: [ReactNode, ReactNode];
}
