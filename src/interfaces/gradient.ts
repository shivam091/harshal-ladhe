// A point in the editor's own 0-100 percentage space — used for radial/conic center position, independent of any other tool's own point type even though the shape matches (this tool's geometry has no relationship to any other feature's coordinate space).
export interface GradientPosition {
  x: number;
  y: number;
}

/*
  The three interpolation methods exposed in the UI. "rgb" is the label users expect, but CSS
  gradients have no such keyword — it compiles to "srgb" (see COLOR_SPACE_KEYWORDS in utils/gradient.ts).
  oklch/hsl are polar spaces (they interpolate around a hue angle), which is what unlocks the
  hue-interpolation control; rgb is rectangular and has no hue to steer.
*/
export type GradientColorSpace = "oklch" | "hsl" | "rgb";

// Which way a polar color space's hue travels between two stops — only meaningful when colorSpace is oklch/hsl.
export type GradientHueInterpolation = "shorter" | "longer" | "increasing" | "decreasing";

// One color stop. `color` is always a hex string from a native <input type="color">, matching this codebase's other hex-color-field conventions — the color-space toggle changes how the browser interpolates BETWEEN stops, not what a stop itself stores.
export interface GradientStop {
  id: string;
  color: string;
  position: number;
}

export type GradientType = "linear" | "radial" | "conic";
export type GradientRadialShape = "circle" | "ellipse";
export type GradientRadialSize = "closest-side" | "closest-corner" | "farthest-side" | "farthest-corner";

// A linear-gradient's own geometry — just the axis angle.
export interface GradientLinearConfig {
  type: "linear";
  angle: number;
}

// A radial-gradient's own geometry — its shape, sizing keyword, and center position.
export interface GradientRadialConfig {
  type: "radial";
  shape: GradientRadialShape;
  size: GradientRadialSize;
  position: GradientPosition;
}

// A conic-gradient's own geometry — a start angle plus a center position, the union of the other two configs' fields.
export interface GradientConicConfig {
  type: "conic";
  angle: number;
  position: GradientPosition;
}

// Discriminated union of every gradient function this editor can drive — `type` narrows to the matching config.
export type GradientConfig = GradientLinearConfig | GradientRadialConfig | GradientConicConfig;

// Full runtime editor state, including the ephemeral UI-only field that never round-trips through the permalink.
export interface GradientEditorState {
  config: GradientConfig;
  // Always kept sorted by position ascending — every mutator returns a re-sorted array, so both the stop list UI and compileGradientValue can rely on left-to-right order without a separate sort step.
  stops: GradientStop[];
  colorSpace: GradientColorSpace;
  hueInterpolation: GradientHueInterpolation;
  repeating: boolean;
  selectedStopId: string | null;
}

// Deliberately narrower than GradientEditorState — the only slice serialized into a permalink or localStorage autosave. Excludes `selectedStopId` (pure UI state) so a shared link never depends on what the sender happened to have clicked.
export type GradientShareableState = Omit<GradientEditorState, "selectedStopId">;

// A curated starting gradient shown in the preset gallery — colorSpace/repeating are deliberately left out so applying a preset never overrides whatever interpolation mode the user is currently exploring.
export interface GradientPresetMeta {
  slug: string;
  name: string;
  config: GradientConfig;
  stops: GradientStop[];
}

/*
  Every mutation GradientGenerator exposes to its children, bundled into one object — mirrors
  CronBuilder/RegexTester's own *Actions style so subcomponents never touch the reducer/undo-stack directly.
*/
export interface GradientActions {
  setType: (type: GradientType) => void;
  // Live angle update while dragging the dial or typing in the degrees field — does not create an undo step; pair with commitDrag on release/blur.
  setAngle: (angle: number) => void;
  // Live center-position update while dragging the position pad — pair with commitDrag on release.
  setPosition: (position: GradientPosition) => void;
  setRadialShape: (shape: GradientRadialShape) => void;
  setRadialSize: (size: GradientRadialSize) => void;
  // Checkpoints the current state onto the undo stack — call once per drag gesture or discrete edit, never per pointermove/keystroke.
  commitDrag: () => void;
  // Adds a stop at `position` (a bar double-click), or at the widest gap's midpoint when omitted (the "+ Add stop" button).
  addStop: (position?: number) => void;
  // Live color update while a color picker is open; pair with commitDrag on blur/close.
  updateStopColor: (id: string, color: string) => void;
  // Live position update while dragging a stop handle along the bar; pair with commitDrag on release.
  updateStopPosition: (id: string, position: number) => void;
  removeStop: (id: string) => void;
  selectStop: (id: string | null) => void;
  setColorSpace: (colorSpace: GradientColorSpace) => void;
  setHueInterpolation: (hueInterpolation: GradientHueInterpolation) => void;
  toggleRepeating: (repeating: boolean) => void;
  applyPreset: (preset: GradientPresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetGradient: () => void;
}

// Props for TypeControls — the gradient-function switcher plus the repeating toggle.
export interface TypeControlsProps {
  state: GradientEditorState;
  actions: GradientActions;
}

// Props for GeometryControls — whichever of AngleDial/PositionPad/shape-size selects the current type needs.
export interface GeometryControlsProps {
  state: GradientEditorState;
  actions: GradientActions;
}

// Props for AngleDial — a controlled angle in degrees, a live-change callback, and a separate commit callback fired once a drag/keypress gesture ends.
export interface AngleDialProps {
  angle: number;
  onChange: (angle: number) => void;
  onCommit: () => void;
  // Distinguishes the linear-gradient axis reading ("Direction") from the conic-gradient start angle ("Start angle") in the field's label — the dial math is identical either way.
  label: string;
}

// Props for PositionPad — a controlled center position, a live-change callback, and a separate commit callback fired once a drag/keypress gesture ends.
export interface PositionPadProps {
  position: GradientPosition;
  onChange: (position: GradientPosition) => void;
  onCommit: () => void;
}

// Props for StopEditor — the draggable stop bar plus its precise-entry list; needs the full action set since it drives most of GradientActions' stop-related mutators.
export interface StopEditorProps {
  state: GradientEditorState;
  actions: GradientActions;
}

// Props for ColorSpaceControls — the interpolation color-space/hue-direction pickers.
export interface ColorSpaceControlsProps {
  state: GradientEditorState;
  actions: GradientActions;
}

// Props for PreviewPane — the dedicated preview rectangle between the toolbar and the rest of the controls.
export interface PreviewPaneProps {
  state: GradientEditorState;
}

// Props for ExportPanel — the CSS/Tailwind/React code-export tabs; read-only.
export interface ExportPanelProps {
  state: GradientEditorState;
}

// Props for PresetGallery — only needs actions since it never reads the current state.
export interface PresetGalleryProps {
  actions: GradientActions;
}

// Props for ShareControls — the permalink readout; read-only.
export interface ShareControlsProps {
  state: GradientEditorState;
}
