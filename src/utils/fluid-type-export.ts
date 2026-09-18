import { compileClampValue, computeClampParts } from "@/utils/fluid-type";
import type { FluidTypeEditorState } from "@/interfaces/fluid-type";

// A step's own name reduced to a safe identifier fragment — shared by the CSS custom-property name, the Tailwind theme key, and the React object key so all three exports point at "the same step" under their own naming convention.
function slugifyName(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "step"
  );
}

function camelizeName(name: string): string {
  const words = name.trim().split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (words.length === 0) return "step";
  return words.map((word, index) => (index === 0 ? word[0].toLowerCase() + word.slice(1) : word[0].toUpperCase() + word.slice(1).toLowerCase())).join("");
}

// Every step's own clamp() value, computed once — the single source of truth all three export formats below read from.
function compileStepValues(state: FluidTypeEditorState): Array<{ step: FluidTypeEditorState["steps"][number]; value: string }> {
  return state.steps.map((step) => ({ step, value: compileClampValue(computeClampParts(step, state.minViewport, state.maxViewport, state.rootFontSize)) }));
}

// A `:root` block of custom properties, one per step — the form that drops straight into a global stylesheet and lets every component reference `var(--step-h1)` instead of repeating the clamp() expression.
export function toCssDeclaration(state: FluidTypeEditorState): string {
  const lines = compileStepValues(state).map(({ step, value }) => `  --step-${slugifyName(step.name)}: ${value};`);
  return `:root {\n${lines.join("\n")}\n}`;
}

// A tailwind.config.js `fontSize` theme extension — the documented way to ship a named fluid scale in Tailwind, since a discrete utility class can't carry a per-step vw-based calc() the way an arbitrary value could for a one-off size.
export function toTailwindClass(state: FluidTypeEditorState): string {
  const lines = compileStepValues(state).map(({ step, value }) => `        ${JSON.stringify(slugifyName(step.name))}: "${value}"`);
  return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      fontSize: {\n${lines.join(",\n")}\n      }\n    }\n  }\n};`;
}

// Plain JS object of per-step style objects, camelCase-keyed — spreadable onto a React element's own `style` prop, e.g. `<h1 style={fluidType.h1}>`.
export function toReactStyleObject(state: FluidTypeEditorState): string {
  const lines = compileStepValues(state).map(({ step, value }) => `  ${camelizeName(step.name)}: { fontSize: "${value}" }`);
  return `{\n${lines.join(",\n")}\n}`;
}
