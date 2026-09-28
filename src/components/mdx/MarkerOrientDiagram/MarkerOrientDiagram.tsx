import type { JSX } from "react";
import { PANEL_WIDTH, PATH_POINTS, PANELS } from "@/components/mdx/MarkerOrientDiagram/MarkerOrientDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/MarkerOrientDiagram/MarkerOrientDiagram.styles";

// The bent path's d string, built once from the shared points so all 3 panels draw identical geometry.
const PATH_D = `M${PATH_POINTS.start.x},${PATH_POINTS.start.y} L${PATH_POINTS.mid.x},${PATH_POINTS.mid.y} L${PATH_POINTS.end.x},${PATH_POINTS.end.y}`;

/*
  Static SVG diagram comparing orient="0", orient="auto", and orient="auto-start-reverse" on the same bent path.
  Uses real <marker> elements rather than hand-rotated triangles, so what the reader sees is exactly what the browser
  computes for each value — including the bisector angle orient="auto" picks at the interior vertex.
*/
export default function MarkerOrientDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox={`0 0 ${PANEL_WIDTH * PANELS.length} 236`} role="img" aria-labelledby="marker-orient-diagram-title marker-orient-diagram-desc">
          <title id="marker-orient-diagram-title">How orient rotates a marker</title>
          <desc id="marker-orient-diagram-desc">
            The same up-then-down path three times. With orient 0 both end arrows point right regardless of the line. With
            orient auto each arrow follows the direction of travel, so the start arrow points into the line, and the arrow on
            the middle vertex points along the bisector of the incoming and outgoing segments, which here is straight right.
            With orient auto-start-reverse the start arrow is flipped to point outward while the end arrow behaves like auto.
          </desc>

          <defs>
            {/* One marker per orient value — identical artwork, so orient is the only variable. */}
            {PANELS.map((panel) => (
              <marker key={panel.id} id={`marker-orient-diagram-${panel.id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient={panel.orient}>
                <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-accent)" />
              </marker>
            ))}
          </defs>

          {/* Panel separators. */}
          {PANELS.slice(1).map((panel, index) => (
            <line key={panel.id} x1={PANEL_WIDTH * (index + 1)} y1={44} x2={PANEL_WIDTH * (index + 1)} y2={190} stroke="var(--color-border-muted)" strokeWidth={1} strokeDasharray="4 4" />
          ))}

          {/* The 3 panels — same path, same marker artwork, different orient. */}
          {PANELS.map((panel, index) => {
            // Each panel points at its own marker, since orient lives on the <marker>, not on the path referencing it.
            const markerRef = `url(#marker-orient-diagram-${panel.id})`;

            return (
              <g key={panel.id} transform={`translate(${PANEL_WIDTH * index}, 0)`}>
                <text x={PANEL_WIDTH / 2} y={30} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">{panel.title}</text>

                {/* The marked path — markers at both ends, plus the interior vertex in the auto panel. */}
                <path d={PATH_D} fill="none" stroke="var(--color-fg-muted)" strokeWidth={3} markerStart={markerRef} markerEnd={markerRef} markerMid={panel.withMid ? markerRef : undefined} />

                {/* Bisector guide at the interior vertex — the angle orient="auto" uses where two segments meet. */}
                {panel.withMid && (
                  <>
                    <line x1={PATH_POINTS.mid.x + 8} y1={PATH_POINTS.mid.y} x2={PATH_POINTS.mid.x + 62} y2={PATH_POINTS.mid.y} stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} strokeDasharray="4 3" />
                    <text x={PATH_POINTS.mid.x + 40} y={PATH_POINTS.mid.y - 8} textAnchor="middle" fontSize={10} fontStyle="italic" fill="var(--color-fg-accent)">bisector</text>
                  </>
                )}

                {/* Caption — what this orient value did to the arrows. */}
                {panel.caption.map((line, lineIndex) => (
                  <text key={line} x={PANEL_WIDTH / 2} y={210 + lineIndex * 16} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{line}</text>
                ))}
              </g>
            );
          })}
        </Svg>
      </Wrapper>
    </>
  );
}

MarkerOrientDiagram.displayName = "MarkerOrientDiagram";
