import { compileBoxShadowValue } from "@/utils/box-shadow";
import type { BoxShadowEditorState } from "@/interfaces/box-shadow";

// Plain CSS declaration, ready to paste into a stylesheet or a `style` block.
export function toCssDeclaration(state: BoxShadowEditorState): string {
  return `box-shadow: ${compileBoxShadowValue(state)};`;
}

/*
  Tailwind's arbitrary-value syntax requires spaces inside the bracket escaped to underscores
  (its own class-name tokenizer would otherwise split on them) — this project has no Tailwind
  dependency itself; it's purely a string formatter for people pasting the shadow into a Tailwind project.
*/
export function toTailwindClass(state: BoxShadowEditorState): string {
  return `shadow-[${compileBoxShadowValue(state).replace(/\s+/g, "_")}]`;
}

// React inline-style object literal, ready to spread/assign onto a `style` prop.
export function toReactStyleObject(state: BoxShadowEditorState): string {
  return `{ boxShadow: "${compileBoxShadowValue(state)}" }`;
}
