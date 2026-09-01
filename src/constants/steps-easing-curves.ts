import type { StepsEasingRegistry } from "@/types/steps-easing";

/*
  One example per steps() jump-term, demoed in "An Interactive Guide to CSS Easing Functions and
  cubic-bezier()". n=5 keeps the staircase small enough to count by eye while still showing every
  jump-term's shape clearly. Shared by StepsEasingGraph, StepsEasingRace, and the post's prose so
  these numbers only ever live in one place.
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
};
