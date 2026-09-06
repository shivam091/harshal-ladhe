import type { JSX } from "react";
import {
  LAYER_SIZE,
  LAYERS,
  RESULT,
  DENSE_DOTS,
  OVERLAY_POINTS,
  OVERLAY_TOOLTIP
} from "@/components/mdx/HybridLayeringDiagram/HybridLayeringDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/HybridLayeringDiagram/HybridLayeringDiagram.styles";

/*
  Static SVG diagram of the hybrid pattern real chart/visualization libraries actually use: a dense Canvas
  layer carrying thousands of redrawn points, with a sparse SVG/HTML layer stacked on top via absolute
  positioning for the few elements that need to be interactive, hoverable, or screen-reader visible. Exists to
  make the "you rarely have to pick exactly one" point visual instead of just asserted in prose.
*/
export default function HybridLayeringDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 460 300" role="img" aria-labelledby="hybrid-layering-diagram-title hybrid-layering-diagram-desc">
          <title id="hybrid-layering-diagram-title">Hybrid Canvas-plus-SVG layering pattern</title>
          <desc id="hybrid-layering-diagram-desc">
            Two stacked layers: a dense Canvas layer scattered with many small points, redrawn every frame, and
            a sparse SVG or HTML overlay on top carrying only a couple of real, hoverable points and one
            tooltip. The composited result on the right shows both together — the dense point cloud rendered
            once, with the few interactive elements layered over it as real DOM nodes.
          </desc>

          <defs>
            <marker id="hybrid-layering-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {/* Stack drawn back-to-front: ② (Canvas, dense) first, then ① (SVG/HTML overlay, sparse) on top. */}
          {[...LAYERS].reverse().map((layer) => {
            const isOverlay = layer.badge === "①";
            return (
              <g key={layer.badge}>
                <rect
                  x={layer.x} y={layer.y} width={LAYER_SIZE} height={LAYER_SIZE} rx={10}
                  fill={isOverlay ? "var(--color-bg-default)" : "var(--color-bg-attention-muted)"}
                  fillOpacity={isOverlay ? 0.55 : 1}
                  stroke={isOverlay ? "var(--color-fg-accent)" : "var(--color-fg-attention)"}
                  strokeWidth={1.5}
                  strokeDasharray={isOverlay ? "4 3" : undefined}
                />

                {!isOverlay && DENSE_DOTS.map((dot, index) => (
                  <circle key={index} cx={layer.x + dot.cx} cy={layer.y + dot.cy} r={2} fill="var(--color-fg-attention)" opacity={0.75} />
                ))}

                {isOverlay && OVERLAY_POINTS.map((point, index) => (
                  <circle key={index} cx={layer.x + point.cx} cy={layer.y + point.cy} r={4.5} fill="var(--color-fg-accent)" stroke="var(--color-bg-default)" strokeWidth={1.25} />
                ))}
                {isOverlay && (
                  <g>
                    <rect x={layer.x + OVERLAY_TOOLTIP.x} y={layer.y + OVERLAY_TOOLTIP.y} width={OVERLAY_TOOLTIP.width} height={OVERLAY_TOOLTIP.height} rx={4} fill="var(--color-bg-default)" stroke="var(--color-fg-accent)" strokeWidth={1} />
                    <text x={layer.x + OVERLAY_TOOLTIP.x + OVERLAY_TOOLTIP.width / 2} y={layer.y + OVERLAY_TOOLTIP.y + 14} textAnchor="middle" fontSize={9.5} fill="var(--color-fg-default)">{OVERLAY_TOOLTIP.label}</text>
                  </g>
                )}

                <circle cx={layer.x + LAYER_SIZE - 13} cy={layer.y + LAYER_SIZE - 13} r={10} fill="var(--color-bg-default)" stroke="var(--color-border-default)" strokeWidth={1.5} />
                <text x={layer.x + LAYER_SIZE - 13} y={layer.y + LAYER_SIZE - 9} textAnchor="middle" fontSize={13} fill="var(--color-fg-default)">{layer.badge}</text>
              </g>
            );
          })}

          {/* Legend mapping each badge to what it represents. */}
          <g transform="translate(18, 232)">
            {LAYERS.map((layer, index) => (
              <text key={layer.badge} x={0} y={index * 18} fontSize={11} fill="var(--color-fg-default)">{layer.badge} {layer.label}</text>
            ))}
          </g>

          {/* Arrow into the composited result. */}
          <line x1={207} y1={125} x2={262} y2={125} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#hybrid-layering-arrow)" />
          <text x={234} y={111} textAnchor="middle" fontSize={16} fill="var(--color-fg-muted)">=</text>

          {/* Composited result — both layers together, the effect actually seen on screen. */}
          <g>
            <rect x={RESULT.x} y={RESULT.y} width={RESULT.size} height={RESULT.size} rx={12} fill="var(--color-bg-attention-muted)" stroke="var(--color-border-default)" strokeWidth={1.25} />
            {DENSE_DOTS.map((dot, index) => (
              <circle key={index} cx={RESULT.x + dot.cx} cy={RESULT.y + dot.cy} r={2} fill="var(--color-fg-attention)" opacity={0.75} />
            ))}
            {OVERLAY_POINTS.map((point, index) => (
              <circle key={index} cx={RESULT.x + point.cx} cy={RESULT.y + point.cy} r={4.5} fill="var(--color-fg-accent)" stroke="var(--color-bg-default)" strokeWidth={1.25} />
            ))}
            <rect x={RESULT.x + OVERLAY_TOOLTIP.x} y={RESULT.y + OVERLAY_TOOLTIP.y} width={OVERLAY_TOOLTIP.width} height={OVERLAY_TOOLTIP.height} rx={4} fill="var(--color-bg-default)" stroke="var(--color-fg-accent)" strokeWidth={1} />
            <text x={RESULT.x + OVERLAY_TOOLTIP.x + OVERLAY_TOOLTIP.width / 2} y={RESULT.y + OVERLAY_TOOLTIP.y + 14} textAnchor="middle" fontSize={9.5} fill="var(--color-fg-default)">{OVERLAY_TOOLTIP.label}</text>
          </g>
          <text x={RESULT.x + RESULT.size / 2} y={RESULT.y + RESULT.size + 20} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">what you actually see</text>

          <text x={230} y={286} textAnchor="middle" fontSize={9.5} fill="var(--color-fg-muted)" fontStyle="italic">you rarely have to pick exactly one</text>
        </Svg>
      </Wrapper>
    </>
  );
}

HybridLayeringDiagram.displayName = "HybridLayeringDiagram";
