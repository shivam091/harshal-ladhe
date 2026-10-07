"use client";

import { useId, useRef, useState } from "react";
import type { JSX } from "react";
import { PlusIcon, TrashIcon } from "@/components/Icon";
import { buildPathData, parsePathData } from "@/components/MotionPathBuilder/MotionPathBuilder.utils";
import { SectionCard, PanelTitle, PanelHint, SegmentGroup, SegmentOption, CheckRow, CaseButton } from "@/components/MotionPathBuilder/MotionPathBuilder.styles";
import { ToolRow, PathTextarea, PasteStatus, SelectionReadout } from "@/components/MotionPathBuilder/PathControls/PathControls.styles";
import type { MotionPathPenMode, PathControlsProps } from "@/components/MotionPathBuilder/MotionPathBuilder.types";

// The two pen habits, in the order they appear on the selector.
const PEN_MODES: { value: MotionPathPenMode; label: string }[] = [
  { value: "smooth", label: "Smooth" },
  { value: "corner", label: "Corner" }
];

/*
  Track-laying tools: which kind of pin the pen lays, whether the line closes into a loop, actions
  on the selected pin (which also make the editor fully usable without a pointer), and a `d`
  string box for pasting a path from elsewhere.
*/
export default function PathControls({ state, actions }: PathControlsProps): JSX.Element {
  const textareaId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState<{ message: string; error: boolean } | null>(null);
  const d = buildPathData(state.vertices, state.closed);
  const selectedVertex = state.selection ? state.vertices[state.selection.vertexIndex] : undefined;

  // Parses whatever is in the box; on success the track is relaid in one undo step, on failure the reason is shown and nothing changes.
  function handleLoad() {
    const result = parsePathData(textareaRef.current?.value ?? "");
    if (!result.ok) {
      setStatus({ message: result.error, error: true });
      return;
    }
    actions.loadPath(result.vertices, result.closed);
    setStatus({
      message: result.fitted ? `Laid ${result.vertices.length} pins — scaled and centred to fit the baseboard.` : `Laid ${result.vertices.length} pins.`,
      error: false
    });
  }

  return (
    <>
      <SectionCard>
        <PanelTitle>Lay track</PanelTitle>
        <PanelHint>
          Click bare felt to lay the next pin, click the rails to insert one, drag pins and their square handles to bend the line. Double-click a pin
          (or press S) to switch it between smooth and corner; Alt-drag a handle to break its mirror.
        </PanelHint>

        <ToolRow>
          <SegmentGroup role="radiogroup" aria-label="New pins are">
            {PEN_MODES.map((mode) => (
              <SegmentOption key={mode.value}>
                <input type="radio" name="motion-path-pen" value={mode.value} checked={state.penMode === mode.value} onChange={() => actions.setPenMode(mode.value)} />
                {mode.label}
              </SegmentOption>
            ))}
          </SegmentGroup>
          <CheckRow>
            <input type="checkbox" checked={state.closed} onChange={actions.toggleClosed} />
            Closed loop
          </CheckRow>
          <CaseButton type="button" onClick={actions.extendTrack}>
            <PlusIcon size={14} aria-hidden="true" />
            Extend track
          </CaseButton>
        </ToolRow>

        <ToolRow>
          <SelectionReadout aria-live="polite">
            {selectedVertex && state.selection
              ? `Pin ${state.selection.vertexIndex + 1}: ${Math.round(selectedVertex.point.x)}, ${Math.round(selectedVertex.point.y)} (${selectedVertex.type === "curve" ? "smooth" : "corner"})`
              : "No pin selected"}
          </SelectionReadout>
          <CaseButton type="button" disabled={!state.selection} onClick={() => state.selection && actions.toggleVertexCurve(state.selection.vertexIndex)}>
            Smooth / corner
          </CaseButton>
          <CaseButton
            type="button"
            disabled={!state.selection || state.vertices.length <= 2}
            onClick={() => state.selection && actions.deleteVertex(state.selection.vertexIndex)}
            aria-label="Pull up the selected pin"
          >
            <TrashIcon size={14} aria-hidden="true" />
            Pull pin
          </CaseButton>
        </ToolRow>

        <label htmlFor={textareaId}>
          <PanelHint as="span">
            Path data — edit it or paste any single-subpath <code>d</code> string (arcs and quadratics are converted to cubic curves).
          </PanelHint>
        </label>
        <PathTextarea key={d} id={textareaId} ref={textareaRef} defaultValue={d} spellCheck={false} />
        <ToolRow>
          <CaseButton type="button" onClick={handleLoad}>
            Lay this track
          </CaseButton>
          {status && (
            <PasteStatus role="status" data-error={status.error ? "true" : undefined}>
              {status.message}
            </PasteStatus>
          )}
        </ToolRow>
      </SectionCard>
    </>
  );
}

PathControls.displayName = "PathControls";
