import { compileFilterProperty, compileFilterValue } from "@/utils/filter";
import type { FilterEditorState } from "@/interfaces/filter";

export function toCssDeclaration(state: FilterEditorState): string {
  return `${compileFilterProperty(state)}: ${compileFilterValue(state)};`;
}

/*
  Tailwind ships discrete step-based utilities for `filter` (blur-sm, saturate-150, ...) but mapping
  this tool's continuous slider values onto its nearest step would silently change the result —
  arbitrary-property syntax (`[filter:value]`, Tailwind 3.1+) instead reproduces the exact compiled
  value, same choice BorderRadiusGenerator made for its squircle clip-path export.
*/
export function toTailwindClass(state: FilterEditorState): string {
  const escaped = compileFilterValue(state).replace(/\s+/g, "_");
  return `[${compileFilterProperty(state)}:${escaped}]`;
}

export function toReactStyleObject(state: FilterEditorState): string {
  const camelProperty = state.target === "filter" ? "filter" : "backdropFilter";
  return `{ ${camelProperty}: "${compileFilterValue(state)}" }`;
}
