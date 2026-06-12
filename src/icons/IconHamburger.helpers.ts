import type { IconHamburgerStatus } from "@/icons/IconHamburger";

// Exported so the SVG's viewBox and the line maths share one source.
export const VIEWBOX_SIZE = 24;

// Width of each hamburger bar, in viewBox units.
const HAMBURGER_LINE_WIDTH = 18;
const HAMBURGER_X_INSET = (VIEWBOX_SIZE - HAMBURGER_LINE_WIDTH) / 2; // 3
const HAMBURGER_Y_INSET = HAMBURGER_X_INSET + 2;                     // 5
const CLOSE_INSET = HAMBURGER_X_INSET + 2;                           // 5

// Top bar folds into the ✕'s first diagonal so open/close reads as one continuous motion.
export function getFirstLineProps(iconStatus: IconHamburgerStatus, isBooped: boolean) {
  switch (iconStatus) {
    case "closed": {
      // Boop squeezes toward centre, previewing the collapse into the ✕.
      const y = isBooped ? HAMBURGER_Y_INSET + 2 : HAMBURGER_Y_INSET;
      return { x1: HAMBURGER_X_INSET, y1: y, x2: VIEWBOX_SIZE - HAMBURGER_X_INSET, y2: y };
    }
    case "opening":
    case "closing":
      return { x1: HAMBURGER_X_INSET, y1: VIEWBOX_SIZE / 2, x2: VIEWBOX_SIZE - HAMBURGER_X_INSET, y2: VIEWBOX_SIZE / 2 };
    case "open":
      // Boop flattens the diagonal slightly so the ✕ still reacts to hover.
      return isBooped
        ? { x1: CLOSE_INSET, y1: CLOSE_INSET + 2, x2: VIEWBOX_SIZE - CLOSE_INSET, y2: VIEWBOX_SIZE - CLOSE_INSET - 2 }
        : { x1: CLOSE_INSET, y1: CLOSE_INSET,     x2: VIEWBOX_SIZE - CLOSE_INSET, y2: VIEWBOX_SIZE - CLOSE_INSET };
  }
}

// Middle bar never moves, only fades — the ✕ needs just two strokes.
export function getSecondLineProps() {
  return {
    x1: HAMBURGER_X_INSET,
    y1: VIEWBOX_SIZE / 2,
    x2: VIEWBOX_SIZE - HAMBURGER_X_INSET,
    y2: VIEWBOX_SIZE / 2
  };
}

// Mirrors the top bar to form the ✕'s second diagonal.
export function getThirdLineProps(iconStatus: IconHamburgerStatus, isBooped: boolean) {
  switch (iconStatus) {
    case "closed": {
      // Mirrors the top bar's boop squeeze.
      const y = isBooped ? VIEWBOX_SIZE - HAMBURGER_Y_INSET - 2 : VIEWBOX_SIZE - HAMBURGER_Y_INSET;
      return { x1: HAMBURGER_X_INSET, y1: y, x2: VIEWBOX_SIZE - HAMBURGER_X_INSET, y2: y };
    }
    case "opening":
    case "closing":
      return { x1: HAMBURGER_X_INSET, y1: VIEWBOX_SIZE / 2, x2: VIEWBOX_SIZE - HAMBURGER_X_INSET, y2: VIEWBOX_SIZE / 2 };
    case "open":
      return isBooped
        ? { x1: CLOSE_INSET, y1: VIEWBOX_SIZE - CLOSE_INSET - 2, x2: VIEWBOX_SIZE - CLOSE_INSET, y2: CLOSE_INSET + 2 }
        : { x1: CLOSE_INSET, y1: VIEWBOX_SIZE - CLOSE_INSET,     x2: VIEWBOX_SIZE - CLOSE_INSET, y2: CLOSE_INSET };
  }
}
