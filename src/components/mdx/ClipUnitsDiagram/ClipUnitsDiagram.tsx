import type { JSX } from "react";
import { TARGETS, TARGET_HEIGHT, ROWS } from "@/components/mdx/ClipUnitsDiagram/ClipUnitsDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/ClipUnitsDiagram/ClipUnitsDiagram.styles";

/*
  Static 2×2 diagram: the same "circle" clip applied to a square and a wide target, once with
  clipPathUnits="objectBoundingBox" and once with userSpaceOnUse. Exists because the ellipse surprise is hard to
  believe from prose alone — bounding-box fractions scale x and y independently, so r=0.5 only stays round on a
  square target, while user-space units stay fixed no matter what they clip.
*/
export default function ClipUnitsDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 640 360" role="img" aria-labelledby="clip-units-diagram-title clip-units-diagram-desc">
          <title id="clip-units-diagram-title">clipPathUnits comparison diagram</title>
          <desc id="clip-units-diagram-desc">
            Top row, objectBoundingBox: a clip circle with r=0.5 is a circle on a 120 by 120 square target but
            stretches into a 240 by 120 ellipse on a wide target, because the fraction is scaled by width and
            height separately. Bottom row, userSpaceOnUse: a circle with r=50 stays the same 50-unit circle on
            both targets.
          </desc>

          {/* Column headers — one per target shape. */}
          {TARGETS.map((target) => (
            <text key={target.key} x={target.x + target.width / 2} y={36} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">{target.header}</text>
          ))}

          {/* Rows — each unit system's label, then its clip result on both targets. */}
          {ROWS.map((row) => (
            <g key={row.title}>
              <text x={20} y={row.y + 55} fontSize={13} fontWeight={600} fill="var(--color-fg-default)">{row.title}</text>
              <text x={20} y={row.y + 73} fontSize={11} fill="var(--color-fg-muted)">{row.note}</text>

              {TARGETS.map((target) => {
                // Radii resolved per target, since objectBoundingBox depends on the target's own width.
                const { rx, ry } = row.radius(target.width);

                return (
                  <g key={target.key}>
                    {/* Target bounding box — the clipped-away area, dashed so it reads as "removed." */}
                    <rect x={target.x} y={row.y} width={target.width} height={TARGET_HEIGHT} fill="var(--color-bg-muted)" stroke="var(--color-border-muted)" strokeWidth={1.5} strokeDasharray="4 4" />
                    {/* Visible result — what survives the clip, centered in the target. */}
                    <ellipse cx={target.x + target.width / 2} cy={row.y + TARGET_HEIGHT / 2} rx={rx} ry={ry} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
                  </g>
                );
              })}
            </g>
          ))}

          {/* Takeaway caption. */}
          <text x={330} y={352} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">bounding-box fractions scale by width and height separately — the circle becomes an ellipse</text>
        </Svg>
      </Wrapper>
    </>
  );
}

ClipUnitsDiagram.displayName = "ClipUnitsDiagram";
