import type { SvgPathPoint, SvgPathVertex } from "@/interfaces/svg-path";

// Aliased from the SVG Path Generator's own model so the shared `compilePathData` builds this tool's track without a conversion step.
export type MotionPathPoint = SvgPathPoint;

// One track pin plus its optional curve handles — the same pen-tool vertex the SVG Path Generator edits.
export type MotionPathVertex = SvgPathVertex;

// Whether a freshly laid pin bends the track smoothly or makes a sharp corner — the pen tool's two drawing habits.
export type MotionPathPenMode = "smooth" | "corner";

// The rolling stock on offer; "custom" swaps the drawn glyph for whatever emoji or short text someone types.
export type MotionPathGlyph = "loco" | "arrow" | "plane" | "dot" | "car" | "custom";

// CSS's own animation-direction keywords, minus alternate-reverse, which SMIL can only fake with a doubled duration anyway.
export type MotionPathDirection = "normal" | "reverse" | "alternate";

// How the element faces along the track: follow the tangent, follow it backwards, or hold one fixed heading.
export type MotionPathRotateMode = "auto" | "auto-reverse" | "fixed";

// The timing keywords on the controller's easing switch, plus "custom" once someone types their own cubic-bezier.
export type MotionPathEasingKeyword = "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "custom";

// cubic-bezier(x1, y1, x2, y2) — kept inside 0–1 on both axes because SMIL's keySplines refuse anything outside it.
export type MotionPathBezier = [number, number, number, number];

// Which pin or handle has focus, so arrow keys and Delete know what to act on.
export interface MotionPathSelection {
  vertexIndex: number;
  part: "point" | "handleIn" | "handleOut";
}

/*
  Full runtime editor state. Coordinates are in the baseboard's own 480 × 300 user units, which
  double as CSS pixels inside the preview's unscaled stage — so the path string exported for
  offset-path is exactly the one the preview runs.
*/
export interface MotionPathEditorState {
  vertices: MotionPathVertex[];
  closed: boolean;
  penMode: MotionPathPenMode;
  selection: MotionPathSelection | null;
  glyph: MotionPathGlyph;
  customGlyph: string;
  // Seconds per iteration.
  duration: number;
  // Seconds before the first departure.
  delay: number;
  iterations: number;
  infinite: boolean;
  direction: MotionPathDirection;
  rotateMode: MotionPathRotateMode;
  // Degrees; only read when rotateMode is "fixed".
  rotateAngle: number;
  easing: MotionPathEasingKeyword;
  bezier: MotionPathBezier;
  // offset-anchor as percentages of the element's own box.
  anchorX: number;
  anchorY: number;
  // offset-distance range in percent of the path length.
  startDistance: number;
  endDistance: number;
}

// Everything except the UI-only selection — what a permalink and the autosave carry.
export type MotionPathShareableState = Omit<MotionPathEditorState, "selection">;

// The timetable and rolling-stock fields — what a preset may override without touching the drawing tools.
export type MotionPathSettings = Omit<MotionPathShareableState, "vertices" | "closed" | "penMode">;

// A ready-made layout in the preset gallery, bringing its own track and, optionally, the run that suits it.
export interface MotionPathPresetMeta {
  slug: string;
  name: string;
  vertices: MotionPathVertex[];
  closed: boolean;
  settings: Partial<MotionPathSettings>;
}

// A point on the track with the tangent heading there (degrees, clockwise from +x) — what a ghost marker or direction chevron needs.
export interface MotionPathSample {
  x: number;
  y: number;
  angle: number;
}

// The track flattened into a polyline with running lengths, so any fraction of the journey maps to a point without re-solving the Béziers.
export interface MotionPathFlattened {
  points: MotionPathPoint[];
  lengths: number[];
  total: number;
}

// What pasting a `d` string yields: a track ready to load, or a reason it couldn't be laid.
export type MotionPathParseResult =
  | { ok: true; vertices: MotionPathVertex[]; closed: boolean; fitted: boolean }
  | { ok: false; error: string };

