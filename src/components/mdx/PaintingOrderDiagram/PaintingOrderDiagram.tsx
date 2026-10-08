import type { JSX } from "react";
import { SLAB, LABEL_X, LAYERS } from "@/components/mdx/PaintingOrderDiagram/PaintingOrderDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/PaintingOrderDiagram/PaintingOrderDiagram.styles";

// Parallelogram corners for one slab, so every layer shares the same perspective and only its height changes.
function slabPoints(y: number): string {
  const { x, width, skew, height } = SLAB;
  return `${x + skew},${y} ${x + skew + width},${y} ${x + width},${y + height} ${x},${y + height}`;
}

/*
  Static "exploded" view of one stacking context's seven painting layers. Exists because the order is the whole
  model behind z-index — once readers see that z-index only reorders the top and bottom slabs, the rest follows.
*/
export default function PaintingOrderDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 640 450" role="img" aria-labelledby="painting-order-diagram-title painting-order-diagram-desc">
          <title id="painting-order-diagram-title">The seven painting layers of a stacking context</title>
          <desc id="painting-order-diagram-desc">
            Seven stacked sheets, painted from bottom to top: 1, the background and borders of the element that formed
            the stacking context; 2, positioned descendants with negative z-index; 3, non-positioned block boxes in normal
            flow; 4, floats; 5, inline content such as text; 6, positioned descendants with z-index auto or 0, along with
            stacking contexts created by properties like opacity and transform; 7, positioned descendants with positive
            z-index. Within one layer, later elements in the source paint on top.
          </desc>

          <defs>
            <marker id="painting-order-diagram-arrow" viewBox="0 0 10 10" refX={5} refY={5} markerWidth={8} markerHeight={8} orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {/* Direction of travel: painted later means closer to the viewer. */}
          <line x1={24} y1={404} x2={24} y2={34} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#painting-order-diagram-arrow)" />
          <text x={14} y={220} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)" transform="rotate(-90 14 220)">
            painted later → closer to you
          </text>

          {LAYERS.map((layer, index) => {
            // Index 0 is painted first, so it sits lowest on the canvas.
            const y = SLAB.bottomY - index * SLAB.gap;
            const midY = y + SLAB.height / 2;
            const edgeX = SLAB.x + SLAB.width + SLAB.skew / 2;

            return (
              <g key={layer.title}>
                <polygon points={slabPoints(y)} fill={layer.fill} stroke={layer.stroke} strokeWidth={1.5} strokeLinejoin="round" />
                <text x={SLAB.x + (SLAB.width + SLAB.skew) / 2} y={midY + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--color-fg-default)">
                  {index + 1}
                </text>
                <line x1={edgeX} y1={midY} x2={LABEL_X - 8} y2={midY} stroke="var(--color-border-muted)" strokeWidth={1} strokeDasharray="3 3" />
                <text x={LABEL_X} y={midY - 3} fontSize={13} fontWeight={600} fill="var(--color-fg-default)">{layer.title}</text>
                <text x={LABEL_X} y={midY + 13} fontSize={11} fill="var(--color-fg-muted)">{layer.detail}</text>
              </g>
            );
          })}

          <text x={320} y={440} textAnchor="middle" fontSize={11} fontStyle="italic" fill="var(--color-fg-muted)">
            within one layer, later elements in the source paint on top of earlier ones
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

PaintingOrderDiagram.displayName = "PaintingOrderDiagram";
