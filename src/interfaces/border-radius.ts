// One corner's horizontal/vertical radius — CSS border-radius longhand models each corner as an
// ellipse quarter-arc with independent h/v, and this editor's "8-point" control is exactly those
// 4 corners × 2 axes exposed directly, rather than the single-radius shorthand most tools stop at.
export interface CornerRadius {
  h: number;
  v: number;
}

export type CornerName = "topLeft" | "topRight" | "bottomRight" | "bottomLeft";

export const CORNER_NAMES: readonly CornerName[] = ["topLeft", "topRight", "bottomRight", "bottomLeft"];

// "rounded" compiles to plain `border-radius` (circular/elliptical arcs, universal support). "squircle" compiles to a sampled superellipse `clip-path: path(...)` instead — a true continuous-curvature corner that border-radius's own arc can only approximate. See compileSquirclePath in utils/border-radius.ts.
export type BlobFamily = "rounded" | "squircle";

/*
  Full runtime editor state. surfaceColor/pageColor/size mirror BoxShadowGenerator's own
  surface/page split — a blob shape's legibility depends on seeing it against a real page-like
  background, not a bare swatch. `size` doubles as the reference box the drag pad's 0-100%
  container space is scaled against, so a corner radius always means the same px value regardless
  of how large the (responsive) preview happens to render on screen.
*/
export interface BorderRadiusEditorState {
  family: BlobFamily;
  corners: Record<CornerName, CornerRadius>;
  // When true, every corner's h and v track one shared value (the common "just round the box" case) — CornerFields collapses to one field pair instead of 8.
  uniform: boolean;
  // Superellipse exponent (Lamé's n) — 2 is a plain ellipse arc (same curve border-radius already draws), higher values pull the curve toward a flatter, more continuous "squircle" corner. Ignored in "rounded" mode.
  curvature: number;
  surfaceColor: string;
  pageColor: string;
  size: number;
  selectedCorner: CornerName | null;
}

// Deliberately narrower than BorderRadiusEditorState — the only slice serialized into a permalink. Excludes `selectedCorner` (pure UI state) so a shared link never depends on what the sender happened to have focused.
export type BorderRadiusShareableState = Omit<BorderRadiusEditorState, "selectedCorner">;

// A curated starting shape shown in the preset gallery — a plain bundle of the same fields a thumbnail needs to render itself with the exact compileBlobValue call the main preview uses.
export interface BorderRadiusPresetMeta {
  slug: string;
  name: string;
  family: BlobFamily;
  corners: Record<CornerName, CornerRadius>;
  curvature: number;
  surfaceColor: string;
  pageColor: string;
  size: number;
}

/*
  Every mutation BorderRadiusGenerator exposes to its children, bundled into one object (mirrors
  every other goodie's *Actions style) so subcomponents never touch the reducer/undo-stack directly.
*/
export interface BorderRadiusActions {
  setFamily: (family: BlobFamily) => void;
  // Live per-corner update while dragging a handle or typing a field — does not create an undo step; pair with commitDrag on release/blur. No-ops while `uniform` is true.
  setCorner: (corner: CornerName, patch: Partial<CornerRadius>) => void;
  // Live single-value update while `uniform` is true — applies to every corner's h and v alike.
  setUniformRadius: (value: number) => void;
  toggleUniform: (uniform: boolean) => void;
  selectCorner: (corner: CornerName | null) => void;
  setCurvature: (curvature: number) => void;
  setSurfaceColor: (color: string) => void;
  setPageColor: (color: string) => void;
  setSize: (size: number) => void;
  // Checkpoints the current state onto the undo stack — call once per drag gesture or discrete edit, never per pointermove/input frame.
  commitDrag: () => void;
  applyPreset: (preset: BorderRadiusPresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetBlob: () => void;
}

export interface FamilyControlsProps {
  state: BorderRadiusEditorState;
  actions: BorderRadiusActions;
}

export interface CornerFieldsProps {
  state: BorderRadiusEditorState;
  actions: BorderRadiusActions;
}

export interface PreviewPaneProps {
  state: BorderRadiusEditorState;
  actions: BorderRadiusActions;
}

export interface RadiusOverlayProps {
  state: BorderRadiusEditorState;
  actions: BorderRadiusActions;
}

export interface SurfaceControlsProps {
  state: BorderRadiusEditorState;
  actions: BorderRadiusActions;
}

export interface ExportPanelProps {
  state: BorderRadiusEditorState;
}

export interface PresetGalleryProps {
  actions: BorderRadiusActions;
}

export interface ShareControlsProps {
  state: BorderRadiusEditorState;
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
