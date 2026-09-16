import { compileGradientValue } from "@/utils/gradient";
import type { GradientEditorState } from "@/interfaces/gradient";

// A plain CSS `background` declaration ready to paste into a stylesheet.
export function toCssDeclaration(state: GradientEditorState): string {
  return `background: ${compileGradientValue(state)};`;
}

/*
  Tailwind's arbitrary-value syntax requires spaces inside the bracket escaped to underscores
  (its own class-name tokenizer would otherwise split on them) — this project has no Tailwind
  dependency itself; it's purely a string formatter for people pasting the gradient into a Tailwind project.
*/
export function toTailwindClass(state: GradientEditorState): string {
  return `bg-[${compileGradientValue(state).replace(/\s+/g, "_")}]`;
}

// A React inline style object literal, ready to paste as a component's `style` prop value.
export function toReactStyleObject(state: GradientEditorState): string {
  return `{ background: "${compileGradientValue(state)}" }`;
}
