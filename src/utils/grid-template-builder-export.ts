import { compileAreaItemDeclarations, compileContainerDeclarations, compileContainerStyle, compileGapValue, compileTrackList, hasAnyArea, listAreaNames } from "@/utils/grid-template-builder";
import type { GridAreaMap, GridTemplateBuilderEditorState, GridTrack } from "@/interfaces/grid-template-builder";

function declarationsToCss(declarations: Array<[string, string]>): string {
  return declarations.map(([property, value]) => `  ${property}: ${value};`).join("\n");
}

// `.grid { ... }` plus one `.<area-name> { grid-area: <area-name>; }` rule per named area, in first-appearance order — a multi-rule stylesheet rather than one declaration, since a real layout is never just the container's own CSS the way a single shadow or gradient is.
export function toCssDeclaration(state: GridTemplateBuilderEditorState): string {
  const containerBlock = `.grid {\n${declarationsToCss(compileContainerDeclarations(state))}\n}`;
  if (!(state.areasEnabled && hasAnyArea(state.areas))) return containerBlock;

  const areaBlocks = listAreaNames(state.areas).map((name) => `.${name} {\n${declarationsToCss(compileAreaItemDeclarations(name))}\n}`);
  return [containerBlock, ...areaBlocks].join("\n\n");
}

// track.unit === "fr" at size 1 for every track is the one shape Tailwind's own grid-cols-N/grid-rows-N utility (`repeat(N, minmax(0, 1fr))`) actually matches — anything else (minmax, auto, mixed/unequal sizes) falls back to the arbitrary-value form so the class never lies about what it renders.
function tracksToTailwind(tracks: GridTrack[], prefix: "grid-cols" | "grid-rows"): string {
  const isUniformFr = tracks.length > 0 && tracks.every((track) => track.unit === "fr" && track.size === 1);
  if (isUniformFr) return `${prefix}-${tracks.length}`;
  return `${prefix}-[${compileTrackList(tracks).replace(/\s+/g, "_")}]`;
}

// Tailwind's arbitrary-property bracket syntax reads underscores as spaces, so each quoted row is joined with `_` rather than a real newline — still parses back to the exact same multi-string grid-template-areas value once Tailwind expands the class.
function tracksAreasToTailwind(areas: GridAreaMap): string {
  const rows = areas.map((row) => `'${row.map((cell) => cell || ".").join("_")}'`);
  return `[grid-template-areas:${rows.join("_")}]`;
}

function containerToTailwindClasses(state: GridTemplateBuilderEditorState): string[] {
  const classes = ["grid", tracksToTailwind(state.columns, "grid-cols"), tracksToTailwind(state.rows, "grid-rows")];
  if (state.areasEnabled && hasAnyArea(state.areas)) classes.push(tracksAreasToTailwind(state.areas));
  classes.push(`gap-[${compileGapValue(state.rowGap, state.columnGap).replace(/\s+/g, "_")}]`);
  return classes;
}

// Markup with real Tailwind classes on a container <div> and one child <div> per named area — shown as HTML rather than bare class strings, since (like LayoutPlayground's own Tailwind tab) this tool's result is inherently more than one element's worth of classes. grid-area itself has no dedicated Tailwind utility, so each item's placement goes through the same arbitrary-property escape hatch as the container's own grid-template-areas.
export function toTailwindClass(state: GridTemplateBuilderEditorState): string {
  const containerClasses = containerToTailwindClasses(state).join(" ");
  const showAreas = state.areasEnabled && hasAnyArea(state.areas);
  const itemLines = showAreas
    ? listAreaNames(state.areas).map((name) => `  <div class="[grid-area:${name}]">${name}</div>`)
    : ["  <!-- enable named areas above to see placeholder items here -->"];

  return [`<div class="${containerClasses}">`, ...itemLines, "</div>"].join("\n");
}

function styleObjectLiteral(style: Record<string, string | number>): string {
  const entries = Object.entries(style).map(([key, value]) => `  ${key}: ${typeof value === "number" ? value : `"${value}"`}`);
  return `{\n${entries.join(",\n")}\n}`;
}

// A gridStyle object plus (only once there's something to place) an areaStyles map keyed by area name — the React-idiomatic shape for "one container, N named regions," mirroring LayoutPlayground's own containerStyle + itemStyles split for its "one container, N items" result.
export function toReactStyleObject(state: GridTemplateBuilderEditorState): string {
  const gridStyle = `const gridStyle = ${styleObjectLiteral(compileContainerStyle(state))};`;
  if (!(state.areasEnabled && hasAnyArea(state.areas))) return gridStyle;

  const entries = listAreaNames(state.areas)
    .map((name) => `  ${name}: { gridArea: "${name}" }`)
    .join(",\n");
  return `${gridStyle}\n\nconst areaStyles = {\n${entries}\n};`;
}
