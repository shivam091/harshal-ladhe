import type { JSX } from "react";
import { STROKE_WIDTH, CORNERS, PASS_MITER, WIDTH_DIMENSION, FAIL_MITER } from "@/components/mdx/MiterLimitDiagram/MiterLimitDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/MiterLimitDiagram/MiterLimitDiagram.styles";

/*
  Static side-by-side of two sharp corners either side of stroke-miterlimit's default of 4. Exists because the
  "sudden" bevel on a sharp star tip looks like a rendering bug until you see that the renderer is simply comparing
  miter length to stroke width, and that the ratio grows without bound as the corner narrows.
*/
export default function MiterLimitDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 660 400" role="img" aria-labelledby="miter-limit-diagram-title miter-limit-diagram-desc">
          <title id="miter-limit-diagram-title">How stroke-miterlimit decides between a miter and a bevel</title>
          <desc id="miter-limit-diagram-desc">
            Two thick strokes, each bending through a sharp corner. On the left a 30 degree corner has a miter length of
            about 3.86 times the stroke width, which is within the default miter limit of 4, so the pointed miter is drawn.
            On the right a 20 degree corner would need a miter 5.76 times the stroke width; that exceeds 4, so the renderer
            cuts the corner off flat with a bevel, and the missing spike is outlined with a dashed line.
          </desc>

          <defs>
            <marker id="miter-limit-diagram-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-default)" />
            </marker>
          </defs>

          {/* Both corners: the real stroke (the browser draws the join), its centreline, and the panel headings. */}
          {CORNERS.map((corner) => (
            <g key={corner.key}>
              <polyline points={corner.arms} fill="none" stroke="var(--color-border-accent-emphasis)" strokeOpacity={0.35} strokeWidth={STROKE_WIDTH} strokeLinejoin="miter" strokeMiterlimit={4} />
              <polyline points={corner.arms} fill="none" stroke="var(--color-fg-accent)" strokeWidth={1} strokeDasharray="4 3" />
              <path d={corner.arc} fill="none" stroke="var(--color-fg-muted)" strokeWidth={1.5} />
              <text x={corner.cx} y={319} textAnchor="middle" fontSize={12} fill="var(--color-fg-muted)">{corner.angleLabel}</text>
              <text x={corner.cx} y={28} textAnchor="middle" fontSize={14} fontWeight={600} fill="var(--color-fg-default)">{corner.title}</text>
              <text x={corner.cx} y={48} textAnchor="middle" fontSize={12} fill="var(--color-fg-default)">{corner.ratio}</text>
              <text x={corner.cx} y={66} textAnchor="middle" fontSize={12} fontWeight={600} fill={corner.key === "pass" ? "var(--color-fg-accent)" : "var(--color-fg-danger)"}>{corner.verdict}</text>
            </g>
          ))}

          {/* 30° corner: miter length dimension, measured from the inner corner to the outer tip. */}
          <line x1={171} y1={PASS_MITER.tipY} x2={241} y2={PASS_MITER.tipY} stroke="var(--color-fg-muted)" strokeWidth={1} strokeDasharray="3 3" />
          <line x1={171} y1={PASS_MITER.innerY} x2={241} y2={PASS_MITER.innerY} stroke="var(--color-fg-muted)" strokeWidth={1} strokeDasharray="3 3" />
          <line x1={235} y1={PASS_MITER.tipY + 2} x2={235} y2={PASS_MITER.innerY - 2} stroke="var(--color-fg-default)" strokeWidth={1.5} markerStart="url(#miter-limit-diagram-arrow)" markerEnd="url(#miter-limit-diagram-arrow)" />
          <circle cx={165} cy={PASS_MITER.tipY} r={3} fill="var(--color-fg-default)" />
          <circle cx={165} cy={PASS_MITER.innerY} r={3} fill="var(--color-fg-default)" />
          <text x={245} y={146} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">miter length</text>
          <text x={245} y={163} fontSize={11} fill="var(--color-fg-muted)">≈ 3.86 × w</text>

          {/* 30° corner: one stroke-width, measured straight across the left arm. */}
          <line x1={WIDTH_DIMENSION.x1} y1={WIDTH_DIMENSION.y1} x2={WIDTH_DIMENSION.x2} y2={WIDTH_DIMENSION.y2} stroke="var(--color-fg-default)" strokeWidth={1.5} markerStart="url(#miter-limit-diagram-arrow)" markerEnd="url(#miter-limit-diagram-arrow)" />
          <text x={106} y={300} textAnchor="end" fontSize={12} fill="var(--color-fg-default)">w = 24</text>

          {/* 20° corner: the spike the miter would need, dashed because the renderer refuses to draw it. */}
          <polygon points={FAIL_MITER} fill="var(--color-bg-danger-muted)" stroke="var(--color-border-danger-emphasis)" strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={512} y={96} fontSize={12} fill="var(--color-fg-danger)">miter needed: 5.76 × w</text>

          {/* 20° corner: pointer to the flat bevel actually painted. */}
          <line x1={526} y1={150} x2={510} y2={148} stroke="var(--color-fg-muted)" strokeWidth={1} />
          <text x={530} y={154} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">bevel</text>

          {/* Panel divider. */}
          <line x1={330} y1={16} x2={330} y2={330} stroke="var(--color-border-muted)" strokeWidth={1} />

          {/* The rule both panels are applying. */}
          <text x={330} y={364} textAnchor="middle" fontSize={12} fill="var(--color-fg-default)">ratio = miter length ÷ stroke-width = 1 / sin(θ ÷ 2)</text>
          <text x={330} y={386} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">stroke-miterlimit defaults to 4, so any corner sharper than ≈ 29° is bevelled</text>
        </Svg>
      </Wrapper>
    </>
  );
}

MiterLimitDiagram.displayName = "MiterLimitDiagram";
