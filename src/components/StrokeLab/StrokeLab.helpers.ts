import type {
  DrawOnFillMode,
  DrawOnLoop,
  DrawOnSettings,
  PickerOption,
  StrokeLabEditorState,
  StrokeLabOverlays,
  StrokeLabPreset,
  StrokeLabShareableState,
  StrokeLinecap,
  StrokeLinejoin,
  StrokePaintOrder,
  StrokeSubject
} from "@/components/StrokeLab/StrokeLab.types";
import { DRAW_ON_EASINGS } from "@/components/StrokeLab/StrokeLab.utils";

// Every numeric control's bounds in one place, so sliders, inputs and the permalink sanitiser can never disagree.
export const LIMITS = {
  strokeWidth: { min: 1, max: 48 },
  dash: { min: 0, max: 200 },
  dashCount: { max: 12 },
  dashOffset: { min: -200, max: 200 },
  marchSpeed: { min: 4, max: 120 },
  miterLimit: { min: 1, max: 20 },
  opacity: { min: 0, max: 1 },
  scale: { min: 0.4, max: 2.5 },
  duration: { min: 0.2, max: 10 },
  delay: { min: 0, max: 5 },
  text: { max: 12 },
  customPath: { max: 4000 }
} as const;

// The test pieces, in the order the ribbon tabs show them.
export const SUBJECT_OPTIONS: PickerOption<StrokeSubject>[] = [
  { value: "zigzag", label: "Zig-zag", description: "Open polyline with corners from ≈ 20° to ≈ 58° — the miter limit's home ground." },
  { value: "star", label: "Star", description: "Closed shape with ≈ 26.7° tips, just past the default limit of 4, and no ends to cap." },
  { value: "spiral", label: "Spiral", description: "One long smooth curve — ideal for dashes, marching and the draw-on." },
  { value: "curve", label: "Open curve", description: "A smooth S with two free ends, so caps have room to show." },
  { value: "text", label: "Text", description: "Glyph outlines from the font — best for paint-order and joins on serifs." },
  { value: "custom", label: "Custom d", description: "Paste any path data; the lab parses it for corners and ends." }
];

// Spool labels and what each cap does past the end of the path.
export const LINECAP_OPTIONS: PickerOption<StrokeLinecap>[] = [
  { value: "butt", label: "Butt", description: "Stops flush with the path end — no extension." },
  { value: "round", label: "Round", description: "Adds a half-disc of radius w/2 beyond the end." },
  { value: "square", label: "Square", description: "Adds a half-square, w/2 long, beyond the end." }
];

// Button-card labels and how each join treats a corner; the SVG 2 pair carry their fallback in the description.
export const LINEJOIN_OPTIONS: PickerOption<StrokeLinejoin>[] = [
  { value: "miter", label: "Miter", description: "Extends the outer edges to a point, until the ratio passes stroke-miterlimit — then bevels." },
  { value: "round", label: "Round", description: "Rounds the outer corner with a circular arc of radius w/2." },
  { value: "bevel", label: "Bevel", description: "Cuts the outer corner straight across, always." },
  { value: "miter-clip", label: "Miter-clip", description: "SVG 2: past the limit, clips the miter at limit × w/2 instead of bevelling." },
  { value: "arcs", label: "Arcs", description: "SVG 2: extends the outer edges as arcs on curved corners; clipped like miter-clip past the limit." }
];

// The two orders that matter on one filled shape.
export const PAINT_ORDER_OPTIONS: PickerOption<StrokePaintOrder>[] = [
  { value: "normal", label: "normal", description: "Fill first, stroke on top — the stroke straddles the outline and covers half of the fill's edge." },
  { value: "stroke", label: "stroke", description: "Stroke first, fill on top — the inner half of the stroke hides under the fill, so only the outer half shows." }
];

