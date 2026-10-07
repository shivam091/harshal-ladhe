import type { SvgElementNode } from "@/components/SvgToReactConverter/SvgToReactConverter.types";

// A rectangle in user units — the same four numbers a `viewBox` attribute carries, in the same order.
export interface ViewBoxRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// The print's size on the page, in CSS pixels — what the `<svg>` element's own width/height attributes set.
export interface ViewportSize {
  width: number;
  height: number;
}

// One axis of an alignment keyword, kept separate so the x and y halves can be explained independently.
export type AlignPosition = "min" | "mid" | "max";

// Every value the first half of `preserveAspectRatio` accepts, spelt exactly as the attribute spells it.
export type AspectAlign =
  | "none"
  | "xMinYMin"
  | "xMidYMin"
  | "xMaxYMin"
  | "xMinYMid"
  | "xMidYMid"
  | "xMaxYMid"
  | "xMinYMax"
  | "xMidYMax"
  | "xMaxYMax";

// The second half of `preserveAspectRatio` — "fit with borders" versus "crop to fill" in darkroom terms.
export type MeetOrSlice = "meet" | "slice";

/*
  Full runtime editor state. Overlay toggles and the auto-tour live outside it on purpose — undo
  should rewind what was framed and printed, not whether the grid happened to be showing.
*/
export interface ViewboxExplorerEditorState {
  // Which built-in negative is on the light box; ignored while a pasted drawing is loaded.
  sampleSlug: string;
  // Raw pasted SVG, or null to fall back to the sample.
  customSource: string | null;
  viewBox: ViewBoxRect;
  viewport: ViewportSize;
  align: AspectAlign;
  meetOrSlice: MeetOrSlice;
}

// The whole editor state is shareable as-is; aliased so a future UI-only field has an obvious place to be excluded.
export type ViewboxExplorerShareableState = ViewboxExplorerEditorState;

/*
  Result of the spec's viewBox-to-viewport algorithm plus the geometry the overlays need, so every
  panel reads one computed object rather than re-deriving scale and offset its own way.
*/
export interface ViewBoxTransform {
  scaleX: number;
  scaleY: number;
  translateX: number;
  translateY: number;
  // Viewport pixels left over (positive, letterbox) or overhanging (negative, crop) on each axis after scaling.
  spareX: number;
  spareY: number;
  // Where the viewBox rectangle lands in viewport pixels — larger than the print when slicing.
  mapped: ViewBoxRect;
  // The user-space region the print actually shows — larger than the viewBox when meeting.
  visible: ViewBoxRect;
}

// A built-in drawing for the light box — its own source string so samples and pasted SVGs share one render path.
export interface ViewboxSample {
  slug: string;
  name: string;
  source: string;
}

// A curated framing that demonstrates one idea; it brings its own sample so the viewBox numbers make sense.
export interface ViewboxPreset {
  slug: string;
  name: string;
  hint: string;
  sampleSlug: string;
  viewBox: ViewBoxRect;
  viewport: ViewportSize;
  align: AspectAlign;
  meetOrSlice: MeetOrSlice;
}

// One stop on the auto-tour — every alignment/meet-or-slice pairing the attribute can express.
export interface TourStep {
  align: AspectAlign;
  meetOrSlice: MeetOrSlice;
}

// A parsed, sanitised drawing ready to render, with the user-space rectangle it was authored in.
export interface ParsedDrawing {
  tree: SvgElementNode | null;
  bounds: ViewBoxRect;
  error: string | null;
}

// Which part of the masking easel a pointer or key is moving — the body, one blade, or one corner.
export type EaselHandle = "move" | "n" | "e" | "s" | "w" | "nw" | "ne" | "sw" | "se";

// What an easel drag remembers from pointerdown — deltas are always applied to the starting rectangle, so rounding never accumulates across frames.
export interface EaselGesture {
  handle: EaselHandle;
  startPoint: { x: number; y: number };
  startRect: ViewBoxRect;
  moved: boolean;
}

