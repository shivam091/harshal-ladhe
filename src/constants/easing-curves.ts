import type { BezierPoint } from "@/utils/bezier";

// A union rather than string, so a mistyped curve name in a post fails the type check.
export type EasingCurveName =
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "ease-mega"
  | "ease-in-out-mega"
  | "overshoot"
  | "anticipation"
  | "punchy-overshoot"
  | "soft-landing"
  | "sharp-exit";

// Keeps a curve's label with its numbers, so pickers and graphs can't disagree on what to call it.
export interface EasingCurveDefinition {
  label: string;
  p1: BezierPoint;
  p2: BezierPoint;
}

// A Record over the union, so adding a name without its curve is a type error.
export type EasingCurveRegistry = Record<EasingCurveName, EasingCurveDefinition>;

/*
  Spec-accurate keyword curves plus the hand-tuned ones from the easing post, kept in one place
  so a graph, a race and the prose can never quote different numbers. `linear` uses (0.5, 0.5)
  twice because any control points on the diagonal draw the same straight line.
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
  anticipation: {
    label: "Anticipation",
    p1: [0.36, 0],
    p2: [0.66, -0.56],
  },
  "punchy-overshoot": {
    label: "Punchy overshoot",
    p1: [0.68, -0.55],
    p2: [0.265, 1.55],
  },
  "soft-landing": {
    label: "Soft landing",
    p1: [0.16, 1],
    p2: [0.3, 1],
  },
  "sharp-exit": {
    label: "Sharp exit",
    p1: [0.7, 0],
    p2: [0.84, 0],
  },
};
