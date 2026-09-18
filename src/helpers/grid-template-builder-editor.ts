import { clamp } from "@/utils/number";
import { generateId } from "@/utils/random";
import type { GridAreaMap, GridTemplateBuilderEditorState, GridTemplateBuilderPresetMeta, GridTemplateBuilderShareableState, GridTrack, TrackUnit } from "@/interfaces/grid-template-builder";

// Upper bound on both axes — keeps the AreaPainter's click/drag grid at a size someone can actually paint cell-by-cell, per the tool's own "up to 6x6" design brief.
export const MAX_TRACKS = 6;

// A track's own shape regardless of `unit` — minmax defaults land on the single most common real-world pattern (`minmax(100px, 1fr)`), so switching a fresh track to minmax always starts from something meaningful rather than 0/0.
function createTrack(unit: TrackUnit, size = 1): GridTrack {
  return { id: generateId(), unit, size, minUnit: "px", minSize: 100, maxUnit: "fr", maxSize: 1 };
}

// Fresh rows.length × columns.length map of unassigned ("") cells — the shape every resize keeps every other track/area function's output consistent with.
function emptyAreas(rowCount: number, columnCount: number): GridAreaMap {
  return Array.from({ length: rowCount }, () => Array.from({ length: columnCount }, () => ""));
}

/*
  Re-shapes an existing area map onto a new row/column count, preserving whatever names already
  sit within the overlapping region — adding a track shouldn't wipe out area assignments the user
  already painted, and removing one should just crop the map down rather than erroring on the now
  out-of-range cells other functions would otherwise still try to read.
*/
export function resizeAreas(areas: GridAreaMap, rowCount: number, columnCount: number): GridAreaMap {
  return Array.from({ length: rowCount }, (_, row) => Array.from({ length: columnCount }, (_, column) => areas[row]?.[column] ?? ""));
}

// Strips `activeAreaName` (the one piece of pure UI state) before this goes to localStorage or a permalink — see GridTemplateBuilderShareableState's own comment for why.
export function toShareableState(state: GridTemplateBuilderEditorState): GridTemplateBuilderShareableState {
  const { columns, rows, rowGap, columnGap, areasEnabled, areas } = state;
  return { columns, rows, rowGap, columnGap, areasEnabled, areas };
}

// A plain 3×2 equal-fr grid with named areas off — a fresh grid should read as bare tracks first, not lead with a feature (named areas) someone hasn't opted into yet.
export function createDefaultEditorState(): GridTemplateBuilderEditorState {
  const columns = [createTrack("fr", 1), createTrack("fr", 1), createTrack("fr", 1)];
  const rows = [createTrack("fr", 1), createTrack("fr", 1)];
  return {
    columns,
    rows,
    rowGap: 12,
    columnGap: 12,
    areasEnabled: false,
    areas: emptyAreas(rows.length, columns.length),
    activeAreaName: "header"
  };
}

// A silent no-op past MAX_TRACKS rather than an error — the Add button is already disabled at that point (see TrackControls), so this is purely a defensive floor for any other caller.
export function addColumnTrack(state: GridTemplateBuilderEditorState): GridTemplateBuilderEditorState {
  if (state.columns.length >= MAX_TRACKS) return state;
  const columns = [...state.columns, createTrack("fr", 1)];
  return { ...state, columns, areas: resizeAreas(state.areas, state.rows.length, columns.length) };
}

// Refuses to drop the last column — grid-template-columns needs at least one track to mean anything, and the Remove button is already disabled at that point (see TrackControls) so this is purely a defensive floor.
export function removeColumnTrack(state: GridTemplateBuilderEditorState, id: string): GridTemplateBuilderEditorState {
  if (state.columns.length <= 1) return state;
  const columns = state.columns.filter((track) => track.id !== id);
  return { ...state, columns, areas: resizeAreas(state.areas, state.rows.length, columns.length) };
}

// The one function every column-track field's onChange goes through — TrackControls always follows a stream of these with a single commitDrag() on blur, so this itself never needs to resize `areas` (a track's own size/unit changing never adds or removes a column).
export function updateColumnTrack(state: GridTemplateBuilderEditorState, id: string, patch: Partial<Omit<GridTrack, "id">>): GridTemplateBuilderEditorState {
  return { ...state, columns: state.columns.map((track) => (track.id === id ? { ...track, ...patch } : track)) };
}

// Row counterpart of addColumnTrack — same MAX_TRACKS floor, same reasoning.
export function addRowTrack(state: GridTemplateBuilderEditorState): GridTemplateBuilderEditorState {
  if (state.rows.length >= MAX_TRACKS) return state;
  const rows = [...state.rows, createTrack("fr", 1)];
  return { ...state, rows, areas: resizeAreas(state.areas, rows.length, state.columns.length) };
}

