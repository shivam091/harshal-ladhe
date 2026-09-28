import type { JSX } from "react";
import type { CompositeOperator } from "@/components/mdx/FeCompositeOperatorsDiagram/FeCompositeOperatorsDiagram.constants";
import { CELL, CELL_ORIGINS, DRAWING_OFFSET_Y, SQUARE_A, CIRCLE_B, OPERATORS } from "@/components/mdx/FeCompositeOperatorsDiagram/FeCompositeOperatorsDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/FeCompositeOperatorsDiagram/FeCompositeOperatorsDiagram.styles";

// Fill for input A — the accent token, so A reads as "the thing being composited" in both themes.
const FILL_A = "var(--color-border-accent-emphasis)";

// Fill for input B — the success token, far enough in hue from the accent that overlaps never blur together.
const FILL_B = "var(--color-border-success-emphasis)";

// Fill for arithmetic's summed overlap — a third hue, because additive blending produces a colour neither input has.
const FILL_SUM = "var(--color-border-attention-emphasis)";

// Circle B as a closed path, reused inside the evenodd "not B" clip where a <circle> element can't punch a hole.
const CIRCLE_B_PATH = `M${CIRCLE_B.cx - CIRCLE_B.r},${CIRCLE_B.cy} A${CIRCLE_B.r},${CIRCLE_B.r} 0 1,0 ${CIRCLE_B.cx + CIRCLE_B.r},${CIRCLE_B.cy} A${CIRCLE_B.r},${CIRCLE_B.r} 0 1,0 ${CIRCLE_B.cx - CIRCLE_B.r},${CIRCLE_B.cy} Z`;

// Oversized frame around the drawing — evenodd against it turns a shape into "everywhere except this shape".
const FRAME_PATH = `M-10,-10 H${CELL.width + 10} V150 H-10 Z`;

// Square A as a bare element, pre-positioned — drawn several ways (whole, clipped) so it's factored out once.
function SquareA({ clipPath }: { clipPath?: string }): JSX.Element {
  return <rect x={SQUARE_A.x} y={SQUARE_A.y} width={SQUARE_A.size} height={SQUARE_A.size} fill={FILL_A} clipPath={clipPath} />;
}

// Circle B as a bare element — same reason as SquareA: each operator reuses it with a different clip.
function CircleB({ clipPath, fill = FILL_B }: { clipPath?: string; fill?: string }): JSX.Element {
  return <circle cx={CIRCLE_B.cx} cy={CIRCLE_B.cy} r={CIRCLE_B.r} fill={fill} clipPath={clipPath} />;
}

/*
  Draws what survives for one operator. Uses clip paths rather than real filters so the diagram stays static,
  server-safe and identical across engines — it illustrates the maths, not a browser's rasterisation of it.
*/
function OperatorResult({ operator }: { operator: CompositeOperator }): JSX.Element {
  switch (operator) {
    case "over":
      return (
        <>
          <CircleB />
          <SquareA />
        </>
      );
    case "in":
      return <SquareA clipPath="url(#fe-composite-operators-diagram-clip-b)" />;
    case "out":
      return <SquareA clipPath="url(#fe-composite-operators-diagram-clip-not-b)" />;
    case "atop":
      return (
        <>
          <CircleB />
          <SquareA clipPath="url(#fe-composite-operators-diagram-clip-b)" />
        </>
      );
    case "xor":
      return (
        <>
          <SquareA clipPath="url(#fe-composite-operators-diagram-clip-not-b)" />
          <CircleB clipPath="url(#fe-composite-operators-diagram-clip-not-a)" />
        </>
      );
    case "arithmetic":
      return (
        <>
          <SquareA />
          <CircleB />
          <CircleB clipPath="url(#fe-composite-operators-diagram-clip-a)" fill={FILL_SUM} />
        </>
      );
  }
}

