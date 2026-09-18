// A point in the shape's own 0-100 percentage space — matches svg-demos.ts's viewBox convention, and lets every family share one coordinate system.
export interface ClipPathPoint {
  x: number;
  y: number;
}

// A polygon vertex with no curvature — connects to its neighbors with a straight edge.
export interface ClipPathStraightVertex {
  type: "straight";
  point: ClipPathPoint;
}

/*
  A pen-tool-style vertex: handleOut feeds the outgoing edge's first control point, handleIn feeds
  the incoming edge's second control point — an edge only curves if at least one endpoint is a curve
  vertex. `mirrored` starts true (handleIn/handleOut kept as reflections through `point`, the
  Illustrator/Figma "smooth anchor" default) until an Alt-drag breaks it into an independent "corner" anchor.
*/
export interface ClipPathCurveVertex {
  type: "curve";
  point: ClipPathPoint;
  handleIn: ClipPathPoint;
  handleOut: ClipPathPoint;
  mirrored: boolean;
}

export type ClipPathVertex = ClipPathStraightVertex | ClipPathCurveVertex;

export type ClipPathShapeFamily = "polygon" | "circle" | "ellipse" | "inset";

export interface ClipPathPolygonShape {
  family: "polygon";
  vertices: ClipPathVertex[];
}

export interface ClipPathCircleShape {
  family: "circle";
  center: ClipPathPoint;
  radius: number;
}

export interface ClipPathEllipseShape {
  family: "ellipse";
  center: ClipPathPoint;
  rx: number;
  ry: number;
}

export interface ClipPathInsetShape {
  family: "inset";
  top: number;
  right: number;
  bottom: number;
  left: number;
  cornerRadius: number;
}

// Discriminated union of every shape family the editor can drive — `family` narrows to the matching shape.
export type ClipPathShape = ClipPathPolygonShape | ClipPathCircleShape | ClipPathEllipseShape | ClipPathInsetShape;

// Which handle of a vertex is currently selected/focused — drives which point keyboard-nudging and Delete act on.
export interface ClipPathSelection {
  vertexIndex: number;
  part: "point" | "handleIn" | "handleOut";
}

export type ClipPathPreviewSubject = "color" | "image" | "text";

// Two shapes' morph configuration — null until the user opts in via MorphControls.
export interface ClipPathMorphState {
  shapeB: ClipPathShape;
  enabled: boolean;
  // Scrub position [0, 1] for the editor's own live preview only — the exported @keyframes rely on the browser's native interpolation, not this value.
  t: number;
  duration: string;
  easing: string;
}

// Full runtime editor state, including ephemeral UI-only fields that never round-trip through the permalink.
export interface ClipPathEditorState {
  shape: ClipPathShape;
  morph: ClipPathMorphState | null;
  selection: ClipPathSelection | null;
  previewSubject: ClipPathPreviewSubject;
  previewColor: string;
  previewImageId: string;
  previewText: string;
}

// Deliberately narrower than ClipPathEditorState — the only slice serialized into a permalink. Excludes `selection` (pure UI state) so a shared link never depends on what the sender happened to have clicked.
export type ClipPathShareableState = Omit<ClipPathEditorState, "selection">;

// A curated (or generated) starting shape shown in the preset gallery.
export interface ClipPathPresetMeta {
  slug: string;
  name: string;
  shape: ClipPathShape;
}

/*
  Every mutation ClipPathGenerator exposes to its children, bundled into one object (mirrors
  DemoControlField's onChange callback style, just widened to the many discrete edits this editor
  supports) so subcomponents never touch the reducer/undo-stack directly.
*/
export interface ClipPathActions {
  setFamily: (family: ClipPathShapeFamily) => void;
  // Live position update while dragging — does not create an undo step; pair with commitDrag on pointerup.
  updateVertexPoint: (index: number, point: ClipPathPoint) => void;
  updateVertexHandle: (index: number, which: "handleIn" | "handleOut", point: ClipPathPoint, altKey: boolean) => void;
  // Checkpoints the current state onto the undo stack — call once per drag gesture (pointerup), never per pointermove frame.
  commitDrag: () => void;
  toggleVertexCurve: (index: number) => void;
  insertVertexAfter: (index: number, point: ClipPathPoint) => void;
  deleteVertex: (index: number) => void;
  select: (selection: ClipPathSelection | null) => void;
  updateCircle: (patch: Partial<Omit<ClipPathCircleShape, "family">>) => void;
  updateEllipse: (patch: Partial<Omit<ClipPathEllipseShape, "family">>) => void;
  updateInset: (patch: Partial<Omit<ClipPathInsetShape, "family">>) => void;
  applyPreset: (shape: ClipPathShape) => void;
  shuffle: () => void;
  setPreviewSubject: (subject: ClipPathPreviewSubject) => void;
  setPreviewColor: (color: string) => void;
  setPreviewImageId: (id: string) => void;
  setPreviewText: (text: string) => void;
  toggleMorph: (enabled: boolean) => void;
  setMorphShapeB: (shape: ClipPathShape) => void;
  setMorphT: (t: number) => void;
  setMorphDuration: (duration: string) => void;
  setMorphEasing: (easing: string) => void;
  syncMorphTopology: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetShape: () => void;
}

export interface ShapeControlsProps {
  state: ClipPathEditorState;
  actions: ClipPathActions;
}

export interface ShapeOverlayProps {
  shape: ClipPathShape;
  selection: ClipPathSelection | null;
  actions: ClipPathActions;
  // Ghost overlay of Shape B's own handles, rendered underneath the live shape while morph is enabled so both endpoints stay visible at once.
  ghostShape?: ClipPathShape | null;
}

export interface PreviewPaneProps {
  state: ClipPathEditorState;
  actions: ClipPathActions;
}

export interface ExportPanelProps {
  state: ClipPathEditorState;
}

export interface MorphControlsProps {
  state: ClipPathEditorState;
  actions: ClipPathActions;
}

export interface PresetGalleryProps {
  actions: ClipPathActions;
}

export interface ShareControlsProps {
  state: ClipPathEditorState;
}
