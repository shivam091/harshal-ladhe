import type { JSX } from "react";
import { CANVAS, REGION, HTML_BOX, TEXT_LINE_WIDTHS, TEXT_LINE_START_Y, TEXT_LINE_STEP } from "@/components/mdx/ForeignObjectRegionDiagram/ForeignObjectRegionDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/ForeignObjectRegionDiagram/ForeignObjectRegionDiagram.styles";

// The region's bottom edge — the line where HTML content stops being painted unless overflow is made visible.
const REGION_BOTTOM = REGION.y + REGION.height;

/*
  Static diagram of a <foreignObject> region: an SVG-user-unit rectangle (x, y, width, height, measured from the
  canvas origin) that hosts an ordinary HTML box. Exists to make two boundaries visible at once — the namespace
  switch, where SVG positioning hands off to CSS layout, and the region's bottom edge, where content taller than
  the declared height is clipped rather than growing the region.
*/
export default function ForeignObjectRegionDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 660 340" role="img" aria-labelledby="foreign-object-region-diagram-title foreign-object-region-diagram-desc">
          <title id="foreign-object-region-diagram-title">A foreignObject region hosting HTML inside SVG</title>
          <desc id="foreign-object-region-diagram-desc">
            An SVG canvas with its origin at the top-left corner. A foreignObject rectangle is positioned by x and y
            from that origin and sized by width and height, all in SVG user units. Inside it, an HTML div in the XHTML
            namespace is laid out by CSS and its text wraps at the region&apos;s width. The div is taller than the
            region, so the part below the region&apos;s bottom edge is clipped by the default overflow: hidden.
          </desc>

          <defs>
            <marker id="foreign-object-region-diagram-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {/* Outer SVG canvas — the user-unit coordinate system the region is positioned in. */}
          <rect x={CANVAS.x} y={CANVAS.y} width={CANVAS.width} height={CANVAS.height} rx={8} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5} />
          <text x={CANVAS.x} y={20} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">{"<svg viewBox=\"…\">  — SVG namespace, user units"}</text>
          <circle cx={CANVAS.x} cy={CANVAS.y} r={3} fill="var(--color-fg-default)" />
          <text x={CANVAS.x + 6} y={CANVAS.y + 14} fontSize={10} fill="var(--color-fg-muted)">(0, 0)</text>

          {/* width dimension line, above the region. */}
          <line x1={REGION.x} y1={70} x2={REGION.x + REGION.width} y2={70} stroke="var(--color-fg-muted)" strokeWidth={1.25} markerStart="url(#foreign-object-region-diagram-arrow)" markerEnd="url(#foreign-object-region-diagram-arrow)" />
          <text x={REGION.x + REGION.width / 2} y={64} textAnchor="middle" fontSize={11} fontStyle="italic" fill="var(--color-fg-muted)">width</text>

          {/* x dimension line, below the region so it never crosses the y line — plus an extension of the region's left edge down to meet it. */}
          <line x1={REGION.x} y1={REGION_BOTTOM} x2={REGION.x} y2={256} stroke="var(--color-fg-muted)" strokeWidth={1} strokeDasharray="2 2" />
          <line x1={CANVAS.x} y1={250} x2={REGION.x} y2={250} stroke="var(--color-fg-muted)" strokeWidth={1.25} markerStart="url(#foreign-object-region-diagram-arrow)" markerEnd="url(#foreign-object-region-diagram-arrow)" />
          <text x={(CANVAS.x + REGION.x) / 2} y={244} textAnchor="middle" fontSize={11} fontStyle="italic" fill="var(--color-fg-muted)">x</text>

          {/* y dimension line, from the canvas top down to the region's top edge. */}
          <line x1={150} y1={CANVAS.y} x2={150} y2={REGION.y} stroke="var(--color-fg-muted)" strokeWidth={1.25} markerStart="url(#foreign-object-region-diagram-arrow)" markerEnd="url(#foreign-object-region-diagram-arrow)" />
          <text x={142} y={(CANVAS.y + REGION.y) / 2 + 4} textAnchor="end" fontSize={11} fontStyle="italic" fill="var(--color-fg-muted)">y</text>

          {/* height dimension line, down the region's right side. */}
          <line x1={500} y1={REGION.y} x2={500} y2={REGION_BOTTOM} stroke="var(--color-fg-muted)" strokeWidth={1.25} markerStart="url(#foreign-object-region-diagram-arrow)" markerEnd="url(#foreign-object-region-diagram-arrow)" />
          <text x={508} y={REGION.y + REGION.height / 2 + 4} fontSize={11} fontStyle="italic" fill="var(--color-fg-muted)">height</text>

          {/* SVG-side annotation — what the region is from SVG's point of view. */}
          <text x={36} y={170} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">SVG side</text>
          <text x={36} y={186} fontSize={10} fill="var(--color-fg-muted)">placed in user units,</text>
          <text x={36} y={200} fontSize={10} fill="var(--color-fg-muted)">follows transforms,</text>
          <text x={36} y={214} fontSize={10} fill="var(--color-fg-muted)">clip-path, mask, filter</text>

          {/* The HTML box's visible part — inside the region, painted normally. */}
          <rect x={HTML_BOX.x} y={HTML_BOX.y} width={HTML_BOX.width} height={REGION_BOTTOM - HTML_BOX.y} fill="var(--color-bg-default)" stroke="var(--color-border-success-emphasis)" strokeWidth={1.25} />
          <text x={HTML_BOX.x + 12} y={HTML_BOX.y + 18} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">{"<div xmlns=\"…/1999/xhtml\">"}</text>
          <text x={HTML_BOX.x + 12} y={HTML_BOX.y + 32} fontSize={10} fill="var(--color-fg-muted)">XHTML namespace — CSS layout, text wraps at width</text>

          {/* The HTML box's overflowing part — laid out, but clipped at the region's edge by default. */}
          <rect x={HTML_BOX.x} y={REGION_BOTTOM} width={HTML_BOX.width} height={HTML_BOX.y + HTML_BOX.height - REGION_BOTTOM} fill="none" stroke="var(--color-border-danger-emphasis)" strokeWidth={1.25} strokeDasharray="4 3" />

          {/* Wrapped text lines — solid inside the region, faded where they overflow. */}
          {TEXT_LINE_WIDTHS.map((lineWidth, index) => {
            // Centre of this bar; compared against the region edge to decide whether it's painted or clipped.
            const centerY = TEXT_LINE_START_Y + index * TEXT_LINE_STEP;
            // Bars past the bottom edge are drawn faded — present in layout, absent from the painted result.
            const clipped = centerY > REGION_BOTTOM;

            return (
              <rect key={centerY} x={HTML_BOX.x + 12} y={centerY - 3} width={lineWidth} height={6} rx={3} fill={clipped ? "var(--color-border-danger-emphasis)" : "var(--color-fg-muted)"} opacity={clipped ? 0.35 : 0.6} />
            );
          })}

          {/* The foreignObject region boundary, drawn last so its edge sits on top of the HTML box. */}
          <rect x={REGION.x} y={REGION.y} width={REGION.width} height={REGION.height} fill="none" stroke="var(--color-border-accent-emphasis)" strokeWidth={2} strokeDasharray="6 4" />
          <text x={REGION.x + 2} y={REGION.y - 6} fontSize={11} fontWeight={600} fill="var(--color-fg-accent)">{"<foreignObject>"}</text>

          {/* Overflow annotation, beside the clipped part of the HTML box. */}
          <text x={478} y={258} fontSize={11} fontWeight={600} fill="var(--color-fg-danger)">overflow: clipped</text>
          <text x={478} y={272} fontSize={10} fill="var(--color-fg-muted)">unless overflow: visible</text>

          <text x={330} y={332} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">the region never grows to fit its content — width and height are the whole box</text>
        </Svg>
      </Wrapper>
    </>
  );
}

ForeignObjectRegionDiagram.displayName = "ForeignObjectRegionDiagram";
