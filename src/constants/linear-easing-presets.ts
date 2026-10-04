import type { LinearEasingStop } from "@/utils/linear-easing";

// Keeps a curve's label with its stops, so pickers and graphs can't disagree on what to call it.
export interface LinearEasingPreset {
  label: string;
  stops: LinearEasingStop[];
}

/*
  Starting shapes worth building on, so readers begin the playground from a working curve
  instead of typing stops from scratch.
*/
export const LINEAR_EASING_PRESETS: Record<string, LinearEasingPreset> = {
  settle: {
    label: "Overshoot & Settle",
    stops: [
      { id: "settle-0", value: 0, position: null },
      { id: "settle-1", value: 0.63, position: 25 },
      { id: "settle-2", value: 0.9, position: 45 },
      { id: "settle-3", value: 1.04, position: 65 },
      { id: "settle-4", value: 1, position: null },
    ],
  },
  // A dropped ball: it lands on 1 four times and never passes it, since the floor is the target.
  bounce: {
    label: "Bounce",
    stops: [
      { id: "bounce-0", value: 0, position: null },
      { id: "bounce-1", value: 0.11, position: 12 },
      { id: "bounce-2", value: 0.44, position: 24 },
      { id: "bounce-3", value: 1, position: 36 },
      { id: "bounce-4", value: 0.82, position: 45 },
      { id: "bounce-5", value: 0.75, position: 55 },
      { id: "bounce-6", value: 0.82, position: 64 },
      { id: "bounce-7", value: 1, position: 73 },
      { id: "bounce-8", value: 0.94, position: 82 },
      { id: "bounce-9", value: 1, position: 91 },
      { id: "bounce-10", value: 0.98, position: 95 },
      { id: "bounce-11", value: 1, position: null },
    ],
  },
  spring: {
    label: "Spring",
    stops: [
      { id: "spring-0", value: 0, position: null },
      { id: "spring-1", value: 0.5, position: null },
      { id: "spring-2", value: 1.09, position: null },
      { id: "spring-3", value: 0.97, position: null },
      { id: "spring-4", value: 1.01, position: null },
      { id: "spring-5", value: 1, position: null },
    ],
  },
  anticipate: {
    label: "Anticipate",
    stops: [
      { id: "anticipate-0", value: 0, position: null },
      { id: "anticipate-1", value: -0.2, position: 15 },
      { id: "anticipate-2", value: 1, position: null },
    ],
  },
  smoothStep: {
    label: "Smooth Step",
    stops: [
      { id: "smooth-0", value: 0, position: null },
      { id: "smooth-1", value: 0.2, position: null },
      { id: "smooth-2", value: 0.8, position: null },
      { id: "smooth-3", value: 1, position: null },
    ],
  },
};

/*
  Kept apart from the presets because they illustrate a rule rather than make a good starting
  point. Each mirrors a CSS value printed in the post, so a graph under a code block draws
  exactly that code.
*/
export const LINEAR_EASING_EXAMPLES: Record<string, LinearEasingPreset> = {
  autoSpacing80: {
    label: "0.9 pinned at 80%",
    stops: [
      { id: "auto80-0", value: 0, position: null },
      { id: "auto80-1", value: 0.3, position: null },
      { id: "auto80-2", value: 0.6, position: null },
      { id: "auto80-3", value: 0.9, position: 80 },
      { id: "auto80-4", value: 1, position: null },
    ],
  },
  autoSpacing50: {
    label: "0.9 pinned at 50%",
    stops: [
      { id: "auto50-0", value: 0, position: null },
      { id: "auto50-1", value: 0.3, position: null },
      { id: "auto50-2", value: 0.6, position: null },
      { id: "auto50-3", value: 0.9, position: 50 },
      { id: "auto50-4", value: 1, position: null },
    ],
  },
  elastic: {
    label: "Elastic settle",
    stops: [
      { id: "elastic-0", value: 0, position: null },
      { id: "elastic-1", value: 0.42, position: 9 },
      { id: "elastic-2", value: 0.83, position: 18 },
      { id: "elastic-3", value: 1.15, position: 32 },
      { id: "elastic-4", value: 0.92, position: 45 },
      { id: "elastic-5", value: 1.06, position: 58 },
      { id: "elastic-6", value: 0.97, position: 70 },
      { id: "elastic-7", value: 1.02, position: 83 },
      { id: "elastic-8", value: 0.99, position: 92 },
      { id: "elastic-9", value: 1, position: null },
    ],
  },
  plateau: {
    label: "Flat segment",
    stops: [
      { id: "plateau-0", value: 0, position: null },
      { id: "plateau-1", value: 0.5, position: 20 },
      { id: "plateau-2", value: 0.5, position: 40 },
      { id: "plateau-3", value: 1, position: null },
    ],
  },
};

// One lookup across presets and examples, so a post can plot either by the same key.
export const LINEAR_EASING_CURVES: Record<string, LinearEasingPreset> = {
  ...LINEAR_EASING_PRESETS,
  ...LINEAR_EASING_EXAMPLES,
};
