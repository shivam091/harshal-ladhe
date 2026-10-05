import { convert, formatNumber, parseBatchValues } from "@/utils/unit-converter";
import type { CssUnit, UnitContext, UnitConverterEditorState } from "@/components/UnitConverter/UnitConverter.types";

// The batch prefix reduced to a safe custom-property fragment, falling back to "space" so an emptied field never exports `---4`.
function slugifyPrefix(prefix: string): string {
  return (
    prefix
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "space"
  );
}

// Decimal px values can't sit in an identifier as-is, so 0.5 becomes 0_5 — the same escape Tailwind uses for its own half-steps.
function pxKey(px: number): string {
  return String(px).replace(".", "_").replace("-", "neg");
}

// Every batch value converted once — the single source of truth all four export formats read from.
function compileBatch(state: UnitConverterEditorState): Array<{ px: number; value: string }> {
  return parseBatchValues(state.batchInput).map((px) => ({
    px,
    value: `${formatNumber(convert(px, "px", state.batchUnit, state.context), state.precision)}${state.batchUnit}`
  }));
}

// A `:root` block of custom properties keyed by px, so `var(--space-16)` still says which design-token step it came from after conversion.
export function toCssCustomProperties(state: UnitConverterEditorState): string {
  const prefix = slugifyPrefix(state.batchPrefix);
  const lines = compileBatch(state).map(({ px, value }) => `  --${prefix}-${pxKey(px)}: ${value}; /* ${px}px */`);
  return `:root {\n${lines.join("\n") || "  /* add px values to the batch list */"}\n}`;
}

// Plain "px → value" lines for pasting into a spec, a ticket or a design-token sheet that isn't CSS at all.
export function toPlainList(state: UnitConverterEditorState): string {
  return compileBatch(state).map(({ px, value }) => `${px}px → ${value}`).join("\n") || "Add px values to the batch list.";
}

// A tailwind.config.js `spacing` extension keyed by px ÷ 4 — Tailwind's own convention where `p-4` means 16px, so the generated keys slot in beside the defaults.
export function toTailwindSpacing(state: UnitConverterEditorState): string {
  const lines = compileBatch(state).map(({ px, value }) => `        ${JSON.stringify(formatNumber(px / 4, 3))}: "${value}", // ${px}px`);
  return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      spacing: {\n${lines.join("\n")}\n      }\n    }\n  }\n};`;
}

// The helper's default base and the factor that turns "fraction of base" into the unit — viewport/container/percent units are hundredths, so they need ×100.
function helperShape(unit: CssUnit, context: UnitContext): { name: string; base: number; scale: number; baseNote: string } {
  switch (unit) {
    case "em":
      return { name: "em", base: context.parentFontSize, scale: 1, baseNote: "parent font-size" };
    case "vw":
      return { name: "vw", base: context.viewportWidth, scale: 100, baseNote: "viewport width" };
    case "vh":
      return { name: "vh", base: context.viewportHeight, scale: 100, baseNote: "viewport height" };
    case "cqi":
      return { name: "cqi", base: context.containerInlineSize, scale: 100, baseNote: "container inline size" };
    case "%":
      return { name: "pct", base: context.parentWidth, scale: 100, baseNote: "parent width" };
    case "pt":
      return { name: "pt", base: 96 / 72, scale: 1, baseNote: "px per pt" };
    default:
      // px → px needs no helper, so a px batch still gets the far more useful rem() helper.
      return { name: "rem", base: context.rootFontSize, scale: 1, baseNote: "root font-size" };
  }
}

// Which unit the helper outputs — px falls back to rem, matching helperShape's own fallback.
function helperUnit(unit: CssUnit): CssUnit {
  return unit === "px" ? "rem" : unit;
}

// A Sass @function for the batch's target unit with the current context baked in as the default base — so the stylesheet keeps the px design values readable at the call site.
export function toSassHelper(state: UnitConverterEditorState): string {
  const unit = helperUnit(state.batchUnit);
  const { name, base, scale, baseNote } = helperShape(unit, state.context);
  const sample = parseBatchValues(state.batchInput)[0] ?? 24;
  const factor = scale === 1 ? `1${unit}` : `${scale}${unit}`;
  return [
    `@use "sass:math";`,
    ``,
    `// px → ${unit}, defaulting to a ${formatNumber(base, 4)}px ${baseNote}`,
    `@function ${name}($px, $base: ${formatNumber(base, 4)}) {`,
    `  @return math.div($px, $base) * ${factor};`,
    `}`,
    ``,
    `.card {`,
    `  padding: ${name}(${sample}); // ${formatNumber(convert(sample, "px", unit, state.context), state.precision)}${unit}`,
    `}`
  ].join("\n");
}

// The same helper as a typed JS function, for CSS-in-JS or inline styles — rounds to the chosen precision so it never emits 0.30000000000000004rem.
export function toJsHelper(state: UnitConverterEditorState): string {
  const unit = helperUnit(state.batchUnit);
  const { name, base, scale, baseNote } = helperShape(unit, state.context);
  const sample = parseBatchValues(state.batchInput)[0] ?? 24;
  const expression = scale === 1 ? "px / base" : `(px / base) * ${scale}`;
  return [
    `// px → ${unit}, defaulting to a ${formatNumber(base, 4)}px ${baseNote}`,
    `export function ${name}(px: number, base = ${formatNumber(base, 4)}): string {`,
    `  const factor = 10 ** ${state.precision};`,
    `  return \`\${Math.round((${expression}) * factor) / factor}${unit}\`;`,
    `}`,
    ``,
    `${name}(${sample}); // "${formatNumber(convert(sample, "px", unit, state.context), state.precision)}${unit}"`
  ].join("\n");
}
