import type { JSX } from "react";
import {
  TIME_TICKS_MS,
  PLOT_X0,
  PLOT_X1,
  ROW_H,
  ROW_GAP,
  LANE_TITLE_H,
  LANE_GAP,
  AXIS_Y,
  FIRST_LANE_Y,
  STREAMING_LANES
} from "@/components/mdx/RSCStreamingDiagram/RSCStreamingDiagram.constants";
import { msToX, getStreamingRowColor } from "@/components/mdx/RSCStreamingDiagram/RSCStreamingDiagram.helpers";
import { Wrapper, Svg } from "@/components/mdx/RSCStreamingDiagram/RSCStreamingDiagram.styles";

/*
  Static SVG timeline comparing two ways the exact same page tree can reach the browser. Each lane
  draws the same 3 segments (shell, post list, comments) as bars along a shared 0-1600ms axis: a
  muted dashed "pending" portion followed by a solid colored "visible" portion starting the moment
  that segment resolves. The top lane resolves everything at once (no Suspense boundary anywhere),
  so all three bars turn solid at the same instant; the bottom lane's bars turn solid at three
  different times, because each one streams in independently the moment its own data is ready.
*/
export default function RSCStreamingDiagram(): JSX.Element {
  const laneBlockH = (rowCount: number) => LANE_TITLE_H + rowCount * (ROW_H + ROW_GAP);

  // Builds each lane's top y-offset from an accumulated running total, without mutating a shared
  // variable across iterations — each step derives its own offset and the next accumulator from the
  // previous one alone.
  const { offsets: laneOffsets, total } = STREAMING_LANES.reduce<{ offsets: number[]; total: number }>(
    (acc, lane) => ({
      offsets: [...acc.offsets, acc.total],
      total: acc.total + laneBlockH(lane.rows.length) + LANE_GAP
    }),
    { offsets: [], total: FIRST_LANE_Y }
  );
  const height = total - LANE_GAP + 16;

  return (
    <>
      <Wrapper>
        <Svg viewBox={`0 0 560 ${height}`} role="img" aria-labelledby="rsc-streaming-diagram-title rsc-streaming-diagram-desc">
          <title id="rsc-streaming-diagram-title">RSC payload streaming timeline</title>
          <desc id="rsc-streaming-diagram-desc">
            Two timelines over the same 1600 millisecond request, each showing a shell, a post list,
            and a comments section. Without a Suspense boundary, all three become visible at the same
            instant, at the very end, once the slowest part resolves. With a Suspense boundary, the
            shell is visible immediately, the post list becomes visible at 800 milliseconds, and the
            comments section becomes visible at 1600 milliseconds — each streaming in independently.
          </desc>

          <line x1={PLOT_X0} y1={AXIS_Y} x2={PLOT_X1} y2={AXIS_Y} stroke="var(--color-border-muted)" strokeWidth={1} />
          {TIME_TICKS_MS.map((ms) => (
            <g key={ms}>
              <line x1={msToX(ms)} y1={AXIS_Y - 4} x2={msToX(ms)} y2={AXIS_Y + 4} stroke="var(--color-border-muted)" strokeWidth={1} />
              <text x={msToX(ms)} y={AXIS_Y - 10} textAnchor="middle" fontSize={9.5} fill="var(--color-fg-muted)">{ms}ms</text>
            </g>
          ))}

          {STREAMING_LANES.map((lane, laneIndex) => {
            const laneY = laneOffsets[laneIndex];
            const rowsStartY = laneY + LANE_TITLE_H;

            return (
              <g key={lane.caption}>
                <text x={20} y={laneY + 12} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">{lane.caption}</text>

                {lane.rows.map((row, rowIndex) => {
                  const rowY = rowsStartY + rowIndex * (ROW_H + ROW_GAP);
                  const visibleX = msToX(row.visibleAtMs);
                  const color = getStreamingRowColor(row.colorRole);

                  return (
                    <g key={row.label}>
                      <text x={PLOT_X0 - 12} y={rowY + ROW_H / 2 + 4} textAnchor="end" fontSize={11} fill="var(--color-fg-muted)">
                        {row.label}
                      </text>

                      {row.visibleAtMs > 0 && (
                        <rect
                          x={PLOT_X0}
                          y={rowY}
                          width={visibleX - PLOT_X0}
                          height={ROW_H}
                          rx={4}
                          fill="var(--color-bg-muted)"
                          stroke="var(--color-border-muted)"
                          strokeDasharray="4 3"
                        />
                      )}

                      <rect
                        x={visibleX}
                        y={rowY}
                        width={PLOT_X1 - visibleX}
                        height={ROW_H}
                        rx={4}
                        fill={color.fill}
                        stroke={color.stroke}
                        strokeWidth={1.5}
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}

          <text x={280} y={height - 4} textAnchor="middle" fontSize={9.5} fontStyle="italic" fill="var(--color-fg-muted)">
            dashed = not yet visible to the user · solid = streamed in and visible
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

RSCStreamingDiagram.displayName = "RSCStreamingDiagram";
