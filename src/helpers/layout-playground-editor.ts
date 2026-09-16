import { clamp } from "@/utils/number";
import { generateId } from "@/utils/random";
import type {
  FlexContainerConfig,
  FlexItemProps,
  GridContainerConfig,
  GridItemProps,
  GridTrack,
  LayoutEditorState,
  LayoutItem,
  LayoutPresetMeta
} from "@/interfaces/layout-playground";

// Cycled by an item's own position rather than picked randomly — a freshly added item's color is then always predictable (and stable across re-renders/undo) instead of jittering on every add.
const ITEM_COLORS = ["#6366f1", "#ec4899", "#22c55e", "#f97316", "#0ea5e9", "#a855f7", "#eab308", "#14b8a6"];

// A freshly added item's flex overrides — grow 0/shrink 1/basis auto is exactly flexbox's own initial state, so a new box behaves like a plain, un-overridden flex child until it's touched.
function defaultFlexItem(): FlexItemProps {
  return { order: 0, grow: 0, shrink: 1, basis: "auto", alignSelf: "auto" };
}

/*
  GridItemProps has no "auto" placement state — every item always compiles to an explicit
  grid-column/grid-row (see compileItemDeclarations) — so a new item defaulting to columnStart: 1,
  rowStart: 1 unconditionally would stack it exactly on top of cell (1,1) regardless of how many
  items already exist there. `columnCount` (the CURRENT grid's own column-track count, not a fixed
  default) lets addItem instead tile new items left-to-right, top-to-bottom across however many
  columns the grid actually has right now, the closest approximation of "auto-place it" this tool's
  always-explicit placement model can offer.
*/
function defaultGridItem(index: number, columnCount: number): GridItemProps {
  const columns = Math.max(1, columnCount);
  return { columnStart: (index % columns) + 1, columnSpan: 1, rowStart: Math.floor(index / columns) + 1, rowSpan: 1, justifySelf: "stretch", alignSelf: "stretch" };
}

// Builds one fresh item at `index`, deriving both its default flex overrides and its tiled grid placement so it drops in sensibly regardless of which mode is currently active.
function createItem(index: number, columnCount: number): LayoutItem {
  return { id: generateId(), label: `${index + 1}`, color: ITEM_COLORS[index % ITEM_COLORS.length], flex: defaultFlexItem(), grid: defaultGridItem(index, columnCount) };
}

// A fresh flex container's initial properties — flexbox's own real defaults, so a brand-new layout renders exactly like an un-styled `display: flex` box until something is changed.
function defaultFlexContainer(): FlexContainerConfig {
  return { direction: "row", wrap: "nowrap", justifyContent: "flex-start", alignItems: "stretch", alignContent: "stretch" };
}

// Builds one grid track with a fresh id — every track needs its own stable id for React keys and for addTrack/removeTrack/updateTrack to target it.
function track(size: number, unit: GridTrack["unit"]): GridTrack {
  return { id: generateId(), size, unit };
}

// A fresh grid container's initial properties — three equal `1fr` columns and one `1fr` row is a small, immediately legible starting grid rather than an empty (and so invisible) one.
function defaultGridContainer(): GridContainerConfig {
  return {
    columns: [track(1, "fr"), track(1, "fr"), track(1, "fr")],
    rows: [track(1, "fr")],
    autoFlow: "row",
    justifyItems: "stretch",
    alignItems: "stretch",
    justifyContent: "flex-start",
    alignContent: "stretch"
  };
}

// The only slice of state a permalink or autosave actually carries — see LayoutShareableState's own comment for why selectedItemId is excluded.
export function toShareableState(state: LayoutEditorState): Omit<LayoutEditorState, "selectedItemId"> {
  const { mode, gap, containerWidth, flexContainer, gridContainer, items } = state;
  return { mode, gap, containerWidth, flexContainer, gridContainer, items };
}

