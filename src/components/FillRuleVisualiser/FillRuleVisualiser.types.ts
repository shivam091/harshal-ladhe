import type { PointerEvent as ReactPointerEvent } from "react";

// A bare coordinate in the light table's 400 × 400 viewBox — shared by anchors, control points and ray hits.
export interface FillRulePoint {
  x: number;
  y: number;
}

/*
  One anchor of a subpath. The optional c1/c2 pair are the control points of the cubic arriving at
  this anchor from the previous one (c1 near the previous anchor, c2 near this one); a node without
  them is reached by a straight line. Every pasted command — lines, quadratics, arcs — normalises to
  this one shape, so dragging, reversing and flattening only ever deal with lines and cubics.
*/
export interface FillRuleNode extends FillRulePoint {
  c1?: FillRulePoint;
  c2?: FillRulePoint;
}

// One closed piece of lead came. Node 0's controls describe the closing edge, because fill always treats a subpath as closed.
export interface FillRuleSubpath {
  nodes: FillRuleNode[];
}

// The undoable part of the tool: just the geometry, so undo rewinds what was drawn rather than where the ray happened to be.
export interface FillRuleEditorState {
  subpaths: FillRuleSubpath[];
}

// The two values of the SVG fill-rule / clip-rule property this tool compares.
export type FillRuleName = "nonzero" | "evenodd";

// How the two rules share the light table: two panels, one panel cut down a movable seam, or one panel with the disagreement hatched.
export type FillRuleViewMode = "side" | "split" | "overlay";

// What a click on empty glass does — add a point to the active subpath, or pin the plumb line there.
export type FillRuleTool = "draw" | "probe";

// The plumb line: an origin plus a direction in degrees (0 = right, clockwise positive, as on screen).
export interface FillRuleProbe {
  x: number;
  y: number;
  angle: number;
}

// Presentation settings that travel in permalinks but stay out of undo history.
export interface FillRuleViewSettings {
  mode: FillRuleViewMode;
  windingMap: boolean;
  arrows: boolean;
  // Seam position for split mode, in viewBox units.
  split: number;
}

// Everything a permalink or the autosave needs to rebuild the exact same table.
export interface FillRuleShareableState {
  subpaths: FillRuleSubpath[];
  probe: FillRuleProbe;
  view: FillRuleViewSettings;
}

// Which handle is focused or being dragged — an anchor, or one of the two control points either side of it.
export interface FillRuleSelection {
  subpath: number;
  node: number;
}

// The flattened polygon for one subpath, kept with its index so ray hits can say which piece of came they struck.
export interface FillRuleFlatSubpath {
  subpath: number;
  points: FillRulePoint[];
}

// One place where the plumb line crosses the came, with everything the readout and the diagram need to explain it.
export interface FillRuleCrossing extends FillRulePoint {
  // Distance from the ray's origin, for sorting crossings into the order the ray meets them.
  distance: number;
  sign: 1 | -1;
  subpath: number;
  // Direction the edge is drawn at the crossing, in degrees — what the ±1 arrow shows.
  tangent: number;
  // Winding number accumulated after this crossing, read outwards from the origin.
  running: number;
}

// The result of casting one ray: every crossing, the winding number, the raw count and both rules' verdicts.
export interface FillRuleRayResult {
  crossings: FillRuleCrossing[];
  winding: number;
  count: number;
  nonzeroInside: boolean;
  evenoddInside: boolean;
}

// The winding-map buckets that get their own tint — anything beyond ±2 shares the outermost colour.
export type FillRuleWindingBucket = "-2" | "-1" | "1" | "2";

/*
  Scanline output for the winding map: one path of row runs per winding bucket, plus the runs a
  ray says are enclosed (winding ≠ 0) yet left empty by evenodd — the regions the two rules argue about.
*/
export interface FillRuleWindingMap {
  tints: Record<FillRuleWindingBucket, string>;
  evenEnclosed: string;
}

// A direction chevron placed along a subpath's came, so drawing order is visible without casting a ray.
export interface FillRuleDirectionArrow extends FillRulePoint {
  angle: number;
  subpath: number;
}

