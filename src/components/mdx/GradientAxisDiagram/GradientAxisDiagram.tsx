import type { JSX } from "react";
import { PANEL_W, PANEL_H, SWATCH_FROM, SWATCH_TO, GRADIENT_AXIS_PANELS } from "@/components/mdx/GradientAxisDiagram/GradientAxisDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GradientAxisDiagram/GradientAxisDiagram.styles";

/*
  Static SVG diagram of CSS `linear-gradient()`'s angle convention — 4 identical two-color swatches, each
  rotated to a cardinal angle, laid out clockwise starting from 0deg (up). Corrects the most common beginner
  assumption (carried over from math/SVG, where 0deg points right) that CSS gradients start pointing right.
*/
export default function GradientAxisDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 480 370" role="img" aria-labelledby="gradient-axis-diagram-title gradient-axis-diagram-desc">
          <title id="gradient-axis-diagram-title">CSS linear-gradient angle diagram</title>
          <desc id="gradient-axis-diagram-desc">
            Four identical two-color swatches, each showing the same gradient rotated to 0deg, 90deg, 180deg, and
            270deg. 0deg points straight up, and the angle increases clockwise from there — 90deg points right,
            180deg points down, and 270deg points left.
          </desc>

          <defs>
            <marker id="gradient-axis-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-default)" />
            </marker>
            {GRADIENT_AXIS_PANELS.map((panel) => (
              <linearGradient key={`grad-${panel.degree}`} id={`gradient-axis-${panel.degree}`} x1={panel.x1} y1={panel.y1} x2={panel.x2} y2={panel.y2}>
                <stop offset="0%" stopColor={SWATCH_FROM} />
                <stop offset="100%" stopColor={SWATCH_TO} />
              </linearGradient>
            ))}
          </defs>

          {GRADIENT_AXIS_PANELS.map((panel) => (
            <g key={panel.degree} transform={`translate(${panel.panelX}, ${panel.panelY})`}>
              <rect width={PANEL_W} height={PANEL_H} rx={10} fill={`url(#gradient-axis-${panel.degree})`} stroke="var(--color-border-muted)" strokeWidth={1} />
              <line
                x1={panel.arrowX1}
                y1={panel.arrowY1}
                x2={panel.arrowX2}
                y2={panel.arrowY2}
                stroke="var(--color-fg-default)"
                strokeWidth={2}
                markerEnd="url(#gradient-axis-arrow)"
              />
              <text x={PANEL_W / 2} y={PANEL_H + 22} textAnchor="middle" fontSize={15} fontWeight={600} fill="var(--color-fg-default)">{panel.degree}</text>
              <text x={PANEL_W / 2} y={PANEL_H + 40} textAnchor="middle" fontSize={11} fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fill="var(--color-fg-muted)">
                {panel.keyword}
              </text>
            </g>
          ))}
        </Svg>
      </Wrapper>
    </>
  );
}

GradientAxisDiagram.displayName = "GradientAxisDiagram";
