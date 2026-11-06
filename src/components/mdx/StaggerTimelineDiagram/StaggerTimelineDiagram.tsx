import type { JSX } from "react";
import { range } from "@/utils/math";
import {
  PANELS,
  CARD_COUNT,
  DURATION_MS,
  AXIS_LEFT,
  AXIS_RIGHT,
  AXIS_MAX_MS,
  BAR_H,
  BAR_GAP,
} from "@/components/mdx/StaggerTimelineDiagram/StaggerTimelineDiagram.constants";
import { msToX, getDelayMs } from "@/components/mdx/StaggerTimelineDiagram/StaggerTimelineDiagram.helpers";
import { Wrapper, Svg } from "@/components/mdx/StaggerTimelineDiagram/StaggerTimelineDiagram.styles";

// Tick marks every half second along each panel's time axis.
const TICKS_MS = [0, 500, 1000, 1500, 2000];

/*
  Static SVG diagram of a 40-card staggered entrance: uncapped, the delay ramps into a two-second wait for the
  last card; capped with min(), everything past card 8 starts together — the post's "Cap the stagger" advice.
*/
export default function StaggerTimelineDiagram(): JSX.Element {
  const panelHeight = CARD_COUNT * (BAR_H + BAR_GAP);

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 420 440" role="img" aria-labelledby="stagger-timeline-title stagger-timeline-desc">
          <title id="stagger-timeline-title">A 40-card stagger, uncapped versus capped at 8</title>
          <desc id="stagger-timeline-desc">
            Two timelines of 40 cards, each bar the 300 millisecond entrance of one card. With a delay of index times 50
            milliseconds, the bars form a long diagonal and the last card only starts at 1.95 seconds, finishing at 2.25
            seconds. With the index capped at 8, the diagonal stops after the eighth card and every remaining card starts
            together at 0.4 seconds, so the whole batch finishes by 0.7 seconds.
          </desc>

          {PANELS.map((panel) => {
            const lastDelayMs = getDelayMs(CARD_COUNT - 1, panel.cap);
            const axisY = panel.y + panelHeight + 6;

            return (
              <g key={panel.heading}>
                <text x={AXIS_LEFT} y={panel.y - 12} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">
                  transition-delay: {panel.heading}
                </text>

                {range(0, CARD_COUNT - 1).map((index) => {
                  const delayMs = getDelayMs(index, panel.cap);
                  const x = msToX(delayMs);
                  return (
                    <rect
                      key={index}
                      x={x} y={panel.y + index * (BAR_H + BAR_GAP)}
                      width={msToX(delayMs + DURATION_MS) - x} height={BAR_H} rx={1}
                      fill={panel.cap === null ? "var(--color-fg-attention)" : "var(--color-fg-success)"}
                    />
                  );
                })}

                <text
                  x={panel.calloutSide === "before" ? msToX(lastDelayMs) - 6 : msToX(lastDelayMs + DURATION_MS) + 6}
                  y={panel.y + panelHeight - 2}
                  textAnchor={panel.calloutSide === "before" ? "end" : "start"}
                  fontSize={10} fill="var(--color-fg-muted)"
                >
                  {panel.callout}
                </text>
                <text x={AXIS_LEFT - 8} y={panel.y + 4} textAnchor="end" fontSize={9} fill="var(--color-fg-muted)">1</text>
                <text x={AXIS_LEFT - 8} y={panel.y + panelHeight} textAnchor="end" fontSize={9} fill="var(--color-fg-muted)">40</text>

                <line x1={AXIS_LEFT} y1={axisY} x2={AXIS_RIGHT} y2={axisY} stroke="var(--color-border-muted)" strokeWidth={1} />
                {TICKS_MS.map((ms) => (
                  <text key={ms} x={msToX(ms)} y={axisY + 13} textAnchor="middle" fontSize={9} fill="var(--color-fg-muted)">
                    {ms / 1000}s
                  </text>
                ))}
              </g>
            );
          })}

          <text x={210} y={434} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">
            Each bar is one card&apos;s {DURATION_MS}ms entrance, on a {AXIS_MAX_MS / 1000}s axis.
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

StaggerTimelineDiagram.displayName = "StaggerTimelineDiagram";
