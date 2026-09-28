import type { JSX } from "react";
import { BBOX, REGION, CONTENT, LEGEND } from "@/components/mdx/MaskRegionDiagram/MaskRegionDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/MaskRegionDiagram/MaskRegionDiagram.styles";

/*
  Static diagram of a <mask>'s region: the masked element's bounding box, the default −10% / 120% region around
  it, and mask content that spills past that region and is cut off. Exists because the region is invisible in
  real output — a blur or glow that "mysteriously" gets a hard edge is almost always this rectangle at work.
*/
export default function MaskRegionDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 660 330" role="img" aria-labelledby="mask-region-diagram-title mask-region-diagram-desc">
          <title id="mask-region-diagram-title">Mask region diagram</title>
          <desc id="mask-region-diagram-desc">
            A solid rectangle marks the masked element&apos;s bounding box. A dashed rectangle around it marks the
            default mask region, which starts 10 percent above and to the left of the bounding box and is 120
            percent of its width and height. A large ellipse of mask content extends past the region on every
            side; only the part inside the region is filled, and the part outside is shown as a dotted ghost
            because it is cut off. maskUnits sizes the region; maskContentUnits sizes the content inside it.
          </desc>

          <defs>
            {/* Clips the drawn content to the region — the same cut-off a real mask applies. */}
            <clipPath id="mask-region-diagram-region-clip">
              <rect x={REGION.x} y={REGION.y} width={REGION.width} height={REGION.height} />
            </clipPath>
            <marker id="mask-region-diagram-tick" viewBox="0 0 2 10" refX="1" refY="5" markerWidth="2" markerHeight="10" markerUnits="userSpaceOnUse">
              <rect width="2" height="10" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {/* Mask content — the ghost of the full shape, then the part the region actually keeps. */}
          <ellipse cx={CONTENT.cx} cy={CONTENT.cy} rx={CONTENT.rx} ry={CONTENT.ry} fill="none" stroke="var(--color-fg-muted)" strokeWidth={1.5} strokeDasharray="2 3" />
          <ellipse cx={CONTENT.cx} cy={CONTENT.cy} rx={CONTENT.rx} ry={CONTENT.ry} fill="var(--color-bg-accent-muted)" clipPath="url(#mask-region-diagram-region-clip)" />

          {/* Mask region — dashed, in the attention colour, since it is the boundary people forget exists. */}
          <rect x={REGION.x} y={REGION.y} width={REGION.width} height={REGION.height} fill="none" stroke="var(--color-border-attention-emphasis)" strokeWidth={2} strokeDasharray="6 4" />

          {/* Element bounding box — solid accent outline, labelled in place. */}
          <rect x={BBOX.x} y={BBOX.y} width={BBOX.width} height={BBOX.height} fill="none" stroke="var(--color-border-accent-emphasis)" strokeWidth={2} />
          <text x={BBOX.x + BBOX.width / 2} y={BBOX.y + BBOX.height / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">element bbox</text>

          {/* Dimension line — the region's width expressed as a fraction of the bounding box. */}
          <line x1={REGION.x} y1={298} x2={REGION.x + REGION.width} y2={298} stroke="var(--color-fg-muted)" strokeWidth={1} markerStart="url(#mask-region-diagram-tick)" markerEnd="url(#mask-region-diagram-tick)" />
          <text x={REGION.x + REGION.width / 2} y={316} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">region width = 120% of bbox width</text>

          {/* Legend — one row per outline style drawn on the left. */}
          {LEGEND.map((item) => (
            <g key={item.title}>
              <rect x={390} y={item.y - 11} width={30} height={16} fill="none" stroke={item.stroke} strokeWidth={2} strokeDasharray={item.dash} />
              <text x={430} y={item.y} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">{item.title}</text>
              <text x={430} y={item.y + 16} fontSize={11} fill="var(--color-fg-muted)">{item.note}</text>
            </g>
          ))}

          {/* Units note — which attribute governs which of the two boxes. */}
          <text x={390} y={262} fontSize={12} fill="var(--color-fg-default)">maskUnits → sizes the region</text>
          <text x={390} y={280} fontSize={12} fill="var(--color-fg-default)">maskContentUnits → sizes the content</text>
        </Svg>
      </Wrapper>
    </>
  );
}

MaskRegionDiagram.displayName = "MaskRegionDiagram";