// The tool's very first render, a manual "reset", and the fallback when a `?state=` link or autosave can't be decoded — three plain boxes in flex mode is a small enough starting layout to read at a glance.
export function createDefaultEditorState(): LayoutEditorState {
  const gridContainer = defaultGridContainer();
  const items = Array.from({ length: 3 }, (_, i) => createItem(i, gridContainer.columns.length));
  return {
    mode: "flex",
    gap: 16,
    containerWidth: 480,
    flexContainer: defaultFlexContainer(),
    gridContainer,
    items,
    selectedItemId: items[0].id
  };
}

// Switches between Flexbox and Grid — both container configs and every item's overrides for both stay intact underneath, so flipping back and forth never loses either mode's own settings.
export function setMode(state: LayoutEditorState, mode: LayoutEditorState["mode"]): LayoutEditorState {
  return { ...state, mode };
}

// Floors at 0 — a negative gap has no CSS meaning.
export function setGap(state: LayoutEditorState, gap: number): LayoutEditorState {
  return { ...state, gap: Math.max(0, gap) };
}

// Clamped to a sensible drafting-sheet range so the preview stage can never collapse to nothing or overflow its panel.
export function setContainerWidth(state: LayoutEditorState, width: number): LayoutEditorState {
  return { ...state, containerWidth: clamp(width, 200, 900) };
}

// Merges a partial patch into the flex container config — used by every flex control field (direction/wrap/justify/align).
export function updateFlexContainer(state: LayoutEditorState, patch: Partial<FlexContainerConfig>): LayoutEditorState {
  return { ...state, flexContainer: { ...state.flexContainer, ...patch } };
}

// Merges a partial patch into the grid container's non-track properties (autoFlow/justifyItems/alignItems/justifyContent/alignContent) — track lists themselves go through addColumnTrack/removeColumnTrack/updateColumnTrack and their row counterparts instead.
export function updateGridContainer(state: LayoutEditorState, patch: Partial<Omit<GridContainerConfig, "columns" | "rows">>): LayoutEditorState {
  return { ...state, gridContainer: { ...state.gridContainer, ...patch } };
}

// Appends one fresh `1fr` track — shared by both the column and row track lists below.
function addTrack(tracks: GridTrack[]): GridTrack[] {
  return [...tracks, track(1, "fr")];
}
// Drops the track with the given id — shared by both the column and row track lists below.
function removeTrack(tracks: GridTrack[], id: string): GridTrack[] {
  return tracks.filter((t) => t.id !== id);
}
// Patches the track with the given id — shared by both the column and row track lists below.
function updateTrack(tracks: GridTrack[], id: string, patch: Partial<Omit<GridTrack, "id">>): GridTrack[] {
  return tracks.map((t) => (t.id === id ? { ...t, ...patch } : t));
}

// Adds one column track (grid-template-columns).
export function addColumnTrack(state: LayoutEditorState): LayoutEditorState {
  return { ...state, gridContainer: { ...state.gridContainer, columns: addTrack(state.gridContainer.columns) } };
}
// Removes one column track (grid-template-columns).
export function removeColumnTrack(state: LayoutEditorState, id: string): LayoutEditorState {
  return { ...state, gridContainer: { ...state.gridContainer, columns: removeTrack(state.gridContainer.columns, id) } };
}
// Patches one column track's own size/unit (grid-template-columns).
export function updateColumnTrack(state: LayoutEditorState, id: string, patch: Partial<Omit<GridTrack, "id">>): LayoutEditorState {
  return { ...state, gridContainer: { ...state.gridContainer, columns: updateTrack(state.gridContainer.columns, id, patch) } };
}
// Adds one row track (grid-template-rows).
export function addRowTrack(state: LayoutEditorState): LayoutEditorState {
  return { ...state, gridContainer: { ...state.gridContainer, rows: addTrack(state.gridContainer.rows) } };
}
// Removes one row track (grid-template-rows).
export function removeRowTrack(state: LayoutEditorState, id: string): LayoutEditorState {
  return { ...state, gridContainer: { ...state.gridContainer, rows: removeTrack(state.gridContainer.rows, id) } };
}
// Patches one row track's own size/unit (grid-template-rows).
export function updateRowTrack(state: LayoutEditorState, id: string, patch: Partial<Omit<GridTrack, "id">>): LayoutEditorState {
  return { ...state, gridContainer: { ...state.gridContainer, rows: updateTrack(state.gridContainer.rows, id, patch) } };
}

