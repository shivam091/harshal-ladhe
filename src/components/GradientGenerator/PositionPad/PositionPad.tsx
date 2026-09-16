"use client";

import { useRef } from "react";
import type { JSX, KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { clamp } from "@/utils/number";
import type { PositionPadProps } from "@/interfaces/gradient";
import { FieldWrapper, FieldLabel, PadStage, PadGuideX, PadGuideY, PadHandle } from "@/components/GradientGenerator/PositionPad/PositionPad.styles";

// Arrow-key nudge size, in the pad's own 0-100 percentage space; Shift steps 10x further.
const STEP = 1;
const STEP_FAST = 10;

/*
  Draggable 2D pad for a radial/conic gradient's center position (this tool's other tactile geometry
  control, alongside AngleDial) — unlike the dial, the drag point IS the value with no angle
  conversion, so the pointer handling here is simpler. Pointer capture lives on PadStage itself (the
  same element that receives pointerdown/move/up), mirroring AngleDial's own approach.
*/
export default function PositionPad({ position, onChange, onCommit }: PositionPadProps): JSX.Element {
  const stageRef = useRef<HTMLDivElement | null>(null);

  // Reads the current pointer position as a point in the pad's own 0-100 coordinate space.
  function pointFromClient(clientX: number, clientY: number): { x: number; y: number } {
    const stage = stageRef.current;
    if (!stage) return position;
    const { left, top, width, height } = stage.getBoundingClientRect();
    return {
      x: clamp(((clientX - left) / width) * 100, 0, 100),
      y: clamp(((clientY - top) / height) * 100, 0, 100)
    };
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    onChange(pointFromClient(event.clientX, event.clientY));
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    event.preventDefault();
    onChange(pointFromClient(event.clientX, event.clientY));
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    onCommit();
  }

  // Arrow keys nudge x/y directly — a keyboard-only equivalent to dragging, since the pad has no separate numeric fields of its own.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? STEP_FAST : STEP;
    let delta: { x: number; y: number } | null = null;
    if (event.key === "ArrowLeft") delta = { x: -step, y: 0 };
    else if (event.key === "ArrowRight") delta = { x: step, y: 0 };
    else if (event.key === "ArrowUp") delta = { x: 0, y: -step };
    else if (event.key === "ArrowDown") delta = { x: 0, y: step };
    if (!delta) return;
    event.preventDefault();
    onChange({ x: clamp(position.x + delta.x, 0, 100), y: clamp(position.y + delta.y, 0, 100) });
    onCommit();
  }

  return (
    <>
      <FieldWrapper>
        <FieldLabel>Position</FieldLabel>
        <PadStage
          ref={stageRef}
          role="group"
          tabIndex={0}
          aria-label={`Gradient center position: ${Math.round(position.x)}%, ${Math.round(position.y)}%`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
        >
          <PadGuideX style={{ top: `${position.y}%` }} />
          <PadGuideY style={{ left: `${position.x}%` }} />
          <PadHandle style={{ left: `${position.x}%`, top: `${position.y}%` }} />
        </PadStage>
      </FieldWrapper>
    </>
  );
}

PositionPad.displayName = "PositionPad";
