import type { JSX } from "react";
import { PANEL_W, PANEL_H, CONTAINMENT_PANELS } from "@/components/mdx/ContainerContainmentDiagram/ContainerContainmentDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/ContainerContainmentDiagram/ContainerContainmentDiagram.styles";

/*
  Static SVG diagram contrasting the two `container-type` values that actually establish a query
  context: `inline-size` (left, watches width only) and `size` (right, watches both axes). Exists
  to make the `size` pitfall unmissable — it's the one value that needs a definite height, since a
  container can't watch a dimension its own children are still determining.
*/
export default function ContainerContainmentDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 460 300" role="img" aria-labelledby="container-containment-diagram-title container-containment-diagram-desc">
          <title id="container-containment-diagram-title">container-type containment axes diagram</title>
          <desc id="container-containment-diagram-desc">
            Two panels comparing container-type values. inline-size watches only the container&apos;s own
            width, leaving its height free to grow with content. size watches both width and height,
            which means it needs a definite height set explicitly — otherwise the container has no
            height to report and collapses to 0px.
          </desc>

          <defs>
            <marker id="containment-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {CONTAINMENT_PANELS.map((panel) => (
            <g key={panel.value} transform={`translate(${panel.panelX}, ${panel.panelY})`}>
              <rect
                width={PANEL_W}
                height={PANEL_H}
                rx={10}
                fill="var(--color-bg-muted)"
                stroke="var(--color-border-muted)"
                strokeWidth={1.5}
                strokeDasharray={panel.value === "size" ? "5 4" : undefined}
              />

              {panel.axes.includes("horizontal") && (
                <line
                  x1={18}
                  y1={PANEL_H / 2}
                  x2={PANEL_W - 18}
                  y2={PANEL_H / 2}
                  stroke="var(--color-fg-accent)"
                  strokeWidth={2}
                  markerStart="url(#containment-arrow)"
                  markerEnd="url(#containment-arrow)"
                />
              )}

              {panel.axes.includes("vertical") && (
                <line
                  x1={PANEL_W / 2}
                  y1={16}
                  x2={PANEL_W / 2}
                  y2={PANEL_H - 16}
                  stroke="var(--color-fg-accent)"
                  strokeWidth={2}
                  markerStart="url(#containment-arrow)"
                  markerEnd="url(#containment-arrow)"
                />
              )}

              <text x={PANEL_W / 2} y={-10} textAnchor="middle" fontSize={14} fontWeight={600} fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fill="var(--color-fg-default)">
                {panel.value}
              </text>

              <text x={PANEL_W / 2} y={PANEL_H + 22} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">
                watches: {panel.watches}
              </text>

              <foreignObject x={-6} y={PANEL_H + 32} width={PANEL_W + 12} height={44}>
                <div
                  style={{
                    fontSize: 11,
                    lineHeight: 1.35,
                    textAlign: "center",
                    color: "var(--color-fg-muted)",
                    fontFamily: "'Alan Sans', 'Source Sans 3', system-ui, sans-serif"
                  }}
                >
                  {panel.note}
                </div>
              </foreignObject>
            </g>
          ))}
        </Svg>
      </Wrapper>
    </>
  );
}

ContainerContainmentDiagram.displayName = "ContainerContainmentDiagram";
