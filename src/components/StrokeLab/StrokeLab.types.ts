// The test pieces the lab can stitch — each one stresses a different stroke property (sharp corners, open ends, smooth curves, glyph outlines).
export type StrokeSubject = "zigzag" | "star" | "spiral" | "curve" | "text" | "custom";

// The three linecap keywords every renderer supports.
export type StrokeLinecap = "butt" | "round" | "square";

// All five SVG 2 linejoin keywords — miter-clip and arcs are included so the lab can show what happens when a browser doesn't support them yet.
export type StrokeLinejoin = "miter" | "round" | "bevel" | "miter-clip" | "arcs";

// Only the two orders that change anything on a single filled, marker-less shape.
export type StrokePaintOrder = "normal" | "stroke";

// How the draw-on export repeats: once, forever, or forever and back again (draw then unpick).
export type DrawOnLoop = "once" | "loop" | "alternate";

// The CSS animation-fill-mode keywords, offered verbatim because each one changes what the path shows before and after the run.
export type DrawOnFillMode = "none" | "forwards" | "backwards" | "both";

// Which of the stage's teaching overlays are switched on — kept in state so a permalink reopens with the same annotations.
export interface StrokeLabOverlays {
  centreline: boolean;
  caps: boolean;
  corners: boolean;
}

// The draw-on line animation's timing — mirrors the animation shorthand's own parts so every export variant can be built from one object.
export interface DrawOnSettings {
  duration: number;
  // A key into DRAW_ON_EASINGS rather than a free string, so the CSS, SVG and React variants always agree on the curve.
  easing: string;
  delay: number;
  fill: DrawOnFillMode;
  loop: DrawOnLoop;
}

/*
  Full runtime editor state — every stroke property plus the subject it is applied to. Small and flat
  on purpose: the whole thing goes into the undo stack, localStorage and the `?state=` permalink.
*/
export interface StrokeLabEditorState {
  subject: StrokeSubject;
  customPath: string;
  text: string;
  strokeWidth: number;
  strokeColour: string;
  strokeOpacity: number;
  fillEnabled: boolean;
  fillColour: string;
  // Raw, possibly odd-length list exactly as typed — the doubling rule is applied when it's read, never baked in.
  dashes: number[];
  dashOffset: number;
  march: boolean;
  // Marching speed in user units per second.
  marchSpeed: number;
  linecap: StrokeLinecap;
  linejoin: StrokeLinejoin;
  miterLimit: number;
  paintOrder: StrokePaintOrder;
  nonScalingStroke: boolean;
  scaleX: number;
  scaleY: number;
  overlays: StrokeLabOverlays;
  drawOn: DrawOnSettings;
}

// Everything is shareable; aliased so a future UI-only field has an obvious place to be excluded, like every other goodie's *ShareableState.
export type StrokeLabShareableState = StrokeLabEditorState;

// A 2D point or direction in the subject's user space.
export interface Vec2 {
  x: number;
  y: number;
}

// One drawn piece of a path with the tangent it leaves its start along and the tangent it arrives at its end along — all a join or cap needs to know.
export interface PathSegment {
  from: Vec2;
  to: Vec2;
  // Unit vectors; zero length when the segment is degenerate and has no direction.
  startTangent: Vec2;
  endTangent: Vec2;
}

// A run of segments started by one moveto; closed subpaths have joins all the way round and no caps.
export interface Subpath {
  start: Vec2;
  segments: PathSegment[];
  closed: boolean;
}

/*
  One corner where two segments meet at an angle. `angle` is the interior angle θ between the two
  arms, so the miter ratio is 1 / sin(θ / 2), matching the formula in the MiterLimitDiagram.
*/
export interface StrokeCorner {
  id: string;
  point: Vec2;
  // Interior angle in degrees.
  angle: number;
  // Miter length ÷ stroke-width.
  ratio: number;
  // Unit vector from the vertex towards the outside of the bend, where the miter tip grows.
  bisector: Vec2;
  // Outward normals of the incoming and outgoing arms on the outer side — the stroke's outer edge corners sit at vertex + normal × w/2.
  inNormal: Vec2;
  outNormal: Vec2;
}

// An open subpath end — where stroke-linecap paints, and where its extension is measured from.
export interface PathEnd {
  id: string;
  point: Vec2;
  // Unit vector pointing out beyond the end, the direction square and round caps extend in.
  direction: Vec2;
}

// The outcome of parsing a path's `d` — geometry when it parses, a human-readable reason when it doesn't.
export interface PathAnalysis {
  ok: boolean;
  error: string | null;
  subpaths: Subpath[];
  corners: StrokeCorner[];
  ends: PathEnd[];
  // Rough user-space bounding box (endpoints, control points and sampled arcs) for fitting a custom path into view.
  bounds: { minX: number; minY: number; maxX: number; maxY: number } | null;
}

