import type { JSX } from "react";
import type { Vertex, VertexRole } from "@/components/mdx/MarkerVertexDiagram/MarkerVertexDiagram.constants";
import { POLYLINE, POLYGON, LEGEND } from "@/components/mdx/MarkerVertexDiagram/MarkerVertexDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/MarkerVertexDiagram/MarkerVertexDiagram.styles";

// Colour pair per role, so the legend and every vertex dot are guaranteed to agree.
const ROLE_COLORS: Record<Exclude<VertexRole, "start-end">, { fill: string; stroke: string }> = {
  start: { fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)" },
  mid: { fill: "var(--color-bg-attention-muted)", stroke: "var(--color-border-attention-emphasis)" },
  end: { fill: "var(--color-bg-danger-muted)", stroke: "var(--color-border-danger-emphasis)" }
};

// Joins vertices into a points string, keeping the drawn line and the labelled dots from ever drifting apart.
const toPoints = (vertices: Vertex[]): string => vertices.map((vertex) => `${vertex.x},${vertex.y}`).join(" ");

// Draws one vertex dot. The closed-shape first point gets a ring plus a dot because two markers genuinely land there.
function VertexDot({ vertex }: { vertex: Vertex }): JSX.Element {
  if (vertex.role === "start-end") {
    return (
      <>
        <circle cx={vertex.x} cy={vertex.y} r={11} fill="none" stroke={ROLE_COLORS.end.stroke} strokeWidth={2.5} />
        <circle cx={vertex.x} cy={vertex.y} r={6} fill={ROLE_COLORS.start.fill} stroke={ROLE_COLORS.start.stroke} strokeWidth={2} />
      </>
    );
  }

  const colors = ROLE_COLORS[vertex.role];

  return (
    <>
      <circle cx={vertex.x} cy={vertex.y} r={7} fill={colors.fill} stroke={colors.stroke} strokeWidth={2} />
    </>
  );
}

/*
  Static SVG diagram of which vertices marker-start, marker-mid, and marker-end paint on. Exists to contrast an open
  polyline — where the first and last listed points are start and end — with a closed polygon, where the implicit
  closing segment adds one more vertex back on the first point, so marker-end lands there too and the last listed
  point becomes an ordinary mid vertex. That second case is the one people get wrong.
*/
export default function MarkerVertexDiagram(): JSX.Element {
  // The closing segment's endpoints, read from the data so the dashed edge always meets the real first and last points.
  const first = POLYGON[0];
  const last = POLYGON[POLYGON.length - 1];

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 660 264" role="img" aria-labelledby="marker-vertex-diagram-title marker-vertex-diagram-desc">
          <title id="marker-vertex-diagram-title">Where marker-start, marker-mid, and marker-end land</title>
          <desc id="marker-vertex-diagram-desc">
            Left: a four-point polyline. Point 1 gets marker-start, points 2 and 3 get marker-mid, and point 4 gets marker-end.
            Right: a four-point polygon. Its automatic closing segment runs from point 4 back to point 1 and adds a final
            vertex there, so point 1 gets both marker-start and marker-end, while points 2, 3, and 4 all get marker-mid.
          </desc>

          {/* Headings for the two shapes. */}
          <text x={170} y={22} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">&lt;polyline&gt;: 4 points, 4 vertices</text>
          <text x={500} y={22} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">&lt;polygon&gt;: 4 points, 5 vertices</text>

          {/* Open polyline — first and last listed points are the ends. */}
          <polyline points={toPoints(POLYLINE)} fill="none" stroke="var(--color-fg-muted)" strokeWidth={2.5} strokeLinejoin="round" />

          {/* Polygon's listed edges, drawn as an open polyline so the closing edge can be styled separately below. */}
          <polyline points={toPoints(POLYGON)} fill="none" stroke="var(--color-fg-muted)" strokeWidth={2.5} strokeLinejoin="round" />

          {/* Closing segment — added automatically, and the reason point 1 is also the final vertex. */}
          <line x1={last.x} y1={last.y} x2={first.x} y2={first.y} stroke="var(--color-border-accent-emphasis)" strokeWidth={2.5} strokeDasharray="7 5" />
          <text x={500} y={216} textAnchor="middle" fontSize={11} fontStyle="italic" fill="var(--color-fg-accent)">closing segment</text>

          {/* Vertex dots and labels for both shapes. */}
          {[...POLYLINE, ...POLYGON].map((vertex) => (
            <g key={`${vertex.x}-${vertex.y}`}>
              <VertexDot vertex={vertex} />
              <text x={vertex.labelX} y={vertex.labelY} textAnchor="middle" fontSize={12} fill="var(--color-fg-default)">{vertex.label}</text>
            </g>
          ))}

          {/* Legend — maps each colour to the marker property that paints at that vertex. */}
          {LEGEND.map((entry) => (
            <g key={entry.role}>
              <circle cx={entry.x} cy={252} r={6} fill={ROLE_COLORS[entry.role].fill} stroke={ROLE_COLORS[entry.role].stroke} strokeWidth={2} />
              <text x={entry.x + 12} y={256} fontSize={11} fill="var(--color-fg-muted)">{entry.label}</text>
            </g>
          ))}
        </Svg>
      </Wrapper>
    </>
  );
}

MarkerVertexDiagram.displayName = "MarkerVertexDiagram";
