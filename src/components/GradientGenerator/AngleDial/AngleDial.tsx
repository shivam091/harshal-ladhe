"use client";

import { useRef } from "react";
import type { JSX, KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { clamp, toFixed } from "@/utils/number";
import type { AngleDialProps } from "@/interfaces/gradient";
import {
  FieldWrapper,
  FieldLabel,
  DialFace,
  DialSvg,
  DialTick,
  DialTrack,
  DialSweep,
  DialNeedle,
  DialHandle,
  DialReadout,
  DialValue,
  DialUnit,
  DegreesRow,
  DegreesInput,
  DegreesSuffix
} from "@/components/GradientGenerator/AngleDial/AngleDial.styles";

// Distance from dial center (50, 50) to the handle/ticks, in the same 0-100 percentage space the drag math below reports points in.
const RADIUS = 38;
// One tick per 30 degrees — a full rotation reads as a clock face (12 marks) rather than an unmarked circle.
const TICK_COUNT = 12;
// Arrow-key nudge size; Shift steps 15 degrees at a time, matching the tick spacing.
const STEP = 1;
const STEP_FAST = 15;
// The dial rim's circumference in the same 0-100 viewBox units DialSweep's stroke-dasharray is drawn in.
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/*
  Converts an angle in degrees to a point on the dial — the inverse of pointToAngle. 0deg sits at the
  top and increases clockwise, matching CSS's own linear-gradient/conic-gradient angle convention.
  Rounded to 3 decimal places (far finer than this 0-100 viewBox needs visually) because Math.sin/cos
  aren't guaranteed bit-identical across JS engines — the exact same angle can compute a value that
  differs in its very last digit between Node's V8 (SSR) and a browser's V8 (hydration), which then
  renders as two different attribute strings and trips a hydration mismatch on every dial tick/handle.
*/
function angleToPoint(angle: number, radius: number = RADIUS): { x: number; y: number } {
  const radians = (angle * Math.PI) / 180;
  return { x: toFixed(50 + radius * Math.sin(radians), 3), y: toFixed(50 - radius * Math.cos(radians), 3) };
}

// Converts a raw drag point (a 0-100 container-relative percentage) back into a 0-360 CSS angle.
function pointToAngle(point: { x: number; y: number }): number {
  const radians = Math.atan2(point.x - 50, -(point.y - 50));
  const degrees = (radians * 180) / Math.PI;
  return (degrees + 360) % 360;
}

/*
  Draggable compass dial for a gradient's angle (this tool's flagship control) — reused for both
  linear-gradient's direction and conic-gradient's start angle, since CSS gives both the exact same
  0deg-at-top-clockwise convention. The whole face is the drag surface (not just the visual handle),
  so a single click-and-drag anywhere on it jumps to and then follows the pointer, and doubles as a
  slider-role keyboard target for arrow-key nudging. Pointer capture is taken on the same element
  that receives pointerdown/move/up, mirroring this codebase's own use-drag.ts idiom, rather than a
  shared multi-handle drag hook — this dial has exactly one handle and needs none of that hook's
  cross-handle coordination.
*/
export default function AngleDial({ angle, onChange, onCommit, label }: AngleDialProps): JSX.Element {
  const faceRef = useRef<HTMLDivElement | null>(null);

  // Reads the current pointer position as a point in the dial's own 0-100 coordinate space, then converts it to an angle.
  function angleFromClientPoint(clientX: number, clientY: number): number {
    const face = faceRef.current;
    if (!face) return angle;
    const { left, top, width, height } = face.getBoundingClientRect();
    return pointToAngle({
      x: clamp(((clientX - left) / width) * 100, 0, 100),
      y: clamp(((clientY - top) / height) * 100, 0, 100)
    });
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    onChange(angleFromClientPoint(event.clientX, event.clientY));
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    event.preventDefault();
    onChange(angleFromClientPoint(event.clientX, event.clientY));
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    onCommit();
  }

  // Left/Down decrease, Right/Up increase, Home/End jump to the two ends of the sweep — each press is its own undo step since, unlike a drag, there's no natural "end of gesture" to defer commit to.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? STEP_FAST : STEP;
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") next = angle + step;
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown") next = angle - step;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 359;
    if (next === null) return;
    event.preventDefault();
    onChange((next + 360) % 360);
    onCommit();
  }

  const handlePoint = angleToPoint(angle);
  const dashLength = (angle / 360) * CIRCUMFERENCE;

  return (
    <>
      <FieldWrapper>
        <FieldLabel>{label}</FieldLabel>
        <DialFace
          ref={faceRef}
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={359}
          aria-valuenow={Math.round(angle)}
          aria-valuetext={`${Math.round(angle)} degrees`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
        >
          <DialSvg viewBox="0 0 100 100" aria-hidden="true">
            {Array.from({ length: TICK_COUNT }, (_, i) => {
              const tickAngle = (i * 360) / TICK_COUNT;
              const inner = angleToPoint(tickAngle, RADIUS - 4);
              const outer = angleToPoint(tickAngle, RADIUS + 4);
              return <DialTick key={tickAngle} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} />;
            })}
            <DialTrack cx={50} cy={50} r={RADIUS} />
            <DialSweep cx={50} cy={50} r={RADIUS} strokeDasharray={`${dashLength} ${CIRCUMFERENCE - dashLength}`} />
            <DialNeedle x1={50} y1={50} x2={handlePoint.x} y2={handlePoint.y} />
            <DialHandle cx={handlePoint.x} cy={handlePoint.y} r={5} />
          </DialSvg>
          <DialReadout aria-hidden="true">
            <DialValue>{Math.round(angle)}°</DialValue>
            <DialUnit>deg</DialUnit>
          </DialReadout>
        </DialFace>

        <DegreesRow>
          <DegreesInput
            type="number"
            min={0}
            max={359}
            value={Math.round(angle)}
            onChange={(event) => onChange(Number(event.target.value))}
            onBlur={onCommit}
            aria-label={label}
          />
          <DegreesSuffix>deg</DegreesSuffix>
        </DegreesRow>
      </FieldWrapper>
    </>
  );
}

AngleDial.displayName = "AngleDial";