// What the stage and the exports draw for a subject: either a path with its `d`, or a line of text.
export type SubjectGeometry = { kind: "path"; d: string; viewBox: string } | { kind: "text"; text: string; viewBox: string; x: number; y: number; fontSize: number };

// The miter verdict for one corner under the current join and limit.
export type CornerVerdict = "miter" | "bevel" | "clipped" | "round" | "n/a";

// A preset card in the pattern drawer — a partial state laid over the defaults, with a name and a one-line reason to try it.
export interface StrokeLabPreset {
  slug: string;
  name: string;
  blurb: string;
  state: Partial<Omit<StrokeLabEditorState, "overlays" | "drawOn">> & { overlays?: Partial<StrokeLabOverlays> };
}

// One option in a labelled picker (subjects, caps, joins, paint order) — description doubles as the hint under the picker.
export interface PickerOption<T extends string> {
  value: T;
  label: string;
  description: string;
}

/*
  Every mutation StrokeLab exposes to its children, bundled into one object like every other
  goodie's *Actions so subcomponents never touch the undo stack directly.
*/
export interface StrokeLabActions {
  // Live update with no undo entry — sliders, colour pickers and typing; pair with commitEdit on release or blur.
  update: (patch: Partial<StrokeLabEditorState>) => void;
  // Discrete change recorded as its own undo step — picker clicks, toggles, add/remove buttons.
  apply: (patch: Partial<StrokeLabEditorState>) => void;
  updateOverlays: (patch: Partial<StrokeLabOverlays>) => void;
  updateDrawOn: (patch: Partial<DrawOnSettings>, record: boolean) => void;
  // Checkpoints the current state onto the undo stack — once per drag or typing run.
  commitEdit: () => void;
  applyPreset: (preset: StrokeLabPreset) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetLab: () => void;
}

// The state plus the actions — the props shape most control cards share.
export interface StrokeLabPanelProps {
  state: StrokeLabEditorState;
  actions: StrokeLabActions;
}

// Which join keywords this browser parses — the SVG 2 pair decide whether the lab draws them or the miter fallback.
export type LinejoinSupport = Record<StrokeLinejoin, boolean>;

// The stage also needs the parsed geometry, whether motion is allowed, and which joins really render.
export interface StageProps extends StrokeLabPanelProps {
  geometry: SubjectGeometry;
  analysis: PathAnalysis;
  reducedMotion: boolean;
  joinSupport: LinejoinSupport;
}

// The seam gauge reads corners and the join that will actually be drawn; it never edits geometry.
export interface SeamGaugeProps extends StrokeLabPanelProps {
  analysis: PathAnalysis;
  joinSupport: LinejoinSupport;
}

// The button cards badge each SVG 2 join with whether this browser supports it.
export interface JoinCardsProps extends StrokeLabPanelProps {
  joinSupport: LinejoinSupport;
}

// The dash tape needs to know whether marching is allowed at all.
export interface DashTapeProps extends StrokeLabPanelProps {
  reducedMotion: boolean;
}

// The draw-on panel previews the current subject, so it needs its geometry too.
export interface DrawOnPanelProps extends StrokeLabPanelProps {
  geometry: SubjectGeometry;
  reducedMotion: boolean;
}

// The export panel only reads.
export interface ExportPanelProps {
  state: StrokeLabEditorState;
  geometry: SubjectGeometry;
}

// The permalink is built from the whole state.
export interface ShareControlsProps {
  state: StrokeLabEditorState;
}

// Presets only ever replace state, so they need nothing but the actions.
export interface PresetGalleryProps {
  actions: StrokeLabActions;
}

// One slider wired to the live/checkpoint undo split.
export interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  step?: number;
  // Decimal places in the bubble — opacity and scale live between whole numbers.
  decimals?: number;
  suffix?: string;
  onChange: (value: number) => void;
  onCommit: () => void;
}

// One tab of generated code — its label, Shiki language and the text itself.
export interface CodeSample {
  id: string;
  label: string;
  language: string;
  code: string;
}

// The tabbed code viewer shared by the stroke export and the draw-on export.
export interface CodeSamplerProps {
  // Names the tablist for screen readers, e.g. "Stroke snippet format".
  label: string;
  samples: CodeSample[];
}

// One labelled stretch of the measuring tape — the dash or gap it stands for and whether it's the doubled repeat of an odd list.
export interface TapeSegment {
  kind: "dash" | "gap";
  length: number;
  start: number;
  repeat: boolean;
}
