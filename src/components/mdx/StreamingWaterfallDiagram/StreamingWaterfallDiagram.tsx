import type { JSX } from "react";
import {
  TIMELINE_X0,
  TIMELINE_X1,
  TIMELINE_X_END,
  ROW_A_Y,
  ROW_B_Y,
  ROW_H
} from "@/components/mdx/StreamingWaterfallDiagram/StreamingWaterfallDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/StreamingWaterfallDiagram/StreamingWaterfallDiagram.styles";

/*
  Static SVG diagram of a conceptual (deliberately not-to-scale) timeline: without streaming, the whole
  page waits for the slowest data before anything paints; with loading.tsx / <Suspense>, the fast shell
  paints almost immediately and only the slow section is replaced by a fallback until its data resolves.
  Both rows end at the same x — the slow fetch itself takes exactly as long either way; only what the
  visitor sees *before* that point changes.
*/
export default function StreamingWaterfallDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 620 345" role="img" aria-labelledby="streaming-waterfall-title streaming-waterfall-desc">
          <title id="streaming-waterfall-title">Diagram comparing a blocking page load to a streamed one</title>
          <desc id="streaming-waterfall-desc">
            A conceptual timeline with two rows sharing the same start and end point. The first row,
            labeled no streaming, is a single blank/waiting bar the full width of the timeline, ending in
            the full page appearing all at once. The second row, labeled streaming with loading.tsx or
            Suspense, shows a short shell-painted segment right at the start, followed by a
            loading.tsx-fallback segment for the remainder, ending at the same point with the slow data
            section streaming in.
          </desc>

          {/* Shared guide lines: request time, shell-paints time (row B only), and data-ready time. */}
          <line x1={TIMELINE_X0} y1={36} x2={TIMELINE_X0} y2={196} stroke="var(--color-fg-muted)" strokeWidth={1} strokeDasharray="3 3" />
          <line x1={TIMELINE_X1} y1={ROW_B_Y - 6} x2={TIMELINE_X1} y2={ROW_B_Y + ROW_H + 6} stroke="var(--color-fg-muted)" strokeWidth={1} strokeDasharray="3 3" />
          <line x1={TIMELINE_X_END} y1={36} x2={TIMELINE_X_END} y2={196} stroke="var(--color-fg-muted)" strokeWidth={1} strokeDasharray="3 3" />

          {/* Row A — no streaming: a single blank/waiting bar the full width, nothing appears until the end. */}
          <text x={TIMELINE_X0} y={ROW_A_Y - 12} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">No streaming (no loading.tsx)</text>
          <rect x={TIMELINE_X0} y={ROW_A_Y} width={TIMELINE_X_END - TIMELINE_X0} height={ROW_H} rx={5} fill="var(--color-bg-neutral-muted)" stroke="var(--color-border-neutral-muted)" strokeWidth={1.5} />
          <text x={(TIMELINE_X0 + TIMELINE_X_END) / 2} y={ROW_A_Y + ROW_H / 2 + 4} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">
            blank — waiting for everything
          </text>

          {/* Row B — streaming: a short "shell" segment, then a loading.tsx-fallback segment. */}
          <text x={TIMELINE_X0} y={ROW_B_Y - 12} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">Streaming (loading.tsx / &lt;Suspense&gt;)</text>
          <rect x={TIMELINE_X0} y={ROW_B_Y} width={TIMELINE_X1 - TIMELINE_X0} height={ROW_H} rx={5} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} />
          <text x={(TIMELINE_X0 + TIMELINE_X1) / 2} y={ROW_B_Y + ROW_H / 2 + 4} textAnchor="middle" fontSize={9.5} fill="var(--color-fg-default)">shell</text>
          <rect x={TIMELINE_X1} y={ROW_B_Y} width={TIMELINE_X_END - TIMELINE_X1} height={ROW_H} rx={5} fill="var(--color-bg-attention-muted)" stroke="var(--color-border-attention-emphasis)" strokeWidth={1.5} />
          <text x={(TIMELINE_X1 + TIMELINE_X_END) / 2} y={ROW_B_Y + ROW_H / 2 + 4} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">
            loading.tsx fallback shown
          </text>

          {/* Guide-line labels. */}
          <g fontSize={10.5} fill="var(--color-fg-muted)">
            <text x={TIMELINE_X0} y={210} textAnchor="middle">request</text>
            <text x={TIMELINE_X1} y={225} textAnchor="middle">shell paints</text>
            <text x={TIMELINE_X_END} y={210} textAnchor="middle">data ready</text>
          </g>

          <text x={TIMELINE_X0} y={250} fontSize={11} fill="var(--color-fg-muted)">
            Same total wait either way — the streamed version just shows something useful sooner.
          </text>

          {/* Legend — stacked one per row, since the labels are too long to fit safely side by side. */}
          <g fontSize={11}>
            <rect x={TIMELINE_X0} y={268} width={17} height={17} rx={4} fill="var(--color-bg-neutral-muted)" stroke="var(--color-border-neutral-muted)" />
            <text x={TIMELINE_X0 + 24} y={282} fill="var(--color-fg-default)">blank / waiting</text>

            <rect x={TIMELINE_X0} y={270 + 24} width={17} height={17} rx={4} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" />
            <text x={TIMELINE_X0 + 24} y={282 + 24} fill="var(--color-fg-default)">shell (server-rendered instantly)</text>

            <rect x={TIMELINE_X0} y={270 + 48} width={17} height={17} rx={4} fill="var(--color-bg-attention-muted)" stroke="var(--color-border-attention-emphasis)" />
            <text x={TIMELINE_X0 + 24} y={282 + 48} fill="var(--color-fg-default)">loading.tsx / Suspense fallback</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

StreamingWaterfallDiagram.displayName = "StreamingWaterfallDiagram";
