import type { JSX } from "react";
import { STAR_POINTS, EDGE_ARROWS, POINT_A, POINT_B, CROSSINGS_A, CROSSING_B, TALLY } from "@/components/mdx/FillRuleRayDiagram/FillRuleRayDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/FillRuleRayDiagram/FillRuleRayDiagram.styles";

/*
  Static worked example of the ray-casting test behind fill-rule. Exists because "winding number" is abstract in
  prose but obvious once you can count the crossings yourself: the same ray from the star's centre scores 2 under
  nonzero (filled) and "even" under evenodd (empty), while a ray from an arm scores 1 under both.
*/
export default function FillRuleRayDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 660 360" role="img" aria-labelledby="fill-rule-ray-diagram-title fill-rule-ray-diagram-desc">
          <title id="fill-rule-ray-diagram-title">Ray-crossing test for nonzero and evenodd fill rules</title>
          <desc id="fill-rule-ray-diagram-desc">
            A five-pointed star polygon with arrows showing the direction each edge is drawn. A ray from point A at the
            centre travels right and crosses two edges that both run the same way, counting +1 and +1 for a winding number
            of 2, so nonzero fills the centre; the same two crossings are an even count, so evenodd leaves it empty. A ray
            from point B inside the left arm crosses one edge, which is +1 under nonzero and odd under evenodd, so both rules
            fill the arm.
          </desc>

          <defs>
            <marker id="fill-rule-ray-diagram-edge-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-accent)" />
            </marker>
            <marker id="fill-rule-ray-diagram-ray-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-attention)" />
            </marker>
          </defs>

          {/* The star itself, filled with the default nonzero rule so the centre reads as solid. */}
          <polygon points={STAR_POINTS} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={2} strokeLinejoin="round" />

          {/* Edge direction arrows — the drawing order that nonzero's +1 / −1 bookkeeping depends on. */}
          {EDGE_ARROWS.map((d) => (
            <path key={d} d={d} fill="none" stroke="none" markerMid="url(#fill-rule-ray-diagram-edge-arrow)" />
          ))}

          {/* Ray from A, heading right out of the star. */}
          <line x1={POINT_A.x} y1={POINT_A.y} x2={340} y2={POINT_A.y} stroke="var(--color-fg-attention)" strokeWidth={2} strokeDasharray="6 4" markerEnd="url(#fill-rule-ray-diagram-ray-arrow)" />

          {/* Ray from B, heading left out of the arm. */}
          <line x1={POINT_B.x} y1={POINT_B.y} x2={14} y2={POINT_B.y} stroke="var(--color-fg-attention)" strokeWidth={2} strokeDasharray="6 4" markerEnd="url(#fill-rule-ray-diagram-ray-arrow)" />

          {/* Crossing markers and their +1 tallies. */}
          {CROSSINGS_A.map((point) => (
            <g key={point.x}>
              <circle cx={point.x} cy={point.y} r={4} fill="var(--color-bg-default)" stroke="var(--color-border-attention-emphasis)" strokeWidth={2} />
              <text x={point.x} y={point.y + 20} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-attention)">+1</text>
            </g>
          ))}
          <circle cx={CROSSING_B.x} cy={CROSSING_B.y} r={4} fill="var(--color-bg-default)" stroke="var(--color-border-attention-emphasis)" strokeWidth={2} />
          <text x={CROSSING_B.x} y={CROSSING_B.y + 20} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-attention)">+1</text>

          {/* Test points A and B. */}
          <circle cx={POINT_A.x} cy={POINT_A.y} r={4} fill="var(--color-fg-default)" />
          <text x={POINT_A.x} y={POINT_A.y - 10} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--color-fg-default)">A</text>
          <circle cx={POINT_B.x} cy={POINT_B.y} r={4} fill="var(--color-fg-default)" />
          <text x={POINT_B.x + 7} y={POINT_B.y + 16} fontSize={13} fontWeight={700} fill="var(--color-fg-default)">B</text>

          {/* Divider between the drawing and the tally. */}
          <line x1={360} y1={40} x2={360} y2={300} stroke="var(--color-border-muted)" strokeWidth={1} />

          {/* Tally — each ray's arithmetic under both rules. */}
          {TALLY.map((block) => (
            <g key={block.heading}>
              <text x={380} y={block.y} fontSize={13} fontWeight={600} fill="var(--color-fg-default)">{block.heading}</text>
              <text x={380} y={block.y + 22} fontSize={11} fill="var(--color-fg-muted)">{block.note}</text>
              <text x={380} y={block.y + 46} fontSize={12} fill="var(--color-fg-default)">{block.nonzero}</text>
              <text x={380} y={block.y + 68} fontSize={12} fill="var(--color-fg-default)">{block.evenodd}</text>
            </g>
          ))}

          {/* Takeaway and legend. */}
          <text x={380} y={290} fontSize={11} fontStyle="italic" fill="var(--color-fg-muted)">Only the centre changes between the two rules.</text>
          <text x={330} y={340} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">arrowheads: edge drawing order · dashed: test rays · star shown with nonzero (the default)</text>
        </Svg>
      </Wrapper>
    </>
  );
}

FillRuleRayDiagram.displayName = "FillRuleRayDiagram";
