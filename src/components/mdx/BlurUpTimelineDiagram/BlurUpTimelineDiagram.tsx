import type { JSX } from "react";
import {
  TIME_TICKS_MS,
  PLOT_X0,
  PLOT_X1,
  ROW_H,
  LANE_TITLE_H,
  LANE_GAP,
  AXIS_Y,
  FIRST_LANE_Y,
  CANVAS_H,
  BLUR_UP_LANES
} from "@/components/mdx/BlurUpTimelineDiagram/BlurUpTimelineDiagram.constants";
import { msToX, getBlurUpSegmentColor } from "@/components/mdx/BlurUpTimelineDiagram/BlurUpTimelineDiagram.helpers";
import { Wrapper, Svg } from "@/components/mdx/BlurUpTimelineDiagram/BlurUpTimelineDiagram.styles";

/*
  Static SVG timeline comparing placeholder="blur" against no placeholder at all, over the same
  1200ms photo load. Each lane draws one row as a sequence of segments along a shared 0-1200ms axis.
  The top lane shows a real (blurred) preview on screen from the very first paint, swapping to the
  sharp photo the instant it loads. The bottom lane shows a dashed, empty box for that same stretch —
  nothing is on screen at all — before the identical sharp photo appears at the identical instant. The
  point isn't that blur-up loads any faster; both lanes reach "sharp" at the same time. It's that one
  of them gives the user something meaningful to look at in the meantime, and the other doesn't.
*/
export default function BlurUpTimelineDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox={`0 0 560 ${CANVAS_H}`} role="img" aria-labelledby="blur-up-timeline-diagram-title blur-up-timeline-diagram-desc">
          <title id="blur-up-timeline-diagram-title">Blur-up placeholder loading timeline</title>
          <desc id="blur-up-timeline-diagram-desc">
            Two timelines over the same 1200 millisecond photo load. With placeholder blur, a blurred
            preview is visible on screen from time zero, then swaps to the sharp photo at 700
            milliseconds. Without a placeholder, nothing is rendered at all until that same 700
            millisecond mark, when the identical sharp photo appears. Both lanes show the sharp photo at
            the same instant; only what fills the wait beforehand differs.
          </desc>

          <line x1={PLOT_X0} y1={AXIS_Y} x2={PLOT_X1} y2={AXIS_Y} stroke="var(--color-border-muted)" strokeWidth={1} />
          {TIME_TICKS_MS.map((ms) => (
            <g key={ms}>
              <line x1={msToX(ms)} y1={AXIS_Y - 4} x2={msToX(ms)} y2={AXIS_Y + 4} stroke="var(--color-border-muted)" strokeWidth={1} />
              <text x={msToX(ms)} y={AXIS_Y - 10} textAnchor="middle" fontSize={9.5} fill="var(--color-fg-muted)">{ms}ms</text>
            </g>
          ))}

          {BLUR_UP_LANES.map((lane, laneIndex) => {
            const laneY = FIRST_LANE_Y + laneIndex * (LANE_TITLE_H + ROW_H + LANE_GAP);
            const rowY = laneY + LANE_TITLE_H;

            let startMs = 0;

            return (
              <g key={lane.caption}>
                <text x={20} y={laneY + 12} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">{lane.caption}</text>

                {lane.segments.map((segment) => {
                  const segStartMs = startMs;
                  startMs = segment.endMs;
                  const x0 = msToX(segStartMs);
                  const x1 = msToX(segment.endMs);
                  const color = getBlurUpSegmentColor(segment.state);

                  return (
                    <g key={`${lane.caption}-${segment.endMs}`}>
                      <rect
                        x={x0}
                        y={rowY}
                        width={x1 - x0}
                        height={ROW_H}
                        rx={4}
                        fill={color.fill}
                        stroke={color.stroke}
                        strokeWidth={1.5}
                        strokeDasharray={color.dashed ? "4 3" : undefined}
                      />
                      {x1 - x0 > 70 && (
                        <text x={(x0 + x1) / 2} y={rowY + ROW_H / 2 + 4} textAnchor="middle" fontSize={9.5} fill="var(--color-fg-muted)">
                          {segment.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}

          <text x={280} y={CANVAS_H - 8} textAnchor="middle" fontSize={9.5} fontStyle="italic" fill="var(--color-fg-muted)">
            dashed = nothing on screen · both lanes reach the sharp photo at the same instant
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

BlurUpTimelineDiagram.displayName = "BlurUpTimelineDiagram";
