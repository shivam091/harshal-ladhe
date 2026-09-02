import { compileGradientValue } from "@/utils/gradient";
import type { GradientEditorState } from "@/interfaces/gradient";

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

export function toReactStyleObject(state: GradientEditorState): string {
  return `{ background: "${compileGradientValue(state)}" }`;
}
