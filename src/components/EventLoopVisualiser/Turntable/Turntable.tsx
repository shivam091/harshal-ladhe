"use client";

import { useState } from "react";
import type { CSSProperties, JSX } from "react";
import {
  TurntableFigure,
  TurntableSvg,
  Pit,
  Road,
  RoadLamp,
  RoadLabel,
  Bridge,
  BridgeDeck,
  BridgeRail,
  BridgePointer,
  ClockReadout
} from "@/components/EventLoopVisualiser/Turntable/Turntable.styles";
import type { EventLoopPhase, TurntableProps } from "@/components/EventLoopVisualiser/EventLoopVisualiser.types";

// SVG user units — the figure scales with CSS, so these only fix proportions.
const SIZE = 160;
// Pivot of the bridge and the hub every road radiates from.
const CENTRE = SIZE / 2;
// Pit radius — where the roads start and the bridge ends.
const ROAD_INNER = 34;
// Where each road ends and its lamp sits, leaving room for labels inside the viewBox.
const ROAD_OUTER = 64;

// The four stops in the order one loop iteration visits them, clockwise from the top — so the bridge always turns the same way the loop does.
const ROADS: { phase: EventLoopPhase; label: string; angle: number; colour: string }[] = [
  { phase: "task", label: "Task", angle: 0, colour: "var(--color-fg-accent)" },
  { phase: "microtask", label: "Micro", angle: 90, colour: "var(--color-fg-success)" },
  { phase: "render", label: "Render", angle: 180, colour: "var(--color-fg-danger)" },
  { phase: "idle", label: "Wait", angle: 270, colour: "var(--color-fg-muted)" }
];

// Angle of a phase's road — a lookup rather than an index so the ROADS order can change without breaking the bridge.
function angleFor(phase: EventLoopPhase): number {
  return ROADS.find((road) => road.phase === phase)?.angle ?? 0;
}

// Polar → SVG point, measured clockwise from twelve o'clock to match how the roads are described above.
function polar(angle: number, radius: number): { x: number; y: number } {
  const radians = ((angle - 90) * Math.PI) / 180;
  return { x: CENTRE + radius * Math.cos(radians), y: CENTRE + radius * Math.sin(radians) };
}

/*
  The event loop drawn as a railway turntable: four roads (task, microtasks, render, waiting on the
  clock) with the bridge lined up on the current stage. The bridge's angle accumulates rather than
  being set absolutely, so going from "Wait" back to "Task" carries on clockwise instead of
  unwinding three-quarters of a turn backwards.
*/
export default function Turntable({ phase, clockMs }: TurntableProps): JSX.Element {
  const [trackedPhase, setTrackedPhase] = useState(phase);
  const [rotation, setRotation] = useState(() => angleFor(phase));

  // Adjusting state during render (React's documented pattern for "derive on prop change") instead of in an effect, so the bridge never paints one frame pointing at the old road.
  if (trackedPhase !== phase) {
    const delta = (((angleFor(phase) - rotation) % 360) + 360) % 360;
    setTrackedPhase(phase);
    setRotation(rotation + delta);
  }

  const current = ROADS.find((road) => road.phase === phase);

  return (
    <>
      <TurntableFigure>
        <TurntableSvg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={`Event loop stage: ${current?.label ?? phase}`}>
          {ROADS.map((road) => {
            const from = polar(road.angle, ROAD_INNER);
            const to = polar(road.angle, ROAD_OUTER);
            const lamp = polar(road.angle, ROAD_OUTER + 6);
            const label = polar(road.angle, ROAD_OUTER + 15);
            const lit = road.phase === phase ? "true" : undefined;
            const style = { "--road-colour": road.colour } as CSSProperties;
            return (
              <g key={road.phase} style={style}>
                <Road x1={from.x} y1={from.y} x2={to.x} y2={to.y} data-lit={lit} />
                <RoadLamp cx={lamp.x} cy={lamp.y} r={4} data-lit={lit} />
                <RoadLabel x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle" data-lit={lit}>
                  {road.label}
                </RoadLabel>
              </g>
            );
          })}
          <Pit cx={CENTRE} cy={CENTRE} r={ROAD_INNER} />
          <Bridge style={{ transform: `rotate(${rotation}deg)` }}>
            <BridgeDeck x={CENTRE - 7} y={CENTRE - ROAD_INNER + 2} width={14} height={ROAD_INNER * 2 - 4} rx={3} />
            <BridgeRail x1={CENTRE - 3} y1={CENTRE - ROAD_INNER + 4} x2={CENTRE - 3} y2={CENTRE + ROAD_INNER - 4} />
            <BridgeRail x1={CENTRE + 3} y1={CENTRE - ROAD_INNER + 4} x2={CENTRE + 3} y2={CENTRE + ROAD_INNER - 4} />
            <BridgePointer points={`${CENTRE},${CENTRE - ROAD_INNER - 6} ${CENTRE - 6},${CENTRE - ROAD_INNER + 3} ${CENTRE + 6},${CENTRE - ROAD_INNER + 3}`} />
          </Bridge>
        </TurntableSvg>
        <ClockReadout>Virtual clock: {clockMs} ms</ClockReadout>
      </TurntableFigure>
    </>
  );
}

Turntable.displayName = "Turntable";
