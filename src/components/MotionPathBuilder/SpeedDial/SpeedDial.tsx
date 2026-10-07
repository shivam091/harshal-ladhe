"use client";

import { useId, useRef } from "react";
import type { JSX, KeyboardEvent, PointerEvent } from "react";
import { clamp, toFixed } from "@/utils/number";
import {
  DialWrap,
  DialLabel,
  DialFace,
  DialTick,
  DialArc,
  DialArcTrack,
  DialKnob,
  DialPointer,
  DialReadout,
  DialEnds
} from "@/components/MotionPathBuilder/SpeedDial/SpeedDial.styles";
import type { SpeedDialProps } from "@/components/MotionPathBuilder/MotionPathBuilder.types";

// The knob sweeps 270°, leaving the usual gap at the bottom where a controller's scale stops.
const SWEEP = 270;
const START_ANGLE = -SWEEP / 2;
const CENTRE = 60;
const RADIUS = 50;
const TICK_COUNT = 11;

// A point on the dial's circle at `angle` degrees clockwise from twelve o'clock.
function polar(angle: number, radius: number): [number, number] {
  const radians = ((angle - 90) * Math.PI) / 180;
  return [CENTRE + radius * Math.cos(radians), CENTRE + radius * Math.sin(radians)];
}

// An SVG arc along the scale between two dial angles.
function arcPath(from: number, to: number): string {
  const [x1, y1] = polar(from, RADIUS);
  const [x2, y2] = polar(to, RADIUS);
  const large = to - from > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${large} 1 ${x2} ${y2}`;
}

/*
  The controller's big rotary dial. It's an ARIA slider underneath — arrow keys, Page Up/Down and
  Home/End all work — and pointer drags read the angle round the centre rather than a straight
  line, so it turns like a real knob. Live turns go through onChange; release (or each key) commits.
*/
export default function SpeedDial({ label, min, max, step, value, unit, onChange, onCommit }: SpeedDialProps): JSX.Element {
  const labelId = useId();
  const faceRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const ratio = max > min ? (value - min) / (max - min) : 0;
  const angle = START_ANGLE + ratio * SWEEP;
  const decimals = step < 1 ? 1 : 0;

  // Snaps to the step and range so a drag never produces 3.4999999 seconds.
  function snap(next: number): number {
    return toFixed(clamp(Math.round(next / step) * step, min, max), 2);
  }

  // Converts a pointer position to a dial value by its angle round the knob's centre, pinned to the ends of the scale through the gap at the bottom.
  function valueFromPointer(event: PointerEvent<HTMLDivElement>): number {
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const pointerAngle = clamp((Math.atan2(dx, -dy) * 180) / Math.PI, START_ANGLE, -START_ANGLE);
    return snap(min + ((pointerAngle - START_ANGLE) / SWEEP) * (max - min));
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    faceRef.current?.focus();
    draggingRef.current = true;
    onChange(valueFromPointer(event));
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    onChange(valueFromPointer(event));
  }

  function handlePointerUp() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    onCommit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const big = step * 10;
    const deltas: Record<string, number> = {
      ArrowUp: step,
      ArrowRight: step,
      ArrowDown: -step,
      ArrowLeft: -step,
      PageUp: big,
      PageDown: -big
    };
    let next: number | null = null;
    if (event.key in deltas) next = value + deltas[event.key] * (event.shiftKey ? 10 : 1);
    else if (event.key === "Home") next = min;
    else if (event.key === "End") next = max;
    if (next === null) return;
    event.preventDefault();
    onChange(snap(next));
    onCommit();
  }

  const [pointerX, pointerY] = polar(angle, 30);

  return (
    <>
      <DialWrap>
        <DialLabel id={labelId}>{label}</DialLabel>
        <DialFace
          ref={faceRef}
          role="slider"
          tabIndex={0}
          aria-labelledby={labelId}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value.toFixed(decimals)} ${unit}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
        >
          <svg viewBox="0 0 120 120" aria-hidden="true">
            {Array.from({ length: TICK_COUNT }, (_, i) => {
              const tickAngle = START_ANGLE + (i / (TICK_COUNT - 1)) * SWEEP;
              const [x1, y1] = polar(tickAngle, 56);
              const [x2, y2] = polar(tickAngle, i % 5 === 0 ? 63 : 60);
              return <DialTick key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
            <DialArcTrack d={arcPath(START_ANGLE, -START_ANGLE)} />
            {ratio > 0.001 && <DialArc d={arcPath(START_ANGLE, angle)} />}
            <DialKnob cx={CENTRE} cy={CENTRE} r={38} />
            <DialPointer x1={CENTRE} y1={CENTRE} x2={pointerX} y2={pointerY} />
          </svg>
        </DialFace>
        <DialEnds aria-hidden="true">
          <span>Quick</span>
          <span>Leisurely</span>
        </DialEnds>
        <DialReadout>
          {value.toFixed(decimals)} {unit}
        </DialReadout>
      </DialWrap>
    </>
  );
}

SpeedDial.displayName = "SpeedDial";
