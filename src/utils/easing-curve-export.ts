import { compileTimingFunction, compileTransitionValue } from "@/utils/easing-curve-editor";
import type { EasingCurveEditorState } from "@/interfaces/easing-curve-editor";

export function toCssDeclaration(state: EasingCurveEditorState): string {
  return `transition: ${compileTransitionValue(state)};`;
}

// Maps the transitioned property onto Tailwind's own small set of transition-property utilities where one exists (transition-colors covers every color-ish property, not just background-color) — falling back to the arbitrary-value form `transition-[prop]` for anything else, since Tailwind has no utility per individual CSS property.
const TAILWIND_PROPERTY_CLASS: Record<string, string> = {
  all: "transition-all",
  transform: "transition-transform",
  opacity: "transition-opacity",
  "background-color": "transition-colors",
  color: "transition-colors",
  "border-color": "transition-colors",
  "box-shadow": "transition-shadow"
};

/*
  Tailwind's `ease-*` utility accepts an arbitrary cubic-bezier() value directly (`ease-[cubic-bezier(...)]`,
  supported since Tailwind 3.1) — a real utility class, not the bracket-property escape hatch every
  other goodie's Tailwind tab falls back to, since transition timing is exactly what Tailwind's own
  utilities are built to express.
*/
export function toTailwindClass(state: EasingCurveEditorState): string {
  const propertyClass = TAILWIND_PROPERTY_CLASS[state.property] ?? `transition-[${state.property}]`;
  // Only the bracket VALUE gets its spaces escaped to underscores (Tailwind's own tokenizer splits classes on whitespace) — the space separating each class in the final string stays a real space.
  const easeClass = `ease-[${compileTimingFunction(state).replace(/\s+/g, "_")}]`;
  const classes = [propertyClass, `duration-[${state.durationMs}ms]`, easeClass];
  if (state.delayMs > 0) classes.push(`delay-[${state.delayMs}ms]`);
  return classes.join(" ");
}

export function toReactStyleObject(state: EasingCurveEditorState): string {
  return `{ transition: "${compileTransitionValue(state)}" }`;
}
