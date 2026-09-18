import { clamp } from "@/utils/number";
import type { TriangleDirection, TriangleEditorState, TriangleShape, TriangleTechnique, TrianglePresetMeta } from "@/interfaces/triangle";

export function toShareableState(state: TriangleEditorState): TriangleEditorState {
  return state;
}

export function createDefaultEditorState(): TriangleEditorState {
  return { technique: "border", direction: "up", shape: "triangle", width: 80, height: 80, notch: 25, color: "#6366f1", pageColor: "#f8fafc" };
}

// Forces the shape back to a plain triangle when leaving clip-path mode — the border trick has no way to render a chevron's concave notch, so carrying that choice into border mode would leave a widget selected that no longer does anything.
export function setTechnique(state: TriangleEditorState, technique: TriangleTechnique): TriangleEditorState {
  return { ...state, technique, shape: technique === "border" ? "triangle" : state.shape };
}

export function setDirection(state: TriangleEditorState, direction: TriangleDirection): TriangleEditorState {
  return { ...state, direction };
}

export function setShape(state: TriangleEditorState, shape: TriangleShape): TriangleEditorState {
  return { ...state, shape };
}

export function setWidth(state: TriangleEditorState, width: number): TriangleEditorState {
  return { ...state, width: clamp(width, 4, 300) };
}

export function setHeight(state: TriangleEditorState, height: number): TriangleEditorState {
  return { ...state, height: clamp(height, 4, 300) };
}

export function setNotch(state: TriangleEditorState, notch: number): TriangleEditorState {
  return { ...state, notch: clamp(notch, 5, 45) };
}

export function setColor(state: TriangleEditorState, color: string): TriangleEditorState {
  return { ...state, color };
}

export function setPageColor(state: TriangleEditorState, color: string): TriangleEditorState {
  return { ...state, pageColor: color };
}

export function applyPreset(state: TriangleEditorState, preset: TrianglePresetMeta): TriangleEditorState {
  const { technique, direction, shape, width, height, notch, color, pageColor } = preset;
  return { ...state, technique, direction, shape, width, height, notch, color, pageColor };
}

export function resetShape(): TriangleEditorState {
  return createDefaultEditorState();
}
