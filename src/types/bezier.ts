import type { EasingCurveDefinition } from "@/interfaces/easing-curve";

// A single cubic-bezier control point as [x, y] — x is the elapsed-time ratio (always 0-1), y is progress (can exceed 0-1 for overshoot/anticipation curves).
export type BezierPoint = [number, number];

// Names of every named easing curve demoed in the "CSS Easing Functions" post, keying the shared EASING_CURVES registry.
export type EasingCurveName =
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "ease-mega"
  | "ease-in-out-mega"
  | "overshoot";

// Full registry of easing curves, keyed by name — the single source of truth shared by EasingCurveGraph, TimingFunctionRace, and the post's prose.
export type EasingCurveRegistry = Record<EasingCurveName, EasingCurveDefinition>;
