import type { JSX } from "react";
import {
  VIEWPORT_X, VIEWPORT_Y, VIEWPORT_W, VIEWPORT_H, VIEWPORT_BOTTOM,
  TARGET_X, TARGET_W, TARGET_H,
  BOUNDARY_ENTRY_START, BOUNDARY_ENTRY_END, BOUNDARY_EXIT_START, BOUNDARY_EXIT_END,
  RANGE_BRACKET_X, COVER_BRACKET_X, TRAIL_ARROW_X
} from "@/components/mdx/AnimationRangeDiagram/AnimationRangeDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/AnimationRangeDiagram/AnimationRangeDiagram.styles";

// Props for one rung of the ghost trail: the target's top y at that boundary and how solid to draw it.
interface GhostRectProps {
  y: number;
  opacity: number;
}

// One faded snapshot of the target element at a fixed point along its pass through the viewport.
function GhostRect({ y, opacity }: GhostRectProps): JSX.Element {
  return (
    <>
      <rect
        x={TARGET_X} y={y} width={TARGET_W} height={TARGET_H} rx={4}
        fill="var(--color-bg-neutral-muted)" stroke="var(--color-border-neutral-muted)" strokeWidth={1.5}
        opacity={opacity}
      />
    </>
  );
}

// Props for a labeled "]"-style bracket spanning a vertical y-range.
interface RangeBracketProps {
  x: number;
  yTop: number;
  yBottom: number;
  label: string;
  color: string;
}

// A vertical bracket (line + end ticks) marking one named range, with its label to the right.
function RangeBracket({ x, yTop, yBottom, label, color }: RangeBracketProps): JSX.Element {
  return (
    <>
      <g>
        <line x1={x} y1={yTop} x2={x} y2={yBottom} stroke={color} strokeWidth={1.75} />
        <line x1={x - 4} y1={yTop} x2={x + 4} y2={yTop} stroke={color} strokeWidth={1.75} />
        <line x1={x - 4} y1={yBottom} x2={x + 4} y2={yBottom} stroke={color} strokeWidth={1.75} />
        <text x={x + 8} y={(yTop + yBottom) / 2 + 4} fontSize={11} fill="var(--color-fg-default)">{label}</text>
      </g>
    </>
  );
}

