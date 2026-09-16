import { compileFilterProperty, compileFilterValue } from "@/utils/filter";
import type { FilterEditorState } from "@/interfaces/filter";

// Plain CSS declaration, ready to paste into a stylesheet or a `style` block.
export function toCssDeclaration(state: FilterEditorState): string {
  return `${compileFilterProperty(state)}: ${compileFilterValue(state)};`;
}

/*
  Tailwind ships discrete step-based utilities for `filter` (blur-sm, saturate-150, ...) but mapping
  this tool's continuous slider values onto its nearest step would silently change the result —
  arbitrary-property syntax (`[filter:value]`, Tailwind 3.1+) instead reproduces the exact compiled
  value, same choice the box-shadow tool made for its own arbitrary-value class.
*/
export function toTailwindClass(state: FilterEditorState): string {
  const escaped = compileFilterValue(state).replace(/\s+/g, "_");
  return `[${compileFilterProperty(state)}:${escaped}]`;
}

// React inline-style object literal, ready to spread/assign onto a `style` prop — `backdropFilter` is spelled in camelCase here since it's a JS property name, not a CSS one.
export function toReactStyleObject(state: FilterEditorState): string {
  const camelProperty = state.target === "filter" ? "filter" : "backdropFilter";
  return `{ ${camelProperty}: "${compileFilterValue(state)}" }`;
}
