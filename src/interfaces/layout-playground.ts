export type LayoutMode = "flex" | "grid";

export type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
// Shared by flex's justify-content/align-content and grid's own (the CSS Box Alignment module unifies these keywords across both layout modes, so one type serves both rather than two near-identical ones).
export type ContentAlignment = "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly" | "stretch";
export type FlexAlignSelf = "auto" | "flex-start" | "flex-end" | "center" | "baseline" | "stretch";

export type GridAutoFlow = "row" | "column" | "row dense" | "column dense";
// Grid's own item-alignment keyword set (start/end, not flex-start/flex-end) — distinct from FlexAlignSelf even though both ultimately drive align-items/align-self, because the two layout modes spell the same concept differently.
export type GridAlignment = "stretch" | "start" | "end" | "center";
export type GridSelfAlignment = "auto" | "stretch" | "start" | "end" | "center";

export type TrackUnit = "fr" | "px" | "%" | "auto";

// One grid-template-columns/rows track — `size` is ignored for the "auto" unit (kept in state anyway so switching a track back to a sized unit doesn't lose whatever value it last had).
export interface GridTrack {
  id: string;
  size: number;
  unit: TrackUnit;
}

export interface FlexContainerConfig {
  direction: FlexDirection;
  wrap: FlexWrap;
  justifyContent: ContentAlignment;
  alignItems: GridAlignment;
  alignContent: ContentAlignment;
}

export interface GridContainerConfig {
  columns: GridTrack[];
  rows: GridTrack[];
  autoFlow: GridAutoFlow;
  justifyItems: GridAlignment;
  alignItems: GridAlignment;
  justifyContent: ContentAlignment;
  alignContent: ContentAlignment;
}

export interface FlexItemProps {
  order: number;
  grow: number;
  shrink: number;
  basis: string;
  alignSelf: FlexAlignSelf;
}

export interface GridItemProps {
  columnStart: number;
  columnSpan: number;
  rowStart: number;
  rowSpan: number;
  justifySelf: GridSelfAlignment;
  alignSelf: GridSelfAlignment;
}

/*
  One preview box. Carries BOTH flex and grid property sets at once rather than only whichever
  mode is active — switching LayoutMode this way never discards an item's grid placement just
  because the user is currently looking at flex mode, matching how GradientGenerator keeps a
  gradient's stops untouched across a type switch.
*/
export interface LayoutItem {
  id: string;
  label: string;
  color: string;
  flex: FlexItemProps;
  grid: GridItemProps;
}

/*
  Full runtime editor state. No ephemeral ClipPath/Gradient/BoxShadow/BorderRadius-style
  "selectedX" field is excluded from the shareable slice here — selectedItemId genuinely is
  excluded (see LayoutShareableState), it's the one piece of UI-only state this tool has.
*/
export interface LayoutEditorState {
  mode: LayoutMode;
  gap: number;
  // The preview stage's own width — wrap and track behavior only mean anything relative to available space, so letting the "viewport" itself resize is what actually demonstrates them.
  containerWidth: number;
  flexContainer: FlexContainerConfig;
  gridContainer: GridContainerConfig;
  items: LayoutItem[];
  selectedItemId: string | null;
}

// Deliberately narrower than LayoutEditorState — the only slice serialized into a permalink. Excludes `selectedItemId` (pure UI state) so a shared link never depends on what the sender happened to have selected.
export type LayoutShareableState = Omit<LayoutEditorState, "selectedItemId">;

// A curated starting layout shown in the preset gallery — a plain bundle of the same fields a thumbnail needs to render itself with the exact compileContainerStyle/compileItemStyle calls the main preview uses.
export interface LayoutPresetMeta {
  slug: string;
  name: string;
  mode: LayoutMode;
  gap: number;
  containerWidth: number;
  flexContainer: FlexContainerConfig;
  gridContainer: GridContainerConfig;
  items: LayoutItem[];
}

/*
  Every mutation LayoutPlayground exposes to its children, bundled into one object (mirrors every
  other goodie's *Actions style) so subcomponents never touch the reducer/undo-stack directly.
*/
export interface LayoutActions {
  setMode: (mode: LayoutMode) => void;
  setGap: (gap: number) => void;
  setContainerWidth: (width: number) => void;
  updateFlexContainer: (patch: Partial<FlexContainerConfig>) => void;
  updateGridContainer: (patch: Partial<Omit<GridContainerConfig, "columns" | "rows">>) => void;
  addColumnTrack: () => void;
  removeColumnTrack: (id: string) => void;
  updateColumnTrack: (id: string, patch: Partial<Omit<GridTrack, "id">>) => void;
  addRowTrack: () => void;
  removeRowTrack: (id: string) => void;
  updateRowTrack: (id: string, patch: Partial<Omit<GridTrack, "id">>) => void;
  addItem: () => void;
  duplicateItem: (id: string) => void;
  removeItem: (id: string) => void;
  selectItem: (id: string | null) => void;
  updateFlexItem: (id: string, patch: Partial<FlexItemProps>) => void;
  updateGridItem: (id: string, patch: Partial<GridItemProps>) => void;
  // Checkpoints the current state onto the undo stack — call once per drag gesture or discrete edit, never per pointermove/input frame.
  commitDrag: () => void;
  applyPreset: (preset: LayoutPresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetLayout: () => void;
}

export interface ModeControlsProps {
  state: LayoutEditorState;
  actions: LayoutActions;
}

export interface FlexContainerControlsProps {
  state: LayoutEditorState;
  actions: LayoutActions;
}

export interface GridContainerControlsProps {
  state: LayoutEditorState;
  actions: LayoutActions;
}

export interface ItemListProps {
  state: LayoutEditorState;
  actions: LayoutActions;
}

export interface ItemControlsProps {
  state: LayoutEditorState;
  actions: LayoutActions;
}

export interface PreviewPaneProps {
  state: LayoutEditorState;
  actions: LayoutActions;
}

export interface ExportPanelProps {
  state: LayoutEditorState;
}

export interface PresetGalleryProps {
  actions: LayoutActions;
}

export interface ShareControlsProps {
  state: LayoutEditorState;
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
