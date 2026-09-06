import type { JSX } from "react";
import {
  PANEL_H,
  TOP_PAD,
  NODE_CX,
  NODE_W,
  NODE_H,
  TITLE_Y,
  TOP_BOX_Y,
  BOTTOM_BOX_Y,
  EDGE_TOP_Y,
  EDGE_BOTTOM_Y,
  EDGE_MID_Y,
  BADGE_CX_OFFSET,
  LABEL_X_OFFSET,
  NOTE_Y,
  COMPOSITION_PANELS
} from "@/components/mdx/CompositionBoundaryDiagram/CompositionBoundaryDiagram.constants";
import { getCompositionNodeColor, getCompositionEdgeColor } from "@/components/mdx/CompositionBoundaryDiagram/CompositionBoundaryDiagram.helpers";
import { Wrapper, Svg } from "@/components/mdx/CompositionBoundaryDiagram/CompositionBoundaryDiagram.styles";

/*
  Static SVG diagram of the composition rule that trips everyone up: a Server Component may import a
  Client Component (panel 1), a Client Component may NOT import a Server Component (panel 2, crossed
  out), and the escape hatch is passing an already-rendered Server Component in as children/props
  instead of importing it (panel 3) — note panels 2 and 3 share the exact same box arrangement, so the
  only thing that changes is the edge itself, not which component "looks" like the parent.
*/
export default function CompositionBoundaryDiagram(): JSX.Element {
  const height = TOP_PAD + COMPOSITION_PANELS.length * PANEL_H;

  return (
    <>
      <Wrapper>
        <Svg viewBox={`0 0 560 ${height}`} role="img" aria-labelledby="composition-boundary-diagram-title composition-boundary-diagram-desc">
          <title id="composition-boundary-diagram-title">Server/Client composition boundary diagram</title>
          <desc id="composition-boundary-diagram-desc">
            Three panels. First: a Server Component imports a Client Component — allowed. Second: a
            Client Component tries to import a Server Component — blocked, shown crossed out. Third: a
            Client Component instead renders a Server Component passed in as children — allowed,
            because it is a data handoff rather than an import.
          </desc>

          <defs>
            <marker id="composition-arrow-down" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-border-success-emphasis)" />
            </marker>
            <marker id="composition-arrow-up" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-border-accent-emphasis)" />
            </marker>
          </defs>

          {COMPOSITION_PANELS.map((panel, index) => {
            const offsetY = TOP_PAD + index * PANEL_H;
            const topColor = getCompositionNodeColor(panel.topKind);
            const bottomColor = getCompositionNodeColor(panel.bottomKind);
            const edgeColor = getCompositionEdgeColor(panel.edgeKind);
            const allowed = panel.edgeKind !== "blocked";
            const badgeColor = allowed
              ? { fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)" }
              : { fill: "var(--color-bg-danger-muted)", stroke: "var(--color-border-danger-emphasis)" };

            return (
              <g key={panel.title} transform={`translate(0, ${offsetY})`}>
                <text x={20} y={TITLE_Y} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">{panel.title}</text>

                <rect x={NODE_CX - NODE_W / 2} y={TOP_BOX_Y} width={NODE_W} height={NODE_H} rx={8} fill={topColor.fill} stroke={topColor.stroke} strokeWidth={1.5} />
                <text x={NODE_CX} y={TOP_BOX_Y + NODE_H / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">
                  {panel.topLabel}
                </text>

                <rect x={NODE_CX - NODE_W / 2} y={BOTTOM_BOX_Y} width={NODE_W} height={NODE_H} rx={8} fill={bottomColor.fill} stroke={bottomColor.stroke} strokeWidth={1.5} />
                <text x={NODE_CX} y={BOTTOM_BOX_Y + NODE_H / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">
                  {panel.bottomLabel}
                </text>

                <line
                  x1={NODE_CX}
                  y1={EDGE_TOP_Y}
                  x2={NODE_CX}
                  y2={EDGE_BOTTOM_Y}
                  stroke={edgeColor}
                  strokeWidth={2}
                  strokeDasharray={panel.edgeKind === "blocked" ? "5 4" : undefined}
                  markerEnd={panel.edgeKind === "allowed-down" ? "url(#composition-arrow-down)" : undefined}
                  markerStart={panel.edgeKind === "allowed-up" ? "url(#composition-arrow-up)" : undefined}
                />

                {panel.edgeKind === "blocked" && (
                  <text x={NODE_CX} y={EDGE_MID_Y + 5} textAnchor="middle" fontSize={17} fontWeight={700} fill="var(--color-border-danger-emphasis)">✕</text>
                )}

                <text x={NODE_CX + LABEL_X_OFFSET} y={EDGE_MID_Y - 8} fontSize={10.5} fontStyle="italic" fill="var(--color-fg-muted)">
                  {panel.edgeLabel}
                </text>

                <circle cx={NODE_CX + BADGE_CX_OFFSET} cy={EDGE_MID_Y} r={11} fill={badgeColor.fill} stroke={badgeColor.stroke} strokeWidth={1.5} />
                <text x={NODE_CX + BADGE_CX_OFFSET} y={EDGE_MID_Y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--color-fg-default)">
                  {allowed ? "✓" : "✕"}
                </text>

                <text x={NODE_CX} y={NOTE_Y} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{panel.note}</text>
              </g>
            );
          })}
        </Svg>
      </Wrapper>
    </>
  );
}

CompositionBoundaryDiagram.displayName = "CompositionBoundaryDiagram";
