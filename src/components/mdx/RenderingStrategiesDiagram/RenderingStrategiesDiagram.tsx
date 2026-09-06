import type { JSX } from "react";
import {
  LANE_LABEL_X,
  TRACK_X0,
  TRACK_X_END,
  LANE_H,
  SSG_Y,
  SSR_Y,
  ISR_Y,
  SSG_BUILD,
  SSG_REQUEST_X,
  SSR_RENDER_X,
  SSR_RENDER_W,
  ISR_BUILD,
  ISR_SEGMENTS
} from "@/components/mdx/RenderingStrategiesDiagram/RenderingStrategiesDiagram.constants";
import { getStrategyBoxColor } from "@/components/mdx/RenderingStrategiesDiagram/RenderingStrategiesDiagram.helpers";
import { Wrapper, Svg } from "@/components/mdx/RenderingStrategiesDiagram/RenderingStrategiesDiagram.styles";

/*
  Static SVG diagram answering one question for all three strategies: WHEN does the HTML for a page
  actually get generated? SSG's lane shows a single build node, then a dashed line of identical
  requests — generation happens exactly once, ever, until a brand new deploy. SSR's lane shows no
  build node at all — every request gets its own independent render box, because generation happens
  fresh, every single time. ISR's lane compresses the dedicated stale-while-revalidate timeline above
  into one row: build once, serve from cache, go stale but keep serving instantly, regenerate once in
  the background, then serve the fresh copy — generation happens at build time AND periodically after,
  triggered by traffic rather than a clock.
*/
export default function RenderingStrategiesDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 640 440" role="img" aria-labelledby="rendering-strategies-title rendering-strategies-desc">
          <title id="rendering-strategies-title">Diagram comparing when HTML is generated under SSG, SSR, and ISR</title>
          <desc id="rendering-strategies-desc">
            Three stacked lanes. SSG shows one build node followed by a dashed line of identical
            requests, all served the same HTML generated once at build time. SSR shows no build node
            and instead a separate render box for each request, generated fresh every single time.
            ISR shows a build node followed by four segments: fresh, stale but still served instantly,
            regenerating in the background, then fresh again — generation happens at build time and
            then periodically afterward, triggered by a request rather than by a fixed schedule.
          </desc>

          {/* ---------------- SSG lane ---------------- */}
          <text x={LANE_LABEL_X} y={SSG_Y + LANE_H / 2 - 6} fontSize={13} fontWeight={700} fill="var(--color-fg-default)">SSG</text>
          <rect
            x={SSG_BUILD.x}
            y={SSG_Y}
            width={SSG_BUILD.width}
            height={LANE_H}
            fill={getStrategyBoxColor(SSG_BUILD.kind).fill}
            stroke={getStrategyBoxColor(SSG_BUILD.kind).stroke}
            strokeWidth={1.5}
          />
          <text x={SSG_BUILD.x + SSG_BUILD.width / 2} y={SSG_Y + LANE_H / 2 + 4} textAnchor="middle" fontSize={10.5} fill="var(--color-fg-default)">
            {SSG_BUILD.label}
          </text>
          <line
            x1={SSG_BUILD.x + SSG_BUILD.width + 10}
            y1={SSG_Y + LANE_H / 2}
            x2={TRACK_X_END}
            y2={SSG_Y + LANE_H / 2}
            stroke="var(--color-border-success-emphasis)"
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
          {SSG_REQUEST_X.map((x) => (
            <circle key={x} cx={x} cy={SSG_Y + LANE_H / 2} r={5} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} />
          ))}
          <text x={TRACK_X0} y={SSG_Y + LANE_H + 20} fontSize={10.5} fill="var(--color-fg-muted)">
            Every request gets the exact same HTML — nothing regenerates until the next full deploy.
          </text>

          {/* ---------------- SSR lane ---------------- */}
          <text x={LANE_LABEL_X} y={SSR_Y + LANE_H / 2 - 6} fontSize={13} fontWeight={700} fill="var(--color-fg-default)">SSR</text>
          <line x1={TRACK_X0} y1={SSR_Y + LANE_H / 2} x2={TRACK_X_END} y2={SSR_Y + LANE_H / 2} stroke="var(--color-fg-muted)" strokeWidth={1} strokeDasharray="2 4" />
          {SSR_RENDER_X.map((x) => {
            const color = getStrategyBoxColor("dynamic");
            return (
              <g key={x}>
                <rect x={x - SSR_RENDER_W / 2} y={SSR_Y} width={SSR_RENDER_W} height={LANE_H} fill={color.fill} stroke={color.stroke} strokeWidth={1.5} />
                <text x={x} y={SSR_Y + LANE_H / 2 + 4} textAnchor="middle" fontSize={9.5} fill="var(--color-fg-default)">render</text>
              </g>
            );
          })}
          <text x={TRACK_X0} y={SSR_Y + LANE_H + 20} fontSize={10.5} fill="var(--color-fg-muted)">
            Every request re-renders the page from scratch — nothing is ever reused between requests.
          </text>

          {/* ---------------- ISR lane ---------------- */}
          <text x={LANE_LABEL_X} y={ISR_Y + LANE_H / 2 - 6} fontSize={13} fontWeight={700} fill="var(--color-fg-default)">ISR</text>
          <rect
            x={ISR_BUILD.x}
            y={ISR_Y}
            width={ISR_BUILD.width}
            height={LANE_H}
            fill={getStrategyBoxColor(ISR_BUILD.kind).fill}
            stroke={getStrategyBoxColor(ISR_BUILD.kind).stroke}
            strokeWidth={1.5}
          />
          <text x={ISR_BUILD.x + ISR_BUILD.width / 2} y={ISR_Y + LANE_H / 2 + 4} textAnchor="middle" fontSize={10} fill="var(--color-fg-default)">
            {ISR_BUILD.label}
          </text>
          {ISR_SEGMENTS.map((segment) => {
            const color = getStrategyBoxColor(segment.kind);
            return (
              <g key={segment.x}>
                <rect x={segment.x} y={ISR_Y} width={segment.width} height={LANE_H} fill={color.fill} stroke={color.stroke} strokeWidth={1.5} />
                <text x={segment.x + segment.width / 2} y={ISR_Y + LANE_H / 2 + 4} textAnchor="middle" fontSize={9} fill="var(--color-fg-default)">
                  {segment.label}
                </text>
              </g>
            );
          })}
          <text x={TRACK_X0} y={ISR_Y + LANE_H + 20} fontSize={10.5} fill="var(--color-fg-muted)">
            Built once, then regenerated in the background — see the timeline diagram above for the full sequence.
          </text>

          {/* Legend */}
          <g fontSize={11}>
            <rect x={TRACK_X0} y={362} width={17} height={17} rx={4} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" />
            <text x={TRACK_X0 + 24} y={375} fill="var(--color-fg-default)">static — HTML that already exists, just handed out</text>

            <rect x={TRACK_X0} y={386} width={17} height={17} rx={4} fill="var(--color-bg-attention-muted)" stroke="var(--color-border-attention-emphasis)" />
            <text x={TRACK_X0 + 24} y={399} fill="var(--color-fg-default)">stale — an old page, still served instantly</text>

            <rect x={TRACK_X0} y={410} width={17} height={17} rx={4} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" />
            <text x={TRACK_X0 + 24} y={423} fill="var(--color-fg-default)">dynamic — HTML being generated right now</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

RenderingStrategiesDiagram.displayName = "RenderingStrategiesDiagram";
