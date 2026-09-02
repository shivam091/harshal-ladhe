"use client";

import { useRef } from "react";
import type { JSX } from "react";
import { usePointDrag } from "@/hooks/use-point-drag";
import type { PositionPadProps } from "@/interfaces/gradient";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { PadStage, PadGuideX, PadGuideY, PadHandle } from "@/components/GradientGenerator/PositionPad/PositionPad.styles";

/*
  Draggable 2D pad for a radial/conic gradient's center position — unlike AngleDial, the drag point
  usePointDrag reports IS the value (a 0-100 x/y position), so there's no angle conversion step here.
*/
export default function PositionPad({ position, onChange, onCommit }: PositionPadProps): JSX.Element {
  const stageRef = useRef<HTMLDivElement | null>(null);

  const { startDrag, handlePointerMove, handlePointerUp } = usePointDrag({
    containerRef: stageRef,
    onDrag: (_id, point) => onChange(point),
    onDragEnd: () => onCommit()
  });

  return (
    <>
      <FieldWrapper>
        <FieldLabel>Position</FieldLabel>
        <PadStage ref={stageRef} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
          <PadGuideX style={{ top: `${position.y}%` }} />
          <PadGuideY style={{ left: `${position.x}%` }} />
          <PadHandle style={{ left: `${position.x}%`, top: `${position.y}%` }} onPointerDown={startDrag("center")} />
        </PadStage>
      </FieldWrapper>
    </>
  );
}

PositionPad.displayName = "PositionPad";
