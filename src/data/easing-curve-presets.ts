import { EASING_CURVES } from "@/constants/easing-curves";
import type { EasingCurvePresetMeta } from "@/interfaces/easing-curve-editor";

/*
  Curated starting curves shown in the preset gallery — the first six are pulled directly from
  EASING_CURVES (the same registry EasingCurveGraph, TimingFunctionRace, and the "CSS Easing
  Functions" post's own prose already share), so this tool's presets are spec-accurate and
  numerically identical to what the guide teaches rather than a second, drifting copy of the same
  five keyword curves. The last four are the guide's own named "recipe" curves (its cubic-bezier
  table), which live only in that post's prose today — reproduced here as data since a generator
  tool needs them as selectable values, not just read about.
*/
export const easingCurvePresets: EasingCurvePresetMeta[] = [
  { slug: "linear", name: "Linear", p1: EASING_CURVES.linear.p1, p2: EASING_CURVES.linear.p2 },
  { slug: "ease", name: "Ease", p1: EASING_CURVES.ease.p1, p2: EASING_CURVES.ease.p2 },
  { slug: "ease-in", name: "Ease In", p1: EASING_CURVES["ease-in"].p1, p2: EASING_CURVES["ease-in"].p2 },
  { slug: "ease-out", name: "Ease Out", p1: EASING_CURVES["ease-out"].p1, p2: EASING_CURVES["ease-out"].p2 },
  { slug: "ease-in-out", name: "Ease In Out", p1: EASING_CURVES["ease-in-out"].p1, p2: EASING_CURVES["ease-in-out"].p2 },
  { slug: "overshoot", name: "Overshoot", p1: EASING_CURVES.overshoot.p1, p2: EASING_CURVES.overshoot.p2 },
  { slug: "anticipation", name: "Anticipation", p1: [0.36, 0], p2: [0.66, -0.56] },
  { slug: "punchy-overshoot", name: "Punchy Overshoot", p1: [0.68, -0.55], p2: [0.265, 1.55] },
  { slug: "soft-landing", name: "Soft Landing", p1: [0.16, 1], p2: [0.3, 1] },
  { slug: "sharp-exit", name: "Sharp Exit", p1: [0.7, 0], p2: [0.84, 0] }
];
