import type { JSX } from "react";
import { PANELS } from "@/components/mdx/PolyClosingDiagram/PolyClosingDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/PolyClosingDiagram/PolyClosingDiagram.styles";

// Joins a point list into a `points` attribute string, so both panels serialise their geometry identically.
function toPointsString(points: Array<[number, number]>): string {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

/*
  Static side-by-side of one point list rendered as a <polyline> and as a <polygon>. Exists to show that the two
  elements share the same implicit closing chord for filling purposes — the difference is only whether that
  chord is stroked — which is exactly why an unfilled-looking polyline still paints a black region by default.
*/
export default function PolyClosingDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 660 300" role="img" aria-labelledby="poly-closing-diagram-title poly-closing-diagram-desc">
          <title id="poly-closing-diagram-title">Open polyline versus closed polygon from the same points</title>
          <desc id="poly-closing-diagram-desc">
            The same five points drawn twice. On the left, a polyline with no fill set: its stroke stops at the last point,
            but the region between the line and a dashed, unstroked chord from the last point back to the first is still
            shaded, because fill defaults to black. On the right, a polygon: the browser adds that same closing segment,
            strokes it, and joins it to the first segment, producing a sealed outline.
          </desc>

          {PANELS.map((panel) => {
            // Derived per panel from its own points, so the chord always meets the panel's real first and last vertex.
            const pointsString = toPointsString(panel.points);
            const [startX, startY] = panel.points[0];
            const [endX, endY] = panel.points[panel.points.length - 1];
            const isOpen = panel.key === "polyline";

            return (
              <g key={panel.key}>
                {/* Panel heading. */}
                <text x={panel.centre} y={30} textAnchor="middle" fontSize={14} fontWeight={600} fill="var(--color-fg-default)">{panel.title}</text>
                <text x={panel.centre} y={48} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{panel.subtitle}</text>

                {/* Fill region — the phantom fill for the polyline, the intended fill for the polygon. */}
                <polygon points={pointsString} fill={isOpen ? "var(--color-bg-danger-muted)" : "var(--color-bg-accent-muted)"} stroke="none" />

                {/* The element's own stroke. */}
                {isOpen ? (
                  <polyline points={pointsString} fill="none" stroke="var(--color-fg-default)" strokeWidth={3} strokeLinejoin="round" />
                ) : (
                  <polygon points={pointsString} fill="none" stroke="var(--color-border-accent-emphasis)" strokeWidth={3} strokeLinejoin="round" />
                )}

                {/* Closing chord — dashed where it only bounds the fill, solid and highlighted where it is really stroked. */}
                {isOpen ? (
                  <line x1={endX} y1={endY} x2={startX} y2={startY} stroke="var(--color-border-danger-emphasis)" strokeWidth={2} strokeDasharray="6 4" />
                ) : (
                  <line x1={endX} y1={endY} x2={startX} y2={startY} stroke="var(--color-border-success-emphasis)" strokeWidth={3} strokeLinecap="round" />
                )}
                <text x={panel.centre} y={250} textAnchor="middle" fontSize={11} fill={isOpen ? "var(--color-fg-danger)" : "var(--color-fg-default)"}>{panel.chordLabel}</text>

                {/* Vertices, with the first and last labelled. */}
                {panel.points.map(([x, y]) => (
                  <circle key={`${x},${y}`} cx={x} cy={y} r={4} fill="var(--color-fg-default)" />
                ))}
                <text x={startX - 8} y={startY + 4} textAnchor="end" fontSize={11} fill="var(--color-fg-muted)">start</text>
                <text x={endX + 8} y={endY + 4} fontSize={11} fill="var(--color-fg-muted)">end</text>
              </g>
            );
          })}

          {/* Panel divider and shared caption. */}
          <line x1={330} y1={16} x2={330} y2={262} stroke="var(--color-border-muted)" strokeWidth={1} />
          <text x={330} y={288} textAnchor="middle" fontSize={11} fontStyle="italic" fill="var(--color-fg-muted)">identical points attribute: only the element name changes</text>
        </Svg>
      </Wrapper>
    </>
  );
}

PolyClosingDiagram.displayName = "PolyClosingDiagram";
