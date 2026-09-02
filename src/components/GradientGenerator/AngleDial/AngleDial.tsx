"use client";

import { useRef } from "react";
import type { JSX } from "react";
import { usePointDrag } from "@/hooks/use-point-drag";
import type { AngleDialProps } from "@/interfaces/gradient";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { DialStage, DialSvg, DialTrack, DialNeedle, DialHandle, DegreesRow, DegreesInput, DegreesSuffix } from "@/components/GradientGenerator/AngleDial/AngleDial.styles";

// Distance from dial center (50, 50) to the handle, in the same 0-100 space usePointDrag reports drag points in.
const RADIUS = 38;

// Converts an angle in degrees to the handle's (x, y) on the dial — the inverse of pointToAngle below. 0deg sits at the top and increases clockwise, matching CSS's own linear-gradient/conic-gradient angle convention (see GradientAxisDiagram).
function angleToPoint(angle: number): { x: number; y: number } {
  const radians = (angle * Math.PI) / 180;
  return { x: 50 + RADIUS * Math.sin(radians), y: 50 - RADIUS * Math.cos(radians) };
}

// Converts a raw drag point (usePointDrag's 0-100 container-relative space) back into a 0-360 CSS angle.
function pointToAngle(point: { x: number; y: number }): number {
  const radians = Math.atan2(point.x - 50, -(point.y - 50));
  const degrees = (radians * 180) / Math.PI;
  return (degrees + 360) % 360;
}

/*
  Draggable compass dial for a gradient's angle — reused for both linear-gradient's direction and
  conic-gradient's start angle, since CSS gives both the exact same 0deg-at-top-clockwise convention.
  Built on usePointDrag (borrowed from the clip-path tool, whose {x, y} drag point is a plain
  container-relative percentage with no clip-path-specific meaning) rather than a new drag hook,
  since a single-handle dial needs none of the multi-handle pointer-capture sharing that hook exists for beyond what it already provides.
*/
export default function AngleDial({ angle, onChange, onCommit, label }: AngleDialProps): JSX.Element {
  const stageRef = useRef<HTMLDivElement | null>(null);

  const { startDrag, handlePointerMove, handlePointerUp } = usePointDrag({
    containerRef: stageRef,
    onDrag: (_id, point) => onChange(pointToAngle(point)),
    onDragEnd: () => onCommit()
  });

  const handlePoint = angleToPoint(angle);

  return (
    <>
      <FieldWrapper>
        <FieldLabel>{label}</FieldLabel>
        <DialStage ref={stageRef}>
          <DialSvg viewBox="0 0 100 100" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
            <DialTrack cx={50} cy={50} r={RADIUS} />
            <DialNeedle x1={50} y1={50} x2={handlePoint.x} y2={handlePoint.y} />
            <DialHandle cx={handlePoint.x} cy={handlePoint.y} r={5} onPointerDown={startDrag("angle")} />
          </DialSvg>
        </DialStage>

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
