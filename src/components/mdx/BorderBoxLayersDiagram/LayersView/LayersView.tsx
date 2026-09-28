import type { JSX } from "react";
import { roundedRectPath } from "@/components/mdx/common.helpers";
import { Svg } from "@/components/mdx/BorderBoxLayersDiagram/BorderBoxLayersDiagram.styles";
import {
  GRADIENT_START,
  GRADIENT_END,
  CODE_FONT,
  LAYER_PANEL,
  LAYER_BORDER,
  LAYER_STEPS
} from "@/components/mdx/BorderBoxLayersDiagram/BorderBoxLayersDiagram.constants";

/*
  The background-clip technique as its two layers plus the composite: a solid padding-box layer, a gradient
  border-box layer, and the ring that's left where the first doesn't cover the second. Exists to make the layer
  order unmissable — the first-listed layer is painted on top.
*/
export default function LayersView(): JSX.Element {
  const { width, height, radius } = LAYER_PANEL;
  const innerRadius = radius - LAYER_BORDER;

  return (
    <Svg viewBox="0 0 540 214" role="img" aria-labelledby="border-box-layers-diagram-title border-box-layers-diagram-desc">
      <title id="border-box-layers-diagram-title">The two background layers of a background-clip gradient border</title>
      <desc id="border-box-layers-diagram-desc">
        Layer one is a solid fill clipped to the padding box, which stops at the inner edge of the border. Layer two is
        the gradient clipped to the border box, which fills the whole element. Layer one is painted on top, so in the
        result the gradient is visible only in the border ring around the solid center.
      </desc>

      <defs>
        <linearGradient id="border-box-layers-gradient" x1={0} y1={1} x2={1} y2={0}>
          <stop offset="0%" stopColor={GRADIENT_START} />
          <stop offset="100%" stopColor={GRADIENT_END} />
        </linearGradient>
      </defs>

      {LAYER_STEPS.map((step) => (
        <g key={step.key}>
          <text x={step.x + width / 2} y={LAYER_PANEL.y - 14} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--color-fg-default)">
            {step.title}
          </text>

          <g transform={`translate(${step.x}, ${LAYER_PANEL.y})`}>
            {step.key === "padding" && (
              <>
                {/* Dashed outline of the full element, so it's clear this layer stops short of the border. */}
                <path d={roundedRectPath(0, 0, width, height, radius)} fill="none" stroke="var(--color-border-default)" strokeDasharray="4 3" />
                <path
                  d={roundedRectPath(LAYER_BORDER, LAYER_BORDER, width - LAYER_BORDER * 2, height - LAYER_BORDER * 2, innerRadius)}
                  fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5}
                />
              </>
            )}

            {step.key === "border" && <path d={roundedRectPath(0, 0, width, height, radius)} fill="url(#border-box-layers-gradient)" />}

            {step.key === "result" && (
              <>
                <path d={roundedRectPath(0, 0, width, height, radius)} fill="url(#border-box-layers-gradient)" />
                <path d={roundedRectPath(LAYER_BORDER, LAYER_BORDER, width - LAYER_BORDER * 2, height - LAYER_BORDER * 2, innerRadius)} fill="var(--color-bg-muted)" />
              </>
            )}
          </g>

          {step.code.map((line, index) => (
            <text
              key={line} x={step.x + width / 2} y={LAYER_PANEL.y + height + 20 + index * 14} textAnchor="middle" fontSize={10}
              fontFamily={step.key === "result" ? undefined : CODE_FONT} fill="var(--color-fg-muted)"
            >
              {line}
            </text>
          ))}
        </g>
      ))}

      {/* "+" and "=" operators between the panels. */}
      <text x={180} y={LAYER_PANEL.y + height / 2 + 7} textAnchor="middle" fontSize={20} fill="var(--color-fg-muted)">+</text>
      <text x={360} y={LAYER_PANEL.y + height / 2 + 7} textAnchor="middle" fontSize={20} fill="var(--color-fg-muted)">=</text>

      <text x={270} y={206} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">
        the first layer listed in the CSS is painted on top
      </text>
    </Svg>
  );
}

LayersView.displayName = "LayersView";
