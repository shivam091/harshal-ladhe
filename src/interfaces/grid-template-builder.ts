// Every unit a track's own fixed length can be expressed in — "auto" has no numeric size at all, the other three pair with a number (see GridTrack.size).
export type TrackValueUnit = "px" | "rem" | "fr" | "auto";

// A track's outer shape: either one of the plain TrackValueUnits, or "minmax" — a compound track whose real bounds live in GridTrack's own min*/max* fields instead of `size`.
export type TrackUnit = TrackValueUnit | "minmax";

/*
  One grid-template-columns/rows track. Every field is always present regardless of which `unit`
  is active — `size` for a plain px/rem/fr track, `minUnit`/`minSize`/`maxUnit`/`maxSize` for a
  minmax() track — so switching a track's unit back and forth (e.g. fr → minmax → fr) never loses
  whatever numbers were last dialled in, the same "keep every mode's fields in state" approach
  TriangleEditorState's own `notch` already uses for a field that only clip-path chevrons read.
*/
export interface GridTrack {
  id: string;
  unit: TrackUnit;
  // Meaningful only when unit is "px" | "rem" | "fr" — ignored (but retained) for "auto" and "minmax".
  size: number;
  minUnit: TrackValueUnit;
  minSize: number;
  maxUnit: TrackValueUnit;
  maxSize: number;
}

/*
  Row-major grid of area names, always sized rows.length × columns.length regardless of whether
  named-areas mode is currently on — resizeAreas keeps it in sync every time a track is added or
  removed so toggling the mode on never finds a stale or mis-sized grid underneath it. An empty
  string means "no named area" and compiles to CSS's own "." placeholder cell.
*/
export type GridAreaMap = string[][];

/*
  Full runtime editor state. `activeAreaName` is the one piece of pure UI state (which name the
  AreaPainter's next click/drag paints with) — excluded from GridTemplateBuilderShareableState the
  same way LayoutEditorState excludes its own selectedItemId, since a shared link shouldn't depend
  on what brush the sender happened to have selected.
*/
export interface GridTemplateBuilderEditorState {
  columns: GridTrack[];
  rows: GridTrack[];
  rowGap: number;
  columnGap: number;
  // Whether grid-template-areas participates in the compiled output/preview at all — off by default so a fresh grid reads as plain tracks first, the same progressive-disclosure the border/clip-path technique toggle applies in TriangleGenerator.
  areasEnabled: boolean;
  areas: GridAreaMap;
  activeAreaName: string;
}

// Deliberately narrower than GridTemplateBuilderEditorState — the only slice serialized into a permalink. Excludes `activeAreaName` (pure UI state).
export type GridTemplateBuilderShareableState = Omit<GridTemplateBuilderEditorState, "activeAreaName">;

// A curated starting layout shown in the preset gallery — a plain bundle of the same fields a thumbnail needs to render itself with the exact compileContainerStyle call the main preview uses.
export interface GridTemplateBuilderPresetMeta {
  slug: string;
  name: string;
  columns: GridTrack[];
  rows: GridTrack[];
  rowGap: number;
  columnGap: number;
  areas: GridAreaMap;
}

/*
  Every mutation GridTemplateBuilder exposes to its children, bundled into one object — mirrors
  every other goodie's own *Actions style so subcomponents never touch the reducer/undo-stack
  directly.
*/
export interface GridTemplateBuilderActions {
  addColumnTrack: () => void;
  removeColumnTrack: (id: string) => void;
  updateColumnTrack: (id: string, patch: Partial<Omit<GridTrack, "id">>) => void;
  addRowTrack: () => void;
  removeRowTrack: (id: string) => void;
  updateRowTrack: (id: string, patch: Partial<Omit<GridTrack, "id">>) => void;
  setRowGap: (gap: number) => void;
  setColumnGap: (gap: number) => void;
  setAreasEnabled: (enabled: boolean) => void;
  setActiveAreaName: (name: string) => void;
  // Paints every cell in the inclusive rectangle [rowStart, rowEnd] × [colStart, colEnd] with `name` (an empty string erases) — the one mechanism both a single click (a 1×1 rectangle) and a click-drag go through.
  paintArea: (rowStart: number, rowEnd: number, colStart: number, colEnd: number, name: string) => void;
  // Erases every cell currently carrying `name` — what the area chip row's own remove control calls.
  clearAreaName: (name: string) => void;
  // Checkpoints the current state onto the undo stack — call once per drag gesture or discrete edit, never per pointermove/input frame.
  commitDrag: () => void;
  applyPreset: (preset: GridTemplateBuilderPresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetGrid: () => void;
}

// Props for the column/row track lists plus the row/column gap sliders.
export interface TrackControlsProps {
  state: GridTemplateBuilderEditorState;
  actions: GridTemplateBuilderActions;
}

// Props for the named-areas toggle and its click/drag painting grid.
export interface AreaPainterProps {
  state: GridTemplateBuilderEditorState;
  actions: GridTemplateBuilderActions;
}

// Props for the live CSS Grid preview — read-only, so no actions are needed.
export interface PreviewPaneProps {
  state: GridTemplateBuilderEditorState;
}

// Props for the CSS/Tailwind/React tabbed code output.
export interface ExportPanelProps {
  state: GridTemplateBuilderEditorState;
}

// Props for the click-to-apply preset gallery — only needs actions.applyPreset, never reads state.
export interface PresetGalleryProps {
  actions: GridTemplateBuilderActions;
}

// Props for the shareable-permalink control.
export interface ShareControlsProps {
  state: GridTemplateBuilderEditorState;
}

// Props for this tool's own local Slider copy — every goodie owns its copy rather than reaching into another tool's folder.
export interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
  onCommit: () => void;
}
