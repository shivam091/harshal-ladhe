import type { RenderCommitPhaseId, RenderCommitGroupKind } from "@/types/render-commit-diagram";

// One phase box in the pipeline: its position, heading, and short caption.
export interface RenderCommitPhase {
  // Which stage this box represents.
  id: RenderCommitPhaseId;
  // Which group (render-phase or commit-phase) this box's color follows.
  group: RenderCommitGroupKind;
  // Bold heading shown inside the box (e.g. "Render").
  label: string;
  // Short one-line description shown under the heading (e.g. "Call components, build a tree").
  caption: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

// One background band (render phase or commit phase) drawn behind its two phase boxes.
export interface RenderCommitGroup {
  kind: RenderCommitGroupKind;
  // All-caps banner text above the band (e.g. "RENDER PHASE").
  label: string;
  // Smaller descriptive text below the band (e.g. "interruptible • no DOM access").
  sublabel: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

// Color set for one group, shared by its band, its heading text, and its two phase boxes.
export interface RenderCommitGroupStyle {
  // Fill for the group's background band.
  bandFill: string;
  // Stroke for the group's dashed band outline.
  bandStroke: string;
  // Text color for the group's banner label.
  labelColor: string;
  // Fill for this group's phase boxes.
  boxFill: string;
  // Stroke for this group's phase boxes.
  boxStroke: string;
}
