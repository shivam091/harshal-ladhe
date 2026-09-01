import type { StepsEasingDefinition } from "@/interfaces/steps-easing";

// The four CSS steps() jump-terms, controlling which of the n interval boundaries produce a discrete jump.
export type StepsJumpTerm = "jump-start" | "jump-end" | "jump-none" | "jump-both";

// Names of every steps() example demoed in the "CSS Easing Functions" post, keying the shared STEPS_EASING_CURVES registry.
export type StepsEasingName = "jump-start" | "jump-end" | "jump-none" | "jump-both";

// Full registry of steps() examples, keyed by name — the single source of truth shared by StepsEasingGraph, StepsEasingRace, and the post's prose.
export type StepsEasingRegistry = Record<StepsEasingName, StepsEasingDefinition>;
