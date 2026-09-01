import type { StepsJumpTerm } from "@/types/steps-easing";

// One named steps() example's parameters plus the display label shown in prose and curve-picker dropdowns.
export interface StepsEasingDefinition {
  label: string;
  n: number;
  jumpTerm: StepsJumpTerm;
}
