import type { JSX } from "react";
import {
  TRACK_X0,
  LANE_H,
  TIME_BASED_Y,
  ON_DEMAND_Y,
  TIME_BASED_BUILD,
  ON_DEMAND_BUILD,
  TIME_BASED_SEGMENTS,
  ON_DEMAND_SEGMENTS,
  TIME_BASED_MARKERS,
  ON_DEMAND_MARKERS
} from "@/components/mdx/RevalidationStrategiesDiagram/RevalidationStrategiesDiagram.constants";
import { getRevalidationSegmentColor } from "@/components/mdx/RevalidationStrategiesDiagram/RevalidationStrategiesDiagram.helpers";
import { Wrapper, Svg } from "@/components/mdx/RevalidationStrategiesDiagram/RevalidationStrategiesDiagram.styles";

/*
  Static SVG diagram contrasting the two ways a rebuild ever gets triggered. The time-based lane has
  TWO separate events that both have to happen before a rebuild starts: the window elapsing (passive
  — a gray dashed line, nothing happens on its own) and, separately and unpredictably later, a
  request actually arriving (the real trigger, drawn as a solid colored line). The gap between them
  is open-ended on purpose. The on-demand lane has only ONE event: a webhook call
  (revalidatePath()/revalidateTag()) that IS the trigger — the rebuild starts at that exact instant,
  with no stale segment at all and no dependency on a visitor ever showing up.
*/
export default function RevalidationStrategiesDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 680 420" role="img" aria-labelledby="revalidation-strategies-title revalidation-strategies-desc">
          <title id="revalidation-strategies-title">Diagram comparing time-based and on-demand revalidation</title>
          <desc id="revalidation-strategies-desc">
            Two lanes. The time-based lane shows a page turning stale once its revalidate window
            elapses, a passive event, then staying stale for an unpredictable stretch until a request
            finally arrives, which is the actual trigger for the rebuild. The on-demand lane shows a
            page staying fresh with no fixed expiry until a CMS webhook calls revalidatePath or
            revalidateTag directly, which itself immediately triggers the rebuild with no stale
            period at all and no dependency on a visitor request.
          </desc>

          {/* ---------------- Time-based lane ---------------- */}
          <text x={TRACK_X0} y={TIME_BASED_Y - 14} fontSize={12} fontWeight={700} fill="var(--color-fg-default)">
            Time-based — export const revalidate = N
          </text>
          <rect x={TIME_BASED_BUILD.x} y={TIME_BASED_Y} width={TIME_BASED_BUILD.width} height={LANE_H} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} />
          <text x={TIME_BASED_BUILD.x + TIME_BASED_BUILD.width / 2} y={TIME_BASED_Y + LANE_H / 2 + 4} textAnchor="middle" fontSize={9.5} fill="var(--color-fg-default)">build</text>
          {TIME_BASED_SEGMENTS.map((segment) => {
            const color = getRevalidationSegmentColor(segment.kind);
            const width = segment.x2 - segment.x1;
            return (
              <g key={segment.x1}>
                <rect x={segment.x1} y={TIME_BASED_Y} width={width} height={LANE_H} fill={color.fill} stroke={color.stroke} strokeWidth={1.5} />
                <text x={segment.x1 + width / 2} y={TIME_BASED_Y + LANE_H / 2 + 4} textAnchor="middle" fontSize={width > 130 ? 9.5 : 8.5} fill="var(--color-fg-default)">
                  {segment.label}
                </text>
              </g>
            );
          })}
          {TIME_BASED_MARKERS.map((marker) => (
            <line
              key={marker.x}
              x1={marker.x}
              y1={TIME_BASED_Y - 6}
              x2={marker.x}
              y2={TIME_BASED_Y + LANE_H + 6}
              stroke={marker.kind === "trigger" ? "var(--color-border-accent-emphasis)" : "var(--color-fg-muted)"}
              strokeWidth={marker.kind === "trigger" ? 2 : 1}
              strokeDasharray={marker.kind === "trigger" ? undefined : "3 3"}
            />
          ))}
          <g fontSize={10} fill="var(--color-fg-muted)">
            {TIME_BASED_MARKERS.map((marker) => (
              <text key={marker.x} x={marker.x} y={TIME_BASED_Y + LANE_H + 20} textAnchor="middle">{marker.caption}</text>
            ))}
          </g>
          <text x={TRACK_X0} y={TIME_BASED_Y + LANE_H + 42} fontSize={10.5} fill="var(--color-fg-muted)">
            The gap between &ldquo;window elapses&rdquo; and &ldquo;request arrives&rdquo; is open-ended — no traffic, no rebuild.
          </text>

          {/* ---------------- On-demand lane ---------------- */}
          <text x={TRACK_X0} y={ON_DEMAND_Y - 14} fontSize={12} fontWeight={700} fill="var(--color-fg-default)">
            On-demand — revalidatePath() / revalidateTag()
          </text>
          <rect x={ON_DEMAND_BUILD.x} y={ON_DEMAND_Y} width={ON_DEMAND_BUILD.width} height={LANE_H} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} />
          <text x={ON_DEMAND_BUILD.x + ON_DEMAND_BUILD.width / 2} y={ON_DEMAND_Y + LANE_H / 2 + 4} textAnchor="middle" fontSize={9.5} fill="var(--color-fg-default)">build</text>
          {ON_DEMAND_SEGMENTS.map((segment) => {
            const color = getRevalidationSegmentColor(segment.kind);
            const width = segment.x2 - segment.x1;
            return (
              <g key={segment.x1}>
                <rect x={segment.x1} y={ON_DEMAND_Y} width={width} height={LANE_H} fill={color.fill} stroke={color.stroke} strokeWidth={1.5} />
                <text x={segment.x1 + width / 2} y={ON_DEMAND_Y + LANE_H / 2 + 4} textAnchor="middle" fontSize={width > 130 ? 9.5 : 8.5} fill="var(--color-fg-default)">
                  {segment.label}
                </text>
              </g>
            );
          })}
          {ON_DEMAND_MARKERS.map((marker) => (
            <line
              key={marker.x}
              x1={marker.x}
              y1={ON_DEMAND_Y - 6}
              x2={marker.x}
              y2={ON_DEMAND_Y + LANE_H + 6}
              stroke="var(--color-border-accent-emphasis)"
              strokeWidth={2}
            />
          ))}
          <g fontSize={10} fill="var(--color-fg-muted)">
            {ON_DEMAND_MARKERS.map((marker) => (
              <text key={marker.x} x={marker.x} y={ON_DEMAND_Y + LANE_H + 20} textAnchor="middle">{marker.caption}</text>
            ))}
          </g>
          <text x={TRACK_X0} y={ON_DEMAND_Y + LANE_H + 42} fontSize={10.5} fill="var(--color-fg-muted)">
            No stale segment at all — the webhook call IS the trigger, whether or not a visitor ever shows up.
          </text>

          {/* Legend */}
          <g fontSize={11}>
            <rect x={TRACK_X0} y={340} width={17} height={17} rx={4} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" />
            <text x={TRACK_X0 + 24} y={353} fill="var(--color-fg-default)">static — HTML that already exists, just handed out</text>

            <rect x={TRACK_X0} y={364} width={17} height={17} rx={4} fill="var(--color-bg-attention-muted)" stroke="var(--color-border-attention-emphasis)" />
            <text x={TRACK_X0 + 24} y={377} fill="var(--color-fg-default)">stale — an old page, still served instantly</text>

            <rect x={TRACK_X0} y={388} width={17} height={17} rx={4} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" />
            <text x={TRACK_X0 + 24} y={401} fill="var(--color-fg-default)">dynamic — a rebuild is in flight right now</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

RevalidationStrategiesDiagram.displayName = "RevalidationStrategiesDiagram";