// Everything derived from the geometry once per change and shared by every panel.
export interface FillRuleGeometry {
  d: string;
  flat: FillRuleFlatSubpath[];
  map: FillRuleWindingMap;
  arrows: FillRuleDirectionArrow[];
  // Signed area per subpath — positive is clockwise on screen, which is what makes nonzero count +1.
  areas: number[];
}

// Outcome of parsing a pasted d string — the error message is shown beside the textarea rather than thrown.
export type FillRuleParseResult = { ok: true; subpaths: FillRuleSubpath[] } | { ok: false; error: string };

// A curated starting window in the preset gallery, with a ray already placed where the rules disagree.
export interface FillRulePreset {
  slug: string;
  name: string;
  blurb: string;
  d: string;
  probe: FillRuleProbe;
}

// One export tab: its label, the Shiki language and the formatter that turns the path into code.
export interface FillRuleExportFormat {
  id: "svg" | "css" | "clip-path" | "jsx";
  label: string;
  language: string;
  build: (d: string, rule: FillRuleName) => string;
}

/*
  Every mutation the root exposes to its children, bundled into one object (mirroring the other
  goodies' *Actions) so subcomponents never touch the undo stack or the probe state directly.
*/
export interface FillRuleActions {
  // Live update during a pointer drag — no undo entry until commitDrag.
  moveNode: (subpath: number, node: number, point: FillRulePoint) => void;
  // Live update for one control point; `which` names the slot on the given node.
  moveControl: (subpath: number, node: number, which: "c1" | "c2", point: FillRulePoint) => void;
  // A whole keyboard nudge as one undo step.
  nudgeNode: (subpath: number, node: number, dx: number, dy: number) => void;
  commitDrag: () => void;
  addNode: (point: FillRulePoint) => void;
  deleteNode: (subpath: number, node: number) => void;
  toggleCurve: (subpath: number, node: number) => void;
  addSubpath: () => void;
  deleteSubpath: (subpath: number) => void;
  reverseSubpath: (subpath: number) => void;
  setActiveSubpath: (subpath: number) => void;
  select: (selection: FillRuleSelection | null) => void;
  applyPathData: (subpaths: FillRuleSubpath[]) => void;
  applyPreset: (preset: FillRulePreset) => void;
  setProbe: (probe: FillRuleProbe) => void;
  setHoverProbe: (point: FillRulePoint | null) => void;
  setTool: (tool: FillRuleTool) => void;
  setView: (view: Partial<FillRuleViewSettings>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  reset: () => void;
}

// What a panel draws: one rule on its own, both rules cut down a seam, or both stacked in one pane.
export type FillRulePanelVariant = FillRuleName | "split" | "overlay";

export interface GlassPanelProps {
  variant: FillRulePanelVariant;
  // Only the first panel takes keyboard focus, so side-by-side mode never doubles the tab stops.
  primary: boolean;
  subpaths: FillRuleSubpath[];
  geometry: FillRuleGeometry;
  probe: FillRuleProbe;
  ray: FillRuleRayResult;
  view: FillRuleViewSettings;
  tool: FillRuleTool;
  activeSubpath: number;
  selection: FillRuleSelection | null;
  actions: FillRuleActions;
}

export interface RayReadoutProps {
  probe: FillRuleProbe;
  ray: FillRuleRayResult;
  // The pinned ray's summary — announced politely, unlike the hover preview, which would chatter.
  announcement: string;
  previewing: boolean;
}

export interface TallyMarksProps {
  count: number;
}

export interface PathControlsProps {
  subpaths: FillRuleSubpath[];
  geometry: FillRuleGeometry;
  activeSubpath: number;
  selection: FillRuleSelection | null;
  tool: FillRuleTool;
  actions: FillRuleActions;
}

export interface ViewControlsProps {
  view: FillRuleViewSettings;
  probe: FillRuleProbe;
  actions: FillRuleActions;
}

export interface PresetGalleryProps {
  actions: FillRuleActions;
}

export interface ExportPanelProps {
  d: string;
}

export interface ShareControlsProps {
  state: FillRuleShareableState;
}

// The shared pointer-down starter from usePointDrag, typed once so panel subparts can accept it.
export type FillRuleStartDrag = (id: string) => (event: ReactPointerEvent) => void;
