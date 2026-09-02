"use client";

import { useCallback, useEffect, useRef } from "react";
import type { JSX, KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { toPlotPoint } from "@/utils/bezier";
import { compileTimingFunction } from "@/utils/easing-curve-editor";
import { pointerEventToPoint } from "@/components/CubicBezierPlayground/CubicBezierPlayground.helpers";
import BezierGraph from "@/components/BezierGraph";
import { GuideLine, Handle } from "@/components/CubicBezierPlayground/CubicBezierPlayground.styles";
import type { BezierPoint } from "@/types/bezier";
import type { ControlPointName, CurveGraphProps } from "@/interfaces/easing-curve-editor";
import { GraphWrapper, ReadoutRow, ReadoutList } from "@/components/EasingCurveEditor/CurveGraph/CurveGraph.styles";

const GRAPH_SIZE = 260;
const HANDLE_RADIUS = 8;

/*
  Draggable two-handle cubic-bezier() plot — built on BezierGraph and the same Handle/GuideLine
  styled primitives and pointerEventToPoint math CubicBezierPlayground already uses in the "CSS
  Easing Functions" post, rather than a reimplementation, so a curve dragged here reads pixel-for-
  pixel identical to one dragged there. The only real difference is where drag output goes: this
  version dispatches through the undo-stack action pair (setPresent live, commitDrag on release)
  every other goodie uses, instead of local useState.
*/
export default function CurveGraph({ state, actions }: CurveGraphProps): JSX.Element {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragCleanupRef = useRef<(() => void) | null>(null);

  // Removes any still-attached window listeners if the tool unmounts mid-drag (e.g. navigating away) — same cleanup CubicBezierPlayground's own drag handler registers.
  useEffect(() => () => dragCleanupRef.current?.(), []);

  const cssValue = compileTimingFunction(state);
  const [x1, y1] = toPlotPoint(state.p1, GRAPH_SIZE);
  const [x2, y2] = toPlotPoint(state.p2, GRAPH_SIZE);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<SVGCircleElement>, point: ControlPointName) => {
      event.preventDefault();
      actions.selectPoint(point);

      function handleMove(moveEvent: PointerEvent) {
        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;
        const next = pointerEventToPoint(moveEvent.clientX, moveEvent.clientY, rect, GRAPH_SIZE);
        if (point === "p1") actions.setP1(next);
        else actions.setP2(next);
      }

      function handleUp() {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        dragCleanupRef.current = null;
        actions.commitDrag();
      }

      dragCleanupRef.current = handleUp;
      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [actions]
  );

  // Arrow-key nudging — mirrors CubicBezierPlayground's own step sizes (0.01, 0.05 with Shift) so keyboard control feels identical between the two.
  function handleKeyDown(point: ControlPointName) {
    return (event: ReactKeyboardEvent<SVGCircleElement>) => {
      const step = event.shiftKey ? 0.05 : 0.01;
      const deltasByKey: Record<string, BezierPoint> = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, step],
        ArrowDown: [0, -step]
      };
      const delta = deltasByKey[event.key];
      if (!delta) return;
      event.preventDefault();

      const current = point === "p1" ? state.p1 : state.p2;
      const next: BezierPoint = [current[0] + delta[0], current[1] + delta[1]];
      if (point === "p1") actions.setP1(next);
      else actions.setP2(next);
      actions.commitDrag();
    };
  }

  return (
    <>
      <GraphWrapper>
        <BezierGraph ref={svgRef} p1={state.p1} p2={state.p2} size={GRAPH_SIZE} ariaLabel={`Draggable cubic-bezier editor, currently ${cssValue}`}>
          <GuideLine x1={0} y1={GRAPH_SIZE} x2={x1} y2={y1} />
          <GuideLine x1={GRAPH_SIZE} y1={0} x2={x2} y2={y2} />
          <Handle
            cx={x1}
            cy={y1}
            r={HANDLE_RADIUS}
            tabIndex={0}
            onPointerDown={(event) => handlePointerDown(event, "p1")}
            onKeyDown={handleKeyDown("p1")}
            onFocus={() => actions.selectPoint("p1")}
            aria-label={`Control point 1, x ${state.p1[0].toFixed(2)}, y ${state.p1[1].toFixed(2)}. Drag or use arrow keys to adjust, hold shift for larger steps.`}
          />
          <Handle
            cx={x2}
            cy={y2}
            r={HANDLE_RADIUS}
            tabIndex={0}
            onPointerDown={(event) => handlePointerDown(event, "p2")}
            onKeyDown={handleKeyDown("p2")}
            onFocus={() => actions.selectPoint("p2")}
            aria-label={`Control point 2, x ${state.p2[0].toFixed(2)}, y ${state.p2[1].toFixed(2)}. Drag or use arrow keys to adjust, hold shift for larger steps.`}
          />
        </BezierGraph>
      </GraphWrapper>

      <ReadoutList>
        <ReadoutRow data-selected={state.selectedPoint === "p1" ? "true" : undefined}>
          <span>P1</span>
          <span>
            {state.p1[0].toFixed(2)}, {state.p1[1].toFixed(2)}
          </span>
        </ReadoutRow>
        <ReadoutRow data-selected={state.selectedPoint === "p2" ? "true" : undefined}>
          <span>P2</span>
          <span>
            {state.p2[0].toFixed(2)}, {state.p2[1].toFixed(2)}
          </span>
        </ReadoutRow>
      </ReadoutList>
    </>
  );
}

CurveGraph.displayName = "CurveGraph";
