import type { SvgElementNode } from "@/components/SvgToReactConverter/SvgToReactConverter.types";

// The sequencing rules a drawing can follow — "custom" is whatever order the ledger was hand-arranged into.
export type StrokeOrderMode = "document" | "reverse" | "left-right" | "top-bottom" | "longest" | "random" | "custom";

// "fixed" gives every stroke the same time; "proportional" keeps the pen at a constant speed, as a real signature would be written.
export type DurationMode = "fixed" | "proportional";

// The named easing curves on offer — a short closed list so the CSS, JS and preview can all agree on the exact same bezier.
export type EasingKey = "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "nib";

// Whether the drawing plays once, restarts, or writes itself out and then un-writes back again.
export type LoopMode = "once" | "loop" | "yoyo";

// When filled shapes fade their fill in: never, as each one's own outline completes, or all together once the pen lifts for good.
export type FillFadeMode = "off" | "each" | "end";

// The four hand-off formats the export panel offers.
export type ExportFormat = "svg" | "css" | "react" | "waapi";

/*
  Every animation-wide setting. Colour and width overrides carry an on/off flag beside their value
  so switching an override off and on again doesn't lose the colour that had been picked.
*/
export interface LineDrawingSettings {
  order: StrokeOrderMode;
  // Seed for the "random" order, so a shuffle someone liked survives a permalink.
  seed: number;
  durationMode: DurationMode;
  // Milliseconds per stroke in fixed mode.
  duration: number;
  // Viewbox units per second in proportional ("signature") mode.
  speed: number;
  // Pen-lift pause, in ms, added between one stroke's handover point and the next stroke starting.
  stagger: number;
  // Percentage of a stroke's duration the next stroke may overlap — 100 starts them together.
  overlap: number;
  easing: EasingKey;
  overrideColour: boolean;
  strokeColour: string;
  overrideWidth: boolean;
  strokeWidth: number;
  // Draws fill-only shapes as outlines too, rather than leaving them out of the sequence.
  outlineFills: boolean;
  fillFade: FillFadeMode;
  fillDuration: number;
  loop: LoopMode;
  // Pause, in ms, on the finished drawing before a loop or yoyo turns round.
  hold: number;
  // Exports with pathLength="1" so the CSS never depends on measured lengths; off bakes the measured lengths in instead.
  normalise: boolean;
}

// One stroke's hand-tweaks from the ledger — all optional, so an untouched stroke costs nothing in the permalink.
export interface StrokeOverride {
  excluded?: boolean;
  duration?: number;
  colour?: string;
  width?: number;
}

/*
  Full runtime editor state. Overrides are keyed by the stroke's document index (as a string, since
  it round-trips through JSON) — a new source resets them, because indices no longer line up.
*/
export interface LineDrawingEditorState {
  source: string;
  settings: LineDrawingSettings;
  overrides: Record<string, StrokeOverride>;
  // The ledger's hand-arranged sequence of document indices; only read while settings.order is "custom".
  customOrder: number[] | null;
}

// Source is optional in a shared link — a drawing too big for a URL is shared as its settings alone.
export interface LineDrawingShareableState {
  source?: string;
  settings: LineDrawingSettings;
  overrides: Record<string, StrokeOverride>;
  customOrder: number[] | null;
}

/*
  What static analysis of the markup knows about one stroke-able element, before the browser has
  measured anything — enough to label it in the ledger and to decide whether it is a stroke, a
  fill, or both.
*/
export interface StrokeInfo {
  // 1-based document index, also written onto the element as data-ld so the stage and exports can find it.
  index: number;
  tag: string;
  summary: string;
  hasStroke: boolean;
  hasFill: boolean;
  // The resolved fill paint, used as the outline colour when a fill-only shape is drawn as a stroke.
  fillColour: string | null;
  fillOpacity: number;
}

// The sanitised, annotated artwork plus everything parsed out of it — one memoised result every panel reads.
export interface PreparedArtwork {
  root: SvgElementNode | null;
  strokes: StrokeInfo[];
  error: string | null;
  // How many unsafe elements, handlers and URLs the sanitiser stripped, so the input panel can say so.
  removed: number;
}

// The browser's own measurements of one stroke — lengths for timing and dashes, boxes for spatial ordering.
export interface StrokeMeasurement {
  length: number;
  x: number;
  y: number;
}

// Measurements keyed by document index; missing until the stage has rendered and measured the artwork.
export type StrokeMeasurements = Record<number, StrokeMeasurement>;

// A fill-opacity fade window on the shared clock.
export interface FillFade {
  start: number;
  duration: number;
  to: number;
}

