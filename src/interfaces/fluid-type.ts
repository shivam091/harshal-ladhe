// One named font-size step in the scale (H1, Body, Small, …) — sized at the min and max viewport; everything between is interpolated by clamp().
export interface FluidTypeStep {
  id: string;
  name: string;
  minSize: number;
  maxSize: number;
}

/*
  Full runtime editor state. `previewWidth` is the only field with no CSS equivalent — it drives
  the live preview's "as-if" viewport width slider, since a plain element can't be told to resolve
  `vw` against anything other than the real browser window (see computeSizeAtWidth in
  utils/fluid-type.ts, which recomputes the same linear interpolation clamp() does, in JS, against
  this value instead).
*/
export interface FluidTypeEditorState {
  minViewport: number;
  maxViewport: number;
  rootFontSize: number;
  steps: FluidTypeStep[];
  selectedStepId: string | null;
  previewWidth: number;
  pageColor: string;
}

// Excludes `selectedStepId` (pure UI state) and `previewWidth` (a preview-only scrubber position) — neither belongs in a shared permalink.
export type FluidTypeShareableState = Omit<FluidTypeEditorState, "selectedStepId" | "previewWidth">;

// A curated starting scale shown in the preset gallery.
export interface FluidTypePresetMeta {
  slug: string;
  name: string;
  minViewport: number;
  maxViewport: number;
  rootFontSize: number;
  pageColor: string;
  steps: FluidTypeStep[];
}

/*
  Every mutation FluidTypeCalculator exposes to its children, bundled into one object — mirrors
  every other goodie's own *Actions style so subcomponents never touch the reducer/undo-stack directly.
*/
export interface FluidTypeActions {
  setMinViewport: (px: number) => void;
  setMaxViewport: (px: number) => void;
  setRootFontSize: (px: number) => void;
  addStep: () => void;
  duplicateStep: (id: string) => void;
  removeStep: (id: string) => void;
  selectStep: (id: string | null) => void;
  updateStep: (id: string, patch: Partial<Omit<FluidTypeStep, "id">>) => void;
  setPreviewWidth: (px: number) => void;
  setPageColor: (color: string) => void;
  // Checkpoints the current state onto the undo stack — call once per drag gesture or discrete edit, never per pointermove/input frame.
  commitDrag: () => void;
  applyPreset: (preset: FluidTypePresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetCalculator: () => void;
}

export interface ViewportControlsProps {
  state: FluidTypeEditorState;
  actions: FluidTypeActions;
}

export interface StepListProps {
  state: FluidTypeEditorState;
  actions: FluidTypeActions;
}

export interface StepControlsProps {
  state: FluidTypeEditorState;
  actions: FluidTypeActions;
}

export interface PreviewPaneProps {
  state: FluidTypeEditorState;
  actions: FluidTypeActions;
}

export interface ExportPanelProps {
  state: FluidTypeEditorState;
}

export interface PresetGalleryProps {
  actions: FluidTypeActions;
}

export interface ShareControlsProps {
  state: FluidTypeEditorState;
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
