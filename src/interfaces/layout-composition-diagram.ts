import type { SegmentStatus } from "@/types/layout-composition-diagram";

// One nested route segment (a layout or the leaf page) drawn as a box within a state panel.
export interface LayoutSegment {
  // Special-file path shown as the box's monospace subtitle, e.g. "app/dashboard/layout.tsx".
  file: string;
  // Human-readable title shown above the file path, e.g. "Dashboard Layout".
  label: string;
  // Whether this segment stays mounted (persists) or is torn down and remounted (swaps) across the navigation this diagram illustrates.
  status: SegmentStatus;
}

// One of the two side-by-side states this diagram compares — before and after a same-layout navigation.
export interface LayoutCompositionState {
  // Route caption shown above the panel, e.g. "/dashboard/settings".
  route: string;
  // Nested segments for this state, outermost (root layout) first, innermost (page) last.
  segments: LayoutSegment[];
  // The leaf page's rendered content label, e.g. "Settings form" — the one thing that visibly changes between states.
  content: string;
}

// Fixed pixel geometry for one nesting depth's box, shared by both state panels (only the label/content text differs).
export interface SegmentRect {
  // SVG y coordinate of the box's top edge.
  y: number;
  // Box height in SVG units.
  height: number;
  // Horizontal inset from the panel's left/right edges — deeper segments are inset further, producing the nested look.
  insetX: number;
}

// Props for SegmentBox — renders one nested segment's rect, title, and file-path subtitle at a given panel position.
export interface SegmentBoxProps {
  // Panel-relative rect resolved from this segment's depth (via SEGMENT_RECTS) plus the panel's x origin.
  x: number;
  y: number;
  width: number;
  height: number;
  // The segment data (label, file, status) to render inside this box.
  segment: LayoutSegment;
}
