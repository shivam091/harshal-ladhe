"use client";

import { useEffect, useRef, useState } from "react";
import type { DragEvent, JSX, KeyboardEvent } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@/components/Icon";
import VisuallyHidden from "@/components/VisuallyHidden";
import { CheckboxInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { formatMs } from "@/components/LineDrawingAnimator/LineDrawingAnimator.utils";
import { SectionCard, PanelTitle, PanelHint, BrassButton } from "@/components/LineDrawingAnimator/LineDrawingAnimator.styles";
import {
  Blotter,
  LedgerList,
  LedgerRow,
  RowNumber,
  RowBody,
  RowLabel,
  RowMeta,
  RowActions,
  StudButton,
  TweakDrawer,
  TweakField,
  LedgerFooter
} from "@/components/LineDrawingAnimator/StrokeLedger/StrokeLedger.styles";
import type { StrokeInfo, StrokeLedgerProps, TimelineEntry } from "@/components/LineDrawingAnimator/LineDrawingAnimator.types";

// Fallback picker colour for a stroke with no override yet — the ink the paper shows by default.
const DEFAULT_TWEAK_COLOUR = "#1f3a8a";

// The ledger's timing column in words: when it starts and for how long, or why it doesn't animate at all.
function describeTiming(entry: TimelineEntry, info: StrokeInfo | undefined, excluded: boolean): string {
  if (excluded) return "left out — shown as drawn";
  if (!entry.draws) return entry.fade ? `fill fades in at ${formatMs(entry.fade.start)}` : "fill-only — shown throughout";
  const fill = entry.fade ? ` · fill at ${formatMs(entry.fade.start)}` : "";
  return `${formatMs(entry.start)} → ${formatMs(entry.duration)}${info && !info.hasStroke ? " · outlined fill" : ""}${fill}`;
}

/*
  The stroke list as an ink-blotter ledger, one line per stroke in drawing order. Reordering works
  three ways — dragging a line, the up/down studs, or Alt+↑/↓ on a focused line — and every move
  pins the sequence as the custom order. A polite live region announces keyboard moves, and focus
  follows the moved line so repeated Alt+↓ keeps carrying the same stroke.
*/
export default function StrokeLedger({ artwork, timeline, state, actions }: StrokeLedgerProps): JSX.Element {
  const [openTweak, setOpenTweak] = useState<number | null>(null);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const listRef = useRef<HTMLOListElement>(null);
  const pendingFocusRef = useRef<number | null>(null);
  const byIndex = new Map(artwork.strokes.map((stroke) => [stroke.index, stroke]));
  const order = timeline.entries.map((entry) => entry.index);

  // After a keyboard move re-renders the list, puts focus back on the line that moved.
  useEffect(() => {
    const index = pendingFocusRef.current;
    if (index === null) return;
    pendingFocusRef.current = null;
    listRef.current?.querySelector<HTMLElement>(`[data-stroke="${index}"]`)?.focus();
  });

  // One move, from any of the three input methods, with an announcement for screen readers.
  function move(from: number, to: number) {
    if (to < 0 || to >= order.length || from === to) return;
    pendingFocusRef.current = order[from];
    actions.moveStroke(order, from, to);
    setAnnouncement(`Stroke ${order[from]} moved to position ${to + 1} of ${order.length}.`);
  }

  // Alt+↑/↓ moves the focused line; plain arrows stay free for scrolling.
  function handleRowKeyDown(event: KeyboardEvent<HTMLLIElement>, position: number) {
    if (event.target !== event.currentTarget || !event.altKey) return;
    if (event.key === "ArrowUp") {
      event.preventDefault();
      move(position, position - 1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      move(position, position + 1);
    }
  }

  // Native drag-and-drop: the dragged line's position travels in dataTransfer as well as state, for browsers that need data set to start a drag.
  function handleDragStart(event: DragEvent<HTMLLIElement>, position: number) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(position));
    setDragFrom(position);
  }

  // Drops the dragged line onto this one's position.
  function handleDrop(event: DragEvent<HTMLLIElement>, position: number) {
    event.preventDefault();
    if (dragFrom !== null) move(dragFrom, position);
    setDragFrom(null);
    setDropTarget(null);
  }

  return (
    <>
      <SectionCard aria-labelledby="ld-ledger-title">
        <PanelTitle id="ld-ledger-title">Stroke ledger</PanelTitle>
        {timeline.entries.length === 0 ? (
          <PanelHint>Strokes appear here once the drawing parses.</PanelHint>
        ) : (
          <Blotter>
            <LedgerList ref={listRef} aria-label="Strokes in drawing order">
              {timeline.entries.map((entry, position) => {
                const info = byIndex.get(entry.index);
                const override = state.overrides[String(entry.index)] ?? {};
                const excluded = Boolean(override.excluded);
                const isOpen = openTweak === entry.index;
                return (
                  <LedgerRow
                    key={entry.index}
                    data-stroke={entry.index}
                    data-excluded={excluded ? "true" : undefined}
                    data-drop-target={dropTarget === position ? "true" : undefined}
                    tabIndex={0}
                    draggable
                    aria-label={`Position ${position + 1}: stroke ${entry.index}, ${info?.tag ?? "shape"}. Alt plus arrow keys to move.`}
                    onKeyDown={(event) => handleRowKeyDown(event, position)}
                    onDragStart={(event) => handleDragStart(event, position)}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDropTarget(position);
                    }}
                    onDragLeave={() => setDropTarget((current) => (current === position ? null : current))}
                    onDragEnd={() => {
                      setDragFrom(null);
                      setDropTarget(null);
                    }}
                    onDrop={(event) => handleDrop(event, position)}
                  >
                    <RowNumber aria-hidden="true">{position + 1}</RowNumber>
                    <RowBody>
                      <RowLabel>
                        #{entry.index} &lt;{info?.tag}&gt; <code>{info?.summary}</code>
                      </RowLabel>
                      <RowMeta>{describeTiming(entry, info, excluded)}</RowMeta>
                    </RowBody>
                    <RowActions>
                      <CheckboxInput
                        type="checkbox"
                        checked={!excluded}
                        aria-label={`Animate stroke ${entry.index}`}
                        onChange={(event) => actions.setOverride(entry.index, { excluded: !event.target.checked })}
                      />
                      <StudButton type="button" aria-label={`Move stroke ${entry.index} earlier`} disabled={position === 0} onClick={() => move(position, position - 1)}>
                        <ArrowUpIcon size={12} />
                      </StudButton>
                      <StudButton type="button" aria-label={`Move stroke ${entry.index} later`} disabled={position === timeline.entries.length - 1} onClick={() => move(position, position + 1)}>
                        <ArrowDownIcon size={12} />
                      </StudButton>
                      <StudButton
                        type="button"
                        aria-label={`Tweak stroke ${entry.index}`}
                        aria-expanded={isOpen}
                        aria-controls={`ld-tweak-${entry.index}`}
                        onClick={() => setOpenTweak(isOpen ? null : entry.index)}
                      >
                        ✎
                      </StudButton>
                    </RowActions>
                    {isOpen && (
                      <TweakDrawer id={`ld-tweak-${entry.index}`}>
                        <TweakField>
                          Duration (ms)
                          <input
                            type="number"
                            min={1}
                            max={20000}
                            step={50}
                            placeholder={String(Math.round(entry.duration))}
                            value={override.duration ?? ""}
                            onChange={(event) => actions.setOverride(entry.index, { duration: Number.isFinite(event.target.valueAsNumber) ? event.target.valueAsNumber : undefined })}
                          />
                        </TweakField>
                        <TweakField>
                          Width
                          <input
                            type="number"
                            min={0.25}
                            max={40}
                            step={0.25}
                            placeholder={entry.width !== null ? String(entry.width) : "as drawn"}
                            value={override.width ?? ""}
                            onChange={(event) => actions.setOverride(entry.index, { width: Number.isFinite(event.target.valueAsNumber) ? event.target.valueAsNumber : undefined })}
                          />
                        </TweakField>
                        <TweakField>
                          Colour
                          <input
                            type="color"
                            value={override.colour ?? DEFAULT_TWEAK_COLOUR}
                            onChange={(event) => actions.setOverrideLive(entry.index, { colour: event.target.value })}
                            onBlur={actions.commitEdit}
                          />
                        </TweakField>
                        <BrassButton type="button" onClick={() => actions.setOverride(entry.index, { duration: undefined, width: undefined, colour: undefined })}>
                          Reset stroke
                        </BrassButton>
                      </TweakDrawer>
                    )}
                  </LedgerRow>
                );
              })}
            </LedgerList>
          </Blotter>
        )}
        <LedgerFooter>
          <PanelHint>Drag a line, use the arrow studs, or focus a line and press Alt+↑/↓ to reorder.</PanelHint>
          <BrassButton type="button" onClick={actions.clearOverrides} disabled={Object.keys(state.overrides).length === 0 && state.customOrder === null}>
            Clear tweaks
          </BrassButton>
        </LedgerFooter>
        <VisuallyHidden role="status" aria-live="polite">
          {announcement}
        </VisuallyHidden>
      </SectionCard>
    </>
  );
}

StrokeLedger.displayName = "StrokeLedger";
