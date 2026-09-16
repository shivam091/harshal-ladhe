import { compileGradientFillDeclarations, compileGradientFillValue, compileTextShadowValue } from "@/utils/text-effects";
import type { TextEffectsEditorState } from "@/interfaces/text-effects";

// Every declaration this state compiles to, as ordered [property, value] pairs — font sizing first, then the shadow (if any layers exist), then the gradient-fill block (if enabled). Shared by toCssDeclaration and toReactStyleObject so the two formats can never drift on which fields they include.
function compileDeclarations(state: TextEffectsEditorState): Array<[string, string]> {
  const declarations: Array<[string, string]> = [
    ["font-size", `${state.fontSize}px`],
    ["font-weight", `${state.fontWeight}`]
  ];

  if (state.shadowLayers.length > 0) declarations.push(["text-shadow", compileTextShadowValue(state.shadowLayers)]);

  // The gradient fill's own `color: transparent` would otherwise conflict with a plain solid color — declared here, not both, never as two competing `color` entries.
  if (state.gradientFill.enabled) declarations.push(...compileGradientFillDeclarations(state.gradientFill));
  else declarations.push(["color", state.textColor]);

  return declarations;
}

// Plain CSS declaration block, ready to paste into a stylesheet or a `style` block.
export function toCssDeclaration(state: TextEffectsEditorState): string {
  return compileDeclarations(state)
    .map(([property, value]) => `${property}: ${value};`)
    .join("\n");
}

/*
  bg-clip-text and text-transparent are real Tailwind utilities (this IS the documented pattern for
  gradient text in Tailwind's own docs) — only the gradient's own value falls back to an arbitrary
  `bg-[...]`, since a fully custom angle/stop list doesn't fit Tailwind's discrete from/via/to
  gradient-stop system. text-shadow has no Tailwind core utility at all (Tailwind v3), so it's
  arbitrary-property throughout, same escape hatch every other goodie's shadow/filter export already uses.
*/
export function toTailwindClass(state: TextEffectsEditorState): string {
  const classes: string[] = [`text-[${state.fontSize}px]`, `font-[${state.fontWeight}]`];

  if (state.shadowLayers.length > 0) {
    classes.push(`[text-shadow:${compileTextShadowValue(state.shadowLayers).replace(/\s+/g, "_")}]`);
  }

  // Mutually exclusive with the plain color class below — Tailwind auto-detects an arbitrary value's type (a length vs. a color) from its own content, so `text-[64px]` (font-size) and `text-[#0f172a]` (color) can coexist as two different `text-[...]` classes without colliding, but `text-transparent` and an explicit text color class both fighting over the same glyphs would just be redundant.
  if (state.gradientFill.enabled) {
    const gradientValue = compileGradientFillValue(state.gradientFill).replace(/\s+/g, "_");
    classes.push(`bg-[${gradientValue}]`, "bg-clip-text", "text-transparent");
  } else {
    classes.push(`text-[${state.textColor}]`);
  }

  return classes.join(" ");
}

// React inline-style object literal, ready to spread/assign onto a `style` prop — camelCases each CSS property the same way PreviewPane's own declarationsToStyle does, so both stay visually consistent with what's actually rendered.
export function toReactStyleObject(state: TextEffectsEditorState): string {
  const declarations = compileDeclarations(state);
  const entries = declarations.map(([property, value]) => {
    const camelProperty = property.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
    return `  ${camelProperty}: "${value}"`;
  });
  return `{\n${entries.join(",\n")}\n}`;
}
