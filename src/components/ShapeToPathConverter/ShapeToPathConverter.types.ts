// A coordinate in the canvas's user units, the unitless grid a `viewBox` defines.
export interface ShapePoint {
  x: number;
  y: number;
}

// The six basic shape elements the converter understands, named as their SVG tags.
export type ShapeKind = "rect" | "circle" | "ellipse" | "line" | "polyline" | "polygon";

/*
  A `<rect>` as authored. `rx`/`ry` stay null when the attribute is absent ("auto"), because an
  absent radius mirrors the other one, and that rule needs to see the gap rather than a zero.
*/
export interface RectShape {
  kind: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number | null;
  ry: number | null;
}

// A `<circle>`: a centre point and one radius.
export interface CircleShape {
  kind: "circle";
  cx: number;
  cy: number;
  r: number;
}

// An `<ellipse>`: a centre point and separate horizontal/vertical radii.
export interface EllipseShape {
  kind: "ellipse";
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

// A `<line>`: two points, start and end.
export interface LineShape {
  kind: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// A `<polyline>` or `<polygon>`; the two share one points list and differ only in automatic closure.
export interface PointsShape {
  kind: "polyline" | "polygon";
  points: ShapePoint[];
}

// Any one supported shape, discriminated on its tag name.
export type Shape = RectShape | CircleShape | EllipseShape | LineShape | PointsShape;

// One stored shape per kind, so flicking between tabs never throws away the attributes someone set up.
export interface ShapeLibrary {
  rect: RectShape;
  circle: CircleShape;
  ellipse: EllipseShape;
  line: LineShape;
  polyline: PointsShape;
  polygon: PointsShape;
}

// Whether path commands are written with absolute (upper-case) or relative (lower-case) coordinates.
export type PathCoordinateMode = "absolute" | "relative";

// The command letters the conversions ever emit; every basic shape reduces to these six.
export type PathCommandLetter = "M" | "L" | "H" | "V" | "A" | "Z";

// The extra parameters an elliptical arc carries beyond its end point.
export interface PathArcParams {
  rx: number;
  ry: number;
  largeArc: 0 | 1;
  sweep: 0 | 1;
}

/*
  One numbered line of working: a single path command in absolute terms, plus where the pen was
  before it, so the same step can be printed absolute or relative and drawn on its own.
*/
export interface PathStep {
  command: PathCommandLetter;
  from: ShapePoint;
  to: ShapePoint;
  arc?: PathArcParams;
  explanation: string;
}

/*
  A full conversion: the steps, plus the "Given" and rule lines worked out before the first
  command (radius clamping, auto mirroring, why two arcs) and anything that stops it rendering.
*/
export interface ShapeConversion {
  steps: PathStep[];
  working: string[];
  warning: string | null;
}

// Axis-aligned extents used to show that the shape and its path cover exactly the same area.
export interface ShapeBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

// One shape tag found in pasted markup, its conversion (when it has one) and why it was skipped otherwise.
export interface PastedShapeResult {
  kind: ShapeKind;
  source: string;
  shape: Shape | null;
  d: string | null;
  warning: string | null;
}

// The whole paste conversion: the rewritten markup plus a per-tag report.
export interface PasteConversion {
  output: string;
  results: PastedShapeResult[];
}

/*
  Full runtime editor state. The pasted markup, the hovered step and the scrubber position stay
  outside it, because undo should rewind the geometry, not where the pointer happened to be.
*/
export interface ShapeToPathEditorState {
  kind: ShapeKind;
  shapes: ShapeLibrary;
  mode: PathCoordinateMode;
  precision: number;
}

// The whole editor state is shareable; aliased so a future UI-only field has an obvious place to be left out.
export type ShapeToPathShareableState = ShapeToPathEditorState;

// A worked example in the preset gallery, loaded straight onto its own shape tab.
export interface ShapePresetMeta {
  slug: string;
  name: string;
  shape: Shape;
}

/*
  Every mutation the converter exposes to its children, bundled into one object (the same *Actions
  style as every other goodie) so subcomponents never touch the undo stack directly.
*/
export interface ShapeToPathActions {
  setKind: (kind: ShapeKind) => void;
  // Live update during a drag or while typing; pair with commitEdit once the gesture settles.
  setShape: (shape: Shape) => void;
  // Swaps in a whole shape as one undo step, from a preset or a pasted tag.
  loadShape: (shape: Shape) => void;
  commitEdit: () => void;
  setMode: (mode: PathCoordinateMode) => void;
  setPrecision: (precision: number) => void;
  applyPreset: (preset: ShapePresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetShape: () => void;
}

export interface ShapeControlsProps {
  state: ShapeToPathEditorState;
  actions: ShapeToPathActions;
}

// How a handle is drawn: a ruler-edge square for a position, a diamond for a radius, a crosshair for a centre.
export type CanvasHandleVariant = "square" | "diamond" | "centre";

// One draggable, keyboard-nudgeable handle on the canvas, with the accessible name read out for it.
export interface CanvasHandle {
  id: string;
  point: ShapePoint;
  label: string;
  variant: CanvasHandleVariant;
}

export interface ExerciseCanvasProps {
  shape: Shape;
  conversion: ShapeConversion;
  mode: PathCoordinateMode;
  precision: number;
  // How many steps the scrubber has drawn so far.
  progress: number;
  hoveredStep: number | null;
  actions: ShapeToPathActions;
}

export interface WorkingOutProps {
  conversion: ShapeConversion;
  mode: PathCoordinateMode;
  precision: number;
  progress: number;
  hoveredStep: number | null;
  onProgressChange: (progress: number) => void;
  onHoverStep: (index: number | null) => void;
}

export interface PasteConverterProps {
  mode: PathCoordinateMode;
  precision: number;
  actions: ShapeToPathActions;
}

export interface ExportPanelProps {
  shape: Shape;
  d: string;
}

export interface PresetGalleryProps {
  actions: ShapeToPathActions;
}

export interface ShareControlsProps {
  state: ShapeToPathEditorState;
}

// One numeric attribute input; `disabled` greys it out while an rx/ry is left on auto.
export interface NumberFieldProps {
  label: string;
  value: number;
  min?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
  onCommit: () => void;
}

export interface PointsEditorProps {
  shape: PointsShape;
  actions: ShapeToPathActions;
}
