import type { JSX } from "react";
import type { ConditionalTypeDiagramProps } from "@/interfaces/conditional-type-diagram";
import { boxWidthForLabel } from "@/components/mdx/ConditionalTypeDiagram/ConditionalTypeDiagram.helpers";
import ConditionalBranch from "@/components/mdx/ConditionalTypeDiagram/ConditionalBranch";
import {
  CX,
  UNION_BOX_Y,
  UNION_BOX_H,
  SPLIT_NOTE_Y,
  INPUT_BOX_Y,
  SMALL_BOX_H,
  OUTPUT_BOX_Y,
  JOIN_NOTE_Y,
  JOIN_POINT_Y,
  RESULT_BOX_Y,
  RESULT_BOX_H,
  DISTRIBUTIVE_COLUMN_X,
  NON_DISTRIBUTIVE_COLUMN_X,
  CONDITIONAL_TYPE_DIAGRAM_CONFIG
} from "@/components/mdx/ConditionalTypeDiagram/ConditionalTypeDiagram.constants";
import {
  Wrapper,
  Svg,
  inputBoxClass,
  resultBoxClass,
  connectorLineClass,
  arrowHeadClass,
  primaryTextClass,
  noteTextClass
} from "@/components/mdx/ConditionalTypeDiagram/ConditionalTypeDiagram.styles";

/*
  Static, illustrative SVG diagram of `T extends any ? T[] : never` applied to `string | number |
  boolean` — the "distributive" variant shows the union splitting into three independent branches
  that each pass through the same check and re-join at the bottom; the "non-distributive" variant
  (tuple-wrapping T as `[T] extends [any] ? T[] : never`) shows the same union staying intact as one
  branch instead. See ConditionalTypeDiagram.constants.ts for both configs, kept in sync with the
  CodeBlock examples in the post's "Distributive Conditional Types" section.
*/
export default function ConditionalTypeDiagram({ variant }: ConditionalTypeDiagramProps): JSX.Element {
  const config = CONDITIONAL_TYPE_DIAGRAM_CONFIG[variant];
  const columnXs = variant === "distributive" ? DISTRIBUTIVE_COLUMN_X : NON_DISTRIBUTIVE_COLUMN_X;
  const unionWidth = boxWidthForLabel(config.unionLabel);
  const resultWidth = boxWidthForLabel(config.resultLabel);

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 560 350" role="img" aria-label={config.ariaLabel}>
          <defs>
            <marker id="conditional-type-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" className={arrowHeadClass} />
            </marker>
          </defs>

          {/* Union/input — the type being fed into the conditional type, before any check runs. */}
          <rect x={CX - unionWidth / 2} y={UNION_BOX_Y} width={unionWidth} height={UNION_BOX_H} rx={6} className={inputBoxClass} />
          <text x={CX} y={UNION_BOX_Y + UNION_BOX_H / 2 + 4} textAnchor="middle" className={primaryTextClass}>
            {config.unionLabel}
          </text>
          <text x={CX} y={SPLIT_NOTE_Y} textAnchor="middle" className={noteTextClass}>
            {config.splitNote}
          </text>

          {/* Split lines — one per branch, fanning out from the union box's bottom-center down to
              each branch's input. With a single branch (non-distributive) this is just one straight
              line, which is itself the point: nothing actually splits. */}
          {columnXs.map((x) => (
            <line
              key={`split-${x}`}
              x1={CX}
              y1={UNION_BOX_Y + UNION_BOX_H}
              x2={x}
              y2={INPUT_BOX_Y}
              className={connectorLineClass}
            />
          ))}

          {config.branches.map((branch, index) => (
            <ConditionalBranch key={branch.input} branch={branch} x={columnXs[index]} />
          ))}

          {/* Join lines — converge every branch's output back toward the center before the final
              arrow into the result box. With a single branch this is one straight line: nothing to
              re-join, the output already is the result. */}
          {columnXs.map((x) => (
            <line
              key={`join-${x}`}
              x1={x}
              y1={OUTPUT_BOX_Y + SMALL_BOX_H}
              x2={CX}
              y2={JOIN_POINT_Y}
              className={connectorLineClass}
            />
          ))}
          <line x1={CX} y1={JOIN_POINT_Y} x2={CX} y2={RESULT_BOX_Y} className={connectorLineClass} markerEnd="url(#conditional-type-arrow)" />

          <text x={CX} y={JOIN_NOTE_Y} textAnchor="middle" className={noteTextClass}>
            {config.joinNote}
          </text>

          {/* Result — what the whole `ToArray<...>` expression actually resolves to. */}
          <rect x={CX - resultWidth / 2} y={RESULT_BOX_Y} width={resultWidth} height={RESULT_BOX_H} rx={6} className={resultBoxClass} />
          <text x={CX} y={RESULT_BOX_Y + RESULT_BOX_H / 2 + 4} textAnchor="middle" className={primaryTextClass}>
            {config.resultLabel}
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

ConditionalTypeDiagram.displayName = "ConditionalTypeDiagram";
