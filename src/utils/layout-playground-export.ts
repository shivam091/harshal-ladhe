import { compileContainerDeclarations, compileContainerStyle, compileItemDeclarations, compileItemStyle, compileTrackList } from "@/utils/layout-playground";
import type {
  ContentAlignment,
  FlexAlignSelf,
  FlexDirection,
  FlexWrap,
  GridAlignment,
  GridAutoFlow,
  GridSelfAlignment,
  GridTrack,
  LayoutEditorState,
  LayoutItem
} from "@/interfaces/layout-playground";

// Renders an ordered [property, value] list as indented CSS declaration lines.
function declarationsToCss(declarations: Array<[string, string]>): string {
  return declarations.map(([property, value]) => `  ${property}: ${value};`).join("\n");
}

// `.container { ... }` plus one `.item-N { ... }` rule per item, in preview order — a multi-rule stylesheet rather than one declaration, since a layout is never just one element's worth of CSS the way a gradient or shadow is.
export function toCssDeclaration(state: LayoutEditorState): string {
  const containerBlock = `.container {\n${declarationsToCss(compileContainerDeclarations(state))}\n}`;
  const itemBlocks = state.items.map((item, index) => `.item-${index + 1} {\n${declarationsToCss(compileItemDeclarations(item, state.mode))}\n}`);
  return [containerBlock, ...itemBlocks].join("\n\n");
}

// flex-direction keyword → Tailwind utility.
const FLEX_DIRECTION_CLASS: Record<FlexDirection, string> = { row: "flex-row", "row-reverse": "flex-row-reverse", column: "flex-col", "column-reverse": "flex-col-reverse" };
// flex-wrap keyword → Tailwind utility.
const FLEX_WRAP_CLASS: Record<FlexWrap, string> = { nowrap: "flex-nowrap", wrap: "flex-wrap", "wrap-reverse": "flex-wrap-reverse" };
// justify-content keyword → Tailwind utility.
const JUSTIFY_CLASS: Record<ContentAlignment, string> = {
  "flex-start": "justify-start",
  "flex-end": "justify-end",
  center: "justify-center",
  "space-between": "justify-between",
  "space-around": "justify-around",
  "space-evenly": "justify-evenly",
  stretch: "justify-stretch"
};
// align-items keyword → Tailwind utility (shared by flex and grid, since both spell align-items with the same start/end/center/stretch set).
const ALIGN_ITEMS_CLASS: Record<GridAlignment, string> = { stretch: "items-stretch", start: "items-start", end: "items-end", center: "items-center" };
// align-content keyword → Tailwind utility.
const ALIGN_CONTENT_CLASS: Record<ContentAlignment, string> = {
  "flex-start": "content-start",
  "flex-end": "content-end",
  center: "content-center",
  "space-between": "content-between",
  "space-around": "content-around",
  "space-evenly": "content-evenly",
  stretch: "content-stretch"
};
// grid-auto-flow keyword → Tailwind utility.
const AUTO_FLOW_CLASS: Record<GridAutoFlow, string> = { row: "grid-flow-row", column: "grid-flow-col", "row dense": "grid-flow-row-dense", "column dense": "grid-flow-col-dense" };
// justify-items keyword → Tailwind utility.
const JUSTIFY_ITEMS_CLASS: Record<GridAlignment, string> = { stretch: "justify-items-stretch", start: "justify-items-start", end: "justify-items-end", center: "justify-items-center" };
// align-self keyword (flex's own set, including baseline) → Tailwind utility.
const FLEX_ALIGN_SELF_CLASS: Record<FlexAlignSelf, string> = {
  auto: "self-auto",
  "flex-start": "self-start",
  "flex-end": "self-end",
  center: "self-center",
  baseline: "self-baseline",
  stretch: "self-stretch"
};
// align-self keyword (grid's own set) → Tailwind utility.
const GRID_SELF_CLASS: Record<GridSelfAlignment, string> = { auto: "self-auto", stretch: "self-stretch", start: "self-start", end: "self-end", center: "self-center" };
// justify-self keyword (grid's own set) → Tailwind utility.
const GRID_JUSTIFY_SELF_CLASS: Record<GridSelfAlignment, string> = {
  auto: "justify-self-auto",
  stretch: "justify-self-stretch",
  start: "justify-self-start",
  end: "justify-self-end",
  center: "justify-self-center"
};

// `grid-cols-N`/`grid-rows-N` only reads correctly when every track is an equal `1fr` share, which is exactly what that utility itself produces (`repeat(N, minmax(0, 1fr))`) — anything else (mixed units, unequal fr weights) falls back to the arbitrary-value form so the class never lies about what it renders.
function tracksToTailwind(tracks: GridTrack[], prefix: "grid-cols" | "grid-rows"): string {
  const isUniformFr = tracks.length > 0 && tracks.every((track) => track.unit === "fr" && track.size === 1);
  if (isUniformFr) return `${prefix}-${tracks.length}`;
  return `${prefix}-[${compileTrackList(tracks).replace(/\s+/g, "_")}]`;
}

