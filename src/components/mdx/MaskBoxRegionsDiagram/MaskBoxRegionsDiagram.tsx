import type { JSX } from "react";
import { MASK_BOX_REGIONS, OUTER_BOX } from "@/components/mdx/MaskBoxRegionsDiagram/MaskBoxRegionsDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/MaskBoxRegionsDiagram/MaskBoxRegionsDiagram.styles";

/*
  Static SVG diagram of the 3 nested reference boxes `mask-origin` and `mask-clip` can point at —
  border-box, padding-box, and content-box, drawn as concentric rectangles matching the regular CSS box
  model. Exists because both properties accept the same 3 keywords but do different things with them
  (mask-origin positions the mask, mask-clip decides what gets cut off), so seeing all 3 boxes at once
  makes clear it's one shared vocabulary, not two.
*/
export default function MaskBoxRegionsDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 400 200" role="img" aria-labelledby="mask-box-regions-diagram-title mask-box-regions-diagram-desc">
          <title id="mask-box-regions-diagram-title">CSS mask box regions diagram</title>
          <desc id="mask-box-regions-diagram-desc">
            Three concentric rectangles labeled border-box, padding-box, and content-box, from outermost to
            innermost. mask-origin and mask-clip both accept these same 3 values — border-box is the default
            for each.
          </desc>

          {MASK_BOX_REGIONS.map((region, index) => {
            const x = OUTER_BOX.x + region.inset;
            const y = OUTER_BOX.y + region.inset;
            const w = OUTER_BOX.w - region.inset * 2;
            const h = OUTER_BOX.h - region.inset * 2;
            const isOutermost = index === 0;

            return (
              <rect
                key={region.key}
                x={x}
                y={y}
                width={w}
                height={h}
                rx={isOutermost ? 10 : 4}
                fill="none"
                stroke={isOutermost ? "var(--color-border-default)" : "var(--color-border-accent-emphasis)"}
                strokeWidth={isOutermost ? 2 : 1.5}
                strokeDasharray={isOutermost ? undefined : "4 3"}
              />
            );
          })}

          <text x={OUTER_BOX.x + OUTER_BOX.w / 2} y={OUTER_BOX.y + OUTER_BOX.h / 2} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">content</text>

          {/* Legend mapping each box to its keyword and what it excludes. */}
          <g transform="translate(268, 30)">
            {MASK_BOX_REGIONS.map((region, index) => (
              <g key={region.key} transform={`translate(0, ${index * 44})`}>
                <rect width={14} height={14} rx={3} fill="none" stroke={index === 0 ? "var(--color-border-default)" : "var(--color-border-accent-emphasis)"} strokeWidth={1.5} />
                <text x={22} y={12} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">{region.label}</text>
                <text x={22} y={28} fontSize={10} fill="var(--color-fg-muted)">{region.note}</text>
              </g>
            ))}
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

MaskBoxRegionsDiagram.displayName = "MaskBoxRegionsDiagram";
