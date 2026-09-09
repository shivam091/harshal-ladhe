import type { ConditionalTypeDiagramVariant } from "@/types/conditional-type-diagram";

// Props for ConditionalTypeDiagram — selects which of the two variants (distributive vs. not) to render.
export interface ConditionalTypeDiagramProps {
  // Which variant's flow to draw.
  variant: ConditionalTypeDiagramVariant;
}

// One branch's journey through the conditional-type "machine": what goes in, what comes out.
export interface ConditionalBranch {
  // The member (or, for the non-distributive variant, the whole union) entering this branch.
  input: string;
  // Bold top line of the branch's condition box — the `extends` check itself.
  conditionTerm: string;
  // Muted bottom line of the branch's condition box — what the true branch resolves to.
  conditionDetail: string;
  // What comes out of this branch once the check resolves.
  output: string;
}

// Props for the ConditionalBranch subcomponent — draws one full input -> check -> output column.
export interface ConditionalBranchProps {
  // The input/condition/output triple to render.
  branch: ConditionalBranch;
  // Horizontal center, in SVG user units, that every box in this column is centered on.
  x: number;
}

// One variant's full diagram config: labels, branches, and the closing note explaining what happened.
export interface ConditionalTypeDiagramConfig {
  // Accessible label summarizing this variant's flow for screen readers.
  ariaLabel: string;
  // Top label: the type being fed into the conditional type (e.g. the union itself, or its tuple-wrapped form).
  unionLabel: string;
  // Caption shown between the top label and the branch(es), explaining whether/why a split happens here.
  splitNote: string;
  // One column per branch — three for "distributive" (one per union member), one for "non-distributive".
  branches: ConditionalBranch[];
  // Caption shown between the branch outputs and the final result, explaining whether/how they combine.
  joinNote: string;
  // Bottom label: the type TypeScript actually resolves the whole expression to.
  resultLabel: string;
}
