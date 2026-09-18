import { compilePathData } from "@/utils/svg-path";
import type { SvgPathEditorState } from "@/interfaces/svg-path";

// The raw `d` attribute value — the tool's headline output, ready to paste into an existing `<path d="...">`.
export function toPathData(state: SvgPathEditorState): string {
  return compilePathData(state.vertices, state.closed);
}

// Shared presentation-attribute string every markup export wraps the same `d` value in.
function presentationAttrs(state: SvgPathEditorState): string {
  const fill = state.fillEnabled ? state.fillColor : "none";
  return `fill="${fill}" stroke="${state.strokeColor}" stroke-width="${state.strokeWidth}" stroke-linecap="${state.lineCap}" stroke-linejoin="${state.lineJoin}"`;
}

// Standalone, ready-to-drop `<svg>` markup at a 0-100 viewBox matching the editor's own coordinate space.
export function toSvgMarkup(state: SvgPathEditorState): string {
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">\n  <path d="${toPathData(state)}" ${presentationAttrs(state)} />\n</svg>`;
}

// React JSX — camelCase presentation props (strokeWidth as a numeric expression, not a string) since JSX doesn't accept the raw HTML attribute names.
export function toReactJsx(state: SvgPathEditorState): string {
  const fill = state.fillEnabled ? state.fillColor : "none";
  return [
    '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">',
    "  <path",
    `    d="${toPathData(state)}"`,
    `    fill="${fill}"`,
    `    stroke="${state.strokeColor}"`,
    `    strokeWidth={${state.strokeWidth}}`,
    `    strokeLinecap="${state.lineCap}"`,
    `    strokeLinejoin="${state.lineJoin}"`,
    "  />",
    "</svg>"
  ].join("\n");
}
