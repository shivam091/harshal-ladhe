import type { JSX } from "react";
import { BLUR_STD_DEVIATION, SHAPE_RADIUS, PANELS } from "@/components/mdx/FilterRegionDiagram/FilterRegionDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/FilterRegionDiagram/FilterRegionDiagram.styles";

/*
  Static side-by-side diagram of the same blurred shape filtered inside the default region versus an expanded one.
  The blur is a real feGaussianBlur clipped to each region's rectangle, so the hard edge readers see is exactly
  the artefact they'll hit in their own work — not an illustration of it.
*/
export default function FilterRegionDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 660 264" role="img" aria-labelledby="filter-region-diagram-title filter-region-diagram-desc">
          <title id="filter-region-diagram-title">Default filter region versus an expanded filter region</title>
          <desc id="filter-region-diagram-desc">
            Two identical rounded rectangles, each blurred with stdDeviation 10. On the left, the default filter region
            extends only 10% beyond the element&apos;s bounding box, so the blur is sliced off with hard straight edges.
            On the right, the region is expanded to -30% / 160%, and the blur fades out smoothly inside it.
          </desc>

          <defs>
            {/* One oversized user-space blur shared by both panels; each panel's clipPath then stands in for its filter region. */}
            <filter id="filter-region-diagram-blur" filterUnits="userSpaceOnUse" x={0} y={0} width={660} height={264}>
              <feGaussianBlur stdDeviation={BLUR_STD_DEVIATION} />
            </filter>
            {PANELS.map((panel) => (
              <clipPath key={panel.key} id={`filter-region-diagram-clip-${panel.key}`}>
                <rect x={panel.region.x} y={panel.region.y} width={panel.region.width} height={panel.region.height} />
              </clipPath>
            ))}
          </defs>

          {/* Divider between the two panels. */}
          <line x1={330} y1={30} x2={330} y2={210} stroke="var(--color-border-muted)" strokeWidth={1} strokeDasharray="4 4" />

          {PANELS.map((panel) => {
            // Titles and captions centre on the bbox, not the region, so both panels' text lines up with the shape.
            const centerX = panel.bbox.x + panel.bbox.width / 2;
            // Danger vs success stroke so the failing panel reads as a bug without reading the caption.
            const regionStroke = panel.clipped ? "var(--color-border-danger-emphasis)" : "var(--color-border-success-emphasis)";

            return (
              <g key={panel.key}>
                {/* Panel title. */}
                <text x={centerX} y={18} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">{panel.title}</text>

                {/* The blurred shape, clipped to this panel's filter region. */}
                <rect x={panel.bbox.x} y={panel.bbox.y} width={panel.bbox.width} height={panel.bbox.height} rx={SHAPE_RADIUS} fill="var(--color-fg-accent)" filter="url(#filter-region-diagram-blur)" clipPath={`url(#filter-region-diagram-clip-${panel.key})`} />

                {/* The element's own bounding box, dashed. */}
                <rect x={panel.bbox.x} y={panel.bbox.y} width={panel.bbox.width} height={panel.bbox.height} fill="none" stroke="var(--color-fg-default)" strokeWidth={1.25} strokeDasharray="5 4" />

                {/* The filter region outline and its percentage label. */}
                <rect x={panel.region.x} y={panel.region.y} width={panel.region.width} height={panel.region.height} fill="none" stroke={regionStroke} strokeWidth={2} />
                <text x={panel.region.x} y={panel.region.y - 6} textAnchor="start" fontSize={10} fill="var(--color-fg-muted)">{panel.regionLabel}</text>

                {/* Caption naming the outcome. */}
                <text x={centerX} y={228} textAnchor="middle" fontSize={11} fontStyle="italic" fill={panel.clipped ? "var(--color-fg-danger)" : "var(--color-fg-muted)"}>{panel.caption}</text>
              </g>
            );
          })}

          {/* Legend: dashed = element bbox, solid = filter region. */}
          <line x1={180} y1={248} x2={206} y2={248} stroke="var(--color-fg-default)" strokeWidth={1.25} strokeDasharray="5 4" />
          <text x={212} y={252} fontSize={11} fill="var(--color-fg-muted)">element bounding box</text>
          <line x1={360} y1={248} x2={386} y2={248} stroke="var(--color-fg-muted)" strokeWidth={2} />
          <text x={392} y={252} fontSize={11} fill="var(--color-fg-muted)">filter region</text>
        </Svg>
      </Wrapper>
    </>
  );
}

FilterRegionDiagram.displayName = "FilterRegionDiagram";
