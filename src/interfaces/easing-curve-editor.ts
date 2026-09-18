import type { BezierPoint } from "@/types/bezier";

// Which control point is currently being dragged/focused — highlights that point's own readout row and is what arrow-key nudging acts on. Pure UI state, same treatment as every other goodie's "selected" field.
export type ControlPointName = "p1" | "p2";

// What the preview animates — easing reads very differently depending on what property it's driving (a slide "arrives," an opacity fade "resolves," a scale "pops"), which is the pedagogical point of offering more than one.
export type PreviewSubject = "slide" | "scale" | "opacity" | "rotate";

/*
  Full runtime editor state. p1/p2 mirror BezierPoint exactly (the same tuple type
  CubicBezierPlayground, EasingCurveGraph, and utils/bezier.ts already share) so this tool's curve
  math is the literal same code path the "CSS Easing Functions" post's own interactive component uses.
*/
export interface EasingCurveEditorState {
  p1: BezierPoint;
  p2: BezierPoint;
  durationMs: number;
  delayMs: number;
  // The CSS property the compiled `transition` shorthand names — "all" is the common default, but a real transition almost always targets something specific.
  property: string;
  previewSubject: PreviewSubject;
  selectedPoint: ControlPointName | null;
}

// Deliberately narrower than EasingCurveEditorState — the only slice serialized into a permalink. Excludes `selectedPoint` (pure UI state) so a shared link never depends on which handle the sender happened to have focused.
export type EasingCurveShareableState = Omit<EasingCurveEditorState, "selectedPoint">;

// A curated starting curve shown in the preset gallery — a plain {p1, p2} pair, so a thumbnail can render it with the exact same BezierGraph/buildBezierPathD call the main graph uses.
export interface EasingCurvePresetMeta {
  slug: string;
  name: string;
  p1: BezierPoint;
  p2: BezierPoint;
}

/*
  Every mutation EasingCurveEditor exposes to its children, bundled into one object (mirrors every
  other goodie's *Actions style) so subcomponents never touch the reducer/undo-stack directly.
*/
export interface EasingCurveActions {
  // Live update while dragging a handle or arrow-nudging it — does not create an undo step; pair with commitDrag on release/keyup.
  setP1: (point: BezierPoint) => void;
  setP2: (point: BezierPoint) => void;
  selectPoint: (point: ControlPointName | null) => void;
  setDurationMs: (ms: number) => void;
  setDelayMs: (ms: number) => void;
  setProperty: (property: string) => void;
  setPreviewSubject: (subject: PreviewSubject) => void;
  // Checkpoints the current state onto the undo stack — call once per drag gesture or discrete edit, never per pointermove/keydown frame.
  commitDrag: () => void;
  applyPreset: (preset: EasingCurvePresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetCurve: () => void;
}

export interface CurveGraphProps {
  state: EasingCurveEditorState;
  actions: EasingCurveActions;
}

export interface TransitionControlsProps {
  state: EasingCurveEditorState;
  actions: EasingCurveActions;
}

export interface PreviewPaneProps {
  state: EasingCurveEditorState;
}

export interface ExportPanelProps {
  state: EasingCurveEditorState;
}

export interface PresetGalleryProps {
  actions: EasingCurveActions;
}

export interface ShareControlsProps {
  state: EasingCurveEditorState;
}

export interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
  onCommit: () => void;
}
