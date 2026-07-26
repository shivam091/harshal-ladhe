import type { ReactNode } from "react";
import type { SplitPaneDirection } from "@/types/split-pane";

// Props for SplitPane — a resizable two-pane layout with a draggable divider.
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

// Refs and geometry useDrag needs to track a pointer/keyboard drag into a pane size split.
export interface UseDragOptions {
  // Split ratio (0-1) to fall back to when no drag has occurred yet.
  defaultRatio: number;
  // Ref to the element whose bounds define the draggable range.
  rulerRef: React.RefObject<HTMLElement | null>;
  // Ref to the outer container used to compute pointer position as a ratio.
  containerRef: React.RefObject<HTMLElement | null>;
  // Ref to the draggable divider element itself.
  dividerRef: React.RefObject<HTMLElement | null>;
  // Divider thickness (px), subtracted when computing available pane space.
  dividerWidth: number;
  // Whether the pane is currently expanded to fill the viewport.
  isFullscreened?: boolean;
  // Layout axis along which the drag offset is measured.
  direction?: SplitPaneDirection;
}
