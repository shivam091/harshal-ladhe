"use client";

import { useId, useMemo, useRef } from "react";
import type { CSSProperties, JSX, KeyboardEvent } from "react";
import { usePointDrag } from "@/hooks/use-point-drag";
import { authoredRadius, listHandles, moveHandle, snapValue, RADIUS_RULER_OFFSET } from "@/components/ShapeToPathConverter/ShapeToPathConverter.helpers";
import {
  boundsDifference,
  buildPathData,
  formatNumber,
  pathBounds,
  resolveRectRadii,
  roundSteps,
  shapeBounds,
  stepSegmentData
} from "@/components/ShapeToPathConverter/ShapeToPathConverter.utils";
import { SectionCard, PanelTitle, TeacherMark } from "@/components/ShapeToPathConverter/ShapeToPathConverter.styles";
import {
  CanvasFrame,
  CanvasSvg,
  CanvasHint,
  GridLine,
  RulerTick,
  RulerLabel,
  OriginalShape,
  GhostPath,
  InkPath,
  PenSegment,
  PenMarker,
  MarkLine,
  MarkLabel,
  StepBadge,
  RadiusRuler,
  Protractor,
  HandleGroup,
  Legend,
  LegendItem
} from "@/components/ShapeToPathConverter/ExerciseCanvas/ExerciseCanvas.styles";
import type { CanvasHandle, ExerciseCanvasProps, Shape } from "@/components/ShapeToPathConverter/ShapeToPathConverter.types";

// Arrow-key nudge sizes in user units: one square of the grid's fine ruling, or a whole square with Shift.
const ARROW_STEP = 1;
const ARROW_STEP_FAST = 5;

// Side of one square of the exercise book's paper, in user units.
const GRID_SQUARE = 5;

// Ruler positions along each edge, every half-square; numbered only on the multiples of 20 to keep the edge readable.
const RULER_MARKS = Array.from({ length: 100 / GRID_SQUARE + 1 }, (_, i) => i * GRID_SQUARE);

// data-* booleans render as the string "false" rather than being omitted, so idle handles get no attribute at all.
function boolAttr(value: boolean): "true" | undefined {
  return value ? "true" : undefined;
}

// Short alias for printing a number on the drawing.
function n(value: number): string {
  return formatNumber(value, 2);
}

// The shape as its real SVG element, so the overlay compares the path against what the browser draws, not a re-derivation of it.
function renderOriginal(shape: Shape): JSX.Element {
  switch (shape.kind) {
    case "rect":
      return (
        <rect
          x={shape.x}
          y={shape.y}
          width={Math.max(0, shape.width)}
          height={Math.max(0, shape.height)}
          rx={shape.rx !== null && shape.rx >= 0 ? shape.rx : undefined}
          ry={shape.ry !== null && shape.ry >= 0 ? shape.ry : undefined}
        />
      );
    case "circle":
      return <circle cx={shape.cx} cy={shape.cy} r={Math.max(0, shape.r)} />;
    case "ellipse":
      return <ellipse cx={shape.cx} cy={shape.cy} rx={Math.max(0, shape.rx)} ry={Math.max(0, shape.ry)} />;
    case "line":
      return <line x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2} />;
    default: {
      const Tag = shape.kind;
      return <Tag points={shape.points.map((p) => `${p.x},${p.y}`).join(" ")} />;
    }
  }
}

