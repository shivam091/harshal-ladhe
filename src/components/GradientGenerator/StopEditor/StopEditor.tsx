"use client";

import { useRef } from "react";
import type { JSX, MouseEvent as ReactMouseEvent } from "react";
import { usePointDrag } from "@/hooks/use-point-drag";
import { toFixed } from "@/utils/number";
import { PlusIcon, TrashIcon } from "@/components/Icon";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import type { StopEditorProps } from "@/interfaces/gradient";
import {
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

// A plain left-to-right preview of the stop list, independent of the editor's actual gradient type/angle — the bar's job is showing stop ORDER and COLOR, not previewing the real output (PreviewPane already does that).
function barPreview(stops: StopEditorProps["state"]["stops"]): string {
  return `linear-gradient(to right, ${stops.map((stop) => `${stop.color} ${toFixed(stop.position, 1)}%`).join(", ")})`;
}

/*
  Multi-stop editor: a draggable gradient bar (drag a handle to reposition its stop, double-click
  empty space to add one there) backed by a plain list of per-stop color/position/remove fields for
  precise or keyboard-only editing. Both views share the same state — dragging a handle updates the
  same stop the list row below it edits.
*/
export default function StopEditor({ state, actions }: StopEditorProps): JSX.Element {
  const barRef = useRef<HTMLDivElement | null>(null);

  const { startDrag, handlePointerMove, handlePointerUp } = usePointDrag({
    containerRef: barRef,
    onDrag: (id, point) => actions.updateStopPosition(id, point.x),
    onDragEnd: () => actions.commitDrag()
  });

  /*
    addStop already commits internally (it's dispatched via undoStack.commit, not setPresent) — a
    trailing commitDrag() here would fire a SECOND commit() call in the same synchronous handler.
    useUndoStack's commit() reads `pendingBaseline ?? state` from this render's closure, not from
    the update addStop's own commit() just queued, so that second call would re-push the exact same
    pre-add snapshot rather than reading anything new: a harmless-looking but real duplicate undo
    entry (confirmed while auditing this pattern for the layout-playground tool, see its own
    GridContainerControls comment). commitDrag() belongs only after a setPresent-based action.
  */
  function handleBarDoubleClick(event: ReactMouseEvent<HTMLDivElement>) {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const position = ((event.clientX - left) / width) * 100;
    actions.addStop(position);
  }

  return (
    <>
      <FieldWrapper>
        <FieldLabel>Stops</FieldLabel>
        <Bar ref={barRef} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onDoubleClick={handleBarDoubleClick}>
          <BarGradient style={{ backgroundImage: barPreview(state.stops) }} />
          {state.stops.map((stop) => (
            <StopHandle
              key={stop.id}
              type="button"
              style={{ left: `${stop.position}%` }}
              data-selected={state.selectedStopId === stop.id ? "true" : undefined}
              aria-label={`${stop.color} stop at ${Math.round(stop.position)}%`}
              onPointerDown={(event) => {
                actions.selectStop(stop.id);
                startDrag(stop.id)(event);
              }}
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
              <TrashIcon size={14} />
            </StopRemoveButton>
          </StopRow>
        ))}
      </StopList>

      <AddStopButton type="button" onClick={() => actions.addStop()}>
        <PlusIcon size={14} />
        Add stop
      </AddStopButton>
    </>
  );
}

StopEditor.displayName = "StopEditor";
