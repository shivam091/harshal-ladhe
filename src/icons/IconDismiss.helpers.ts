// Only the phases a ✕ can be in, since it never renders the hamburger's bar states.
export type IconDismissStatus = "closing" | "open";

// Same coordinate space as the hamburger so the two icons move identically.
export const VIEWBOX_SIZE = 24;

// Same width as the hamburger's bars so the ✕ matches it exactly.
const LINE_WIDTH = 18;
const TRANSITION_INSET = (VIEWBOX_SIZE - LINE_WIDTH) / 2; // 3
const CLOSE_INSET = TRANSITION_INSET + 2;                 // 5

// Flattens to the midline while pressed so the press registers before the dismiss fires.
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

// Mirrors the first diagonal so the ✕ stays symmetric.
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
