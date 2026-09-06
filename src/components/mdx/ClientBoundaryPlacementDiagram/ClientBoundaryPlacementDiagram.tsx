import type { JSX } from "react";
import {
  CLIENT_BOUNDARY_NODES,
  CLIENT_BOUNDARY_EDGES,
  PANEL_A_CLIENT_IDS,
  PANEL_B_CLIENT_IDS,
  PANEL_W,
  PANEL_H,
  PANEL_A_X,
  PANEL_B_X,
  PANEL_Y
} from "@/components/mdx/ClientBoundaryPlacementDiagram/ClientBoundaryPlacementDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/ClientBoundaryPlacementDiagram/ClientBoundaryPlacementDiagram.styles";

// Fill/stroke for a node, given whether this panel treats it as a client node.
function colorFor(isClient: boolean) {
  return isClient
    ? { fill: "var(--color-bg-accent-muted)", stroke: "var(--color-border-accent-emphasis)" }
    : { fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)" };
}

/*
  Static SVG diagram comparing two placements of the same "use client" directive over an identical page
  tree (Page > Header/Sidebar/Content, Content > Article/LikeButton). Panel A puts it on Page itself, so
  every descendant — even the static Header and Article — ships as client JS. Panel B pushes it down to
  the one leaf that actually needs interactivity (LikeButton), so everything else stays a Server Component:
  no JS shipped, and each one can fetch its own data directly.
*/
export default function ClientBoundaryPlacementDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 760 310" role="img" aria-labelledby="client-boundary-placement-title client-boundary-placement-desc">
          <title id="client-boundary-placement-title">
            Diagram comparing two placements of &quot;use client&quot; over the same page tree
          </title>
          <desc id="client-boundary-placement-desc">
            The same component tree (Page rendering Header, Sidebar, and Content, and Content rendering
            Article and LikeButton) shown twice. In the left panel, &quot;use client&quot; is placed on
            Page, so every descendant is shaded as a Client Component. In the right panel, &quot;use
            client&quot; is placed only on LikeButton, so it alone is shaded as a Client Component while
            Page, Header, Sidebar, Content, and Article all stay Server Components.
          </desc>

          {/* Panel A — "use client" too high */}
          <g transform={`translate(${PANEL_A_X}, ${PANEL_Y})`}>
            <rect x={-10} y={-30} width={PANEL_W} height={PANEL_H + 40} rx={10} fill="none" stroke="var(--color-border-danger-emphasis)" strokeWidth={1.5} strokeDasharray="5 4" />
            <text x={PANEL_W / 2 - 10} y={-10} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-danger)">
              &quot;use client&quot; on Page (too high)
            </text>

            {CLIENT_BOUNDARY_EDGES.map((edge, index) => (
              <line key={index} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke="var(--color-fg-muted)" strokeWidth={1.5} />
            ))}

            {CLIENT_BOUNDARY_NODES.map((node) => {
              const color = colorFor(PANEL_A_CLIENT_IDS.includes(node.id));
              return (
                <g key={node.id}>
                  <rect x={node.x} y={node.y} width={node.w} height={node.h} rx={6} fill={color.fill} stroke={color.stroke} strokeWidth={1.5} />
                  <text x={node.x + node.w / 2} y={node.y + node.h / 2 + 4} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">
                    {node.label}
                  </text>
                </g>
              );
            })}

            <text x={PANEL_W / 2 - 10} y={PANEL_H + 22} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">
              the entire subtree ships as client JS
            </text>
          </g>

          {/* Panel B — "use client" pushed down to the leaf */}
          <g transform={`translate(${PANEL_B_X}, ${PANEL_Y})`}>
            <rect x={-10} y={-30} width={PANEL_W} height={PANEL_H + 40} rx={10} fill="none" stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} strokeDasharray="5 4" />
            <text x={PANEL_W / 2 - 10} y={-10} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-success)">
              &quot;use client&quot; on LikeButton only
            </text>

            {CLIENT_BOUNDARY_EDGES.map((edge, index) => (
              <line key={index} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke="var(--color-fg-muted)" strokeWidth={1.5} />
            ))}

            {CLIENT_BOUNDARY_NODES.map((node) => {
              const color = colorFor(PANEL_B_CLIENT_IDS.includes(node.id));
              return (
                <g key={node.id}>
                  <rect x={node.x} y={node.y} width={node.w} height={node.h} rx={6} fill={color.fill} stroke={color.stroke} strokeWidth={1.5} />
                  <text x={node.x + node.w / 2} y={node.y + node.h / 2 + 4} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">
                    {node.label}
                  </text>
                </g>
              );
            })}

            <text x={PANEL_W / 2 - 10} y={PANEL_H + 22} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">
              only the leaf widget ships client JS
            </text>
          </g>

          {/* Legend */}
          <g fontSize={11}>
            <rect x={260} y={280} width={17} height={17} rx={4} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" />
            <text x={284} y={294} fill="var(--color-fg-default)">Server Component</text>

            <rect x={430} y={280} width={17} height={17} rx={4} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" />
            <text x={454} y={294} fill="var(--color-fg-default)">Client Component</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

ClientBoundaryPlacementDiagram.displayName = "ClientBoundaryPlacementDiagram";
