import { clamp } from "@/utils/number";
import { CORNER_NAMES } from "@/interfaces/border-radius";
import type { BorderRadiusEditorState, BorderRadiusPresetMeta, BorderRadiusShareableState, CornerName, CornerRadius, FamilyShape } from "@/interfaces/border-radius";

// Keeps a corner's radius from exceeding half the box on either axis — the same clamp a browser applies to an overflowing border-radius, done here instead so the drag pad and numeric fields never show a value the compiled shape can't actually honor.
function clampCorner(corner: CornerRadius, size: number): CornerRadius {
  const max = size / 2;
  return { h: clamp(corner.h, 0, max), v: clamp(corner.v, 0, max) };
}

function uniformCorners(value: number, size: number): Record<CornerName, CornerRadius> {
  const corner = clampCorner({ h: value, v: value }, size);
  return { topLeft: corner, topRight: corner, bottomRight: corner, bottomLeft: corner };
}

// Narrows full editor state down to the permalink/autosave-safe slice — see BorderRadiusShareableState's own comment for why `selectedCorner` is dropped.
export function toShareableState(state: BorderRadiusEditorState): BorderRadiusShareableState {
  const { family, corners, uniform, curvature, surfaceColor, pageColor, size } = state;
  return { family, corners, uniform, curvature, surfaceColor, pageColor, size };
}

export function createDefaultEditorState(): BorderRadiusEditorState {
  return {
    family: "rounded",
    corners: uniformCorners(16, 200),
    uniform: true,
    curvature: 4,
    surfaceColor: "#c98a63",
    pageColor: "#f1ede6",
    size: 200,
    selectedCorner: null
  };
}

export function setCorner(state: BorderRadiusEditorState, corner: CornerName, patch: Partial<CornerRadius>): BorderRadiusEditorState {
  if (state.uniform) return state;
  const next = clampCorner({ ...state.corners[corner], ...patch }, state.size);
  return { ...state, corners: { ...state.corners, [corner]: next } };
}

export function setUniformRadius(state: BorderRadiusEditorState, value: number): BorderRadiusEditorState {
  if (!state.uniform) return state;
  return { ...state, corners: uniformCorners(value, state.size) };
}

// Switching INTO uniform mode collapses every corner to the top-left corner's own h — an arbitrary but consistent choice (rather than, say, an average) so the collapse is easy to predict.
export function toggleUniform(state: BorderRadiusEditorState, uniform: boolean): BorderRadiusEditorState {
  if (uniform === state.uniform) return state;
  return uniform ? { ...state, uniform, corners: uniformCorners(state.corners.topLeft.h, state.size) } : { ...state, uniform };
}

export function selectCorner(state: BorderRadiusEditorState, corner: CornerName | null): BorderRadiusEditorState {
  return { ...state, selectedCorner: corner };
}

export function setCurvature(state: BorderRadiusEditorState, curvature: number): BorderRadiusEditorState {
  return { ...state, curvature: clamp(curvature, 2, 10) };
}

export function setSurfaceColor(state: BorderRadiusEditorState, color: string): BorderRadiusEditorState {
  return { ...state, surfaceColor: color };
}
export function setPageColor(state: BorderRadiusEditorState, color: string): BorderRadiusEditorState {
  return { ...state, pageColor: color };
}

// Re-clamps every corner against the new size so a shrink can't leave a stored radius bigger than the box now allows.
export function setSize(state: BorderRadiusEditorState, size: number): BorderRadiusEditorState {
  const clampedSize = Math.max(40, size);
  const corners = Object.fromEntries(CORNER_NAMES.map((name) => [name, clampCorner(state.corners[name], clampedSize)])) as Record<CornerName, CornerRadius>;
  return { ...state, size: clampedSize, corners };
}

/*
  Stamps a FamilyControls clay-lump quick shape onto the current lump. Each shape's `corners` are
  fractions of the current size (see FamilyShape's own comment), so they're scaled back out to real
  px here — against THIS state's size, not whatever size the shape's fractions were designed
  against — and re-clamped exactly like any other corner edit, so e.g. "Pill"'s fraction of 1
  reliably clamps down to a true half-size stadium radius rather than an out-of-range value.
*/
export function applyFamilyShape(state: BorderRadiusEditorState, shape: FamilyShape): BorderRadiusEditorState {
  const corners = Object.fromEntries(
    CORNER_NAMES.map((name) => [name, clampCorner({ h: shape.corners[name].h * state.size, v: shape.corners[name].v * state.size }, state.size)])
  ) as Record<CornerName, CornerRadius>;

  return { ...state, family: shape.family, curvature: shape.curvature, uniform: shape.uniform, corners, selectedCorner: null };
}

// Derives `uniform` from the preset's own corners (every corner equal to top-left) rather than carrying over whatever the editor's uniform flag happened to be — an asymmetric preset applied while uniform was still on would otherwise leave setCorner silently no-op-ing (see its own guard) and the user unable to fine-tune the very shape they just picked.
export function applyPreset(state: BorderRadiusEditorState, preset: BorderRadiusPresetMeta): BorderRadiusEditorState {
  const corners = structuredClone(preset.corners);
  const uniform = CORNER_NAMES.every((name) => corners[name].h === corners.topLeft.h && corners[name].v === corners.topLeft.v);

  return {
    ...state,
    family: preset.family,
    corners,
    uniform,
    curvature: preset.curvature,
    surfaceColor: preset.surfaceColor,
    pageColor: preset.pageColor,
    size: preset.size,
    selectedCorner: null
  };
}

export function resetBlob(): BorderRadiusEditorState {
  return createDefaultEditorState();
}
