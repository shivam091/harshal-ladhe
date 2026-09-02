import { compileBlobValue } from "@/utils/border-radius";
import type { BorderRadiusEditorState } from "@/interfaces/border-radius";

export function toCssDeclaration(state: BorderRadiusEditorState): string {
  const { property, value } = compileBlobValue(state);
  return `${property}: ${value};`;
}

/*
  Tailwind has a built-in arbitrary-VALUE syntax (`rounded-[...]`) for border-radius, but no utility
  for clip-path at all — squircle mode instead uses Tailwind's arbitrary-PROPERTY syntax
  (`[clip-path:value]`, supported since Tailwind 3.1) so both families still produce a single
  pasteable class. Spaces are escaped to underscores either way, same reasoning as every other
  goodie's Tailwind formatter.
*/
export function toTailwindClass(state: BorderRadiusEditorState): string {
  const { property, value } = compileBlobValue(state);
  const escaped = value.replace(/\s+/g, "_");
  return property === "border-radius" ? `rounded-[${escaped}]` : `[clip-path:${escaped}]`;
}

export function toReactStyleObject(state: BorderRadiusEditorState): string {
  const { property, value } = compileBlobValue(state);
  const camelProperty = property === "border-radius" ? "borderRadius" : "clipPath";
  return `{ ${camelProperty}: "${value}" }`;
}