/*
  One stroke's slot on the shared clock, in sequence order. Non-drawing entries (excluded strokes,
  fill-only shapes left as fills) keep their place so the ledger and exports can still list them.
*/
export interface TimelineEntry {
  index: number;
  position: number;
  draws: boolean;
  start: number;
  duration: number;
  length: number;
  // Null means "leave the artwork's own stroke paint alone".
  colour: string | null;
  width: number | null;
  fade: FillFade | null;
}

// The whole sequence plus its three key moments: the pen's last lift, the end of every fade, and one full loop cycle.
export interface LineDrawingTimeline {
  entries: TimelineEntry[];
  drawEnd: number;
  total: number;
  cycle: number;
}

// One easing option — the CSS string and the bezier control points it stands for, so the preview evaluates exactly what the exports write.
export interface EasingDefinition {
  key: EasingKey;
  label: string;
  css: string;
  bezier: [number, number, number, number];
}

// A curated starting drawing — carries its own suggested settings, since a signature and an icon set want very different pacing.
export interface LineDrawingPreset {
  slug: string;
  name: string;
  description: string;
  source: string;
  settings?: Partial<LineDrawingSettings>;
}

// The export panel's input — everything any of the four formats needs, already resolved.
export interface LineDrawingExportInput {
  artwork: PreparedArtwork;
  timeline: LineDrawingTimeline;
  settings: LineDrawingSettings;
}

/*
  Every mutation the root exposes to its children, bundled into one object (mirrors every other
  goodie's *Actions style) so subcomponents never touch the undo stack directly.
*/
export interface LineDrawingActions {
  setSource: (source: string) => void;
  loadFile: (source: string) => void;
  // Live update while a slider drags — pair with commitEdit on release.
  setSettingLive: <K extends keyof LineDrawingSettings>(key: K, value: LineDrawingSettings[K]) => void;
  setSetting: <K extends keyof LineDrawingSettings>(key: K, value: LineDrawingSettings[K]) => void;
  setOverride: (index: number, patch: StrokeOverride) => void;
  // Live update while a ledger colour picker scrubs — pair with commitEdit on release.
  setOverrideLive: (index: number, patch: StrokeOverride) => void;
  // Wipes every per-stroke tweak and the hand-arranged order in one undoable step.
  clearOverrides: () => void;
  // Moves a stroke within the current sequence, switching the order to "custom".
  moveStroke: (order: number[], from: number, to: number) => void;
  commitEdit: () => void;
  applyPreset: (preset: LineDrawingPreset) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetAnimator: () => void;
}

// The ink well needs the raw source to edit and the prepared artwork to report parse errors and sanitiser removals.
export interface InputPanelProps {
  state: LineDrawingEditorState;
  artwork: PreparedArtwork;
  actions: LineDrawingActions;
}

// The fittings only ever touch animation-wide settings, so they get just those.
export interface SettingsPanelProps {
  settings: LineDrawingSettings;
  actions: LineDrawingActions;
}

// The page draws from the shared timeline and reports its own measurements back up, since ordering and timing depend on them.
export interface StagePaneProps {
  artwork: PreparedArtwork;
  timeline: LineDrawingTimeline;
  settings: LineDrawingSettings;
  measurements: StrokeMeasurements;
  onMeasure: (measurements: StrokeMeasurements) => void;
}

// The ledger lists strokes in timeline order and reads the editor state for each one's overrides.
export interface StrokeLedgerProps {
  artwork: PreparedArtwork;
  timeline: LineDrawingTimeline;
  state: LineDrawingEditorState;
  actions: LineDrawingActions;
}

// One pre-resolved bundle, so every export format reads exactly the same drawing.
export interface ExportPanelProps {
  input: LineDrawingExportInput;
}

// The gallery only needs to load presets.
export interface PresetGalleryProps {
  actions: LineDrawingActions;
}

// The permalink is built from the editor state alone.
export interface ShareControlsProps {
  state: LineDrawingEditorState;
}

// A labelled range with the live-change / commit-on-release split the undo stack relies on.
export interface SliderProps {
  id: string;
  label: string;
  min: number;
  max: number;
  value: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
  onCommit: () => void;
}

// Inherited paint carried down the walk — SVG's stroke and fill both inherit, and default to none and black respectively.
export interface InheritedPaint {
  stroke: string;
  strokeWidth: string;
  fill: string;
  fillOpacity: string;
}

// How a format addresses its strokes — data attributes when the markup ships with the CSS, classes when only the CSS does.
export interface SelectorScheme {
  drawBase: string;
  fadeBase: string;
  draw: (index: number) => string;
  fade: (index: number) => string;
}
