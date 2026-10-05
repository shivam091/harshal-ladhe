import type { ShaderUniformControl, ShaderUniformValue } from "@/components/ShaderPlayground/ShaderPlayground.types";

/*
  One annotated uniform per line: the declaration, then a trailing `// @slider …` or `// @color …`
  comment. Anchored to a whole line (multiline flag) so a commented-out declaration or one buried
  in a block comment's prose can't sprout a phantom control.
*/
const ANNOTATION_PATTERN = /^[ \t]*uniform[ \t]+(?:(?:lowp|mediump|highp)[ \t]+)?(float|vec3)[ \t]+([A-Za-z_]\w*)[ \t]*;[ \t]*\/\/[ \t]*@(slider|color)\b([^\n]*)$/gm;

// Six-digit hex only — the one format <input type="color"> both accepts and reports back, so no normalisation step is ever needed.
const HEX_COLOR = /^#[0-9a-f]{6}$/i;

// A missing or out-of-range default falls back to the slider's midpoint rather than its minimum, which tends to render something more representative.
function resolveSliderDefault(min: number, max: number, raw: number | undefined): number {
  if (raw === undefined || !Number.isFinite(raw)) return (min + max) / 2;
  return Math.min(max, Math.max(min, raw));
}

/*
  Reads the source's `@slider`/`@color` annotations into control descriptors — the tool's whole
  "declare it once, get a control for free" trick. A mismatched pairing (`@color` on a float) or
  malformed bounds is silently skipped rather than reported: the shader itself still compiles, so
  the honest outcome is simply that no control appears. Duplicate names keep the first declaration,
  matching how the GLSL compiler itself would reject the second.
*/
export function parseUniformControls(source: string): ShaderUniformControl[] {
  const controls: ShaderUniformControl[] = [];
  const seen = new Set<string>();

  for (const match of source.matchAll(ANNOTATION_PATTERN)) {
    const [, glslType, name, annotation, rest] = match;
    if (seen.has(name)) continue;
    const args = rest.trim().split(/[\s,]+/).filter(Boolean);

    if (annotation === "slider" && glslType === "float") {
      const [min, max, rawDefault, rawStep] = args.map(Number);
      if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) continue;
      const step = Number.isFinite(rawStep) && rawStep > 0 ? rawStep : (max - min) / 100;
      controls.push({ kind: "slider", name, min, max, defaultValue: resolveSliderDefault(min, max, rawDefault), step });
      seen.add(name);
    } else if (annotation === "color" && glslType === "vec3") {
      const defaultValue = args[0] && HEX_COLOR.test(args[0]) ? args[0].toLowerCase() : "#ffffff";
      controls.push({ kind: "color", name, defaultValue });
      seen.add(name);
    }
  }

  return controls;
}

// A control's live value: whatever was saved for it if that still fits the control's current kind, else its annotated default — so editing an annotation's type never feeds a stale hex string into a float slider.
export function resolveUniformValue(control: ShaderUniformControl, values: Record<string, ShaderUniformValue>): ShaderUniformValue {
  const saved = values[control.name];
  if (control.kind === "slider") return typeof saved === "number" && Number.isFinite(saved) ? Math.min(control.max, Math.max(control.min, saved)) : control.defaultValue;
  return typeof saved === "string" && HEX_COLOR.test(saved) ? saved : control.defaultValue;
}

// #rrggbb → linear 0–1 floats for uniform3f. No gamma conversion: shader authors expect the picker's numbers verbatim, the same as typing vec3(1.0, 0.5, 0.0) by hand.
export function hexToVec3(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.slice(1), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}