// animation-fill-mode choices with what each means for a path hidden at rest.
export const FILL_MODE_OPTIONS: PickerOption<DrawOnFillMode>[] = [
  { value: "forwards", label: "forwards", description: "Holds the finished line once the run ends." },
  { value: "none", label: "none", description: "Snaps back to hidden when the run ends." },
  { value: "backwards", label: "backwards", description: "Applies the first frame during the delay; here that matches the hidden rest state." },
  { value: "both", label: "both", description: "backwards during the delay and forwards after." }
];

// How the draw-on repeats.
export const LOOP_OPTIONS: PickerOption<DrawOnLoop>[] = [
  { value: "once", label: "Once", description: "Draws a single time." },
  { value: "loop", label: "Loop", description: "Draws, snaps back, draws again." },
  { value: "alternate", label: "Draw & unpick", description: "Draws, then unpicks itself in reverse, forever." }
];

// The opening custom path — a moveto, lines, an arc and a quadratic, so every corner and cap code path shows up the first time someone picks "Custom d".
export const DEFAULT_CUSTOM_PATH = "M50,210 L110,60 A75,75 0 0 1 250,70 Q300,10 350,210";

// The opening state: a solid zig-zag with every overlay on, which shows the miter limit failing at its sharpest corner before anything is touched.
export function createDefaultEditorState(): StrokeLabEditorState {
  return {
    subject: "zigzag",
    customPath: DEFAULT_CUSTOM_PATH,
    text: "Hem",
    strokeWidth: 14,
    strokeColour: "#d6336c",
    strokeOpacity: 1,
    fillEnabled: false,
    fillColour: "#f2c14e",
    dashes: [],
    dashOffset: 0,
    march: false,
    marchSpeed: 24,
    linecap: "butt",
    linejoin: "miter",
    miterLimit: 4,
    paintOrder: "normal",
    nonScalingStroke: false,
    scaleX: 1,
    scaleY: 1,
    overlays: { centreline: true, caps: true, corners: true },
    drawOn: { duration: 2, easing: "ease-in-out", delay: 0, fill: "forwards", loop: "once" }
  };
}

// Copied rather than passed by reference so JSON.stringify and the URL encoder never touch the live undo-stack object.
export function toShareableState(state: StrokeLabEditorState): StrokeLabShareableState {
  return { ...state, dashes: [...state.dashes], overlays: { ...state.overlays }, drawOn: { ...state.drawOn } };
}

// Shallow patch — every field is replaced whole, which is all the controls ever need.
export function patchState(state: StrokeLabEditorState, patch: Partial<StrokeLabEditorState>): StrokeLabEditorState {
  return { ...state, ...patch };
}

// Overlay toggles patch their own nested object.
export function patchOverlays(state: StrokeLabEditorState, patch: Partial<StrokeLabOverlays>): StrokeLabEditorState {
  return { ...state, overlays: { ...state.overlays, ...patch } };
}

// Draw-on controls patch their own nested object.
export function patchDrawOn(state: StrokeLabEditorState, patch: Partial<DrawOnSettings>): StrokeLabEditorState {
  return { ...state, drawOn: { ...state.drawOn, ...patch } };
}

// A preset swaps the stroke but keeps the draw-on timing someone may already have tuned.
export function applyPreset(state: StrokeLabEditorState, preset: StrokeLabPreset): StrokeLabEditorState {
  const base = createDefaultEditorState();
  return { ...base, ...preset.state, overlays: { ...base.overlays, ...preset.state.overlays }, drawOn: state.drawOn };
}

