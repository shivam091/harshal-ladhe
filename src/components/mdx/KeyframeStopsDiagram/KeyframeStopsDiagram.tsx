import type { JSX } from "react";
import {
  TIMELINE_X_START,
  TIMELINE_X_END,
  TIMELINE_Y,
  DOT_RADIUS,
  STOP_0_X,
  STOP_10_X,
  STOP_40_X,
  STOP_60_X,
  STOP_100_X,
  GROUP_PULSE_BRACKET_Y,
  GROUP_REST_BRACKET_Y
} from "@/components/mdx/KeyframeStopsDiagram/KeyframeStopsDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/KeyframeStopsDiagram/KeyframeStopsDiagram.styles";

// Props for one keyframe-stop marker: its x position on the timeline and the percentage it represents.
interface StopMarkerProps {
  x: number;
  percent: number;
}

// A single keyframe stop: a dot on the timeline plus its "N%" label underneath.
function StopMarker({ x, percent }: StopMarkerProps): JSX.Element {
  return (
    <>
      <circle cx={x} cy={TIMELINE_Y} r={DOT_RADIUS} fill="var(--color-fg-default)" />
      <text x={x} y={TIMELINE_Y + 24} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">
        {percent}%
      </text>
    </>
  );
}

// Props for a bracket spanning every stop that shares one identical set of property values.
interface GroupBracketProps {
  stopXs: number[];
  bracketY: number;
  tickEndY: number;
  chipY: number;
  chipLabel: string;
  color: string;
}

// Ties every stop in a shared-style group together, so one value set visibly applies at several percentages.
function GroupBracket({ stopXs, bracketY, tickEndY, chipY, chipLabel, color }: GroupBracketProps): JSX.Element {
  const xLeft = stopXs[0];
  const xRight = stopXs[stopXs.length - 1];
  const midX = (xLeft + xRight) / 2;

  return (
    <>
      <line x1={xLeft} y1={bracketY} x2={xRight} y2={bracketY} stroke={color} strokeWidth={1.75} />
      {stopXs.map((x) => (
        <line key={x} x1={x} y1={bracketY} x2={x} y2={tickEndY} stroke={color} strokeWidth={1.5} strokeDasharray="2 3" />
      ))}
      <text x={midX} y={chipY} textAnchor="middle" fontSize={11} fontWeight={600} fill={color}>
        {chipLabel}
      </text>
    </>
  );
}

/*
  Static SVG diagram of the `pulsing` grouped-keyframes example: a single 0%-100% timeline with all
  five percentage stops marked, and two brackets showing which stops share identical property values
  — 10%/40%/60% sharing one "pulsed" look, 0%/100% sharing the element's resting look — making the
  abstract idea of a percentage checkpoint concrete before the animation-* properties that follow.
*/
export default function KeyframeStopsDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 460 190" role="img" aria-labelledby="keyframe-stops-diagram-title keyframe-stops-diagram-desc">
          <title id="keyframe-stops-diagram-title">CSS keyframe percentage stops diagram</title>
          <desc id="keyframe-stops-diagram-desc">
            A horizontal timeline from 0% to 100% with five marked stops. The 10%, 40%, and 60%
            stops are bracketed together above the timeline, labeled as sharing opacity 0.2 and
            scale 1.05. The 0% and 100% stops are bracketed together below the timeline, labeled
            as sharing opacity 1 and scale 1 — the element's resting appearance.
          </desc>

          {/* Base timeline */}
          <line
            x1={TIMELINE_X_START} y1={TIMELINE_Y} x2={TIMELINE_X_END} y2={TIMELINE_Y}
            stroke="var(--color-border-muted)" strokeWidth={2}
          />

          {/* The "pulsed" group — 10%, 40%, 60% share identical opacity/scale. */}
          <GroupBracket
            stopXs={[STOP_10_X, STOP_40_X, STOP_60_X]}
            bracketY={GROUP_PULSE_BRACKET_Y}
            tickEndY={TIMELINE_Y - DOT_RADIUS - 4}
            chipY={GROUP_PULSE_BRACKET_Y - 12}
            chipLabel="opacity: 0.2 · scale(1.05)"
            color="var(--color-border-accent-emphasis)"
          />

          {/* The "resting" group — 0% and 100% share the element's untouched appearance. */}
          <GroupBracket
            stopXs={[STOP_0_X, STOP_100_X]}
            bracketY={GROUP_REST_BRACKET_Y}
            tickEndY={TIMELINE_Y + DOT_RADIUS + 4}
            chipY={GROUP_REST_BRACKET_Y + 20}
            chipLabel="opacity: 1 · scale(1)"
            color="var(--color-border-success-emphasis)"
          />

          {/* Every stop on the timeline, in order. */}
          <StopMarker x={STOP_0_X} percent={0} />
          <StopMarker x={STOP_10_X} percent={10} />
          <StopMarker x={STOP_40_X} percent={40} />
          <StopMarker x={STOP_60_X} percent={60} />
          <StopMarker x={STOP_100_X} percent={100} />
        </Svg>
      </Wrapper>
    </>
  );
}

KeyframeStopsDiagram.displayName = "KeyframeStopsDiagram";
