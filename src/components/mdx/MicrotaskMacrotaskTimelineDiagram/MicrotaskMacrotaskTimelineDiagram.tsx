import type { JSX } from "react";
import {
  STEPS,
  BRACKETS,
  PHASE_COLORS,
  LEGEND,
  STEP_W,
  STEP_H,
  STEP_Y,
  BRACKET_Y,
  BRACKET_TICK_H,
  BRACKET_LABEL_Y,
  LEGEND_Y,
  LEGEND_ROW_GAP,
  FIRST_STEP_X
} from "@/components/mdx/MicrotaskMacrotaskTimelineDiagram/MicrotaskMacrotaskTimelineDiagram.constants";
import { stepX } from "@/components/mdx/MicrotaskMacrotaskTimelineDiagram/MicrotaskMacrotaskTimelineDiagram.helpers";
import { Wrapper, Svg } from "@/components/mdx/MicrotaskMacrotaskTimelineDiagram/MicrotaskMacrotaskTimelineDiagram.styles";

/*
  Static SVG diagram replaying the post's `queueMicrotask()` example as an execution-order timeline:
  five console.log steps, reordered left-to-right into the order they actually run in rather than
  the order they appear in the source, grouped under Synchronous / Microtasks / Macrotask brackets
  coloured the same way as EventLoopDiagram so the two reinforce one another.
*/
export default function MicrotaskMacrotaskTimelineDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 480 190" role="img" aria-labelledby="microtask-timeline-diagram-title microtask-timeline-diagram-desc">
          <title id="microtask-timeline-diagram-title">Microtask vs macrotask execution order timeline</title>
          <desc id="microtask-timeline-diagram-desc">
            Five steps in the order they actually execute: Start and End run synchronously first,
            then the Promise and queueMicrotask callbacks run as microtasks and drain completely,
            and only then does the setTimeout callback run as a single macrotask.
          </desc>

          <defs>
            <marker id="timeline-step-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {/* One arrow between each consecutive pair of steps, showing the single line of execution order. */}
          {STEPS.slice(0, -1).map((_, index) => {
            const x1 = stepX(index) + STEP_W;
            const x2 = stepX(index + 1);
            const y = STEP_Y + STEP_H / 2;
            return <line key={`arrow-${index}`} x1={x1} y1={y} x2={x2} y2={y} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#timeline-step-arrow)" />;
          })}

          {/* One box per step — its console.log's original number, its label, and a fill/stroke colour keyed to its phase. */}
          {STEPS.map((step, index) => {
            const x = stepX(index);
            const colors = PHASE_COLORS[step.phase];
            return (
              <g key={`step-${index}`}>
                <rect x={x} y={STEP_Y} width={STEP_W} height={STEP_H} rx={6} fill={colors.fill} stroke={colors.stroke} strokeWidth={2} />
                <text x={x + 10} y={STEP_Y + 16} fontSize={10} fontWeight={700} fill="var(--color-fg-muted)">{step.order}</text>
                <text x={x + STEP_W / 2} y={STEP_Y + STEP_H / 2 + 10} textAnchor="middle" fontSize={step.label.length > 10 ? 8 : 9.5} fontWeight={600} fill="var(--color-fg-default)">{step.label}</text>
              </g>
            );
          })}

          {/* One bracket per phase group — a horizontal line with end-ticks, labelled underneath. */}
          {BRACKETS.map((bracket, index) => {
            const x1 = stepX(bracket.startIndex);
            const x2 = stepX(bracket.endIndex) + STEP_W;
            const colors = PHASE_COLORS[bracket.phase];
            return (
              <g key={`bracket-${index}`}>
                <line x1={x1} y1={BRACKET_Y} x2={x2} y2={BRACKET_Y} stroke={colors.stroke} strokeWidth={1.5} />
                <line x1={x1} y1={BRACKET_Y} x2={x1} y2={BRACKET_Y + BRACKET_TICK_H} stroke={colors.stroke} strokeWidth={1.5} />
                <line x1={x2} y1={BRACKET_Y} x2={x2} y2={BRACKET_Y + BRACKET_TICK_H} stroke={colors.stroke} strokeWidth={1.5} />
                <text x={(x1 + x2) / 2} y={BRACKET_LABEL_Y} textAnchor="middle" fontSize={9.5} fill="var(--color-fg-muted)">{bracket.label}</text>
              </g>
            );
          })}

          {/* Legend — one row per phase, restating the colour key the boxes and brackets above already use. */}
          <g fontSize={10}>
            {LEGEND.map((item, index) => {
              const colors = PHASE_COLORS[item.phase];
              const y = LEGEND_Y + index * LEGEND_ROW_GAP;
              return (
                <g key={`legend-${item.phase}`}>
                  <rect x={FIRST_STEP_X} y={y} width={13} height={13} rx={3} fill={colors.fill} stroke={colors.stroke} />
                  <text x={FIRST_STEP_X + 19} y={y + 11} fill="var(--color-fg-default)">{item.label}</text>
                </g>
              );
            })}
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

MicrotaskMacrotaskTimelineDiagram.displayName = "MicrotaskMacrotaskTimelineDiagram";