// Pins a number into range, falling back when the value isn't a finite number at all.
export function clamp(value: unknown, min: number, max: number, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

// Accepts a value only if it's one of the allowed keywords.
function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

// Only #rrggbb survives, the one format the native colour input reads.
function hexColour(value: unknown, fallback: string): string {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
}

// True or false only — a permalink saying "yes" shouldn't switch anything on.
function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

/*
  Rebuilds a full editor state from an untrusted permalink or autosave, field by field, so a
  hand-edited or stale link can only ever produce a valid state — never a crash or an invalid
  attribute on the stage.
*/
export function sanitiseState(raw: unknown): StrokeLabEditorState | null {
  if (!raw || typeof raw !== "object") return null;
  const input = raw as Record<string, unknown>;
  const base = createDefaultEditorState();
  const overlays = (input.overlays && typeof input.overlays === "object" ? input.overlays : {}) as Record<string, unknown>;
  const drawOn = (input.drawOn && typeof input.drawOn === "object" ? input.drawOn : {}) as Record<string, unknown>;
  const dashes = Array.isArray(input.dashes)
    ? input.dashes
        .filter((n): n is number => typeof n === "number" && Number.isFinite(n))
        .slice(0, LIMITS.dashCount.max)
        .map((n) => clamp(n, LIMITS.dash.min, LIMITS.dash.max, 0))
    : base.dashes;

  return {
    subject: oneOf(input.subject, SUBJECT_OPTIONS.map((o) => o.value), base.subject),
    customPath: typeof input.customPath === "string" ? input.customPath.slice(0, LIMITS.customPath.max) : base.customPath,
    text: typeof input.text === "string" ? input.text.slice(0, LIMITS.text.max) : base.text,
    strokeWidth: clamp(input.strokeWidth, LIMITS.strokeWidth.min, LIMITS.strokeWidth.max, base.strokeWidth),
    strokeColour: hexColour(input.strokeColour, base.strokeColour),
    strokeOpacity: clamp(input.strokeOpacity, LIMITS.opacity.min, LIMITS.opacity.max, base.strokeOpacity),
    fillEnabled: bool(input.fillEnabled, base.fillEnabled),
    fillColour: hexColour(input.fillColour, base.fillColour),
    dashes,
    dashOffset: clamp(input.dashOffset, LIMITS.dashOffset.min, LIMITS.dashOffset.max, base.dashOffset),
    march: bool(input.march, base.march),
    marchSpeed: clamp(input.marchSpeed, LIMITS.marchSpeed.min, LIMITS.marchSpeed.max, base.marchSpeed),
    linecap: oneOf(input.linecap, LINECAP_OPTIONS.map((o) => o.value), base.linecap),
    linejoin: oneOf(input.linejoin, LINEJOIN_OPTIONS.map((o) => o.value), base.linejoin),
    miterLimit: clamp(input.miterLimit, LIMITS.miterLimit.min, LIMITS.miterLimit.max, base.miterLimit),
    paintOrder: oneOf(input.paintOrder, PAINT_ORDER_OPTIONS.map((o) => o.value), base.paintOrder),
    nonScalingStroke: bool(input.nonScalingStroke, base.nonScalingStroke),
    scaleX: clamp(input.scaleX, LIMITS.scale.min, LIMITS.scale.max, base.scaleX),
    scaleY: clamp(input.scaleY, LIMITS.scale.min, LIMITS.scale.max, base.scaleY),
    overlays: {
      centreline: bool(overlays.centreline, base.overlays.centreline),
      caps: bool(overlays.caps, base.overlays.caps),
      corners: bool(overlays.corners, base.overlays.corners)
    },
    drawOn: {
      duration: clamp(drawOn.duration, LIMITS.duration.min, LIMITS.duration.max, base.drawOn.duration),
      easing: typeof drawOn.easing === "string" && drawOn.easing in DRAW_ON_EASINGS ? drawOn.easing : base.drawOn.easing,
      delay: clamp(drawOn.delay, LIMITS.delay.min, LIMITS.delay.max, base.drawOn.delay),
      fill: oneOf(drawOn.fill, FILL_MODE_OPTIONS.map((o) => o.value), base.drawOn.fill),
      loop: oneOf(drawOn.loop, LOOP_OPTIONS.map((o) => o.value), base.drawOn.loop)
    }
  };
}

// Asks the browser whether it parses each join keyword — the SVG 2 pair are the only ones that can come back false.
export function detectLinejoinSupport(): Record<StrokeLinejoin, boolean> {
  const supports = (value: string) => typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("stroke-linejoin", value);
  return { miter: true, round: true, bevel: true, "miter-clip": supports("miter-clip"), arcs: supports("arcs") };
}