// A half-disc protractor round a centre point, with a tick every 30°.
function renderProtractor(cx: number, cy: number): JSX.Element {
  const radius = 6;
  return (
    <Protractor aria-hidden="true">
      <path d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy} Z`} />
      {[30, 60, 90, 120, 150].map((angle) => {
        const radians = (angle * Math.PI) / 180;
        return (
          <line
            key={angle}
            x1={cx + Math.cos(radians) * (radius - 1.4)}
            y1={cy - Math.sin(radians) * (radius - 1.4)}
            x2={cx + Math.cos(radians) * radius}
            y2={cy - Math.sin(radians) * radius}
          />
        );
      })}
    </Protractor>
  );
}

/*
  A ruler strip running alongside one edge of a rect, with a red tick at half the rect's size: the
  most a radius can be before it is clamped, so dragging past it shows the rule in action.
*/
function renderRadiusRuler(axis: "x" | "y", originX: number, originY: number, length: number, limit: number): JSX.Element {
  const thickness = 2.4;
  const marks = Array.from({ length: Math.floor(length) + 1 }, (_, i) => i);
  const horizontal = axis === "x";

  return (
    <RadiusRuler aria-hidden="true">
      <rect
        x={horizontal ? originX : originX - thickness / 2}
        y={horizontal ? originY - thickness / 2 : originY}
        width={horizontal ? length : thickness}
        height={horizontal ? thickness : length}
      />
      {marks.map((i) => {
        const size = i % 5 === 0 ? 1.1 : 0.55;
        return horizontal ? (
          <line key={i} x1={originX + i} y1={originY - thickness / 2} x2={originX + i} y2={originY - thickness / 2 + size} />
        ) : (
          <line key={i} x1={originX - thickness / 2} y1={originY + i} x2={originX - thickness / 2 + size} y2={originY + i} />
        );
      })}
      {horizontal ? (
        <MarkLine x1={originX + limit} y1={originY - thickness} x2={originX + limit} y2={originY + thickness} style={{ strokeDasharray: "none" }} />
      ) : (
        <MarkLine x1={originX - thickness} y1={originY + limit} x2={originX + thickness} y2={originY + limit} style={{ strokeDasharray: "none" }} />
      )}
    </RadiusRuler>
  );
}

// The teacher's red-pen working marks for each shape: dimension lines, radius arrows and labelled points.
function renderMarks(shape: Shape): JSX.Element | null {
  switch (shape.kind) {
    case "rect": {
      if (shape.width <= 0 || shape.height <= 0) return null;
      const { rx, ry } = resolveRectRadii(shape);
      const below = shape.y + shape.height + 3;
      const beside = shape.x + shape.width + 3;
      const rulerLength = Math.max(shape.width / 2, authoredRadius(shape, "rx")) + 2;
      const rulerHeight = Math.max(shape.height / 2, authoredRadius(shape, "ry")) + 2;
      return (
        <g aria-hidden="true">
          {renderRadiusRuler("x", shape.x, shape.y - RADIUS_RULER_OFFSET, rulerLength, shape.width / 2)}
          {renderRadiusRuler("y", shape.x - RADIUS_RULER_OFFSET, shape.y, rulerHeight, shape.height / 2)}
          <MarkLine x1={shape.x} y1={below} x2={shape.x + shape.width} y2={below} />
          <MarkLabel x={shape.x + shape.width / 2} y={below + 3.4} textAnchor="middle">
            width = {n(shape.width)}
          </MarkLabel>
          <MarkLine x1={beside} y1={shape.y} x2={beside} y2={shape.y + shape.height} />
          <MarkLabel x={beside + 1} y={shape.y + shape.height / 2} transform={`rotate(90 ${beside + 1} ${shape.y + shape.height / 2})`} textAnchor="middle">
            height = {n(shape.height)}
          </MarkLabel>
          {rx > 0 && (
            <>
              <MarkLine x1={shape.x + rx} y1={shape.y + ry} x2={shape.x + rx} y2={shape.y} />
              <MarkLine x1={shape.x + rx} y1={shape.y + ry} x2={shape.x} y2={shape.y + ry} />
              <MarkLabel x={shape.x + rx / 2} y={shape.y + ry + 3.2} textAnchor="middle">
                rx {n(rx)}
              </MarkLabel>
              <MarkLabel x={shape.x + rx + 1} y={shape.y + ry / 2 + 1}>
                ry {n(ry)}
              </MarkLabel>
            </>
          )}
        </g>
      );
    }
    case "circle":
      if (shape.r <= 0) return null;
      return (
        <g aria-hidden="true">
          {renderProtractor(shape.cx, shape.cy)}
          <MarkLine x1={shape.cx} y1={shape.cy} x2={shape.cx + shape.r} y2={shape.cy} />
          <MarkLabel x={shape.cx + shape.r / 2} y={shape.cy + 3.6} textAnchor="middle">
            r = {n(shape.r)}
          </MarkLabel>
        </g>
      );
    case "ellipse":
      if (shape.rx <= 0 || shape.ry <= 0) return null;
      return (
        <g aria-hidden="true">
          {renderProtractor(shape.cx, shape.cy)}
          <MarkLine x1={shape.cx} y1={shape.cy} x2={shape.cx + shape.rx} y2={shape.cy} />
          <MarkLine x1={shape.cx} y1={shape.cy} x2={shape.cx} y2={shape.cy + shape.ry} />
          <MarkLabel x={shape.cx + shape.rx / 2} y={shape.cy + 3.6} textAnchor="middle">
            rx = {n(shape.rx)}
          </MarkLabel>
          <MarkLabel x={shape.cx + 1.2} y={shape.cy + shape.ry / 2 + 1}>
            ry = {n(shape.ry)}
          </MarkLabel>
        </g>
      );
    case "line":
      return (
        <g aria-hidden="true">
          <MarkLabel x={shape.x1 + 2} y={shape.y1 - 2}>
            (x1, y1)
          </MarkLabel>
          <MarkLabel x={shape.x2 + 2} y={shape.y2 - 2}>
            (x2, y2)
          </MarkLabel>
        </g>
      );
    default:
      return (
        <g aria-hidden="true">
          {shape.points.map((point, index) => (
            <MarkLabel key={index} x={point.x + 2} y={point.y - 2}>
              {index + 1}
            </MarkLabel>
          ))}
        </g>
      );
  }
}

/*
  The squared-paper drawing. Layers bottom to top: the paper and ruler, the original element in
  broad pencil, the generated path in biro (dashed where the scrubber has not reached yet), the
  hovered step traced in red pen, the teacher's dimension marks, and finally the handles, so they
  always sit above anything they might share a point with.
*/
export default function ExerciseCanvas({ shape, conversion, mode, precision, progress, hoveredStep, actions }: ExerciseCanvasProps): JSX.Element {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const patternId = `exercise-grid-${useId().replace(/:/g, "")}`;
  const hintId = `${patternId}-hint`;
  const { steps } = conversion;

  const { activeId, startDrag, handlePointerMove, handlePointerUp } = usePointDrag({
    containerRef: svgRef,
    onDrag: (id, point, modifiers) => {
      actions.setShape(moveHandle(shape, id, { x: snapValue(point.x, modifiers.altKey), y: snapValue(point.y, modifiers.altKey) }));
    },
    onDragEnd: () => actions.commitEdit()
  });

  const fullD = useMemo(() => buildPathData(steps, mode, precision), [steps, mode, precision]);
  const drawnD = useMemo(() => buildPathData(steps, mode, precision, progress), [steps, mode, precision, progress]);

  // Compared against the rounded steps, so the tick is for the path someone will actually copy at this precision.
  const difference = useMemo(() => boundsDifference(shapeBounds(shape), pathBounds(roundSteps(steps, precision))), [shape, steps, precision]);
  const bounds = shapeBounds(shape);

  const handles = listHandles(shape);
  const hovered = hoveredStep !== null ? steps[hoveredStep] : undefined;
  const penPoint = progress > 0 ? steps[progress - 1]?.to : undefined;

  // Arrow keys nudge the focused handle; each nudge is its own undo step, as a keyboard edit has no "release" to wait for.
  function handleKeyDown(handle: CanvasHandle, event: KeyboardEvent<SVGGElement>) {
    const step = event.shiftKey ? ARROW_STEP_FAST : ARROW_STEP;
    const delta: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (!(event.key in delta)) return;
    event.preventDefault();
    const [dx, dy] = delta[event.key];
    actions.loadShape(moveHandle(shape, handle.id, { x: handle.point.x + dx, y: handle.point.y + dy }));
  }

  return (
    <>
      <SectionCard>
        <PanelTitle>Drawing</PanelTitle>
        <CanvasFrame>
          <CanvasSvg
            ref={svgRef}
            viewBox="0 0 100 100"
            role="group"
            aria-label={`Squared-paper drawing of the <${shape.kind}> with its generated path overlaid`}
            aria-describedby={hintId}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <defs>
              <pattern id={patternId} width={GRID_SQUARE} height={GRID_SQUARE} patternUnits="userSpaceOnUse">
                <GridLine d={`M ${GRID_SQUARE} 0 L 0 0 0 ${GRID_SQUARE}`} />
              </pattern>
            </defs>
            <rect x={0} y={0} width={100} height={100} fill={`url(#${patternId})`} aria-hidden="true" />

            <g aria-hidden="true">
              {RULER_MARKS.map((mark) => (
                <g key={mark}>
                  <RulerTick x1={mark} y1={0} x2={mark} y2={mark % 10 === 0 ? 2 : 1} />
                  <RulerTick x1={0} y1={mark} x2={mark % 10 === 0 ? 2 : 1} y2={mark} />
                  {mark % 20 === 0 && mark > 0 && mark < 100 && (
                    <>
                      <RulerLabel x={mark} y={4.4} textAnchor="middle">
                        {mark}
                      </RulerLabel>
                      <RulerLabel x={2.6} y={mark + 0.8}>
                        {mark}
                      </RulerLabel>
                    </>
                  )}
                </g>
              ))}
            </g>

            <OriginalShape aria-hidden="true">{renderOriginal(shape)}</OriginalShape>

            {progress < steps.length && <GhostPath d={fullD} aria-hidden="true" />}
            {drawnD && <InkPath d={drawnD} aria-hidden="true" />}
            {penPoint && progress < steps.length && <PenMarker cx={penPoint.x} cy={penPoint.y} r={1} aria-hidden="true" />}

            {renderMarks(shape)}

            {hovered && hoveredStep !== null && (
              <g aria-hidden="true">
                {hovered.command === "M" ? (
                  <PenMarker cx={hovered.to.x} cy={hovered.to.y} r={1.6} style={{ "--marker-colour": "var(--book-pen)" } as CSSProperties} />
                ) : (
                  <PenSegment key={`${hoveredStep}-${stepSegmentData(hovered)}`} d={stepSegmentData(hovered)} pathLength={1} />
                )}
                <StepBadge transform={`translate(${hovered.to.x + 3} ${hovered.to.y - 3})`}>
                  <circle r={2} />
                  <text>{hoveredStep + 1}</text>
                </StepBadge>
              </g>
            )}

            {handles.map((handle) => (
              <HandleGroup
                key={handle.id}
                transform={`translate(${handle.point.x} ${handle.point.y})`}
                tabIndex={0}
                role="button"
                aria-roledescription="draggable handle"
                aria-label={handle.label}
                data-active={boolAttr(activeId === handle.id)}
                onPointerDown={startDrag(handle.id)}
                onKeyDown={(event) => handleKeyDown(handle, event)}
              >
                <circle className="handle-hit" r={3.5} />
                <circle className="handle-focus" r={2.8} />
                {handle.variant === "centre" ? (
                  <>
                    <path className="handle-mark" d="M -2.2 0 H 2.2 M 0 -2.2 V 2.2" />
                    <circle className="handle-mark" r={1} />
                  </>
                ) : (
                  <rect className="handle-mark" x={-1.1} y={-1.1} width={2.2} height={2.2} transform={handle.variant === "diamond" ? "rotate(45)" : undefined} />
                )}
              </HandleGroup>
            ))}
          </CanvasSvg>
        </CanvasFrame>

        <Legend aria-hidden="true">
          <LegendItem style={{ "--legend-colour": "color-mix(in srgb, var(--book-pencil) 45%, transparent)" } as CSSProperties}>{`Original <${shape.kind}>`}</LegendItem>
          <LegendItem style={{ "--legend-colour": "var(--book-ink)" } as CSSProperties}>Generated path</LegendItem>
          <LegendItem style={{ "--legend-colour": "var(--book-pen)" } as CSSProperties}>Hovered step</LegendItem>
        </Legend>

        <TeacherMark>
          {difference === null
            ? `✗ ${conversion.warning ?? "Nothing to draw."}`
            : difference <= 0.001 && bounds
              ? `✓ Both cover (${n(bounds.minX)}, ${n(bounds.minY)}) to (${n(bounds.maxX)}, ${n(bounds.maxY)}). Well done!`
              : `✗ Rounded to ${precision} dp, an edge is off by ${n(difference)}. Try more decimal places.`}
        </TeacherMark>

        <CanvasHint id={hintId}>
          Drag the ink handles, or Tab to one and use the arrow keys (Shift for a whole square). Drags snap to whole units; hold Alt for tenths.
        </CanvasHint>
      </SectionCard>
    </>
  );
}

ExerciseCanvas.displayName = "ExerciseCanvas";