/*
  Static SVG diagram of the `animation-range` named ranges (entry, contain, exit, and their union
  cover) against a `view()` timeline: a fixed viewport window with a ghost trail showing the target
  element's four boundary positions as it travels through it, and brackets marking which span of
  that travel each named range covers.
*/
export default function AnimationRangeDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 400 320" role="img" aria-labelledby="animation-range-diagram-title animation-range-diagram-desc">
          <title id="animation-range-diagram-title">CSS animation-range named ranges diagram</title>
          <desc id="animation-range-diagram-desc">
            A fixed viewport box with four ghost positions of a target element showing it entering
            from below, becoming fully contained, then exiting above. Brackets mark entry as the
            span while the target crosses the bottom edge, contain as the span while it sits fully
            inside, exit as the span while it crosses the top edge, and cover as the full span from
            first pixel in to last pixel out.
          </desc>

          <defs>
            <marker id="animation-range-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {/* viewport — the fixed window the page scrolls the target through. */}
          <rect
            x={VIEWPORT_X} y={VIEWPORT_Y} width={VIEWPORT_W} height={VIEWPORT_H} rx={6}
            fill="none" stroke="var(--color-border-muted)" strokeWidth={2} strokeDasharray="5 4"
          />
          <text x={VIEWPORT_X + 8} y={VIEWPORT_Y + 16} fontSize={11} fontWeight={600} fill="var(--color-fg-muted)">
            viewport (fixed)
          </text>

          {/* Guideline for the one boundary that doesn't already coincide with a viewport edge on each side. */}
          <line x1={VIEWPORT_X} y1={BOUNDARY_ENTRY_END} x2={RANGE_BRACKET_X} y2={BOUNDARY_ENTRY_END} stroke="var(--color-border-muted)" strokeWidth={1} strokeDasharray="2 3" />
          <line x1={VIEWPORT_X} y1={BOUNDARY_EXIT_END} x2={RANGE_BRACKET_X} y2={BOUNDARY_EXIT_END} stroke="var(--color-border-muted)" strokeWidth={1} strokeDasharray="2 3" />

          {/* Ghost trail — the target at its four boundary positions, most transparent where it first touches the viewport and most solid by the time it's about to fully exit. */}
          <GhostRect y={BOUNDARY_ENTRY_START} opacity={0.3} />
          <GhostRect y={BOUNDARY_ENTRY_END} opacity={0.55} />
          <GhostRect y={BOUNDARY_EXIT_START} opacity={0.8} />
          <GhostRect y={BOUNDARY_EXIT_END} opacity={1} />
          <text x={TARGET_X + TARGET_W / 2} y={BOUNDARY_EXIT_END + TARGET_H / 2 + 4} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="var(--color-fg-default)">
            target
          </text>

          {/* Direction arrow — the target moves up the page as the user scrolls down. */}
          <line
            x1={TRAIL_ARROW_X} y1={BOUNDARY_ENTRY_START + TARGET_H} x2={TRAIL_ARROW_X} y2={BOUNDARY_EXIT_END}
            stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#animation-range-arrow)"
          />
          <text
            x={TRAIL_ARROW_X - 8} y={(BOUNDARY_ENTRY_START + BOUNDARY_EXIT_END) / 2} textAnchor="middle" fontSize={9.5} fill="var(--color-fg-muted)"
            transform={`rotate(-90, ${TRAIL_ARROW_X - 8}, ${(BOUNDARY_ENTRY_START + BOUNDARY_EXIT_END) / 2})`}
          >
            scroll progress
          </text>

          {/* Sequential named ranges, in the order the target actually crosses them. */}
          <RangeBracket x={RANGE_BRACKET_X} yTop={BOUNDARY_ENTRY_END} yBottom={BOUNDARY_ENTRY_START} label="entry" color="var(--color-border-accent-emphasis)" />
          <RangeBracket x={RANGE_BRACKET_X} yTop={BOUNDARY_EXIT_START} yBottom={BOUNDARY_ENTRY_END} label="contain" color="var(--color-border-success-emphasis)" />
          <RangeBracket x={RANGE_BRACKET_X} yTop={BOUNDARY_EXIT_END} yBottom={BOUNDARY_EXIT_START} label="exit" color="var(--color-border-danger-emphasis)" />

          {/* cover — the union of all three, from first pixel in to last pixel out. */}
          <RangeBracket x={COVER_BRACKET_X} yTop={BOUNDARY_EXIT_END} yBottom={BOUNDARY_ENTRY_START} label="cover" color="var(--color-fg-muted)" />

          {/* Legend — restates each bracket color against its range name. */}
          <g fontSize={10.5}>
            <line x1={40} y1={245} x2={56} y2={245} stroke="var(--color-border-accent-emphasis)" strokeWidth={2} />
            <text x={62} y={249} fill="var(--color-fg-default)">entry — crossing the bottom edge</text>

            <line x1={40} y1={263} x2={56} y2={263} stroke="var(--color-border-success-emphasis)" strokeWidth={2} />
            <text x={62} y={267} fill="var(--color-fg-default)">contain — fully inside the viewport</text>

            <line x1={40} y1={281} x2={56} y2={281} stroke="var(--color-border-danger-emphasis)" strokeWidth={2} />
            <text x={62} y={285} fill="var(--color-fg-default)">exit — crossing the top edge</text>

            <line x1={40} y1={299} x2={56} y2={299} stroke="var(--color-fg-muted)" strokeWidth={2} />
            <text x={62} y={303} fill="var(--color-fg-default)">cover — the entire visible pass</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

AnimationRangeDiagram.displayName = "AnimationRangeDiagram";
