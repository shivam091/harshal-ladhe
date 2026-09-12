import type { JSX } from "react";
import {
  BORDER_BOX_X,
  BORDER_BOX_Y,
  BORDER_BOX_W,
  BORDER_BOX_H,
  CONTENT_BOX_X,
  CONTENT_BOX_Y,
  CONTENT_BOX_W,
  CONTENT_BOX_H,
  CALLOUT_ANCHOR_X,
  CALLOUT_ANCHOR_Y
} from "@/components/mdx/ResizeBoxModelDiagram/ResizeBoxModelDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/ResizeBoxModelDiagram/ResizeBoxModelDiagram.styles";

// Left x coordinate of the device-pixel-content-box callout card.
const CALLOUT_X = 300;
// Top y coordinate of the callout card.
const CALLOUT_Y = 60;
// Width of the callout card.
const CALLOUT_W = 150;
// Height of the callout card.
const CALLOUT_H = 100;

/*
  Static SVG diagram of the three ResizeObserver "boxes" the post's ResizeObserver section lists as
  bullet points: content-box nested inside border-box (the padding/border gap between them), plus a
  callout clarifying that device-pixel-content-box isn't a fourth, larger region — it's the same area
  as content-box, just reported in physical device pixels instead of CSS pixels.
*/
export default function ResizeBoxModelDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 460 260" role="img" aria-labelledby="resize-box-model-diagram-title resize-box-model-diagram-desc">
          <title id="resize-box-model-diagram-title">ResizeObserver box options diagram</title>
          <desc id="resize-box-model-diagram-desc">
            An outer border-box rectangle containing an inner content-box rectangle, with the gap
            between them representing padding and border. A callout points from the content-box to a
            note explaining that device-pixel-content-box covers the same area as content-box, just
            measured in physical device pixels instead of CSS pixels.
          </desc>

          {/* border-box — the outermost box ResizeObserver can report: content + padding + border. */}
          <rect
            x={BORDER_BOX_X} y={BORDER_BOX_Y} width={BORDER_BOX_W} height={BORDER_BOX_H} rx={6}
            fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={2}
          />
          <text x={BORDER_BOX_X + 10} y={BORDER_BOX_Y + 18} fontSize={11} fontWeight={600} fill="var(--color-fg-muted)">
            border-box
          </text>

          {/* content-box — the default box ResizeObserver reports; padding/border make up the gap to border-box. */}
          <rect
            x={CONTENT_BOX_X} y={CONTENT_BOX_Y} width={CONTENT_BOX_W} height={CONTENT_BOX_H} rx={4}
            fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={2}
          />
          <text x={CONTENT_BOX_X + CONTENT_BOX_W / 2} y={CONTENT_BOX_Y + CONTENT_BOX_H / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--color-fg-default)">
            content-box
          </text>

          {/* Dashed leader line connecting content-box to the device-pixel-content-box callout card. */}
          <line
            x1={CALLOUT_ANCHOR_X} y1={CALLOUT_ANCHOR_Y} x2={CALLOUT_X} y2={CALLOUT_Y + CALLOUT_H / 2}
            stroke="var(--color-fg-attention)" strokeWidth={1.5} strokeDasharray="4 3"
          />

          {/* Callout card — same region as content-box, just measured in physical pixels. */}
          <rect
            x={CALLOUT_X} y={CALLOUT_Y} width={CALLOUT_W} height={CALLOUT_H} rx={6}
            fill="var(--color-bg-attention-muted)" stroke="var(--color-border-attention-emphasis)" strokeWidth={1.5} strokeDasharray="4 3"
          />
          <text x={CALLOUT_X + CALLOUT_W / 2} y={CALLOUT_Y + 20} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="var(--color-fg-default)">
            device-pixel-
          </text>
          <text x={CALLOUT_X + CALLOUT_W / 2} y={CALLOUT_Y + 34} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="var(--color-fg-default)">
            content-box
          </text>
          <text x={CALLOUT_X + CALLOUT_W / 2} y={CALLOUT_Y + 54} textAnchor="middle" fontSize={9.5} fill="var(--color-fg-muted)">
            = content-box size ×
          </text>
          <text x={CALLOUT_X + CALLOUT_W / 2} y={CALLOUT_Y + 68} textAnchor="middle" fontSize={9.5} fill="var(--color-fg-muted)">
            devicePixelRatio
          </text>
          <text x={CALLOUT_X + CALLOUT_W / 2} y={CALLOUT_Y + 86} textAnchor="middle" fontSize={9.5} fill="var(--color-fg-muted)">
            (physical pixels)
          </text>

          {/* Legend — restates the three box options and what distinguishes them, in one glance. */}
          <g fontSize={11}>
            <rect x={BORDER_BOX_X} y={214} width={14} height={14} rx={3} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" />
            <text x={BORDER_BOX_X + 20} y={225} fill="var(--color-fg-default)">border-box — content + padding + border</text>

            <rect x={BORDER_BOX_X} y={236} width={14} height={14} rx={3} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" />
            <text x={BORDER_BOX_X + 20} y={247} fill="var(--color-fg-default)">content-box — default, excludes padding/border</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

ResizeBoxModelDiagram.displayName = "ResizeBoxModelDiagram";
