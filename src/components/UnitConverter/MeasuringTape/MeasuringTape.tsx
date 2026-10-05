"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { JSX, KeyboardEvent, PointerEvent } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { computeRulerTicks, formatNumber, fromPx, pxPerUnit, toPx } from "@/utils/unit-converter";
import { UNIT_META, UNIT_ORDER } from "@/data/unit-converter-units";
import { buildTickPath, computeTapeLength } from "@/components/UnitConverter/MeasuringTape/MeasuringTape.helpers";
import {
  TapeScroller,
  TapeTrack,
  HandleRail,
  TapeHandle,
  Strip,
  StripLabel,
  StripReading,
  MeasuredBand,
  ChalkLine
} from "@/components/UnitConverter/MeasuringTape/MeasuringTape.styles";
import { SectionCard, PanelTitle, PanelHint } from "@/components/UnitConverter/UnitConverter.styles";
import type { MeasuringTapeProps } from "@/components/UnitConverter/UnitConverter.types";

// Baseline for tick labels, just under the tallest tick — px because it lives in the same coordinate space as the true-scale ticks.
const LABEL_BASELINE_PX = 24;

// Keeps the handle this far inside the scroller's edges when auto-scrolling after a typed change, so it never lands half-hidden.
const SCROLL_MARGIN_PX = 48;

// Keys the handle responds to — keyup on anything else (Tab arriving, a modifier) must not checkpoint a no-op undo step.
const NUDGE_KEYS = new Set(["ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown", "PageUp", "PageDown", "Home"]);

/*
  A tape measure drawn at true CSS px, with one parallel ruler per unit, so the relationship between
  1rem, 1vw and 1cqi is something you can see rather than work out. Dragging the tab along the top
  rail (or arrowing it) changes the length in px, which the editor converts back into whichever unit
  the person last typed in.
*/
export default function MeasuringTape({ state, actions }: MeasuringTapeProps): JSX.Element {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  // Where inside the tab the pointer grabbed it, so dragging the tab doesn't snap its edge to the cursor on the first move.
  const grabOffsetRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const lengthPx = toPx(state.value, state.sourceUnit, state.context);
  const drawnPx = Math.max(lengthPx, 0);
  const tapeLength = computeTapeLength(drawnPx);

  // Recomputed only when the context or tape length changes — a drag within the same 100px band reuses every strip's path.
  const strips = useMemo(
    () =>
      UNIT_ORDER.map((unit) => {
        const ticks = computeRulerTicks(pxPerUnit(unit, state.context), tapeLength);
        return { unit, path: buildTickPath(ticks), labels: ticks.filter((tick) => tick.major && tick.x > 0) };
      }),
    [state.context, tapeLength]
  );

  // Follows typed or preset changes along a long tape; skipped mid-drag since the handle is already under the pointer.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || isDragging) return;
    const { scrollLeft, clientWidth } = scroller;
    if (drawnPx >= scrollLeft + SCROLL_MARGIN_PX && drawnPx <= scrollLeft + clientWidth - SCROLL_MARGIN_PX * 2) return;
    scroller.scrollTo({ left: Math.max(drawnPx - clientWidth / 2, 0), behavior: prefersReducedMotion ? "auto" : "smooth" });
  }, [drawnPx, isDragging, prefersReducedMotion]);

  // The rail's left edge is the tape's zero, and getBoundingClientRect already accounts for the scroll offset.
  function pointerToPx(clientX: number): number {
    const rail = railRef.current;
    if (!rail) return drawnPx;
    return Math.round(clientX - rail.getBoundingClientRect().left);
  }

  // Captures the pointer so the drag keeps tracking once it leaves the rail, and jumps the handle to wherever the rail was pressed.
  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    const onRailItself = event.target === event.currentTarget;
    grabOffsetRef.current = onRailItself ? 0 : pointerToPx(event.clientX) - drawnPx;
    if (onRailItself) actions.setLengthPx(pointerToPx(event.clientX));
  }

  // Only reacts while captured, so merely hovering over the rail never changes the length.
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    actions.setLengthPx(pointerToPx(event.clientX) - grabOffsetRef.current);
  }

  // One undo step per drag gesture, however many frames it ran for.
  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setIsDragging(false);
    actions.commitDrag();
  }

  // Standard slider keys — 1px per arrow, 10px with Shift, 100px per Page key — so the tape is fully usable without a pointer.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 10 : 1;
    const deltas: Record<string, number> = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: 100, PageDown: -100 };
    if (event.key === "Home") {
      event.preventDefault();
      actions.setLengthPx(0);
      return;
    }
    if (!(event.key in deltas)) return;
    event.preventDefault();
    actions.setLengthPx(Math.round(drawnPx) + deltas[event.key]);
  }

  const sourceReading = `${formatNumber(state.value, state.precision)}${state.sourceUnit}`;

  return (
    <>
      <SectionCard>
        <PanelTitle>Measuring tape</PanelTitle>
        <PanelHint>Drawn at true CSS px. Drag the tab, or focus it and use the arrow keys, to pull the tape out.</PanelHint>
        <TapeScroller ref={scrollerRef} data-dragging={isDragging ? "true" : undefined} tabIndex={-1}>
          <TapeTrack style={{ inlineSize: `${tapeLength}px` }}>
            <HandleRail ref={railRef} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
              <TapeHandle
                role="slider"
                tabIndex={0}
                aria-label="Measured length"
                aria-valuemin={0}
                aria-valuemax={10000}
                aria-valuenow={Math.round(drawnPx)}
                aria-valuetext={`${formatNumber(drawnPx, state.precision)}px, ${sourceReading}`}
                style={{ transform: `translateX(${drawnPx}px)` }}
                onKeyDown={handleKeyDown}
                onKeyUp={(event) => NUDGE_KEYS.has(event.key) && actions.commitDrag()}
              >
                {formatNumber(drawnPx, 1)}px
              </TapeHandle>
            </HandleRail>

            {strips.map(({ unit, path, labels }) => (
              <Strip key={unit} data-reference={unit === "px" ? "true" : undefined} data-source={unit === state.sourceUnit ? "true" : undefined}>
                <svg width={tapeLength} height="100%" aria-hidden="true" focusable="false">
                  <path d={path} stroke="currentColor" strokeWidth={1} fill="none" />
                  {labels.map((tick) => (
                    <text key={tick.x} x={tick.x + 3} y={LABEL_BASELINE_PX} fontSize={10} fill="currentColor">
                      {tick.label}
                    </text>
                  ))}
                </svg>
                <StripLabel>
                  {unit}
                  <StripReading>{formatNumber(fromPx(drawnPx, unit, state.context), Math.min(state.precision, 2))}</StripReading>
                </StripLabel>
              </Strip>
            ))}

            <MeasuredBand style={{ inlineSize: `${drawnPx}px` }} />
            <ChalkLine style={{ transform: `translateX(${drawnPx}px)` }} />
          </TapeTrack>
        </TapeScroller>
        <PanelHint>
          {UNIT_META[state.sourceUnit].name} is in charge: dragging keeps the reading in {state.sourceUnit} ({sourceReading}).
        </PanelHint>
      </SectionCard>
    </>
  );
}

MeasuringTape.displayName = "MeasuringTape";
