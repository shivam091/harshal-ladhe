import { generateRamp } from "@/utils/color-ramp";
import type { ColorPaletteEditorState } from "@/interfaces/color-palette";
import type { RampStop } from "@/interfaces/color-palette";

// "50" -> "color-50"; keeps the leading digit out of the raw custom-property/object-key name, since `--50` and a bare `50:` key are both invalid.
function stepKey(step: RampStop): string {
  return `color-${step.name}`;
}

function camelStepKey(step: RampStop): string {
  return `color${step.name}`;
}

// A `:root` block declaring one CSS custom property per ramp step, ready to paste straight into a stylesheet.
export function toCssDeclaration(state: ColorPaletteEditorState): string {
  const ramp = generateRamp(state.seedColor, state.rampMode);
  const lines = ramp.map((step) => `  --${stepKey(step)}: ${step.hex};`);
  return `:root {\n${lines.join("\n")}\n}`;
}

// A tailwind.config.js `colors` theme extension, one shade key per ramp step — the documented way to register a full named color scale in Tailwind.
export function toTailwindClass(state: ColorPaletteEditorState): string {
  const ramp = generateRamp(state.seedColor, state.rampMode);
  const lines = ramp.map((step) => `        ${JSON.stringify(step.name)}: "${step.hex}"`);
  return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        brand: {\n${lines.join(",\n")}\n        }\n      }\n    }\n  }\n};`;
}

// A plain object literal keyed by camelCase step name, ready to drop into a React inline style or theme object.
export function toReactStyleObject(state: ColorPaletteEditorState): string {
  const ramp = generateRamp(state.seedColor, state.rampMode);
  const lines = ramp.map((step) => `  ${camelStepKey(step)}: "${step.hex}"`);
  return `{\n${lines.join(",\n")}\n}`;
}