// Every Tailwind utility class the current container config maps onto, container-level only (per-item classes are built separately below).
function containerToTailwindClasses(state: LayoutEditorState): string[] {
  if (state.mode === "flex") {
    const { direction, wrap, justifyContent, alignItems, alignContent } = state.flexContainer;
    return ["flex", FLEX_DIRECTION_CLASS[direction], FLEX_WRAP_CLASS[wrap], JUSTIFY_CLASS[justifyContent], ALIGN_ITEMS_CLASS[alignItems], ALIGN_CONTENT_CLASS[alignContent], `gap-[${state.gap}px]`];
  }

  const { columns, rows, autoFlow, justifyItems, alignItems, justifyContent, alignContent } = state.gridContainer;
  return [
    "grid",
    tracksToTailwind(columns, "grid-cols"),
    tracksToTailwind(rows, "grid-rows"),
    AUTO_FLOW_CLASS[autoFlow],
    JUSTIFY_ITEMS_CLASS[justifyItems],
    ALIGN_ITEMS_CLASS[alignItems],
    JUSTIFY_CLASS[justifyContent],
    ALIGN_CONTENT_CLASS[alignContent],
    `gap-[${state.gap}px]`
  ];
}

// order/grow/shrink/basis each have a real Tailwind utility for their single most common value (order-none, grow, shrink, basis-auto) — everything else falls back to that utility's own arbitrary-value form rather than guessing at Tailwind's numeric step scale, which this tool's free-form sliders won't reliably land on.
function flexItemToTailwindClasses(item: LayoutItem): string[] {
  const { order, grow, shrink, basis, alignSelf } = item.flex;
  const orderClass = order === 0 ? "order-none" : `order-[${order}]`;
  const growClass = grow === 0 ? "grow-0" : grow === 1 ? "grow" : `grow-[${grow}]`;
  const shrinkClass = shrink === 0 ? "shrink-0" : shrink === 1 ? "shrink" : `shrink-[${shrink}]`;
  const basisClass = basis === "auto" ? "basis-auto" : `basis-[${basis}]`;
  return [orderClass, growClass, shrinkClass, basisClass, FLEX_ALIGN_SELF_CLASS[alignSelf]];
}

// Placement uses arbitrary-property syntax rather than Tailwind's col-start-N/col-span-N utilities — those only cover a fixed 1-12/1-13 range, and a start+span combination that overshoots it would otherwise silently produce wrong (or no) output instead of the value this tool actually compiled.
function gridItemToTailwindClasses(item: LayoutItem): string[] {
  const { columnStart, columnSpan, rowStart, rowSpan, justifySelf, alignSelf } = item.grid;
  return [
    `[grid-column:${columnStart}_/_span_${columnSpan}]`,
    `[grid-row:${rowStart}_/_span_${rowSpan}]`,
    GRID_JUSTIFY_SELF_CLASS[justifySelf],
    GRID_SELF_CLASS[alignSelf]
  ];
}

// Markup with real Tailwind classes on a container <div> and one child <div> per item — shown as HTML rather than bare class strings, since (unlike every other goodie's single-property output) this tool's result is inherently more than one element's worth of classes.
export function toTailwindClass(state: LayoutEditorState): string {
  const containerClasses = containerToTailwindClasses(state).join(" ");
  const itemLines = state.items.map((item, index) => {
    const classes = (state.mode === "flex" ? flexItemToTailwindClasses(item) : gridItemToTailwindClasses(item)).join(" ");
    return `  <div class="${classes}"></div><!-- item ${index + 1} -->`;
  });

  return [`<div class="${containerClasses}">`, ...itemLines, "</div>"].join("\n");
}

// Renders a camelCased style object as a JS object-literal source string.
function styleObjectLiteral(style: Record<string, string | number>): string {
  const entries = Object.entries(style).map(([key, value]) => `  ${key}: ${typeof value === "number" ? value : `"${value}"`}`);
  return `{\n${entries.join(",\n")}\n}`;
}

// A containerStyle object plus an itemStyles array, in preview order — the React-idiomatic shape for "one container, N items," rather than forcing this multi-element result into the single style-object format every other goodie's React tab uses.
export function toReactStyleObject(state: LayoutEditorState): string {
  const containerStyle = `const containerStyle = ${styleObjectLiteral(compileContainerStyle(state))};`;
  const itemStyles = state.items.map((item) => styleObjectLiteral(compileItemStyle(item, state.mode))).join(",\n");
  return `${containerStyle}\n\nconst itemStyles = [\n${itemStyles}\n];`;
}