// Appends one fresh item, tiled into the grid's current column count, and selects it so ItemControls immediately shows its fields.
export function addItem(state: LayoutEditorState): LayoutEditorState {
  const item = createItem(state.items.length, state.gridContainer.columns.length);
  return { ...state, items: [...state.items, item], selectedItemId: item.id };
}

// Deep-copies an item (both its flex and grid overrides) right after itself in the list, with a fresh id/label, and selects the copy.
export function duplicateItem(state: LayoutEditorState, id: string): LayoutEditorState {
  const index = state.items.findIndex((item) => item.id === id);
  if (index === -1) return state;
  const copy: LayoutItem = { ...structuredClone(state.items[index]), id: generateId(), label: `${state.items.length + 1}` };
  const items = [...state.items];
  items.splice(index + 1, 0, copy);
  return { ...state, items, selectedItemId: copy.id };
}

// No floor on item count — an empty flex/grid container is valid CSS (it just renders nothing inside), same reasoning box-shadow's removeLayer already applied to its own arbitrary list.
export function removeItem(state: LayoutEditorState, id: string): LayoutEditorState {
  const items = state.items.filter((item) => item.id !== id);
  const selectedItemId = state.selectedItemId === id ? (items[0]?.id ?? null) : state.selectedItemId;
  return { ...state, items, selectedItemId };
}

// Marks which item ItemControls shows fields for — pure UI state, not part of the shareable slice.
export function selectItem(state: LayoutEditorState, id: string | null): LayoutEditorState {
  return { ...state, selectedItemId: id };
}

// Merges a partial patch into one item's flex overrides (order/grow/shrink/basis/align-self).
export function updateFlexItem(state: LayoutEditorState, id: string, patch: Partial<FlexItemProps>): LayoutEditorState {
  return { ...state, items: state.items.map((item) => (item.id === id ? { ...item, flex: { ...item.flex, ...patch } } : item)) };
}
// Merges a partial patch into one item's grid overrides (column/row start+span, justify-self/align-self).
export function updateGridItem(state: LayoutEditorState, id: string, patch: Partial<GridItemProps>): LayoutEditorState {
  return { ...state, items: state.items.map((item) => (item.id === id ? { ...item, grid: { ...item.grid, ...patch } } : item)) };
}

// Regenerates every item's (and track's) id from the preset's own static copy — applying the same preset twice in a row would otherwise leave every item sharing ids with the first application, which is harmless today (presets replace the whole array rather than merge into it) but is the same defensive convention BoxShadowGenerator's own applyPreset already set.
export function applyPreset(state: LayoutEditorState, preset: LayoutPresetMeta): LayoutEditorState {
  const items = structuredClone(preset.items).map((item) => ({ ...item, id: generateId() }));
  const gridContainer = structuredClone(preset.gridContainer);
  gridContainer.columns = gridContainer.columns.map((t) => ({ ...t, id: generateId() }));
  gridContainer.rows = gridContainer.rows.map((t) => ({ ...t, id: generateId() }));

  return {
    ...state,
    mode: preset.mode,
    gap: preset.gap,
    containerWidth: preset.containerWidth,
    flexContainer: structuredClone(preset.flexContainer),
    gridContainer,
    items,
    selectedItemId: items[0]?.id ?? null
  };
}

// Discards the whole editor and starts over from a fresh default layout — the tool's "reset" action.
export function resetLayout(): LayoutEditorState {
  return createDefaultEditorState();
}
