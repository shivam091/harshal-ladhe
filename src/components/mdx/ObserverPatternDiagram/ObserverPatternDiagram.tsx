import type { JSX } from "react";
import {
  SUBJECT_X,
  SUBJECT_Y,
  SUBJECT_W,
  SUBJECT_H,
  OBSERVER_X,
  OBSERVER_W,
  OBSERVER_H,
  OBSERVER_Y,
  NOTIFY_START_X,
  NOTIFY_START_Y
} from "@/components/mdx/ObserverPatternDiagram/ObserverPatternDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/ObserverPatternDiagram/ObserverPatternDiagram.styles";

/*
  Static SVG diagram of the Observer design pattern: one Subject box broadcasting a single state
  change to three independent Observer boxes, none of which poll it for updates. Anchors the "Why
  Move to Native Observers" section's Subject/Observer terminology before the post applies it to
  MutationObserver, IntersectionObserver, ResizeObserver, and PerformanceObserver individually.
*/
export default function ObserverPatternDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 480 286" role="img" aria-labelledby="observer-pattern-diagram-title observer-pattern-diagram-desc">
          <title id="observer-pattern-diagram-title">Observer pattern diagram</title>
          <desc id="observer-pattern-diagram-desc">
            A single Subject box on the left with three arrows, each labeled notify(), fanning out to
            three separate Observer boxes on the right. The Subject changes state once and every
            Observer is notified directly — none of them poll the Subject to find out.
          </desc>

          {/* Arrowhead marker shared by all three notify() arrows. */}
          <defs>
            <marker id="notify-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-accent)" />
            </marker>
          </defs>

          {/* Subject box — the single source of the state change. */}
          <rect
            x={SUBJECT_X} y={SUBJECT_Y} width={SUBJECT_W} height={SUBJECT_H} rx={8}
            fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={2}
          />
          <text x={SUBJECT_X + SUBJECT_W / 2} y={SUBJECT_Y + SUBJECT_H / 2 - 4} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--color-fg-default)">
            Subject
          </text>
          <text x={SUBJECT_X + SUBJECT_W / 2} y={SUBJECT_Y + SUBJECT_H / 2 + 14} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">
            (state changes)
          </text>

          {/* Three notify() arrows, one per Observer box, all starting from the Subject's right edge. */}
          {OBSERVER_Y.map((y, index) => (
            <line
              key={`notify-line-${index}`}
              x1={NOTIFY_START_X} y1={NOTIFY_START_Y}
              x2={OBSERVER_X} y2={y + OBSERVER_H / 2}
              stroke="var(--color-fg-accent)" strokeWidth={1.75}
              markerEnd="url(#notify-arrow)"
            />
          ))}

          {/* Single "notify()" label placed on the middle arrow, next to the Subject box. */}
          <text x={NOTIFY_START_X + 26} y={NOTIFY_START_Y - 8} fontSize={11} fontStyle="italic" fill="var(--color-fg-accent)">
            notify()
          </text>

          {/* Three Observer boxes — independent, unaware of each other, each reacting on its own. */}
          {OBSERVER_Y.map((y, index) => (
            <g key={`observer-${index}`}>
              <rect
                x={OBSERVER_X} y={y} width={OBSERVER_W} height={OBSERVER_H} rx={8}
                fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" strokeWidth={2}
              />
              <text x={OBSERVER_X + OBSERVER_W / 2} y={y + OBSERVER_H / 2 + 5} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">
                Observer {index + 1}
              </text>
            </g>
          ))}

          {/* Legend — sits a full 24px below the lowest Observer box (OBSERVER_Y[2] + OBSERVER_H = 230)
              so it reads as a separate caption, not another row of the diagram. Colour is never the
              only signal; each role is spelled out in the diagram already, this just restates it
              compactly for anyone scanning the legend first. */}
          <g fontSize={11}>
            <rect x={SUBJECT_X} y={254} width={14} height={14} rx={3} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" />
            <text x={SUBJECT_X + 20} y={265} fill="var(--color-fg-default)">Subject — owns the state, calls notify()</text>

            <rect x={300} y={254} width={14} height={14} rx={3} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" />
            <text x={320} y={265} fill="var(--color-fg-default)">Observer — reacts, never polls</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

ObserverPatternDiagram.displayName = "ObserverPatternDiagram";
