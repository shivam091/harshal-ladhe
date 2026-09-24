import type { StepsJumpTerm } from "@/utils/steps-easing";

// Closed set of example names, so a typo in a registry lookup fails at compile time.
export type StepsEasingName = "jump-start" | "jump-end" | "jump-none" | "jump-both" | "step-start" | "step-end";

// A steps() example's parameters paired with its label, so the displayed text can't drift from the plotted numbers.
export interface StepsEasingDefinition {
  label: string;
  n: number;
  jumpTerm: StepsJumpTerm;
}

// Record over every name, so adding a name without its definition is a type error.
export type StepsEasingRegistry = Record<StepsEasingName, StepsEasingDefinition>;

/*
  n=5 keeps the jump-term staircases small enough to count by eye while still showing every shape
  clearly; the step-start/step-end shorthands are fixed at n=1 by definition (steps(1, jump-start) /
  steps(1, jump-end)).
*/
export const STEPS_EASING_CURVES: StepsEasingRegistry = {
  "jump-start": {
    label: "steps(5, jump-start)",
    n: 5,
    jumpTerm: "jump-start",
  },
  "jump-end": {
    label: "steps(5, jump-end)",
    n: 5,
    jumpTerm: "jump-end",
  },
  "jump-none": {
    label: "steps(5, jump-none)",
    n: 5,
    jumpTerm: "jump-none",
  },
  "jump-both": {
    label: "steps(5, jump-both)",
    n: 5,
    jumpTerm: "jump-both",
  },
  "step-start": {
    label: "step-start",
    n: 1,
    jumpTerm: "jump-start",
  },
  "step-end": {
    label: "step-end",
    n: 1,
    jumpTerm: "jump-end",
  },
};
