// One absolute cubic bézier segment; its start is implied by the previous segment's end (or the subpath's start), exactly like a `C` command.
export interface CubicSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x: number;
  y: number;
}

// A run of cubics from one moveto — the unit that gets padded, subdivided, rotated and reversed independently of its siblings.
export interface CubicSubpath {
  startX: number;
  startY: number;
  segments: CubicSegment[];
  // Ends in `Z` — closed subpaths are the only ones whose start point can be rotated without changing the drawing.
  closed: boolean;
}

// A bare coordinate pair — the matcher's own, so it doesn't lean on another goodie's 0–100 point convention.
export interface MorphPoint {
  x: number;
  y: number;
}

// An on-curve point tagged with its subpath, so the flasks can colour matched points and ring each subpath's start.
export interface MorphAnchor extends MorphPoint {
  subpath: number;
  first: boolean;
}

// An axis-aligned box in path units — for viewBox fitting and subpath pairing.
export interface MorphBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

// The gist of a subpath for pairing across keyframes: where it sits and roughly how big it is.
export interface SubpathSignature {
  cx: number;
  cy: number;
  size: number;
}

// How one subpath was turned to line up with its predecessor — how many segments its start moved, and whether it runs backwards.
export interface SubpathAlignment {
  rotation: number;
  reversed: boolean;
}

// A whole path normalised to nothing but M/C/Z, so two shapes can be compared and interpolated number by number.
export type CubicShape = CubicSubpath[];

// One command group as written (implicit repeats split out), case kept so the report can tell relative from absolute.
export interface ParsedPathCommand {
  letter: string;
  values: number[];
}

// The parser's verdict — a character position on failure, so the editor can say where the d string went wrong rather than just that it did.
export type PathParseResult = { ok: true; commands: ParsedPathCommand[] } | { ok: false; error: string; position: number };

// What normalisation had to rewrite, tallied so the report can say "turned 4 arcs into cubics" instead of a bare before/after count.
export interface PathConversionTally {
  relative: number;
  lines: number;
  quadratics: number;
  arcs: number;
  smooth: number;
  closingLines: number;
  emptySubpaths: number;
}

// A parsed-and-normalised keyframe, keeping its original command tally for the compatibility report.
export interface NormalisedPath {
  shape: CubicShape;
  commandCounts: Record<string, number>;
  commandTotal: number;
  conversions: PathConversionTally;
}

// One keyframe read for matching — parsed and normalised, or the reason it couldn't be.
export type KeyframeReadResult = { ok: true; path: NormalisedPath } | { ok: false; error: string };

// What a matching step did — drives the icon/colour of each line in the compatibility report.
export type MorphStepKind = "normalise" | "pad" | "subdivide" | "rotate" | "reverse" | "close";

// One human-readable line of "what was done to make these morphable".
export interface MorphStep {
  kind: MorphStepKind;
  text: string;
}

// Before/after numbers for one keyframe, so the report can show the transformation as a ledger rather than prose alone.
export interface KeyframeReport {
  label: string;
  commandCounts: Record<string, number>;
  commandTotal: number;
  normalisedSubpaths: number;
  normalisedSegments: number;
  matchedSubpaths: number;
  matchedSegments: number;
}

// Everything the report panel shows — travel distances quantify what auto-alignment actually bought.
export interface MorphReport {
  keyframes: KeyframeReport[];
  steps: MorphStep[];
  travelBefore: number;
  travelAfter: number;
}

// A plain SVG viewBox, kept numeric so the preview can pad and centre it before stringifying.
export interface MorphViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// The matcher's output — structurally identical shapes plus their serialised `d` strings, ready for every export and the preview.
export interface MorphMatchResult {
  shapes: CubicShape[];
  strings: string[];
  viewBox: MorphViewBox;
  report: MorphReport;
}

// Either a usable match or the first keyframe that failed to parse — the preview and exports need all keyframes valid at once.
export type MorphOutcome = { ok: true; result: MorphMatchResult } | { ok: false; keyframeIndex: number; error: string };

// Knobs for the alignment stage; the offset twists every keyframe's start point relative to the one before it.
export interface MorphMatchOptions {
  autoAlign: boolean;
  allowReverse: boolean;
  startOffset: number;
}

// The easing presets on offer — all stay within [0, 1] on the y axis so SMIL's keySplines (which forbid overshoot) can express every one.
export type MorphEasingId = "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "sine" | "expo" | "quint-out";

/*
  One easing as each export dialect spells it: the CSS keyword/cubic-bezier, the bezier numbers
  SMIL's keySplines and the preview's solver need, and the nearest named react-spring easing.
*/
export interface MorphEasingMeta {
  id: MorphEasingId;
  label: string;
  bezier: [number, number, number, number];
  css: string;
  spring: string;
}

// Filled shapes read as solid icons; stroked ones are needed for line-art morphs like hamburger → close.
export type MorphRenderMode = "fill" | "stroke";

/*
  Full editor state — only what changes the output. Playback (playing, speed, playhead) and view
  toggles stay out, so undo rewinds the recipe rather than whether the preview happened to be running.
*/
export interface SvgPathMorphState {
  // Raw `d` strings, A first — two or more keyframes, morphed in order.
  keyframes: string[];
  autoAlign: boolean;
  allowReverse: boolean;
  startOffset: number;
  // Time for one keyframe-to-keyframe morph, so adding keyframes lengthens the loop rather than rushing it.
  durationMs: number;
  easing: MorphEasingId;
  renderMode: MorphRenderMode;
}