// Row counterpart of removeColumnTrack — same "never drop the last track" floor, same reasoning.
export function removeRowTrack(state: GridTemplateBuilderEditorState, id: string): GridTemplateBuilderEditorState {
  if (state.rows.length <= 1) return state;
  const rows = state.rows.filter((track) => track.id !== id);
  return { ...state, rows, areas: resizeAreas(state.areas, rows.length, state.columns.length) };
}

// Row counterpart of updateColumnTrack.
export function updateRowTrack(state: GridTemplateBuilderEditorState, id: string, patch: Partial<Omit<GridTrack, "id">>): GridTemplateBuilderEditorState {
  return { ...state, rows: state.rows.map((track) => (track.id === id ? { ...track, ...patch } : track)) };
}

// Bounds match TrackControls' own gap Slider range (0-64px) exactly, the same "clamp mirrors the slider it backs" convention TriangleEditorState's setWidth/setHeight already follow.
export function setRowGap(state: GridTemplateBuilderEditorState, gap: number): GridTemplateBuilderEditorState {
  return { ...state, rowGap: clamp(gap, 0, 64) };
}

// Column counterpart of setRowGap — same bounds, same reasoning.
export function setColumnGap(state: GridTemplateBuilderEditorState, gap: number): GridTemplateBuilderEditorState {
  return { ...state, columnGap: clamp(gap, 0, 64) };
}

// Toggling this off never clears `areas` itself — only whether grid-template-areas/the per-area preview items participate in the compiled output (see hasAnyArea's own callers) — so switching back on later restores exactly what was already painted.
export function setAreasEnabled(state: GridTemplateBuilderEditorState, enabled: boolean): GridTemplateBuilderEditorState {
  return { ...state, areasEnabled: enabled };
}

// Changes which name the AreaPainter's next click/drag paints with — pure UI state, excluded from GridTemplateBuilderShareableState (see its own comment).
export function setActiveAreaName(state: GridTemplateBuilderEditorState, name: string): GridTemplateBuilderEditorState {
  return { ...state, activeAreaName: name };
}

// Paints every cell of the inclusive rectangle spanning [rowStart, rowEnd] × [colStart, colEnd] — the two corners are order-independent (a drag can end up-left of where it started) and always clamped to the map's own current bounds, so a stale rectangle from before a track removal can never index out of range.
export function paintArea(state: GridTemplateBuilderEditorState, rowStart: number, rowEnd: number, colStart: number, colEnd: number, name: string): GridTemplateBuilderEditorState {
  const rowCount = state.areas.length;
  const colCount = state.areas[0]?.length ?? 0;
  const rowLo = clamp(Math.min(rowStart, rowEnd), 0, rowCount - 1);
  const rowHi = clamp(Math.max(rowStart, rowEnd), 0, rowCount - 1);
  const colLo = clamp(Math.min(colStart, colEnd), 0, colCount - 1);
  const colHi = clamp(Math.max(colStart, colEnd), 0, colCount - 1);

  const areas = state.areas.map((row, r) => (r < rowLo || r > rowHi ? row : row.map((cell, c) => (c < colLo || c > colHi ? cell : name))));
  return { ...state, areas };
}

// What the area chip row's own remove control calls — clears every cell carrying `name` in one step, rather than making someone paint over each one by hand with the Eraser.
export function clearAreaName(state: GridTemplateBuilderEditorState, name: string): GridTemplateBuilderEditorState {
  const areas = state.areas.map((row) => row.map((cell) => (cell === name ? "" : cell)));
  return { ...state, areas };
}

// Regenerates every track's id from the preset's own static copy — applying the same preset twice in a row would otherwise leave every track sharing ids with the first application, the same defensive convention LayoutPlayground's own applyPreset already sets for its tracks/items.
export function applyPreset(state: GridTemplateBuilderEditorState, preset: GridTemplateBuilderPresetMeta): GridTemplateBuilderEditorState {
  const columns = preset.columns.map((track) => ({ ...track, id: generateId() }));
  const rows = preset.rows.map((track) => ({ ...track, id: generateId() }));
  return {
    ...state,
    columns,
    rows,
    rowGap: preset.rowGap,
    columnGap: preset.columnGap,
    areasEnabled: true,
    areas: resizeAreas(structuredClone(preset.areas), rows.length, columns.length)
  };
}

// What the toolbar's own reset button calls — a fresh default grid, wired through undoStack.commit by the root component so this itself stays a pure "what should the state become" function.
export function resetGrid(): GridTemplateBuilderEditorState {
  return createDefaultEditorState();
}
