import type { ConditionalTypeDiagramVariant } from "@/types/conditional-type-diagram";
import type { ConditionalTypeDiagramConfig } from "@/interfaces/conditional-type-diagram";

// Horizontal center of the whole diagram, shared by the top union box, the join arrow, and the result box.
export const CX = 280;

// Top y coordinate of the union/input box.
export const UNION_BOX_Y = 20;

// Height of the union/input box.
export const UNION_BOX_H = 36;

// y position of the split-note caption, sitting between the union box and the branch columns.
export const SPLIT_NOTE_Y = 76;

// Top y coordinate of each branch's input box (bottom of the split lines coming from the union box).
export const INPUT_BOX_Y = 96;

// Height shared by every branch's input and output boxes.
export const SMALL_BOX_H = 34;

// Top y coordinate of each branch's condition box.
export const CONDITION_BOX_Y = 150;

// Height of each branch's condition box (tall enough for its two lines of text).
export const CONDITION_BOX_H = 48;

// Top y coordinate of each branch's output box.
export const OUTPUT_BOX_Y = 218;

// y position of the join-note caption, sitting between the branch outputs and the result box.
export const JOIN_NOTE_Y = 270;

// y coordinate the join line(s) converge to, just above the final arrow into the result box.
export const JOIN_POINT_Y = 288;

// Top y coordinate of the final result box.
export const RESULT_BOX_Y = 300;

// Height of the final result box.
export const RESULT_BOX_H = 40;

// Column centers for the three parallel branches in the "distributive" variant — spread wide enough
// that each box (plus its two-line condition text) has room without touching its neighbors.
export const DISTRIBUTIVE_COLUMN_X: number[] = [90, 280, 470];

// Column center for the single branch in the "non-distributive" variant — same center as the union
// and result boxes above/below it, since nothing here ever splits sideways.
export const NON_DISTRIBUTIVE_COLUMN_X: number[] = [280];

/*
  Per-variant diagram config, verified against `type ToArray<T> = T extends any ? T[] : never` (see
  the post's "Distributive Conditional Types" section). Keep both branches' text in sync with the
  CodeBlock examples that sit next to this diagram — the whole point is that the two agree exactly.
*/
export const CONDITIONAL_TYPE_DIAGRAM_CONFIG: Record<ConditionalTypeDiagramVariant, ConditionalTypeDiagramConfig> = {
  distributive: {
    ariaLabel: "Diagram of a distributive conditional type: the union string, number, boolean splits into three independent branches, each passing through the same extends-any check to produce its own array type, which then re-join into the union string array, number array, boolean array.",
    unionLabel: "T = string | number | boolean",
    splitNote: "naked T distributes — splits into one branch per member",
    branches: [
      { input: "string", conditionTerm: "T extends any ?", conditionDetail: "→ T[]", output: "string[]" },
      { input: "number", conditionTerm: "T extends any ?", conditionDetail: "→ T[]", output: "number[]" },
      { input: "boolean", conditionTerm: "T extends any ?", conditionDetail: "→ T[]", output: "boolean[]" }
    ],
    joinNote: "the three results re-join into one union",
    resultLabel: "string[] | number[] | boolean[]"
  },
  "non-distributive": {
    ariaLabel: "Diagram of a non-distributive conditional type: wrapping T in a tuple keeps the union string, number, boolean intact as one branch, which passes through the tuple-wrapped extends-any check to produce a single combined array type, unchanged going into the result.",
    unionLabel: "[T] = [string | number | boolean]",
    splitNote: "tuple-wrapped [T] does not distribute — stays one branch",
    branches: [
      {
        input: "string | number | boolean",
        conditionTerm: "[T] extends [any] ?",
        conditionDetail: "→ T[]",
        output: "(string | number | boolean)[]"
      }
    ],
    joinNote: "nothing to re-join — one branch, one result",
    resultLabel: "(string | number | boolean)[]"
  }
};
