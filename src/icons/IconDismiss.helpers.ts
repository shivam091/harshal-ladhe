import type { IconDismissStatus } from "@/types/icon";

// SVG viewBox dimension shared with IconHamburger — the dismiss icon renders in the same coordinate space.
export const VIEWBOX_SIZE = 24;

// Width of each diagonal line, in viewBox units — matches IconHamburger's bar width.
const LINE_WIDTH = 18;
const TRANSITION_INSET = (VIEWBOX_SIZE - LINE_WIDTH) / 2; // 3
const CLOSE_INSET = TRANSITION_INSET + 2;                 // 5

// Returns SVG line coordinates for the first diagonal of the ✕, flattening to the horizontal midline while pressed.
export function getFirstLineProps(iconStatus: IconDismissStatus, isBooped: boolean) {
  switch (iconStatus) {
    case "closing":
      return { x1: TRANSITION_INSET, y1: VIEWBOX_SIZE / 2, x2: VIEWBOX_SIZE - TRANSITION_INSET, y2: VIEWBOX_SIZE / 2 };
    case "open":
      // Boop: diagonal becomes slightly flatter (endpoints shift 2px inward vertically)
      return isBooped
        ? { x1: CLOSE_INSET, y1: CLOSE_INSET + 2, x2: VIEWBOX_SIZE - CLOSE_INSET, y2: VIEWBOX_SIZE - CLOSE_INSET - 2 }
        : { x1: CLOSE_INSET, y1: CLOSE_INSET,     x2: VIEWBOX_SIZE - CLOSE_INSET, y2: VIEWBOX_SIZE - CLOSE_INSET };
  }
}

// Returns SVG line coordinates for the second diagonal of the ✕, mirroring getFirstLineProps.
export function getSecondLineProps(iconStatus: IconDismissStatus, isBooped: boolean) {
  switch (iconStatus) {
    case "closing":
      return { x1: TRANSITION_INSET, y1: VIEWBOX_SIZE / 2, x2: VIEWBOX_SIZE - TRANSITION_INSET, y2: VIEWBOX_SIZE / 2 };
    case "open":
      return isBooped
        ? { x1: CLOSE_INSET, y1: VIEWBOX_SIZE - CLOSE_INSET - 2, x2: VIEWBOX_SIZE - CLOSE_INSET, y2: CLOSE_INSET + 2 }
        : { x1: CLOSE_INSET, y1: VIEWBOX_SIZE - CLOSE_INSET,     x2: VIEWBOX_SIZE - CLOSE_INSET, y2: CLOSE_INSET };
  }
}
