// Every CSS `<filter-function>` this tool exposes except drop-shadow, which gets its own state shape (DropShadowState) since it takes four values instead of one.
export type FilterFunctionName = "blur" | "brightness" | "contrast" | "grayscale" | "hueRotate" | "invert" | "opacity" | "saturate" | "sepia";

// Canonical application order — CSS applies filter functions left to right, and letting a user freely reorder a fixed 9-function set (unlike box-shadow's arbitrary layer list) buys little: these particular functions rarely interact enough for order to matter, so this tool applies enabled ones in one consistent order instead of exposing reordering UI.
export const FILTER_FUNCTION_ORDER: readonly FilterFunctionName[] = [
  "blur",
  "brightness",
  "contrast",
  "grayscale",
  "hueRotate",
  "invert",
  "opacity",
  "saturate",
  "sepia"
];

// One function's on/off state and its single numeric argument — meaning (px/%/deg) depends on the function, see FUNCTION_META in utils/filter.ts.
export interface FilterFunctionState {
  enabled: boolean;
  value: number;
}

// drop-shadow(<x> <y> <blur> <color>) — structurally a single box-shadow layer, so its fields and color-to-alpha handling mirror ShadowLayer/compileLayerColor in the box-shadow tool exactly.
export interface DropShadowState {
  enabled: boolean;
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
  opacity: number;
}

// "filter" applies to the preview subject itself (an image or a gradient swatch gets processed directly). "backdropFilter" applies to whatever sits BEHIND a translucent panel — the mechanism glassmorphism actually depends on — so switching this also swaps what the preview renders, not just which CSS property the export panel names.
export type FilterTarget = "filter" | "backdropFilter";

// What sits behind (backdropFilter) or is itself processed (filter) in the preview — a vivid gradient shows saturate/hue-rotate/grayscale far more clearly than a flat color, and one of the site's own photos for a realistic case.
export type PreviewSubject = "gradient" | "photo";

/*
  Full runtime editor state. No ephemeral UI-only field exists here (unlike the other three
  goodies' selectedStopId/selectedLayerId/selectedCorner) — every value is edited directly through
  its own always-visible toggle/slider, with no drag-to-select or reorderable list in this tool, so
  the whole state is already what a permalink/autosave should carry as-is.
*/
export interface FilterEditorState {
  target: FilterTarget;
  functions: Record<FilterFunctionName, FilterFunctionState>;
  dropShadow: DropShadowState;
  previewSubject: PreviewSubject;
  previewImageId: string;
  // The translucent panel's own tint — only rendered/relevant when target is "backdropFilter", since a plain "filter" target has no separate panel to tint.
  panelColor: string;
  panelOpacity: number;
}

// A curated starting look shown in the preset gallery — a plain bundle of the same fields a thumbnail needs to render itself with the exact compileFilterValue call the main preview uses.
export interface FilterPresetMeta {
  slug: string;
  name: string;
  target: FilterTarget;
  functions: Record<FilterFunctionName, FilterFunctionState>;
  dropShadow: DropShadowState;
  previewSubject: PreviewSubject;
  previewImageId: string;
  panelColor: string;
  panelOpacity: number;
}

/*
  Every mutation FilterGenerator exposes to its children, bundled into one object (mirrors every
  other goodie's *Actions style) so subcomponents never touch the reducer/undo-stack directly.
*/
export interface FilterActions {
  setTarget: (target: FilterTarget) => void;
  toggleFunction: (name: FilterFunctionName, enabled: boolean) => void;
  // Live value update while dragging a function's slider — does not create an undo step; pair with commitDrag on release.
  setFunctionValue: (name: FilterFunctionName, value: number) => void;
  toggleDropShadow: (enabled: boolean) => void;
  updateDropShadow: (patch: Partial<Omit<DropShadowState, "enabled">>) => void;
  setPreviewSubject: (subject: PreviewSubject) => void;
  setPreviewImageId: (id: string) => void;
  setPanelColor: (color: string) => void;
  setPanelOpacity: (opacity: number) => void;
  // Checkpoints the current state onto the undo stack — call once per drag gesture or discrete edit, never per pointermove/input frame.
  commitDrag: () => void;
  applyPreset: (preset: FilterPresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetFilter: () => void;
}

export interface TargetControlsProps {
  state: FilterEditorState;
  actions: FilterActions;
}

export interface FunctionListProps {
  state: FilterEditorState;
  actions: FilterActions;
}

export interface PanelControlsProps {
  state: FilterEditorState;
  actions: FilterActions;
}

export interface PreviewPaneProps {
  state: FilterEditorState;
}

export interface ExportPanelProps {
  state: FilterEditorState;
}

export interface PresetGalleryProps {
  actions: FilterActions;
}

export interface ShareControlsProps {
  state: FilterEditorState;
}

export interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
  onCommit: () => void;
}