// One labelled strip of letterbox border or cropped overhang on the print, in print pixels.
export interface PrintBand {
  key: string;
  x: number;
  y: number;
  size: number;
}

// The export tabs — plain markup, a React component, and the hand-written matrix equivalent.
export type ExportFormatId = "svg" | "react" | "matrix";

// Overlays that can be switched off independently when the print gets busy.
export interface OverlayToggles {
  grid: boolean;
  outline: boolean;
  borders: boolean;
}

/*
  Every mutation ViewboxExplorer exposes to its children, bundled into one object (mirrors every
  other goodie's *Actions style) so subcomponents never touch the undo stack directly.
*/
export interface ViewboxExplorerActions {
  // Live update while a handle drags — pair with commitEdit on release.
  setViewBoxLive: (viewBox: ViewBoxRect) => void;
  // One discrete change (a key press, a typed number) that becomes its own undo step.
  setViewBox: (viewBox: ViewBoxRect) => void;
  setViewportLive: (viewport: ViewportSize) => void;
  setAlign: (align: AspectAlign) => void;
  setMeetOrSlice: (meetOrSlice: MeetOrSlice) => void;
  // Tour steps change without an undo entry each; stopping the tour checkpoints them as one.
  setTourStepLive: (step: TourStep) => void;
  selectSample: (slug: string) => void;
  loadCustomDrawing: (source: string, bounds: ViewBoxRect) => void;
  fitToDrawing: () => void;
  matchViewportRatio: () => void;
  commitEdit: () => void;
  applyPreset: (preset: ViewboxPreset) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetExplorer: () => void;
}

// The light box needs the extent to size its grid and handles, and the transform to trace what actually prints.
export interface LightBoxProps {
  drawing: ParsedDrawing;
  extent: ViewBoxRect;
  state: ViewboxExplorerEditorState;
  transform: ViewBoxTransform;
  overlays: OverlayToggles;
  actions: ViewboxExplorerActions;
}

// The print reads the same transform as the readout, so its overlays and numbers can never disagree.
export interface PrintStageProps {
  drawing: ParsedDrawing;
  extent: ViewBoxRect;
  state: ViewboxExplorerEditorState;
  transform: ViewBoxTransform;
  overlays: OverlayToggles;
}

// Tour state lives in the root, so undo and preset loads can stop a running tour.
export interface AlignmentPanelProps {
  state: ViewboxExplorerEditorState;
  actions: ViewboxExplorerActions;
  tourIndex: number | null;
  isTouring: boolean;
  prefersReducedMotion: boolean;
  onToggleTour: () => void;
  onStepTour: (direction: 1 | -1) => void;
}

// Read-only: the readout only ever reports, never edits.
export interface ReadoutPanelProps {
  state: ViewboxExplorerEditorState;
  transform: ViewBoxTransform;
}

// Overlay toggles are passed in rather than owned here, since both the light box and the print draw them.
export interface EaselControlsProps {
  state: ViewboxExplorerEditorState;
  extent: ViewBoxRect;
  overlays: OverlayToggles;
  onOverlaysChange: (overlays: OverlayToggles) => void;
  actions: ViewboxExplorerActions;
}

// The parsed drawing comes in so a pasted file's error can be shown beside the box it came from.
export interface DrawingPanelProps {
  state: ViewboxExplorerEditorState;
  drawing: ParsedDrawing;
  actions: ViewboxExplorerActions;
}

// The transform comes in pre-computed so the matrix export matches the readout to the last digit.
export interface ExportPanelProps {
  state: ViewboxExplorerEditorState;
  transform: ViewBoxTransform;
}

// Presets only ever load whole states, so the actions are all the gallery needs.
export interface PresetGalleryProps {
  actions: ViewboxExplorerActions;
}

// The permalink is built from the live state on every render, so nothing else is needed.
export interface ShareControlsProps {
  state: ViewboxExplorerEditorState;
}

// The live/checkpoint pair keeps a slider scrub to a single undo step.
export interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
  onCommit: () => void;
}
