import type { CSSProperties } from "react";
import type { SvgDemoControl } from "@/data/svg-demos";

// A short, realistic range — real stacking bugs come from small sibling values, not from the size of the number.
const Z_INDEX_OPTIONS = ["auto", "0", "1", "2", "3"];

/*
  The everyday properties that quietly create a stacking context. Each label is also the literal declaration
  written into the live CSS, so what the reader picks is exactly what the browser receives.
*/
export const TRIGGER_STYLES: Record<string, CSSProperties> = {
  "nothing": {},
  "opacity: 0.99": { opacity: 0.99 },
  "transform: translateZ(0)": { transform: "translateZ(0)" },
  "filter: blur(0)": { filter: "blur(0)" },
  "will-change: transform": { willChange: "transform" },
  "isolation: isolate": { isolation: "isolate" }
};

/*
  Defaults reproduce the classic bug — a 9999 tooltip hidden under a z-index: 2 sibling — so the reader starts
  from the broken state and fixes it themselves.
*/
export const CONTROLS: SvgDemoControl[] = [
  { id: "cardAZ", label: "Card A z-index", type: "select", options: Z_INDEX_OPTIONS, defaultValue: "1" },
  { id: "trigger", label: "Card A also has", type: "select", options: Object.keys(TRIGGER_STYLES), defaultValue: "nothing" },
  { id: "tooltipZ", label: "Tooltip z-index (inside Card A)", type: "range", min: 0, max: 9999, defaultValue: 9999 },
  { id: "cardBZ", label: "Card B z-index", type: "select", options: Z_INDEX_OPTIONS, defaultValue: "2" }
];
