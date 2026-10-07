"use client";

import { useId, useRef, useState } from "react";
import type { JSX, KeyboardEvent, PointerEvent } from "react";
import { renderSvgTree } from "@/utils/svg-to-react-render";
import VisuallyHidden from "@/components/VisuallyHidden";
import {
  adjustViewBox,
  arrowDelta,
  drawingAsGroup,
  formatNumber,
  formatViewBox,
  gridLines,
  gridStepFor,
  rectPath,
  snapStepFor
} from "@/components/ViewboxExplorer/ViewboxExplorer.utils";
import { SectionCard, PanelTitle } from "@/components/ViewboxExplorer/ViewboxExplorer.styles";
import {
  FilmStrip,
  LightBoxSvg,
  GridLine,
  GridLabel,
  AuthoredFrame,
  MaskShade,
  BandShade,
  VisibleOutline,
  EaselBody,
  Blade,
  CornerKnob,
  CornerLabel,
  Caption
} from "@/components/ViewboxExplorer/LightBox/LightBox.styles";
import type { EaselGesture, EaselHandle, LightBoxProps } from "@/components/ViewboxExplorer/ViewboxExplorer.types";

// Human names for each handle, so screen readers announce "top blade" rather than a compass code.
const HANDLE_NAMES: Record<EaselHandle, string> = {
  move: "Easel",
  n: "Top blade",
  s: "Bottom blade",
  e: "Right blade",
  w: "Left blade",
  nw: "Top-left corner",
  ne: "Top-right corner",
  sw: "Bottom-left corner",
  se: "Bottom-right corner"
};

// data-* booleans render the literal string "false" otherwise — this keeps idle handles free of stray attributes.
function boolAttr(value: boolean): "true" | undefined {
  return value ? "true" : undefined;
}

