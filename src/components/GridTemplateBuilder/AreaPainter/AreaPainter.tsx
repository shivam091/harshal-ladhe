"use client";

import { useEffect, useState } from "react";
import type { JSX, PointerEvent as ReactPointerEvent } from "react";
import { TrashIcon } from "@/components/Icon";
import { colorForIndex, listAreaNames } from "@/utils/grid-template-builder";
import { FieldWrapper, FieldLabel, CheckboxInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import {
  TextInput,
  SuggestionRow,
  SuggestionChip,
  ChipRow,
  Chip,
  ChipButton,
  ChipRemove,
  PainterGrid,
  PainterCell,
  HelpText
} from "@/components/GridTemplateBuilder/AreaPainter/AreaPainter.styles";
import type { AreaPainterProps } from "@/interfaces/grid-template-builder";

// Common landmark region names — a shortcut into a recognizable layout, not the only names the free-text field accepts.
const SUGGESTED_NAMES = ["header", "nav", "sidebar", "main", "aside", "footer"];

// One in-progress click/drag gesture: the cell the pointer went down on, and the cell it's currently over — both are the SAME cell for a plain click, which is exactly what makes a click paint a 1×1 rectangle through the same code path a drag does.
interface DragRect {
  origin: { row: number; col: number };
  current: { row: number; col: number };
}

// True once (row, col) falls inside the rectangle a DragRect's two corners describe, regardless of which corner is "first" — a drag can end up-left of where it started.
function isInDragRect(row: number, col: number, drag: DragRect | null): boolean {
  if (!drag) return false;
  const rowLo = Math.min(drag.origin.row, drag.current.row);
  const rowHi = Math.max(drag.origin.row, drag.current.row);
  const colLo = Math.min(drag.origin.col, drag.current.col);
  const colHi = Math.max(drag.origin.col, drag.current.col);
  return row >= rowLo && row <= rowHi && col >= colLo && col <= colHi;
}

// Releases any implicit pointer capture the browser grants the cell a drag started on — without this, touch (and some mouse) input would keep routing pointerenter/pointerup to the ORIGIN cell only, so the pointer could never "arrive" at the cells it drags across.
function releaseImplicitCapture(event: ReactPointerEvent<HTMLButtonElement>): void {
  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId);
  }
}

/*
  The tool's signature interaction: a toggle that reveals a click/drag grid outline sized to the
  current column/row counts, painted cell-by-cell into a real grid-template-areas string. A whole
  drag gesture is tracked as local, undo-exempt component state (`drag`) and only turned into one
  `actions.paintArea` call — and therefore one undo step — on pointerup, the same
  "collapse a gesture into a single commit" approach useUndoStack's own doc comment describes for a
  slider drag, just with a rectangle selection standing in for setPresent's running value.
*/
export default function AreaPainter({ state, actions }: AreaPainterProps): JSX.Element {
  const [drag, setDrag] = useState<DragRect | null>(null);
  const areaNames = listAreaNames(state.areas);
  const previewIndex = areaNames.includes(state.activeAreaName) ? areaNames.indexOf(state.activeAreaName) : areaNames.length;
  const previewColor = state.activeAreaName ? colorForIndex(previewIndex) : "var(--color-fg-muted)";

  // Finalizes whatever rectangle is currently pending as soon as the pointer is released anywhere on the page — not just inside the grid — since a fast drag can easily end outside PainterGrid's own bounds.
  useEffect(() => {
    if (!drag) return;
    function handlePointerUp() {
      if (!drag) return;
      actions.paintArea(drag.origin.row, drag.current.row, drag.origin.col, drag.current.col, state.activeAreaName);
      setDrag(null);
    }
    window.addEventListener("pointerup", handlePointerUp);
    return () => window.removeEventListener("pointerup", handlePointerUp);
  }, [drag, state.activeAreaName, actions]);

  return (
    <>
      <FieldWrapper data-inline>
        <CheckboxInput id="areas-enabled" type="checkbox" checked={state.areasEnabled} onChange={(event) => actions.setAreasEnabled(event.target.checked)} />
        <FieldLabel htmlFor="areas-enabled">Named areas</FieldLabel>
      </FieldWrapper>

      {state.areasEnabled && (
        <>
          <FieldWrapper>
            <FieldLabel htmlFor="active-area-name">Active area name</FieldLabel>
            <TextInput
              id="active-area-name"
              type="text"
              placeholder="e.g. header"
              value={state.activeAreaName}
              onChange={(event) => actions.setActiveAreaName(event.target.value.replace(/\s+/g, "-"))}
            />
          </FieldWrapper>

          <SuggestionRow>
            {SUGGESTED_NAMES.map((name) => (
              <SuggestionChip key={name} type="button" data-active={state.activeAreaName === name ? "true" : undefined} onClick={() => actions.setActiveAreaName(name)}>
                {name}
              </SuggestionChip>
            ))}
            <SuggestionChip type="button" data-eraser="true" data-active={state.activeAreaName === "" ? "true" : undefined} onClick={() => actions.setActiveAreaName("")}>
              Eraser
            </SuggestionChip>
          </SuggestionRow>

          {areaNames.length > 0 && (
            <ChipRow>
              {areaNames.map((name, index) => (
                <Chip key={name} data-active={state.activeAreaName === name ? "true" : undefined} style={{ background: colorForIndex(index) }}>
                  <ChipButton type="button" onClick={() => actions.setActiveAreaName(name)}>
                    {name}
                  </ChipButton>
                  <ChipRemove type="button" aria-label={`Clear ${name} area`} onClick={() => actions.clearAreaName(name)}>
                    <TrashIcon size={10} />
                  </ChipRemove>
                </Chip>
              ))}
            </ChipRow>
          )}

          <PainterGrid style={{ gridTemplateColumns: `repeat(${state.columns.length}, 1fr)`, gridTemplateRows: `repeat(${state.rows.length}, 2rem)` }}>
            {state.areas.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const pending = isInDragRect(rowIndex, colIndex, drag);
                const background = pending ? previewColor : cell ? colorForIndex(areaNames.indexOf(cell)) : undefined;
                return (
                  <PainterCell
                    key={`${rowIndex}-${colIndex}`}
                    type="button"
                    data-pending={pending ? "true" : undefined}
                    style={background ? { background } : undefined}
                    aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}${cell ? `, area ${cell}` : ""}`}
                    onPointerDown={(event) => {
                      releaseImplicitCapture(event);
                      setDrag({ origin: { row: rowIndex, col: colIndex }, current: { row: rowIndex, col: colIndex } });
                    }}
                    onPointerEnter={() => setDrag((prev) => (prev ? { ...prev, current: { row: rowIndex, col: colIndex } } : prev))}
                  >
                    {pending ? "" : cell}
                  </PainterCell>
                );
              })
            )}
          </PainterGrid>

          <HelpText>Click or drag across cells to paint them with the active area name. Pick &ldquo;Eraser&rdquo; to clear cells instead.</HelpText>
        </>
      )}
    </>
  );
}

AreaPainter.displayName = "AreaPainter";
