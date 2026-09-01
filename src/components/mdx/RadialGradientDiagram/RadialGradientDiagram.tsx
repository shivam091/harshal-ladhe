import type { JSX } from "react";
import type { RadialGradientDiagramProps } from "@/interfaces/radial-gradient-diagram";
import {
  SWATCH_FROM,
  SWATCH_TO,
  CIRCLE_BOX,
  ELLIPSE_BOX,
  SIZE_PANEL_ORIGIN,
  ORIGIN_LOCAL,
  SIZE_BOUNDARIES
} from "@/components/mdx/RadialGradientDiagram/RadialGradientDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/RadialGradientDiagram/RadialGradientDiagram.styles";

/*
  Static SVG diagram for `radial-gradient()`, one of two variants: "shape" contrasts `circle` vs. `ellipse`
  using the same gradient definition on a square vs. a wide box (no extra math needed — objectBoundingBox
  space scales with the element itself), and "size" contrasts the 4 size keywords as boundary circles
  measured from an off-center gradient origin, the part of radial gradients beginners find most confusing.
*/
export default function RadialGradientDiagram({ variant }: RadialGradientDiagramProps): JSX.Element {
  if (variant === "shape") {
    return (
      <>
        <Wrapper>
          <Svg viewBox="0 0 500 280" role="img" aria-labelledby="radial-gradient-shape-title radial-gradient-shape-desc">
            <title id="radial-gradient-shape-title">radial-gradient circle vs ellipse diagram</title>
            <desc id="radial-gradient-shape-desc">
              The same radial gradient definition applied to a square box renders as a circle, and applied to
              a wide box renders as an ellipse — the shape keyword just picks which of the two the browser
              defaults to when it has to guess.
            </desc>

            <defs>
              <radialGradient id="radial-gradient-shape-swatch">
                <stop offset="0%" stopColor={SWATCH_FROM} />
                <stop offset="100%" stopColor={SWATCH_TO} />
              </radialGradient>
            </defs>

            <rect x={CIRCLE_BOX.x} y={CIRCLE_BOX.y} width={CIRCLE_BOX.size} height={CIRCLE_BOX.size} rx={10} fill="url(#radial-gradient-shape-swatch)" stroke="var(--color-border-muted)" strokeWidth={1} />
            <text x={CIRCLE_BOX.x + CIRCLE_BOX.size / 2} y={CIRCLE_BOX.y + CIRCLE_BOX.size + 24} textAnchor="middle" fontSize={15} fontWeight={600} fill="var(--color-fg-default)">circle</text>
            <text x={CIRCLE_BOX.x + CIRCLE_BOX.size / 2} y={CIRCLE_BOX.y + CIRCLE_BOX.size + 42} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">square box → circle</text>

            <rect x={ELLIPSE_BOX.x} y={ELLIPSE_BOX.y} width={ELLIPSE_BOX.w} height={ELLIPSE_BOX.h} rx={10} fill="url(#radial-gradient-shape-swatch)" stroke="var(--color-border-muted)" strokeWidth={1} />
            <text x={ELLIPSE_BOX.x + ELLIPSE_BOX.w / 2} y={ELLIPSE_BOX.y + ELLIPSE_BOX.h + 24} textAnchor="middle" fontSize={15} fontWeight={600} fill="var(--color-fg-default)">ellipse</text>
            <text x={ELLIPSE_BOX.x + ELLIPSE_BOX.w / 2} y={ELLIPSE_BOX.y + ELLIPSE_BOX.h + 42} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">wide box → ellipse (default)</text>
          </Svg>
        </Wrapper>
      </>
    );
  }

  const originX = SIZE_PANEL_ORIGIN.x + ORIGIN_LOCAL.x;
  const originY = SIZE_PANEL_ORIGIN.y + ORIGIN_LOCAL.y;
  // Largest boundary circle — the legend sits below its full extent so it never overlaps an uncut circle.
  const maxBoundaryRadius = Math.max(...SIZE_BOUNDARIES.map((boundary) => boundary.radius));

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 650 800" role="img" aria-labelledby="radial-gradient-size-title radial-gradient-size-desc">
          <title id="radial-gradient-size-title">radial-gradient size keyword diagram</title>
          <desc id="radial-gradient-size-desc">
            A square box with an off-center gradient origin, showing the 4 size keywords as complete boundary
            circles measured from that origin: closest-side and closest-corner stop at the nearest edge or
            corner, while farthest-side and farthest-corner reach the farthest one, extending well past the
            box itself — a real background gradient would still only ever paint inside the box, but every
            boundary is drawn in full here so its true size is never hidden.
          </desc>

          {SIZE_BOUNDARIES.map((boundary) => (
            <circle
              key={boundary.keyword}
              cx={originX}
              cy={originY}
              r={boundary.radius}
              fill="none"
              stroke={boundary.color}
              strokeWidth={2}
              strokeDasharray={boundary.dashArray === "0" ? undefined : boundary.dashArray}
            />
          ))}

          <circle cx={originX} cy={originY} r={4} fill="var(--color-fg-default)" />
          <text x={originX + 10} y={originY - 10} fontSize={11} fill="var(--color-fg-default)">gradient origin (25% 30%)</text>

          <g transform={`translate(${SIZE_PANEL_ORIGIN.x}, ${originY + maxBoundaryRadius + 40})`}>
            {SIZE_BOUNDARIES.map((boundary, index) => (
              <g key={boundary.keyword} transform={`translate(0, ${index * 22})`}>
                <line x1={0} y1={0} x2={24} y2={0} stroke={boundary.color} strokeWidth={2.5} strokeDasharray={boundary.dashArray === "0" ? undefined : boundary.dashArray} />
                <text x={32} y={4} fontSize={12} fill="var(--color-fg-default)">{boundary.keyword} — {boundary.radius}px</text>
              </g>
            ))}
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

RadialGradientDiagram.displayName = "RadialGradientDiagram";
