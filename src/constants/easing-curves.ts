import type { EasingCurveRegistry } from "@/types/bezier";

/*
  Spec-accurate control points for every easing curve demoed in "An Interactive Guide to CSS
  Easing Functions and cubic-bezier()" — the five browser-default keywords, plus two
  "supercharged" variants and one overshoot curve used to show how far a curve's feel can be
  pushed once you leave the defaults behind. Shared by EasingCurveGraph, TimingFunctionRace,
  and the post's prose so these numbers only ever live in one place.
*/
export const EASING_CURVES: EasingCurveRegistry = {
  linear: {
    label: "linear",
    p1: [0.5, 0.5],
    p2: [0.5, 0.5],
  },
  ease: {
    label: "ease",
    p1: [0.25, 0.1],
    p2: [0.25, 1],
  },
  "ease-in": {
    label: "ease-in",
    p1: [0.42, 0],
    p2: [1, 1],
  },
  "ease-out": {
    label: "ease-out",
    p1: [0, 0],
    p2: [0.58, 1],
  },
  "ease-in-out": {
    label: "ease-in-out",
    p1: [0.42, 0],
    p2: [0.58, 1],
  },
  "ease-mega": {
    label: "ease (supercharged)",
    p1: [0.44, 0.21],
    p2: [0, 1],
  },
  "ease-in-out-mega": {
    label: "ease-in-out (supercharged)",
    p1: [0.645, 0.045],
    p2: [0.355, 1],
  },
  overshoot: {
    label: "overshoot",
    p1: [0.325, 0],
    p2: [0.7, 1.25],
  },
};
