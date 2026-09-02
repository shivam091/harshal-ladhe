import { clamp } from "@/utils/number";
import type { BezierPoint } from "@/types/bezier";
import type { ControlPointName, EasingCurveEditorState, EasingCurvePresetMeta, EasingCurveShareableState } from "@/interfaces/easing-curve-editor";

// x (time) is spec-clamped to [0,1]; y (progress) is allowed further out to [-1, 2] so overshoot/anticipation curves stay draggable — same bounds CubicBezierPlayground's own drag and arrow-key handlers already use.
function clampPoint(point: BezierPoint): BezierPoint {
  return [clamp(point[0], 0, 1), clamp(point[1], -1, 2)];
}

export function toShareableState(state: EasingCurveEditorState): EasingCurveShareableState {
  const { p1, p2, durationMs, delayMs, property, previewSubject } = state;
  return { p1, p2, durationMs, delayMs, property, previewSubject };
}

export function createDefaultEditorState(): EasingCurveEditorState {
  return {
    p1: [0.65, 0],
    p2: [0.35, 1],
    durationMs: 300,
    delayMs: 0,
    property: "transform",
    previewSubject: "slide",
    selectedPoint: "p1"
  };
}

export function setP1(state: EasingCurveEditorState, point: BezierPoint): EasingCurveEditorState {
  return { ...state, p1: clampPoint(point) };
}
export function setP2(state: EasingCurveEditorState, point: BezierPoint): EasingCurveEditorState {
  return { ...state, p2: clampPoint(point) };
}
export function selectPoint(state: EasingCurveEditorState, point: ControlPointName | null): EasingCurveEditorState {
  return { ...state, selectedPoint: point };
}
export function setDurationMs(state: EasingCurveEditorState, durationMs: number): EasingCurveEditorState {
  return { ...state, durationMs: Math.max(0, durationMs) };
}
export function setDelayMs(state: EasingCurveEditorState, delayMs: number): EasingCurveEditorState {
  return { ...state, delayMs: Math.max(0, delayMs) };
}
export function setProperty(state: EasingCurveEditorState, property: string): EasingCurveEditorState {
  return { ...state, property };
}
export function setPreviewSubject(state: EasingCurveEditorState, previewSubject: EasingCurveEditorState["previewSubject"]): EasingCurveEditorState {
  return { ...state, previewSubject };
}

export function applyPreset(state: EasingCurveEditorState, preset: EasingCurvePresetMeta): EasingCurveEditorState {
  return { ...state, p1: [...preset.p1], p2: [...preset.p2] };
}

export function resetCurve(): EasingCurveEditorState {
  return createDefaultEditorState();
}
