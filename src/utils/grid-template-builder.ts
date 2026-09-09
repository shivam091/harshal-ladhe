import { toFixed } from "@/utils/number";
import type { GridAreaMap, GridTemplateBuilderEditorState, GridTrack, TrackValueUnit } from "@/interfaces/grid-template-builder";

// Cycled by an area's or numbered placeholder's own position — deterministic (stable across re-renders/undo) rather than random, same reasoning LayoutPlayground's own ITEM_COLORS cycling applies.
export const AREA_COLORS = ["#6366f1", "#ec4899", "#22c55e", "#f97316", "#0ea5e9", "#a855f7", "#eab308", "#14b8a6"];

// Picks a track/area's display color purely from its position in a list — the one place every consumer (AreaPainter, PreviewPane, PresetGallery) reads from so the same name/index always renders the same color everywhere.
export function colorForIndex(index: number): string {
  return AREA_COLORS[index % AREA_COLORS.length];
}

// A plain value/unit pair as CSS text — "auto" has no number, the other three units do.
function compileTrackValue(unit: TrackValueUnit, size: number): string {
  if (unit === "auto") return "auto";
  return `${toFixed(size, 2)}${unit}`;
}

// One track's own CSS text — minmax() nests two independent value/unit pairs, everything else is a single value/unit pair.
export function compileTrack(track: GridTrack): string {
  if (track.unit === "minmax") return `minmax(${compileTrackValue(track.minUnit, track.minSize)}, ${compileTrackValue(track.maxUnit, track.maxSize)})`;
  return compileTrackValue(track.unit, track.size);
}

// "1fr 200px minmax(100px, 1fr)" — an empty list compiles to "none" (grid-template-columns/rows' own actual default), letting a track list start empty without producing invalid or misleading CSS.
export function compileTrackList(tracks: GridTrack[]): string {
  return tracks.length > 0 ? tracks.map(compileTrack).join(" ") : "none";
}

// The distinct, non-empty area names in the order they first appear reading the map row-major (top-to-bottom, left-to-right) — the single source of truth every consumer (area chip row, per-area preview items, per-area CSS rules) derives its own name list from, rather than each keeping its own copy that could drift out of sync with `areas` itself.
export function listAreaNames(areas: GridAreaMap): string[] {
  const seen: string[] = [];
  for (const row of areas) {
    for (const cell of row) {
      if (cell && !seen.includes(cell)) seen.push(cell);
    }
  }
  return seen;
}

// True once at least one cell carries a name — grid-template-areas is only emitted (see compileContainerDeclarations) once there's actually something to show, so toggling "Named areas" on with a still-blank map doesn't add a meaningless all-dot declaration.
export function hasAnyArea(areas: GridAreaMap): boolean {
  return areas.some((row) => row.some((cell) => cell !== ""));
}

// Each row as its own quoted "name name ." token — empty cells render as CSS's own "no area" placeholder character rather than an empty string, which grid-template-areas doesn't accept.
export function compileAreaRows(areas: GridAreaMap): string[] {
  return areas.map((row) => `"${row.map((cell) => cell || ".").join(" ")}"`);
}

// Multi-line grid-template-areas value, each row's quoted string indented onto its own line the way a developer would hand-format it.
export function compileAreasValue(areas: GridAreaMap): string {
  return compileAreaRows(areas).join("\n    ");
}

// "12px" if the two gaps match, "12px 8px" (row then column, matching the `gap` shorthand's own row-first order) otherwise — keeps the common "one uniform gap" case from printing a redundant two-value declaration.
export function compileGapValue(rowGap: number, columnGap: number): string {
  const row = toFixed(rowGap, 1);
  const column = toFixed(columnGap, 1);
  return row === column ? `${row}px` : `${row}px ${column}px`;
}

/*
  Container declarations as an ordered list of [property, value] pairs rather than a plain object —
  CSS declaration order in the export panel should read top-to-bottom the way a developer would
  actually write it (display, then tracks, then areas, then gap), which a plain object's key order
  can't be trusted to preserve as reliably once it's round-tripped through state updates.
*/
export function compileContainerDeclarations(state: GridTemplateBuilderEditorState): Array<[string, string]> {
  const declarations: Array<[string, string]> = [
    ["display", "grid"],
    ["grid-template-columns", compileTrackList(state.columns)],
    ["grid-template-rows", compileTrackList(state.rows)]
  ];
  if (state.areasEnabled && hasAnyArea(state.areas)) declarations.push(["grid-template-areas", compileAreasValue(state.areas)]);
  declarations.push(["gap", compileGapValue(state.rowGap, state.columnGap)]);
  return declarations;
}

// Live inline-style object for PreviewPane's actual grid element — same source data as compileContainerDeclarations, just camelCased and keyed for React's style prop instead of formatted as CSS text.
export function compileContainerStyle(state: GridTemplateBuilderEditorState): Record<string, string> {
  const style: Record<string, string> = {
    display: "grid",
    gridTemplateColumns: compileTrackList(state.columns),
    gridTemplateRows: compileTrackList(state.rows),
    gap: compileGapValue(state.rowGap, state.columnGap)
  };
  if (state.areasEnabled && hasAnyArea(state.areas)) style.gridTemplateAreas = compileAreasValue(state.areas);
  return style;
}

// One named area's own declaration — every item that mode places is positioned purely by name, never by explicit column/row lines, so grid-area is the only property either the CSS or React export ever needs to emit for it.
export function compileAreaItemDeclarations(name: string): Array<[string, string]> {
  return [["grid-area", name]];
}
