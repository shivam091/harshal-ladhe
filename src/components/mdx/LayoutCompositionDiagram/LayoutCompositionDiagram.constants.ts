import type { LayoutCompositionState, SegmentRect } from "@/interfaces/layout-composition-diagram";

// SVG viewBox for the whole diagram — two panels, a connecting arrow, and a legend row underneath.
export const VIEWBOX = "0 0 560 340";

// Shared panel width in SVG units.
export const PANEL_WIDTH = 240;

// x origin of the left ("before") panel.
export const PANEL_A_X = 20;

// x origin of the right ("after") panel.
export const PANEL_B_X = 300;

// y position of each panel's route caption.
export const CAPTION_Y = 22;

/*
  Geometry for each nesting depth's box, outermost first — shared by both panels since only the
  label/content text differs between "viewing settings" and "viewing billing".
*/
export const SEGMENT_RECTS: SegmentRect[] = [
  { y: 38, height: 264, insetX: 0 },  // root layout — spans the full panel
  { y: 76, height: 210, insetX: 18 }, // dashboard layout — nested inside the root layout
  { y: 116, height: 154, insetX: 38 } // page — nested inside the dashboard layout
];

// y position of the leaf page's big content label — the one thing that visibly changes between states.
export const CONTENT_LABEL_Y = 250;

// y position of the connecting arrow drawn between the two panels.
export const ARROW_Y = 172;

// x span of the connecting arrow.
export const ARROW_X_START = 264;
export const ARROW_X_END = 296;

// y position of the legend row beneath both panels.
export const LEGEND_Y = 322;

// x position of the "persists" legend swatch, centered under the pair together with the "swaps" swatch.
export const LEGEND_PERSISTS_X = 150;

// x position of the "swaps" legend swatch.
export const LEGEND_SWAPS_X = 330;

/*
  The two states this diagram compares: navigating from one page to a sibling page under the SAME
  dashboard layout. Kept in sync with section 3 of the post that uses this ("Nested Layouts and
  Composition") — the root and dashboard layouts are identical file references in both states, only
  the page segment and its rendered content actually change.
*/
export const STATE_A: LayoutCompositionState = {
  route: "/dashboard/settings",
  segments: [
    { file: "app/layout.tsx", label: "Root Layout", status: "persists" },
    { file: "app/dashboard/layout.tsx", label: "Dashboard Layout", status: "persists" },
    { file: "app/dashboard/settings/page.tsx", label: "Page", status: "swaps" }
  ],
  content: "Settings form"
};

// The "after" state — same two layouts, a different sibling page.
export const STATE_B: LayoutCompositionState = {
  route: "/dashboard/billing",
  segments: [
    { file: "app/layout.tsx", label: "Root Layout", status: "persists" },
    { file: "app/dashboard/layout.tsx", label: "Dashboard Layout", status: "persists" },
    { file: "app/dashboard/billing/page.tsx", label: "Page", status: "swaps" }
  ],
  content: "Billing table"
};
