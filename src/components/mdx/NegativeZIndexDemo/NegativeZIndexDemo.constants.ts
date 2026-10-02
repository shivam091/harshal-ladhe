import type { CSSProperties } from "react";
import type { SvgDemoControl } from "@/data/svg-demos";

/*
  The parent's options, keyed by the declaration written into the live CSS. The parent is always
  position: relative so the child's containing block — and therefore its position — never changes; only the
  stacking context does, which isolates the one variable the demo is about.
*/
export const PARENT_STYLES: Record<string, CSSProperties> = {
  "z-index: auto": {},
  "z-index: 0": { zIndex: 0 },
  "isolation: isolate": { isolation: "isolate" }
};

// Starts on `auto`, the state where the child disappears — the surprise the reader is meant to investigate.
export const CONTROLS: SvgDemoControl[] = [
  { id: "negativeParent", label: "Parent also has", type: "select", options: Object.keys(PARENT_STYLES), defaultValue: "z-index: auto" }
];
