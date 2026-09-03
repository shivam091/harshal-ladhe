import type { CanvasRenderLoopArrow, CanvasRenderLoopArrowTone, CanvasRenderLoopBox } from "@/components/mdx/CanvasRenderLoopDiagram/CanvasRenderLoopDiagram.types";

// Code-named steps read as real calls only in monospace.
export const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

// Shared height of every step box, so both lanes read as the same kind of step.
export const BOX_H = 40;

// Stroke colour and arrowhead marker per arrow tone, keeping each lane's return arrow in its own accent.
export const ARROW_TONES: Record<CanvasRenderLoopArrowTone, { stroke: string; marker: string }> = {
  muted: { stroke: "var(--color-fg-muted)", marker: "canvas-render-loop-arrow-muted" },
  danger: { stroke: "var(--color-fg-danger)", marker: "canvas-render-loop-arrow-danger" },
  success: { stroke: "var(--color-fg-success)", marker: "canvas-render-loop-arrow-success" }
};

// Snakes over two rows so the four React-owned steps form one block that a single tint can mark out.
export const STATE_LOOP_BOXES: CanvasRenderLoopBox[] = [
  { x: 31, y: 72, w: 180, label: "requestAnimationFrame", mono: true },
  { x: 247, y: 72, w: 110, label: "setX()", mono: true },
  { x: 393, y: 72, w: 110, label: "re-render", mono: false },
  { x: 539, y: 72, w: 110, label: "reconcile", mono: false },
  { x: 539, y: 150, w: 110, label: "commit", mono: false },
  { x: 393, y: 150, w: 110, label: "useEffect", mono: true },
  { x: 247, y: 150, w: 110, label: "draw", mono: false }
];

// Ends with a return arrow, because this whole pipeline repeats on every frame.
export const STATE_LOOP_ARROWS: CanvasRenderLoopArrow[] = [
  { d: "M213,92 H245", tone: "muted" },
  { d: "M359,92 H391", tone: "muted" },
  { d: "M505,92 H537", tone: "muted" },
  { d: "M594,114 V148", tone: "muted" },
  { d: "M537,170 H505", tone: "muted" },
  { d: "M391,170 H359", tone: "muted" },
  { d: "M245,170 H121 V114", tone: "danger" }
];

// Same box sizes as the useState loop, so the missing React work is obvious by comparison.
export const REF_LOOP_BOXES: CanvasRenderLoopBox[] = [
  { x: 31, y: 300, w: 180, label: "requestAnimationFrame", mono: true },
  { x: 247, y: 300, w: 110, label: "x += dx", mono: true },
  { x: 393, y: 300, w: 110, label: "draw", mono: false }
];

// Ends with a return arrow, because even the lean loop repeats on every frame.
export const REF_LOOP_ARROWS: CanvasRenderLoopArrow[] = [
  { d: "M213,320 H245", tone: "muted" },
  { d: "M359,320 H391", tone: "muted" },
  { d: "M448,342 V366 H121 V342", tone: "success" }
];