// The whole editor state is shareable; aliased so a future UI-only field has an obvious place to be excluded, as every other goodie does.
export type SvgPathMorphShareableState = SvgPathMorphState;

// Settings editable through the generic setSetting actions — everything except the keyframe strings themselves.
export type MorphSettingKey = Exclude<keyof SvgPathMorphState, "keyframes">;

// A curated recipe for the preset shelf.
export interface MorphPresetMeta {
  slug: string;
  name: string;
  keyframes: string[];
  renderMode: MorphRenderMode;
  durationMs: number;
  easing: MorphEasingId;
}

// Every mutation the root exposes to its children, bundled like every other goodie's *Actions so subcomponents never touch the undo stack directly.
export interface SvgPathMorphActions {
  // Live per keystroke; the textarea's blur checkpoints the typing run via commitEdit.
  setKeyframe: (index: number, d: string) => void;
  commitEdit: () => void;
  addKeyframe: () => void;
  removeKeyframe: (index: number) => void;
  reverseKeyframes: () => void;
  setSetting: <K extends MorphSettingKey>(key: K, value: SvgPathMorphState[K]) => void;
  // Live variant for slider drags — pair with commitEdit on release.
  setSettingLive: <K extends MorphSettingKey>(key: K, value: SvgPathMorphState[K]) => void;
  applyPreset: (preset: MorphPresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetMorph: () => void;
}

// Preview transport — owned by the bench rather than the undo stack, since pausing is inspecting, not editing.
export interface MorphPlayback {
  isPlaying: boolean;
  // 0 → 1 across one pass through every keyframe (the preview ping-pongs, so this rises then falls).
  progress: number;
  speed: number;
  toggle: () => void;
  seek: (progress: number) => void;
  setSpeed: (speed: number) => void;
}

// Per-keyframe errors come in alongside state, so each label can explain its own parse failure.
export interface KeyframeLabelsProps {
  state: SvgPathMorphState;
  actions: SvgPathMorphActions;
  errors: (string | null)[];
}

// The bench needs the matcher's outcome as well as the recipe — it draws the matched shapes, not the raw strings.
export interface MorphBenchProps {
  state: SvgPathMorphState;
  actions: SvgPathMorphActions;
  outcome: MorphOutcome;
}

// A flask shows whichever keyframe the playhead's current leg starts or ends on, already matched.
export interface FlaskProps {
  label: string;
  caption: string;
  shape: CubicShape | null;
  viewBox: MorphViewBox | null;
  renderMode: MorphRenderMode;
  showPoints: boolean;
  side: "start" | "end";
  // Which keyframe's elixir colour to fill with — the flask may hold any keyframe, not just A or B.
  toneIndex: number;
}

// Everything the alembic needs to draw one frame of the morph, its ghosts and its travel lines.
export interface AlembicProps {
  shapes: CubicShape[] | null;
  viewBox: MorphViewBox | null;
  renderMode: MorphRenderMode;
  progress: number;
  easing: MorphEasingId;
  onionSkins: number;
  showPoints: boolean;
  showTravel: boolean;
  error: string | null;
  // Lets the brew's bubbles rise only while the morph is actually running.
  isPlaying: boolean;
}

// One onion-skin frame — `ahead` ghosts show where the shape is going, the rest where it has been.
export interface OnionGhost {
  key: string;
  d: string;
  opacity: number;
  ahead: boolean;
}

// The dial only reads and drives playback; keyframe count places the letters round its rim.
export interface AstrolabeProps {
  playback: MorphPlayback;
  keyframeCount: number;
  disabled: boolean;
}

// The alignment knobs edit the recipe, so they take state and actions like every other editor panel.
export interface AlignmentControlsProps {
  state: SvgPathMorphState;
  actions: SvgPathMorphActions;
}

// The report reads only the matcher's outcome — it explains what was done, it never edits.
export interface CompatibilityReportProps {
  outcome: MorphOutcome;
}

// The export tabs — two CSS flavours, SMIL, react-spring, and the bare matched strings.
export type MorphExportFormatId = "css-keyframes" | "css-transition" | "smil" | "react" | "paths";

// One export tab: its label, Shiki language, the caveat shown above it, and the builder that writes it from the match.
export interface MorphExportFormat {
  id: MorphExportFormatId;
  label: string;
  language: string;
  note: string;
  build: (state: SvgPathMorphState, result: MorphMatchResult) => string;
}

// Exports need the recipe (timing, easing, render mode) as well as the matched strings.
export interface ExportPanelProps {
  state: SvgPathMorphState;
  outcome: MorphOutcome;
}

// The shelf only loads recipes, so actions are all it needs.
export interface PresetGalleryProps {
  actions: SvgPathMorphActions;
}

// The permalink encodes the recipe and nothing else.
export interface ShareControlsProps {
  state: SvgPathMorphState;
}

// The bench's own slider, split into live onChange and a single onCommit for undo.
export interface SliderProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  format?: (value: number) => string;
  onChange: (value: number) => void;
  onCommit: () => void;
}
