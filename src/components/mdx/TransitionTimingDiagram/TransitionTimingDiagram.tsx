import type { JSX } from "react";
import { PLOT_LEFT, PLOT_BOTTOM, PLOT_W, PLOT_H, TIMING_CURVES, CURVE_ORDER, LEGEND_X, LEGEND_Y } from "@/components/mdx/TransitionTimingDiagram/TransitionTimingDiagram.constants";
import { buildTimingCurvePath } from "@/components/mdx/TransitionTimingDiagram/TransitionTimingDiagram.helpers";
import { Wrapper, Svg } from "@/components/mdx/TransitionTimingDiagram/TransitionTimingDiagram.styles";

/*
  Static SVG diagram plotting all 5 keyword timing functions on shared progress-vs-time axes, using their real
  spec-defined cubic-bezier control points — the same curve-editor convention browser devtools uses.
*/
export default function TransitionTimingDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 380 300" role="img" aria-labelledby="transition-timing-diagram-title transition-timing-diagram-desc">
          <title id="transition-timing-diagram-title">CSS transition timing function curves</title>
          <desc id="transition-timing-diagram-desc">
            A progress-versus-time plot comparing the linear, ease, ease-in, ease-out, and ease-in-out timing
            functions: linear is a straight diagonal, ease-in stays flat before rising steeply, ease-out rises
            steeply before flattening, and ease-in-out is a shallow S-curve that is slow at both ends.
          </desc>

          <defs>
            <marker id="timing-axis-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {/* Guidelines — light dashed "drop lines" from each axis in to (1s, 100%) and (0.5s, 50%), each an
              L-shaped corner (across from the y-axis, then down to the x-axis) rather than a full cross, so
              they mark just those two reference points without a line running through every curve. */}
          <line x1={PLOT_LEFT} y1={PLOT_BOTTOM - PLOT_H} x2={PLOT_LEFT + PLOT_W} y2={PLOT_BOTTOM - PLOT_H} stroke="var(--color-border-muted)" strokeWidth={1} strokeDasharray="2 3" />
          <line x1={PLOT_LEFT + PLOT_W} y1={PLOT_BOTTOM - PLOT_H} x2={PLOT_LEFT + PLOT_W} y2={PLOT_BOTTOM} stroke="var(--color-border-muted)" strokeWidth={1} strokeDasharray="2 3" />
          <line x1={PLOT_LEFT} y1={PLOT_BOTTOM - PLOT_H / 2} x2={PLOT_LEFT + PLOT_W / 2} y2={PLOT_BOTTOM - PLOT_H / 2} stroke="var(--color-border-muted)" strokeWidth={1} strokeDasharray="2 3" />
          <line x1={PLOT_LEFT + PLOT_W / 2} y1={PLOT_BOTTOM - PLOT_H / 2} x2={PLOT_LEFT + PLOT_W / 2} y2={PLOT_BOTTOM} stroke="var(--color-border-muted)" strokeWidth={1} strokeDasharray="2 3" />

          {/* Axes */}
          <line x1={PLOT_LEFT} y1={PLOT_BOTTOM} x2={PLOT_LEFT} y2={PLOT_BOTTOM - PLOT_H - 20} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#timing-axis-arrow)" />
          <line x1={PLOT_LEFT} y1={PLOT_BOTTOM} x2={PLOT_LEFT + PLOT_W + 15} y2={PLOT_BOTTOM} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#timing-axis-arrow)" />

          <text x={PLOT_LEFT - 8} y={PLOT_BOTTOM + 4} textAnchor="end" fontSize={11} fill="var(--color-fg-muted)">0%</text>
          <text x={PLOT_LEFT - 8} y={PLOT_BOTTOM - PLOT_H / 2 + 4} textAnchor="end" fontSize={11} fill="var(--color-fg-muted)">50%</text>
          <text x={PLOT_LEFT - 8} y={PLOT_BOTTOM - PLOT_H + 4} textAnchor="end" fontSize={11} fill="var(--color-fg-muted)">100%</text>
          <text x={PLOT_LEFT} y={PLOT_BOTTOM + 18} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">0s</text>
          <text x={PLOT_LEFT + PLOT_W / 2} y={PLOT_BOTTOM + 18} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">0.5s</text>
          <text x={PLOT_LEFT + PLOT_W} y={PLOT_BOTTOM + 18} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">1s</text>
          <text
            x={22} y={PLOT_BOTTOM - (PLOT_H + 20) / 2} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)"
            transform={`rotate(-90, 22, ${PLOT_BOTTOM - (PLOT_H + 20) / 2})`}
          >
            Progress
          </text>
          <text x={PLOT_LEFT + PLOT_W / 2} y={PLOT_BOTTOM + 32} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">Time</text>

          {/* One path per timing function, using its real cubic-bezier control points. */}
          {CURVE_ORDER.map((curve) => {
            const config = TIMING_CURVES[curve];
            return (
              <path
                key={curve} d={buildTimingCurvePath(config)} fill="none"
                stroke={config.color} strokeWidth={2}
                strokeDasharray={config.dashed ? "5 4" : undefined}
              />
            );
          })}

          {/* Legend — one swatch per curve, matched by color to its path above. */}
          {CURVE_ORDER.map((curve, index) => {
            const config = TIMING_CURVES[curve];
            return (
              <g key={curve}>
                <line
                  x1={LEGEND_X[index]} y1={LEGEND_Y[index]} x2={LEGEND_X[index] + 16} y2={LEGEND_Y[index]}
                  stroke={config.color} strokeWidth={2}
                  strokeDasharray={config.dashed ? "5 4" : undefined}
                />
                <text x={LEGEND_X[index] + 22} y={LEGEND_Y[index] + 4} fontSize={11} fill="var(--color-fg-default)">{curve}</text>
              </g>
            );
          })}
        </Svg>
      </Wrapper>
    </>
  );
}

TransitionTimingDiagram.displayName = "TransitionTimingDiagram";
