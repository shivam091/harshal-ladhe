import type { JSX } from "react";
import type { ConditionalBranchProps } from "@/interfaces/conditional-type-diagram";
import { boxWidthForLabel } from "@/components/mdx/ConditionalTypeDiagram/ConditionalTypeDiagram.helpers";
import {
  INPUT_BOX_Y,
  SMALL_BOX_H,
  CONDITION_BOX_Y,
  CONDITION_BOX_H,
  OUTPUT_BOX_Y
} from "@/components/mdx/ConditionalTypeDiagram/ConditionalTypeDiagram.constants";
import {
  inputBoxClass,
  conditionBoxClass,
  outputBoxClass,
  connectorLineClass,
  primaryTextClass,
  detailTextClass
} from "@/components/mdx/ConditionalTypeDiagram/ConditionalTypeDiagram.styles";

/*
  Renders one full column of the conditional-type "machine": the member entering it, the `extends`
  check it passes through, and what comes out the other side. Reused three times (once per union
  member) for the distributive variant, and once (for the whole union) for the non-distributive one —
  the same shape either way is the point: distribution is about how many times this column repeats,
  not what happens inside it.
*/
export default function ConditionalBranch({ branch, x }: ConditionalBranchProps): JSX.Element {
  const inputWidth = boxWidthForLabel(branch.input);
  const conditionWidth = boxWidthForLabel(branch.conditionTerm);
  const outputWidth = boxWidthForLabel(branch.output);

  return (
    <>
      {/* Input — the value entering this branch, before any check has run. */}
      <rect x={x - inputWidth / 2} y={INPUT_BOX_Y} width={inputWidth} height={SMALL_BOX_H} rx={6} className={inputBoxClass} />
      <text x={x} y={INPUT_BOX_Y + SMALL_BOX_H / 2 + 4} textAnchor="middle" className={primaryTextClass}>
        {branch.input}
      </text>

      {/* Arrow from input into the condition check. */}
      <line
        x1={x}
        y1={INPUT_BOX_Y + SMALL_BOX_H}
        x2={x}
        y2={CONDITION_BOX_Y}
        className={connectorLineClass}
        markerEnd="url(#conditional-type-arrow)"
      />

      {/* Condition — the `extends` check itself (bold), and what its true branch resolves to (muted). */}
      <rect x={x - conditionWidth / 2} y={CONDITION_BOX_Y} width={conditionWidth} height={CONDITION_BOX_H} rx={6} className={conditionBoxClass} />
      <text x={x} y={CONDITION_BOX_Y + 20} textAnchor="middle" className={primaryTextClass}>
        {branch.conditionTerm}
      </text>
      <text x={x} y={CONDITION_BOX_Y + 36} textAnchor="middle" className={detailTextClass}>
        {branch.conditionDetail}
      </text>

      {/* Arrow from the condition check into its output. */}
      <line
        x1={x}
        y1={CONDITION_BOX_Y + CONDITION_BOX_H}
        x2={x}
        y2={OUTPUT_BOX_Y}
        className={connectorLineClass}
        markerEnd="url(#conditional-type-arrow)"
      />

      {/* Output — what this branch produced, ready to (maybe) re-join the others below. */}
      <rect x={x - outputWidth / 2} y={OUTPUT_BOX_Y} width={outputWidth} height={SMALL_BOX_H} rx={6} className={outputBoxClass} />
      <text x={x} y={OUTPUT_BOX_Y + SMALL_BOX_H / 2 + 4} textAnchor="middle" className={primaryTextClass}>
        {branch.output}
      </text>
    </>
  );
}

ConditionalBranch.displayName = "ConditionalBranch";
