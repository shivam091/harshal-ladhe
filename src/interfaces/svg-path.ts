// A point in the path's own 0-100 percentage space — matches clip-path.ts's convention, and lets the
// same 0-100 viewBox drive both the live preview and the draggable overlay.
export interface SvgPathPoint {
  x: number;
  y: number;
}

// A path vertex with no curvature — connects to its neighbors with a straight edge.
export interface SvgPathStraightVertex {
  type: "straight";
  point: SvgPathPoint;
}

/*
  A pen-tool-style vertex: handleOut feeds the outgoing edge's first control point, handleIn feeds
  the incoming edge's second control point — an edge only curves if at least one endpoint is a curve
  vertex. `mirrored` starts true (handleIn/handleOut kept as reflections through `point`, the
  Illustrator/Figma "smooth anchor" default) until an Alt-drag breaks it into an independent "corner" anchor.
*/
export interface SvgPathCurveVertex {
  type: "curve";
  point: SvgPathPoint;
  handleIn: SvgPathPoint;
  handleOut: SvgPathPoint;
  mirrored: boolean;
}

export type SvgPathVertex = SvgPathStraightVertex | SvgPathCurveVertex;

export type SvgLineCap = "butt" | "round" | "square";
export type SvgLineJoin = "miter" | "round" | "bevel";

// Which handle of a vertex is currently selected/focused — drives which point keyboard-nudging and Delete act on.
export interface SvgPathSelection {
  vertexIndex: number;
  part: "point" | "handleIn" | "handleOut";
}

// Full runtime editor state, including ephemeral UI-only fields that never round-trip through the permalink.
export interface SvgPathEditorState {
  vertices: SvgPathVertex[];
  // Whether the path loops back to its first vertex (adds a trailing Z) — off by default, since an
  // open stroke is the case clip-path's always-closed polygon model can't represent at all.
  closed: boolean;
  selection: SvgPathSelection | null;
  strokeColor: string;
  strokeWidth: number;
  lineCap: SvgLineCap;
  lineJoin: SvgLineJoin;
  fillEnabled: boolean;
  fillColor: string;
}

// Deliberately narrower than SvgPathEditorState — the only slice serialized into a permalink. Excludes
// `selection` (pure UI state) so a shared link never depends on what the sender happened to have clicked.
export type SvgPathShareableState = Omit<SvgPathEditorState, "selection">;

// A curated (or generated) starting path shown in the preset gallery.
export interface SvgPathPresetMeta {
  slug: string;
  name: string;
  vertices: SvgPathVertex[];
  closed: boolean;
}

/*
  Every mutation SvgPathGenerator exposes to its children, bundled into one object (mirrors
  ClipPathActions' style) so subcomponents never touch the reducer/undo-stack directly.
*/
export interface SvgPathActions {
  // Live position update while dragging — does not create an undo step; pair with commitDrag on pointerup.
  updateVertexPoint: (index: number, point: SvgPathPoint) => void;
  updateVertexHandle: (index: number, which: "handleIn" | "handleOut", point: SvgPathPoint, altKey: boolean) => void;
  // Checkpoints the current state onto the undo stack — call once per drag gesture (pointerup), never per pointermove frame.
  commitDrag: () => void;
  toggleVertexCurve: (index: number) => void;
  // Splits the edge under the click — always between two EXISTING vertices.
  insertVertexAfter: (index: number, point: SvgPathPoint) => void;
  // Extends the path with a new vertex after its last point — the "click empty canvas to keep drawing" pen-tool gesture, which a closed clip-path shape never needs.
  appendVertex: (point: SvgPathPoint) => void;
  deleteVertex: (index: number) => void;
  select: (selection: SvgPathSelection | null) => void;
  toggleClosed: () => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setLineCap: (cap: SvgLineCap) => void;
  setLineJoin: (join: SvgLineJoin) => void;
  setFillEnabled: (enabled: boolean) => void;
  setFillColor: (color: string) => void;
  applyPreset: (preset: SvgPathPresetMeta) => void;
  shuffle: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetPath: () => void;
}

export interface PathControlsProps {
  state: SvgPathEditorState;
  actions: SvgPathActions;
}

export interface PathOverlayProps {
  vertices: SvgPathVertex[];
  closed: boolean;
  selection: SvgPathSelection | null;
  actions: SvgPathActions;
}

export interface PreviewPaneProps {
  state: SvgPathEditorState;
  actions: SvgPathActions;
}

export interface ExportPanelProps {
  state: SvgPathEditorState;
}

export interface PresetGalleryProps {
  actions: SvgPathActions;
}

export interface ShareControlsProps {
  state: SvgPathEditorState;
}