// One primitive of a glyph drawing — enough to render it as JSX and as SVG markup from the same data.
export interface MotionPathGlyphShape {
  tag: "path" | "circle" | "rect";
  attrs: Record<string, string | number>;
  // Detail parts (wheels, windows) are drawn at reduced opacity so the silhouette still reads in one colour.
  detail?: boolean;
}

// Which code the export panel is showing.
export type MotionPathExportFormat = "css" | "smil" | "react";

/*
  Every mutation MotionPathBuilder exposes to its children, bundled into one object (the same
  *Actions shape every other goodie uses) so subcomponents never touch the undo stack directly.
*/
export interface MotionPathActions {
  // Live update while a pin drags — pair with commitEdit on release.
  updateVertexPoint: (index: number, point: MotionPathPoint) => void;
  updateVertexHandle: (index: number, which: "handleIn" | "handleOut", point: MotionPathPoint, altKey: boolean) => void;
  // Checkpoints the current state onto the undo stack — once per drag, slider gesture or nudge.
  commitEdit: () => void;
  toggleVertexCurve: (index: number) => void;
  insertVertexAfter: (index: number, point: MotionPathPoint) => void;
  appendVertex: (point: MotionPathPoint) => void;
  // Lays a new pin a short way beyond the last one — the keyboard route to extending the track.
  extendTrack: () => void;
  deleteVertex: (index: number) => void;
  select: (selection: MotionPathSelection | null) => void;
  setPenMode: (mode: MotionPathPenMode) => void;
  toggleClosed: () => void;
  loadPath: (vertices: MotionPathVertex[], closed: boolean) => void;
  // Live setting change (slider drag, dial turn) — no undo entry until commitEdit.
  previewSetting: <K extends keyof MotionPathSettings>(key: K, value: MotionPathSettings[K]) => void;
  // Discrete setting change (radio, select, toggle) — its own undo step straight away.
  applySetting: <K extends keyof MotionPathSettings>(key: K, value: MotionPathSettings[K]) => void;
  setEasingKeyword: (keyword: Exclude<MotionPathEasingKeyword, "custom">) => void;
  setBezierValue: (index: number, value: number) => void;
  applyPreset: (preset: MotionPathPresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetLayout: () => void;
}

export interface BaseboardProps {
  state: MotionPathEditorState;
  actions: MotionPathActions;
}

export interface PlaybackBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  onScrub: (fraction: number) => void;
  // Callback ref for the scrub input, so the animation loop can move its thumb without re-rendering React every frame.
  scrubRef: (element: HTMLInputElement | null) => void;
  // Callback ref for the elapsed-time readout, updated the same way.
  readoutRef: (element: HTMLOutputElement | null) => void;
}

export interface PathControlsProps {
  state: MotionPathEditorState;
  actions: MotionPathActions;
}

export interface ControllerPanelProps {
  state: MotionPathEditorState;
  actions: MotionPathActions;
}

export interface EasingControlsProps {
  state: MotionPathEditorState;
  actions: MotionPathActions;
}

export interface RollingStockProps {
  state: MotionPathEditorState;
  actions: MotionPathActions;
}

export interface ExportPanelProps {
  state: MotionPathEditorState;
}

export interface PresetGalleryProps {
  actions: MotionPathActions;
}

export interface ShareControlsProps {
  state: MotionPathEditorState;
}

export interface GlyphProps {
  glyph: MotionPathGlyph;
  customGlyph: string;
}

export interface SpeedDialProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  // Spoken alongside the number, e.g. "seconds per run".
  unit: string;
  onChange: (value: number) => void;
  onCommit: () => void;
}

export interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  step?: number;
  decimals?: number;
  suffix?: string;
  onChange: (value: number) => void;
  onCommit: () => void;
}

// A pin as the parser builds it — handles stay null until a curve segment actually supplies one.
export interface DraftVertex {
  point: MotionPathPoint;
  handleIn: MotionPathPoint | null;
  handleOut: MotionPathPoint | null;
}
