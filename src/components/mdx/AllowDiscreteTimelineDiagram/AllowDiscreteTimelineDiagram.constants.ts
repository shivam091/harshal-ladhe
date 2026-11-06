import type { AllowDiscreteRow, AllowDiscreteVariant, AllowDiscreteVariantDefinition } from "@/components/mdx/AllowDiscreteTimelineDiagram/AllowDiscreteTimelineDiagram.types";

// Marks 0% of the duration, so a flip can be read as a fraction of the transition.
export const AXIS_LEFT = 80;
// Marks 100% of the duration, where the exit flip has to land.
export const AXIS_RIGHT = 340;

// Thick enough for the fade to read as a ramp rather than a line.
export const RAMP_H = 18;

/*
  Entry flips `display` at the START of the duration (0%) so the element is present and paintable for the
  whole fade/slide in; exit flips it at the END (100%) so the element stays visible and interactive for the
  whole fade/slide out, only disappearing once the transition has actually finished.
*/
const DISPLAY_ROWS: AllowDiscreteRow[] = [
  {
    y: 80,
    heading: "Entry (closed → open)",
    direction: "in",
    flipX: AXIS_LEFT,
    flipLabel: "display: none → block",
    caption: "Flips at 0% — the element exists for the entire entrance."
  },
  {
    y: 200,
    heading: "Exit (open → closed)",
    direction: "out",
    flipX: AXIS_RIGHT,
    flipLabel: "display: block → none",
    caption: "Flips at 100% — the element stays visible until the exit finishes."
  }
];

/*
  Without overlay in the transition list, a closing dialog leaves the top layer the instant [open] is removed
  (0%), so its fade plays behind the page, if at all; listing overlay with allow-discrete holds that exit to 100%.
*/
const OVERLAY_ROWS: AllowDiscreteRow[] = [
  {
    y: 80,
    heading: "Exit without overlay in the transition",
    direction: "out",
    flipX: AXIS_LEFT,
    flipLabel: "leaves the top layer",
    caption: "Removed at 0% — the fade plays behind the page, if at all."
  },
  {
    y: 200,
    heading: "Exit with overlay 0.25s allow-discrete",
    direction: "out",
    flipX: AXIS_RIGHT,
    flipLabel: "leaves the top layer",
    caption: "Held until 100% — it stays on top until the fade finishes."
  }
];

// Registry of both row sets with the accessible text each one announces.
export const VARIANTS: Record<AllowDiscreteVariant, AllowDiscreteVariantDefinition> = {
  display: {
    title: "When display actually flips with transition-behavior: allow-discrete",
    description: "Two timelines from 0% to 100% of a transition's duration. On entry, display flips from none to block at 0%, right as the fade/slide-in transition starts, so the element is present for the whole entrance. On exit, display stays at block until 100%, only flipping to none once the fade/slide-out transition has fully finished, so the element remains visible and interactive throughout the exit.",
    rows: DISPLAY_ROWS
  },
  overlay: {
    title: "When a closing dialog leaves the top layer, with and without overlay",
    description: "Two exit timelines from 0% to 100% of a dialog's fade-out. Without overlay in the transition list, the dialog leaves the top layer at 0%, so the fade plays out behind the rest of the page. With overlay 0.25s allow-discrete, it stays in the top layer until 100%, so the whole fade is visible on top.",
    rows: OVERLAY_ROWS
  }
};
