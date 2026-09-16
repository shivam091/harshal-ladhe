"use client";

import { useRef } from "react";
import type { CSSProperties, JSX, KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { clamp, toFixed } from "@/utils/number";
import { PlusIcon, CloseIcon } from "@/components/Icon";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/GradientGenerator/GradientGenerator.styles";
import type { StopEditorProps } from "@/interfaces/gradient";
import {
  FieldWrapper,
  FieldLabel,
  Bar,
  BarGradient,
  StopHandle,
  StopList,
  StopRow,
  StopColorInput,
  StopPositionInput,
  StopRemoveButton,
  AddStopButton
} from "@/components/GradientGenerator/StopEditor/StopEditor.styles";

// Arrow-key nudge size for a focused stop handle, in percentage points; Shift steps 10x further.
const STEP = 1;
const STEP_FAST = 10;

// A plain left-to-right preview of the stop list, independent of the editor's actual gradient type/angle — the bar's job is showing stop ORDER and COLOR, not previewing the real output (the live canvas backdrop already does that).
function barPreview(stops: StopEditorProps["state"]["stops"]): string {
  return `linear-gradient(to right, ${stops.map((stop) => `${stop.color} ${toFixed(stop.position, 1)}%`).join(", ")})`;
}

/*
  Multi-stop editor: a draggable gradient bar (drag a handle to reposition its stop, double-click
  empty space to add one there) backed by a plain list of per-stop color/position/remove fields for
  precise or keyboard-only editing. Both views share the same state — dragging a handle updates the
  same stop the list row below it edits. Each handle manages its own pointer capture directly
  (rather than one shared drag hook) since every stop is an independent draggable target with no
  need to coordinate with its siblings mid-drag.
*/
export default function StopEditor({ state, actions }: StopEditorProps): JSX.Element {
  const barRef = useRef<HTMLDivElement | null>(null);

  // Reads a client x-coordinate as a 0-100 position along the bar.
  function positionFromClientX(clientX: number): number {
    const bar = barRef.current;
    if (!bar) return 0;
    const { left, width } = bar.getBoundingClientRect();
    return clamp(((clientX - left) / width) * 100, 0, 100);
  }

  function handleBarDoubleClick(event: ReactMouseEvent<HTMLDivElement>) {
    actions.addStop(positionFromClientX(event.clientX));
    actions.commitDrag();
  }

  function handleHandlePointerDown(id: string) {
    return (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      actions.selectStop(id);
    };
  }

  function handleHandlePointerMove(id: string) {
    return (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
      event.preventDefault();
      actions.updateStopPosition(id, positionFromClientX(event.clientX));
    };
  }

  function handleHandlePointerUp(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    actions.commitDrag();
  }

  // Left/Right nudges a focused handle by STEP (Shift for STEP_FAST); Delete/Backspace removes it outright.
  function handleHandleKeyDown(id: string, position: number) {
    return (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      const step = event.shiftKey ? STEP_FAST : STEP;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        actions.updateStopPosition(id, clamp(position - step, 0, 100));
        actions.commitDrag();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        actions.updateStopPosition(id, clamp(position + step, 0, 100));
        actions.commitDrag();
      } else if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        actions.removeStop(id);
      }
    };
  }

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Stops</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <FieldWrapper>
            <FieldLabel>Drag to reposition, double-click to add</FieldLabel>
            <Bar ref={barRef} onDoubleClick={handleBarDoubleClick}>
              <BarGradient style={{ backgroundImage: barPreview(state.stops) }} />
              {state.stops.map((stop) => (
                <StopHandle
                  key={stop.id}
                  type="button"
                  style={{ left: `${stop.position}%`, "--stop-color": stop.color } as CSSProperties}
                  data-selected={state.selectedStopId === stop.id ? "true" : undefined}
                  aria-label={`${stop.color} stop at ${Math.round(stop.position)}%`}
                  onPointerDown={handleHandlePointerDown(stop.id)}
                  onPointerMove={handleHandlePointerMove(stop.id)}
                  onPointerUp={handleHandlePointerUp}
                  onPointerCancel={handleHandlePointerUp}
                  onKeyDown={handleHandleKeyDown(stop.id, stop.position)}
                />
              ))}
            </Bar>
          </FieldWrapper>

          <StopList>
            {state.stops.map((stop) => (
              <StopRow key={stop.id} data-selected={state.selectedStopId === stop.id ? "true" : undefined}>
                <StopColorInput
                  type="color"
                  value={stop.color}
                  aria-label={`Stop color, ${Math.round(stop.position)}%`}
                  onFocus={() => actions.selectStop(stop.id)}
                  onChange={(event) => actions.updateStopColor(stop.id, event.target.value)}
                  onBlur={actions.commitDrag}
                />
                <StopPositionInput
                  type="number"
                  min={0}
                  max={100}
                  value={Math.round(stop.position)}
                  aria-label={`Stop position, ${stop.color}`}
                  onFocus={() => actions.selectStop(stop.id)}
                  onChange={(event) => actions.updateStopPosition(stop.id, Number(event.target.value))}
                  onBlur={actions.commitDrag}
                />
                <StopRemoveButton
                  type="button"
                  disabled={state.stops.length <= 2}
                  aria-label={`Remove ${stop.color} stop`}
                  onClick={() => actions.removeStop(stop.id)}
                >
                  <CloseIcon size={14} />
                </StopRemoveButton>
              </StopRow>
            ))}
          </StopList>

          <AddStopButton type="button" onClick={() => actions.addStop()}>
            <PlusIcon size={14} />
            Add stop
          </AddStopButton>
        </PanelBody>
      </Panel>
    </>
  );
}

StopEditor.displayName = "StopEditor";
