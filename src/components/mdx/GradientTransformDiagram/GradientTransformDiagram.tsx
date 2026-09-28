import type { JSX } from "react";
import { BOX_SIZE, BOX_Y, PANELS } from "@/components/mdx/GradientTransformDiagram/GradientTransformDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GradientTransformDiagram/GradientTransformDiagram.styles";

/*
  Static comparison of gradientTransform="rotate(45)" vs. rotate(45 .5 .5) on the same square box. Exists
  because both produce the same diagonal direction, so the difference — where the ramp sits inside the box —
  is easy to miss until the pivot, the rotated vector and the 0%/100% isolines are drawn side by side.
*/
export default function GradientTransformDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 620 310" role="img" aria-labelledby="gradient-transform-diagram-title gradient-transform-diagram-desc">
          <title id="gradient-transform-diagram-title">gradientTransform rotate pivot diagram</title>
          <desc id="gradient-transform-diagram-desc">
            Two identical square boxes filled with the same left-to-right gradient, each rotated 45 degrees. On the left,
            rotate(45) pivots on the box&apos;s top-left corner: the rotated vector runs from that corner only about 70% of
            the way along the diagonal, so the ramp finishes early and the bottom-right corner is flat. On the right,
            rotate(45 .5 .5) pivots on the box&apos;s center: the vector is shifted so the ramp is centered, with equal
            small flat areas at both corners. Dashed lines mark where the 0% and 100% stops fall.
          </desc>

          <defs>
            <marker id="gradient-transform-diagram-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-default)" />
            </marker>
            {/* The real gradients being compared — identical except for the rotation's pivot. */}
            <linearGradient id="gradient-transform-diagram-corner" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(45)">
              <stop offset="0" style={{ stopColor: "var(--color-fg-accent)" }} />
              <stop offset="1" style={{ stopColor: "var(--color-bg-accent-muted)" }} />
            </linearGradient>
            <linearGradient id="gradient-transform-diagram-center" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(45 .5 .5)">
              <stop offset="0" style={{ stopColor: "var(--color-fg-accent)" }} />
              <stop offset="1" style={{ stopColor: "var(--color-bg-accent-muted)" }} />
            </linearGradient>
          </defs>

          {PANELS.map((panel) => (
            <g key={panel.key}>
              {/* Heading — the exact attribute value this panel renders. */}
              <text x={panel.boxX + BOX_SIZE / 2} y={40} textAnchor="middle" fontSize={13} fontWeight={600} fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fill="var(--color-fg-default)">{panel.heading}</text>

              {/* The painted bounding box. */}
              <rect x={panel.boxX} y={BOX_Y} width={BOX_SIZE} height={BOX_SIZE} fill={`url(#gradient-transform-diagram-${panel.key})`} stroke="var(--color-border-default)" strokeWidth={1.5} />

              {/* Isolines where the 0% and 100% stops land (the corner pivot's 0% line is the corner itself). */}
              {panel.stop0 && <line x1={panel.stop0.x1} y1={panel.stop0.y1} x2={panel.stop0.x2} y2={panel.stop0.y2} stroke="var(--color-fg-default)" strokeWidth={1.5} strokeDasharray="5 4" />}
              <line x1={panel.stop1.x1} y1={panel.stop1.y1} x2={panel.stop1.x2} y2={panel.stop1.y2} stroke="var(--color-fg-default)" strokeWidth={1.5} strokeDasharray="5 4" />

              {/* The rotated gradient vector. */}
              <line x1={panel.vector.x1} y1={panel.vector.y1} x2={panel.vector.x2} y2={panel.vector.y2} stroke="var(--color-fg-default)" strokeWidth={2} markerEnd="url(#gradient-transform-diagram-arrow)" />

              {/* The pivot point the rotation turns around. */}
              <circle cx={panel.pivot.x} cy={panel.pivot.y} r={5} fill="var(--color-fg-attention)" stroke="var(--color-bg-default)" strokeWidth={1.5} />

              {/* Captions — where the pivot is, and what that does to the ramp. */}
              <text x={panel.boxX + BOX_SIZE / 2} y={278} textAnchor="middle" fontSize={12} fill="var(--color-fg-default)">{panel.captions[0]}</text>
              <text x={panel.boxX + BOX_SIZE / 2} y={296} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{panel.captions[1]}</text>
            </g>
          ))}

          {/* Pivot labels — outside the box on the left, on a pill over the ramp on the right. */}
          <text x={50} y={84} textAnchor="end" fontSize={11} fontWeight={600} fill="var(--color-fg-attention)">pivot</text>
          <rect x={436} y={180} width={48} height={18} rx={9} fill="var(--color-bg-default)" stroke="var(--color-border-muted)" />
          <text x={460} y={193} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--color-fg-attention)">pivot</text>
        </Svg>
      </Wrapper>
    </>
  );
}

GradientTransformDiagram.displayName = "GradientTransformDiagram";
