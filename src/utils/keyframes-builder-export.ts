import { compileAnimationLonghands, compileAnimationShorthand, compileKeyframes, sanitiseAnimationName } from "@/utils/keyframes-builder";
import type { KeyframesBuilderState } from "@/components/KeyframesBuilder/KeyframesBuilder.types";

// Plain CSS: the @keyframes block plus a class applying it through the `animation` shorthand — the form the keyframes guide itself builds up to.
export function toCssExport(state: KeyframesBuilderState): string {
  const name = sanitiseAnimationName(state.settings.name);
  return `${compileKeyframes(state.stops, name)}\n\n.animated {\n  animation: ${compileAnimationShorthand(state.settings, name)};\n}`;
}

/*
  Tailwind has no utility for authoring keyframes, so this emits both halves: the arbitrary
  `animate-[…]` class (spaces escaped to underscores, which Tailwind's tokeniser turns back into
  spaces), and the v4 `@theme` block that registers the keyframes — plus a named `--animate-*`
  token, so the same animation is also available as a tidy `animate-<name>` utility.
*/
export function toTailwindExport(state: KeyframesBuilderState): string {
  const name = sanitiseAnimationName(state.settings.name);
  const shorthand = compileAnimationShorthand(state.settings, name);
  const arbitrary = `animate-[${shorthand.replace(/\s+/g, "_")}]`;
  const keyframes = compileKeyframes(state.stops, name)
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
  return [
    `/* Arbitrary utility — works once the keyframes below are registered: */`,
    `/* class="${arbitrary}" */`,
    ``,
    `/* Tailwind v4 — in your main CSS file. Also unlocks class="animate-${name}" */`,
    `@theme {`,
    `  --animate-${name}: ${shorthand};`,
    ``,
    keyframes,
    `}`,
    ``,
    `/* Tailwind v3 — add the same frames under theme.extend.keyframes in tailwind.config.js */`
  ].join("\n");
}

// React: the keyframes as a string to render once in a <style> tag (inline styles can't declare @keyframes), plus a longhand style object pointing at them.
export function toReactExport(state: KeyframesBuilderState): string {
  const name = sanitiseAnimationName(state.settings.name);
  const longhands = compileAnimationLonghands(state.settings, name);
  const styleBody = Object.entries(longhands)
    .map(([key, value]) => `  ${key}: "${value}"`)
    .join(",\n");
  return [
    `const keyframes = \`\n${compileKeyframes(state.stops, name)}\n\`;`,
    ``,
    `const animatedStyle = {\n${styleBody}\n};`,
    ``,
    `export function Animated({ children }) {`,
    `  return (`,
    `    <>`,
    `      <style>{keyframes}</style>`,
    `      <div style={animatedStyle}>{children}</div>`,
    `    </>`,
    `  );`,
    `}`
  ].join("\n");
}