/*
  Static 3×2 grid comparing feComposite's operators on the same two inputs — a square (A, `in`) and a circle
  (B, `in2`). Exists because the operators differ only in which of four regions (A only, B only, overlap,
  neither) survive, and that is far quicker to see side by side than to read as prose or formulas.
*/
export default function FeCompositeOperatorsDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 660 486" role="img" aria-labelledby="fe-composite-operators-diagram-title fe-composite-operators-diagram-desc">
          <title id="fe-composite-operators-diagram-title">feComposite operator comparison</title>
          <desc id="fe-composite-operators-diagram-desc">
            Six panels, each compositing a square A (the in input) with an overlapping circle B (the in2 input). over shows B
            with A on top. in shows only the part of A inside B. out shows only the part of A outside B. atop shows all of B
            with the part of A inside B on top. xor shows both shapes with the overlap removed. arithmetic with k2 and k3 set
            to 1 adds both inputs, so the overlap becomes a brighter third colour.
          </desc>

          <defs>
            <clipPath id="fe-composite-operators-diagram-clip-a">
              <rect x={SQUARE_A.x} y={SQUARE_A.y} width={SQUARE_A.size} height={SQUARE_A.size} />
            </clipPath>
            <clipPath id="fe-composite-operators-diagram-clip-b">
              <circle cx={CIRCLE_B.cx} cy={CIRCLE_B.cy} r={CIRCLE_B.r} />
            </clipPath>
            <clipPath id="fe-composite-operators-diagram-clip-not-a">
              <path d={`${FRAME_PATH} M${SQUARE_A.x},${SQUARE_A.y} h${SQUARE_A.size} v${SQUARE_A.size} h-${SQUARE_A.size} Z`} clipRule="evenodd" />
            </clipPath>
            <clipPath id="fe-composite-operators-diagram-clip-not-b">
              <path d={`${FRAME_PATH} ${CIRCLE_B_PATH}`} clipRule="evenodd" />
            </clipPath>
          </defs>

          {OPERATORS.map(({ operator, title, formula }, index) => (
            <g key={operator} transform={`translate(${CELL_ORIGINS[index].x}, ${CELL_ORIGINS[index].y})`}>
              {/* Cell background and operator name. */}
              <rect x={0} y={0} width={CELL.width} height={CELL.height} rx={CELL.radius} fill="var(--color-bg-muted)" stroke="var(--color-border-muted)" strokeWidth={1} />
              <text x={CELL.width / 2} y={24} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">{title}</text>

              {/* The surviving regions, then dashed outlines of both inputs so the removed parts stay locatable. */}
              <g transform={`translate(0, ${DRAWING_OFFSET_Y})`}>
                <OperatorResult operator={operator} />
                <rect x={SQUARE_A.x} y={SQUARE_A.y} width={SQUARE_A.size} height={SQUARE_A.size} fill="none" stroke="var(--color-fg-muted)" strokeWidth={1} strokeDasharray="4 3" />
                <circle cx={CIRCLE_B.cx} cy={CIRCLE_B.cy} r={CIRCLE_B.r} fill="none" stroke="var(--color-fg-muted)" strokeWidth={1} strokeDasharray="4 3" />
              </g>

              {/* The operator's formula, in premultiplied terms. */}
              <text x={CELL.width / 2} y={194} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{formula}</text>
            </g>
          ))}

          {/* Legend — which shape is which input, and what the dashed outline means. */}
          <rect x={140} y={460} width={14} height={14} rx={2} fill={FILL_A} />
          <text x={160} y={471} fontSize={11} fill="var(--color-fg-default)">A = in (square)</text>
          <rect x={272} y={460} width={14} height={14} rx={7} fill={FILL_B} />
          <text x={292} y={471} fontSize={11} fill="var(--color-fg-default)">B = in2 (circle)</text>
          <line x1={404} y1={467} x2={428} y2={467} stroke="var(--color-fg-muted)" strokeWidth={1} strokeDasharray="4 3" />
          <text x={434} y={471} fontSize={11} fill="var(--color-fg-default)">outline of each input</text>
        </Svg>
      </Wrapper>
    </>
  );
}

FeCompositeOperatorsDiagram.displayName = "FeCompositeOperatorsDiagram";
