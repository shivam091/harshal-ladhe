import type { JSX } from "react";
import {
  CACHE_SEGMENTS,
  REBUILD_SEGMENTS,
  MARKERS,
  TIMELINE_X0,
  ROW_A_Y,
  ROW_B_Y,
  ROW_H
} from "@/components/mdx/ISRTimelineDiagram/ISRTimelineDiagram.constants";
import { getISRSegmentColor } from "@/components/mdx/ISRTimelineDiagram/ISRTimelineDiagram.helpers";
import { Wrapper, Svg } from "@/components/mdx/ISRTimelineDiagram/ISRTimelineDiagram.styles";

/*
  Static SVG diagram of the single most-misunderstood mechanic in ISR: stale-while-revalidate. Row A
  is what a visitor is actually served over time; row B is what's happening in the background. The
  key detail the shapes have to get right: the window elapsing (a passive dashed line, no visitor
  involved) does NOT by itself start a rebuild — row B stays "idle" straight through it. Only when
  Request A actually arrives does row B flip to "rebuilding," and row A keeps handing out the STALE
  v1 page instantly the entire time that rebuild is running. Only Request B, arriving after the
  rebuild finishes, gets the fresh v2 page. Nothing on row A ever shows a gap or a wait — that's the
  whole point of "stale-while-revalidate": nobody ever blocks on a live rebuild.
*/
export default function ISRTimelineDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 680 430" role="img" aria-labelledby="isr-timeline-title isr-timeline-desc">
          <title id="isr-timeline-title">Diagram of the stale-while-revalidate ISR timeline</title>
          <desc id="isr-timeline-desc">
            Two rows sharing one timeline. The top row, what a visitor is served, starts fresh (v1),
            turns stale once the revalidate window elapses but keeps being served instantly, then
            turns fresh again (v2) once a rebuild finishes. The bottom row, background regeneration,
            stays idle straight through the window elapsing and only starts rebuilding the moment
            Request A actually arrives, going idle again once the rebuild finishes. Request A, arriving
            during the stale period, gets the old page instantly and silently triggers the rebuild.
            Request B, arriving after the rebuild finishes, gets the freshly rebuilt page.
          </desc>

          {/* Shared dashed guide lines, one per marker instant, spanning both rows. */}
          {MARKERS.map((marker) => (
            <line
              key={marker.x}
              x1={marker.x}
              y1={70}
              x2={marker.x}
              y2={240}
              stroke="var(--color-fg-muted)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          ))}

          {/* Row A — what a visitor is served: fresh, then stale-but-instant, then fresh again. */}
          <text x={TIMELINE_X0} y={ROW_A_Y - 12} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">
            Page cache (what a visitor gets)
          </text>
          {CACHE_SEGMENTS.map((segment) => {
            const color = getISRSegmentColor(segment.kind);
            const width = segment.x2 - segment.x1;
            return (
              <g key={`${segment.x1}-${segment.x2}`}>
                <rect x={segment.x1} y={ROW_A_Y} width={width} height={ROW_H} fill={color.fill} stroke={color.stroke} strokeWidth={1.5} />
                <text
                  x={segment.x1 + width / 2}
                  y={ROW_A_Y + ROW_H / 2 + 4}
                  textAnchor="middle"
                  fontSize={width > 140 ? 10.5 : 9}
                  fill="var(--color-fg-default)"
                >
                  {segment.label}
                </text>
              </g>
            );
          })}

          {/* Row B — background regeneration: idle until Request A triggers it, then idle again. */}
          <text x={TIMELINE_X0} y={ROW_B_Y - 12} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">
            Background regeneration
          </text>
          {REBUILD_SEGMENTS.map((segment) => {
            const color = getISRSegmentColor(segment.kind);
            const width = segment.x2 - segment.x1;
            return (
              <g key={`${segment.x1}-${segment.x2}`}>
                <rect x={segment.x1} y={ROW_B_Y} width={width} height={ROW_H} fill={color.fill} stroke={color.stroke} strokeWidth={1.5} />
                <text
                  x={segment.x1 + width / 2}
                  y={ROW_B_Y + ROW_H / 2 + 4}
                  textAnchor="middle"
                  fontSize={width > 140 ? 10.5 : 9}
                  fill="var(--color-fg-default)"
                >
                  {segment.label}
                </text>
              </g>
            );
          })}

          {/* Marker captions, directly under the guide lines. */}
          <g fontSize={10.5} fill="var(--color-fg-muted)">
            {MARKERS.map((marker) => (
              <text key={marker.x} x={marker.x} y={254} textAnchor="middle">
                {marker.caption}
              </text>
            ))}
          </g>

          <text x={TIMELINE_X0} y={282} fontSize={11} fill="var(--color-fg-muted)">
            Request A is served instantly from the stale cache — nobody ever waits on a live rebuild.
          </text>
          <text x={TIMELINE_X0} y={298} fontSize={11} fill="var(--color-fg-muted)">
            Only Request B, arriving after the rebuild finishes, gets the freshly rebuilt page.
          </text>

          {/* Legend — one entry per segment kind used above. */}
          <g fontSize={11}>
            <rect x={TIMELINE_X0} y={320} width={17} height={17} rx={4} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" />
            <text x={TIMELINE_X0 + 24} y={333} fill="var(--color-fg-default)">fresh — served instantly, no rebuild pending</text>

            <rect x={TIMELINE_X0} y={344} width={17} height={17} rx={4} fill="var(--color-bg-attention-muted)" stroke="var(--color-border-attention-emphasis)" />
            <text x={TIMELINE_X0 + 24} y={357} fill="var(--color-fg-default)">stale — still served instantly, rebuild pending or running</text>

            <rect x={TIMELINE_X0} y={368} width={17} height={17} rx={4} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" />
            <text x={TIMELINE_X0 + 24} y={381} fill="var(--color-fg-default)">rebuilding — a background regeneration is in flight</text>

            <rect x={TIMELINE_X0} y={392} width={17} height={17} rx={4} fill="var(--color-bg-neutral-muted)" stroke="var(--color-border-neutral-muted)" />
            <text x={TIMELINE_X0 + 24} y={405} fill="var(--color-fg-default)">idle — no regeneration running</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

ISRTimelineDiagram.displayName = "ISRTimelineDiagram";
