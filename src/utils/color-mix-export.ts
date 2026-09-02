import { buildColorMixValue } from "@/helpers/color-mix-editor";
import type { ColorMixEditorState } from "@/interfaces/color-mix";

export function toCssDeclaration(state: ColorMixEditorState): string {
  return `.element {\n  background-color: ${buildColorMixValue(state)};\n}`;
}

// Arbitrary-value bracket syntax — Tailwind has no first-class color-mix() utility, so this is its documented escape hatch for an arbitrary CSS function value.
export function toTailwindClass(state: ColorMixEditorState): string {
  return `<div class="bg-[${buildColorMixValue(state)}]"></div>`;
}

export function toReactStyleObject(state: ColorMixEditorState): string {
  return `{\n  backgroundColor: "${buildColorMixValue(state)}"\n}`;
}