/*
  The negative on the light box: the drawing in raw user space under a grid, with the masking easel
  (the viewBox) laid over it. Pointer drags and arrow keys both feed adjustViewBox from the same
  starting rectangle, so a drag and a key press can never disagree about snapping or limits. The
  region the print really shows is traced alongside, which is how "meet shows more than the
  viewBox" and "slice shows less" become visible on the negative itself.
*/
export default function LightBox({ drawing, extent, state, transform, overlays, actions }: LightBoxProps): JSX.Element {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gestureRef = useRef<EaselGesture | null>(null);
  const [activeHandle, setActiveHandle] = useState<EaselHandle | null>(null);
  const prefix = useId().replace(/[^A-Za-z0-9_-]/g, "");

  const { viewBox } = state;
  const step = snapStepFor(extent);
  const gridStep = gridStepFor(extent);
  const unit = Math.max(extent.width, extent.height);
  const knob = unit * 0.024;
  const fontSize = unit * 0.028;
  const right = viewBox.x + viewBox.width;
  const bottom = viewBox.y + viewBox.height;
  const visible = transform.visible;
  const isMeet = state.align !== "none" && state.meetOrSlice === "meet";
  const isSlice = state.align !== "none" && state.meetOrSlice === "slice";
  const hintId = `${prefix}-easel-hint`;

  // Screen pixels to user units through the svg's own CTM, which already accounts for its letterboxing inside the film strip.
  function toUserPoint(event: PointerEvent<Element>): { x: number; y: number } | null {
    const ctm = svgRef.current?.getScreenCTM();
    if (!ctm) return null;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(ctm.inverse());
    return { x: point.x, y: point.y };
  }

  // Captures the pointer on the grabbed handle so the drag survives leaving it; move/up bubble to the svg.
  function startDrag(handle: EaselHandle) {
    return (event: PointerEvent<SVGElement>) => {
      if (event.button !== 0) return;
      const startPoint = toUserPoint(event);
      if (!startPoint) return;
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      gestureRef.current = { handle, startPoint, startRect: viewBox, moved: false };
      setActiveHandle(handle);
    };
  }

  // Live-only updates — the whole drag becomes one undo step when the pointer lifts.
  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    const gesture = gestureRef.current;
    if (!gesture) return;
    const point = toUserPoint(event);
    if (!point) return;
    event.preventDefault();
    gesture.moved = true;
    actions.setViewBoxLive(adjustViewBox(gesture.startRect, gesture.handle, point.x - gesture.startPoint.x, point.y - gesture.startPoint.y, extent, step));
  }

  // Checkpoints only real drags, so a stray click on the easel doesn't leave an empty undo step behind.
  function handlePointerUp() {
    const gesture = gestureRef.current;
    gestureRef.current = null;
    setActiveHandle(null);
    if (gesture?.moved) actions.commitEdit();
  }

  // Arrow keys nudge by one snap step, Shift by ten — each press its own undo step, like the other goodies' handles.
  function handleKeyDown(handle: EaselHandle) {
    return (event: KeyboardEvent<SVGElement>) => {
      const delta = arrowDelta(event.key);
      if (!delta) return;
      event.preventDefault();
      const distance = event.shiftKey ? step * 10 : step;
      actions.setViewBox(adjustViewBox(viewBox, handle, delta[0] * distance, delta[1] * distance, extent, step));
    };
  }

  // Shared props for every focusable easel part — same role, hint and handlers, only the name and handle differ.
  function handleProps(handle: EaselHandle, valueText: string) {
    return {
      tabIndex: 0,
      role: "button",
      "aria-roledescription": "draggable easel handle",
      "aria-label": `${HANDLE_NAMES[handle]}, ${valueText}`,
      "aria-describedby": hintId,
      "data-active": boolAttr(activeHandle === handle),
      onPointerDown: startDrag(handle),
      onKeyDown: handleKeyDown(handle)
    };
  }

  const xLines = overlays.grid ? gridLines(extent.x, extent.width, gridStep) : [];
  const yLines = overlays.grid ? gridLines(extent.y, extent.height, gridStep) : [];
  const blades: Array<{ handle: EaselHandle; x1: number; y1: number; x2: number; y2: number; value: string }> = [
    { handle: "n", x1: viewBox.x, y1: viewBox.y, x2: right, y2: viewBox.y, value: `y ${formatNumber(viewBox.y)}` },
    { handle: "s", x1: viewBox.x, y1: bottom, x2: right, y2: bottom, value: `y ${formatNumber(bottom)}` },
    { handle: "w", x1: viewBox.x, y1: viewBox.y, x2: viewBox.x, y2: bottom, value: `x ${formatNumber(viewBox.x)}` },
    { handle: "e", x1: right, y1: viewBox.y, x2: right, y2: bottom, value: `x ${formatNumber(right)}` }
  ];
  const corners: Array<{ handle: EaselHandle; x: number; y: number }> = [
    { handle: "nw", x: viewBox.x, y: viewBox.y },
    { handle: "ne", x: right, y: viewBox.y },
    { handle: "sw", x: viewBox.x, y: bottom },
    { handle: "se", x: right, y: bottom }
  ];

  return (
    <>
      <SectionCard>
        <PanelTitle>Negative on the light box</PanelTitle>
        <FilmStrip>
          <LightBoxSvg
            ref={svgRef}
            viewBox={formatViewBox(extent)}
            role="group"
            aria-label="User-space canvas with the viewBox easel"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <defs>
              <pattern id={`${prefix}-bleed`} patternUnits="userSpaceOnUse" width={unit * 0.025} height={unit * 0.025} patternTransform="rotate(45)">
                <rect width={unit * 0.025} height={unit * 0.025} fill="var(--safelight)" fillOpacity={0.1} />
                <line x1={0} y1={0} x2={0} y2={unit * 0.025} stroke="var(--safelight)" strokeWidth={unit * 0.006} strokeOpacity={0.55} />
              </pattern>
              <pattern id={`${prefix}-crop`} patternUnits="userSpaceOnUse" width={unit * 0.025} height={unit * 0.025} patternTransform="rotate(45)">
                <line x1={0} y1={0} x2={0} y2={unit * 0.025} stroke="var(--safelight)" strokeWidth={unit * 0.005} strokeOpacity={0.8} />
                <line x1={0} y1={0} x2={unit * 0.025} y2={0} stroke="var(--safelight)" strokeWidth={unit * 0.005} strokeOpacity={0.8} />
              </pattern>
            </defs>

            {xLines.map((x) => (
              <GridLine key={`x${x}`} x1={x} y1={extent.y} x2={x} y2={extent.y + extent.height} data-axis={boolAttr(x === 0)} />
            ))}
            {yLines.map((y) => (
              <GridLine key={`y${y}`} x1={extent.x} y1={y} x2={extent.x + extent.width} y2={y} data-axis={boolAttr(y === 0)} />
            ))}

            {drawing.tree && <g aria-hidden="true">{renderSvgTree(drawingAsGroup(drawing.tree), { idPrefix: `${prefix}-n-` })}</g>}
            <AuthoredFrame x={drawing.bounds.x} y={drawing.bounds.y} width={drawing.bounds.width} height={drawing.bounds.height} />

            {overlays.grid &&
              xLines.map((x) => (
                <GridLabel key={`lx${x}`} x={x + fontSize * 0.25} y={extent.y + fontSize * 1.1} fontSize={fontSize * 0.85}>
                  {formatNumber(x)}
                </GridLabel>
              ))}
            {overlays.grid &&
              yLines.map((y) => (
                <GridLabel key={`ly${y}`} x={extent.x + fontSize * 0.25} y={y - fontSize * 0.25} fontSize={fontSize * 0.85}>
                  {formatNumber(y)}
                </GridLabel>
              ))}

            <MaskShade d={`${rectPath(extent)} ${rectPath(visible)}`} />
            {overlays.borders && isMeet && <BandShade d={`${rectPath(visible)} ${rectPath(viewBox)}`} fill={`url(#${prefix}-bleed)`} />}
            {overlays.borders && isSlice && <BandShade d={`${rectPath(viewBox)} ${rectPath(visible)}`} fill={`url(#${prefix}-crop)`} />}
            {overlays.outline && <VisibleOutline x={visible.x} y={visible.y} width={visible.width} height={visible.height} />}

            <EaselBody x={viewBox.x} y={viewBox.y} width={viewBox.width} height={viewBox.height} {...handleProps("move", `viewBox ${formatViewBox(viewBox)}`)} />

            {blades.map((blade) => (
              <Blade key={blade.handle} {...handleProps(blade.handle, blade.value)} style={{ cursor: blade.handle === "n" || blade.handle === "s" ? "ns-resize" : "ew-resize" }}>
                <line data-hit="" x1={blade.x1} y1={blade.y1} x2={blade.x2} y2={blade.y2} strokeWidth={knob * 1.6} />
                <line data-bar="" x1={blade.x1} y1={blade.y1} x2={blade.x2} y2={blade.y2} />
              </Blade>
            ))}

            {corners.map((corner) => (
              <CornerKnob
                key={corner.handle}
                x={corner.x - knob / 2}
                y={corner.y - knob / 2}
                width={knob}
                height={knob}
                style={{ cursor: corner.handle === "nw" || corner.handle === "se" ? "nwse-resize" : "nesw-resize" }}
                {...handleProps(corner.handle, `x ${formatNumber(corner.x)}, y ${formatNumber(corner.y)}`)}
              />
            ))}

            <CornerLabel x={viewBox.x} y={viewBox.y - fontSize * 0.6} fontSize={fontSize}>
              ({formatNumber(viewBox.x)},{formatNumber(viewBox.y)})
            </CornerLabel>
            <CornerLabel x={right} y={bottom + fontSize * 1.3} fontSize={fontSize} textAnchor="end">
              ({formatNumber(right)},{formatNumber(bottom)})
            </CornerLabel>
          </LightBoxSvg>
        </FilmStrip>
        <VisuallyHidden id={hintId}>Arrow keys move this part of the easel by one grid step; hold Shift for ten.</VisuallyHidden>
        <Caption>
          <span>
            viewBox=&quot;<strong>{formatViewBox(viewBox)}</strong>&quot;
          </span>
          <span>{formatNumber(viewBox.width)} × {formatNumber(viewBox.height)} user units</span>
        </Caption>
      </SectionCard>
    </>
  );
}

LightBox.displayName = "LightBox";
