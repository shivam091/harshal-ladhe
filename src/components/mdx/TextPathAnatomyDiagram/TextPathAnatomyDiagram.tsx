import type { JSX } from "react";
import { CURVE_D, PATH_START, PATH_END, START_OFFSET_PERCENT, OFFSET_POINT, OFFSET_TANGENT, TANGENT_HALF } from "@/components/mdx/TextPathAnatomyDiagram/TextPathAnatomyDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/TextPathAnatomyDiagram/TextPathAnatomyDiagram.styles";

/*
  Static SVG diagram of how <textPath> lays text on a curve: where the path starts, which way it travels,
  how startOffset is measured along the arc (not in a straight line), and how each glyph's baseline follows
  the path's tangent. The text is a real <textPath> on the same curve, so the picture can't drift from the
  behaviour it describes.
*/
export default function TextPathAnatomyDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 640 292" role="img" aria-labelledby="text-path-anatomy-diagram-title text-path-anatomy-diagram-desc">
          <title id="text-path-anatomy-diagram-title">SVG textPath anatomy diagram</title>
          <desc id="text-path-anatomy-diagram-desc">
            An arch-shaped path runs from its start point on the left to its end on the right, with an arrow showing its
            direction of travel. The first quarter of the arc is highlighted and labelled startOffset 25 percent, measured
            along the arc. The text starts at that point and rides the curve, standing on the left-hand side of the
            direction of travel, which is above the arch here. A short dashed line shows the baseline at that point is
            the tangent to the path.
          </desc>

          <defs>
            <path id="text-path-anatomy-diagram-curve" d={CURVE_D} />
            <marker id="text-path-anatomy-diagram-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {/* The path itself — drawn visibly here, with an arrowhead at the end to show its direction of travel. */}
          <path d={CURVE_D} fill="none" stroke="var(--color-fg-muted)" strokeWidth={1.5} strokeDasharray="5 4" markerEnd="url(#text-path-anatomy-diagram-arrow)" />

          {/* startOffset segment — pathLength="100" makes the dash length a percentage of the arc, exactly like startOffset. */}
          <path d={CURVE_D} fill="none" pathLength={100} stroke="var(--color-border-attention-emphasis)" strokeWidth={4} strokeLinecap="round" strokeDasharray={`${START_OFFSET_PERCENT} 200`} />

          {/* Path start — the zero point startOffset is measured from. */}
          <circle cx={PATH_START.x} cy={PATH_START.y} r={5} fill="var(--color-fg-default)" />
          <text x={PATH_START.x} y={PATH_START.y + 24} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">path start (M)</text>
          <text x={PATH_END.x} y={PATH_END.y + 24} textAnchor="middle" fontSize={12} fill="var(--color-fg-muted)">path end</text>

          {/* The real text on the curve, starting at the offset point. */}
          <text fontSize={20} fontWeight={600} fill="var(--color-fg-accent)">
            <textPath href="#text-path-anatomy-diagram-curve" startOffset={`${START_OFFSET_PERCENT}%`}>Text riding the curve</textPath>
          </text>

          {/* Baseline tangent at the offset point — the direction the first glyph's baseline follows. */}
          <line x1={OFFSET_POINT.x - OFFSET_TANGENT.dx * TANGENT_HALF} y1={OFFSET_POINT.y - OFFSET_TANGENT.dy * TANGENT_HALF} x2={OFFSET_POINT.x + OFFSET_TANGENT.dx * TANGENT_HALF} y2={OFFSET_POINT.y + OFFSET_TANGENT.dy * TANGENT_HALF} stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} strokeDasharray="3 3" />
          <circle cx={OFFSET_POINT.x} cy={OFFSET_POINT.y} r={4} fill="var(--color-border-attention-emphasis)" />
          <line x1={226} y1={184} x2={197} y2={170} stroke="var(--color-fg-muted)" strokeWidth={1} />
          <text x={230} y={192} fontSize={12} fill="var(--color-fg-default)">baseline = tangent to the path</text>

          {/* Labels inside the arch — the offset measurement and the direction of travel. */}
          <text x={160} y={226} fontSize={12} fontWeight={600} fill="var(--color-fg-attention)">startOffset = {START_OFFSET_PERCENT}%</text>
          <text x={160} y={242} fontSize={11} fill="var(--color-fg-muted)">measured along the arc</text>
          <text x={455} y={228} textAnchor="middle" fontSize={12} fill="var(--color-fg-muted)">direction of travel →</text>

          {/* Caption — which side the glyphs stand on, and the portable way to flip it. */}
          <text x={320} y={284} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">glyphs stand on the left of the direction of travel — reverse the path data to flip them</text>
        </Svg>
      </Wrapper>
    </>
  );
}

TextPathAnatomyDiagram.displayName = "TextPathAnatomyDiagram";
