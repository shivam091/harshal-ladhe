import type { JSX } from "react";
import {
  CENTER,
  RADIUS,
  FOREIGN_OBJECT,
  ARC_OUTER_RADIUS,
  ARC_START,
  ARC_END,
  SWEEP_COLORS
} from "@/components/mdx/ConicGradientDiagram/ConicGradientDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/ConicGradientDiagram/ConicGradientDiagram.styles";

/*
  Static SVG diagram of `conic-gradient()` as a clock face: colours sweep clockwise around a centre point,
  starting at the `from` angle (0deg, 12 o'clock) rather than radiating outward like a radial gradient. The
  swatch itself is a real CSS conic-gradient rendered inside a <foreignObject>, since SVG has no native conic
  gradient primitive to fall back on.
*/
export default function ConicGradientDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 340 350" role="img" aria-labelledby="conic-gradient-diagram-title conic-gradient-diagram-desc">
          <title id="conic-gradient-diagram-title">conic-gradient sweep diagram</title>
          <desc id="conic-gradient-diagram-desc">
            A color wheel that sweeps clockwise starting from 0deg at the top (12 o&apos;clock), around through
            90deg on the right, 180deg at the bottom, and 270deg on the left, back to the start — centered on
            the gradient&apos;s &quot;at&quot; position.
          </desc>

          <defs>
            <marker id="conic-gradient-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-default)" />
            </marker>
          </defs>

          <foreignObject x={FOREIGN_OBJECT.x} y={FOREIGN_OBJECT.y} width={FOREIGN_OBJECT.size} height={FOREIGN_OBJECT.size}>
            <div
              style={{
                width: FOREIGN_OBJECT.size,
                height: FOREIGN_OBJECT.size,
                borderRadius: "50%",
                background: `conic-gradient(from 0deg at 50% 50%, ${SWEEP_COLORS})`,
                border: "1px solid var(--color-border-muted)"
              }}
            />
          </foreignObject>

          {/* "from" indicator — the sweep's 0deg starting point. */}
          <line x1={CENTER.x} y1={CENTER.y - RADIUS - 32} x2={CENTER.x} y2={CENTER.y - RADIUS - 14} stroke="var(--color-fg-default)" strokeWidth={2} markerEnd="url(#conic-gradient-arrow)" />
          <text x={CENTER.x} y={CENTER.y - RADIUS - 40} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">from 0deg</text>

          {/* Sweep-direction arc — a short clockwise guide, drawn just outside the circle. */}
          <path d={`M ${ARC_START.x} ${ARC_START.y} A ${ARC_OUTER_RADIUS} ${ARC_OUTER_RADIUS} 0 0 1 ${ARC_END.x} ${ARC_END.y}`} fill="none" stroke="var(--color-fg-muted)" strokeWidth={1.5} strokeDasharray="4 4" markerEnd="url(#conic-gradient-arrow)" />
          <text x={ARC_END.x + 8} y={ARC_END.y + 4} fontSize={11} fill="var(--color-fg-muted)">sweeps clockwise</text>

          {/* Degree ticks at the other 3 cardinal points around the wheel. */}
          <text x={CENTER.x + RADIUS + 10} y={CENTER.y + 4} fontSize={11} fill="var(--color-fg-muted)">90deg</text>
          <text x={CENTER.x} y={CENTER.y + RADIUS + 22} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">180deg</text>
          <text x={CENTER.x - RADIUS - 10} y={CENTER.y + 4} textAnchor="end" fontSize={11} fill="var(--color-fg-muted)">270deg</text>

          {/* Centre "at" marker. */}
          <circle cx={CENTER.x} cy={CENTER.y} r={4} fill="var(--color-fg-default)" />
          <text x={CENTER.x} y={CENTER.y + RADIUS + 50} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">at 50% 50% — the gradient&apos;s center point</text>
        </Svg>
      </Wrapper>
    </>
  );
}

ConicGradientDiagram.displayName = "ConicGradientDiagram";
