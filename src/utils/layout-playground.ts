import { toFixed } from "@/utils/number";
import type { GridTrack, LayoutEditorState, LayoutItem } from "@/interfaces/layout-playground";

function px(value: number): string {
  return `${toFixed(value, 1)}px`;
}

function compileTrack(track: GridTrack): string {
  if (track.unit === "auto") return "auto";
  return `${toFixed(track.size, 1)}${track.unit}`;
}

// "1fr 2fr 100px auto" — an empty list compiles to "none" (grid-template-columns/rows' own actual default), letting a track list start empty without producing invalid or misleading CSS.
export function compileTrackList(tracks: GridTrack[]): string {
  return tracks.length > 0 ? tracks.map(compileTrack).join(" ") : "none";
}

/*
  Container declarations as an ordered list of [property, value] pairs rather than a plain object —
  CSS declaration order in the export panel should read top-to-bottom the way a developer would
  actually write it (display first, then flow, then alignment, then spacing), which a plain object's
  key order can't be trusted to preserve as reliably once it's round-tripped through state updates.
*/
export function compileContainerDeclarations(state: LayoutEditorState): Array<[string, string]> {
  if (state.mode === "flex") {
    const { direction, wrap, justifyContent, alignItems, alignContent } = state.flexContainer;
    return [
      ["display", "flex"],
      ["flex-direction", direction],
      ["flex-wrap", wrap],
      ["justify-content", justifyContent],
      ["align-items", alignItems],
      ["align-content", alignContent],
      ["gap", px(state.gap)]
    ];
  }

  const { columns, rows, autoFlow, justifyItems, alignItems, justifyContent, alignContent } = state.gridContainer;
  return [
    ["display", "grid"],
    ["grid-template-columns", compileTrackList(columns)],
    ["grid-template-rows", compileTrackList(rows)],
    ["grid-auto-flow", autoFlow],
    ["justify-items", justifyItems],
    ["align-items", alignItems],
    ["justify-content", justifyContent],
    ["align-content", alignContent],
    ["gap", px(state.gap)]
  ];
}

// Live inline-style object for PreviewPane's actual container element — same source data as compileContainerDeclarations, just camelCased and keyed for React's style prop instead of formatted as CSS text.
export function compileContainerStyle(state: LayoutEditorState): Record<string, string> {
  if (state.mode === "flex") {
    const { direction, wrap, justifyContent, alignItems, alignContent } = state.flexContainer;
    return { display: "flex", flexDirection: direction, flexWrap: wrap, justifyContent, alignItems, alignContent, gap: px(state.gap) };
  }

  const { columns, rows, autoFlow, justifyItems, alignItems, justifyContent, alignContent } = state.gridContainer;
  return {
    display: "grid",
    gridTemplateColumns: compileTrackList(columns),
    gridTemplateRows: compileTrackList(rows),
    gridAutoFlow: autoFlow,
    justifyItems,
    alignItems,
    justifyContent,
    alignContent,
    gap: px(state.gap)
  };
}

export function compileItemDeclarations(item: LayoutItem, mode: LayoutEditorState["mode"]): Array<[string, string]> {
  if (mode === "flex") {
    const { order, grow, shrink, basis, alignSelf } = item.flex;
    return [
      ["order", `${order}`],
      ["flex-grow", `${toFixed(grow, 2)}`],
      ["flex-shrink", `${toFixed(shrink, 2)}`],
      ["flex-basis", basis],
      ["align-self", alignSelf]
    ];
  }

  const { columnStart, columnSpan, rowStart, rowSpan, justifySelf, alignSelf } = item.grid;
  return [
    ["grid-column", `${columnStart} / span ${columnSpan}`],
    ["grid-row", `${rowStart} / span ${rowSpan}`],
    ["justify-self", justifySelf],
    ["align-self", alignSelf]
  ];
}

export function compileItemStyle(item: LayoutItem, mode: LayoutEditorState["mode"]): Record<string, string | number> {
  if (mode === "flex") {
    const { order, grow, shrink, basis, alignSelf } = item.flex;
    return { order, flexGrow: grow, flexShrink: shrink, flexBasis: basis, alignSelf };
  }

  const { columnStart, columnSpan, rowStart, rowSpan, justifySelf, alignSelf } = item.grid;
  return { gridColumn: `${columnStart} / span ${columnSpan}`, gridRow: `${rowStart} / span ${rowSpan}`, justifySelf, alignSelf };
}
