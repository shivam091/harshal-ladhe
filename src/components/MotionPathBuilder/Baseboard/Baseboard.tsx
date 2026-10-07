"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, JSX, KeyboardEvent, MouseEvent, PointerEvent } from "react";
import { usePointDrag } from "@/hooks/use-point-drag";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useRequestAnimationFrameLoop } from "@/hooks/use-request-animation-frame-loop";
import {
  GLYPH_HEIGHT,
  GLYPH_LABELS,
  GLYPH_WIDTH,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  buildPathData,
  directionMarkers,
  flattenPath,
  ghostTrail,
  offsetAnchorCss,
  pointAtFraction,
  resolveEasingCss,
  resolveOffsetRotate,
  timelineMs
} from "@/components/MotionPathBuilder/MotionPathBuilder.utils";
import { incomingControlPoint, outgoingControlPoint } from "@/utils/svg-path";
import Glyph from "@/components/MotionPathBuilder/Glyph/Glyph";
import PlaybackBar from "@/components/MotionPathBuilder/PlaybackBar/PlaybackBar";
import {
  BoardCard,
  BoardFrame,
  Stage,
  TrackSvg,
  Ballast,
  Sleepers,
  RailSteel,
  RailGap,
  Chevron,
  BufferStop,
  GhostMarker,
  EdgeHit,
  HandleLine,
  Pin,
  HandleDot,
  Loco,
  AnchorMark,
  BoardCaption
} from "@/components/MotionPathBuilder/Baseboard/Baseboard.styles";
import type { BaseboardProps, MotionPathPoint, MotionPathSelection } from "@/components/MotionPathBuilder/MotionPathBuilder.types";

// Arrow-key nudge sizes, in baseboard units — one for fine placement, ten with Shift for crossing the board quickly.
const NUDGE = 1;
const NUDGE_FAST = 10;

// Half a handle square's side.
const HANDLE_HALF = 4;

// The scrubber's resolution — must match PlaybackBar's own range max.
const SCRUB_STEPS = 1000;

// data-* booleans render as the string "false" when false; this keeps idle pins free of stray attributes.
function boolAttr(value: boolean): "true" | undefined {
  return value ? "true" : undefined;
}

// Converts usePointDrag's 0–100 percentages back into baseboard units.
function percentToStage(point: MotionPathPoint): MotionPathPoint {
  return { x: (point.x / 100) * STAGE_WIDTH, y: (point.y / 100) * STAGE_HEIGHT };
}

// A pointer position on the (scaled) board in baseboard units — the board is scaled by a transform, so its on-screen rect is what maps back.
function eventToStage(event: MouseEvent<Element>, element: Element): MotionPathPoint {
  const { left, top, width, height } = element.getBoundingClientRect();
  return { x: ((event.clientX - left) / width) * STAGE_WIDTH, y: ((event.clientY - top) / height) * STAGE_HEIGHT };
}

// Whether a selection points at the given pin part — drives the brass highlight.
function isSelected(selection: MotionPathSelection | null, vertexIndex: number, part: MotionPathSelection["part"]): boolean {
  return selection?.vertexIndex === vertexIndex && selection.part === part;
}

/*
  The layout itself: the track drawn on felt, editable pins and handles, a ghost trail, and the
  loco running on real CSS offset-path via the Web Animations API (so play, pause and scrub are
  just calls on one Animation object). The stage stays at its true pixel size and is scaled with a
  transform, so the preview runs the exact path() string the CSS export writes out.
*/
export default function Baseboard({ state, actions }: BaseboardProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const locoRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  // Where the run had got to when its settings last changed, so tweaking a control doesn't throw the loco back to the start.
  const savedTimeRef = useRef(0);
  const timingRef = useRef({ total: 1, delay: 0, infinite: false });
  const scrubRef = useRef<HTMLInputElement | null>(null);
  const readoutRef = useRef<HTMLOutputElement | null>(null);
  const [scale, setScale] = useState(1);
  // No autoplay when reduced motion is requested — the loco waits at the start until someone presses play.
  const [isPlaying, setIsPlaying] = useState(() => !prefersReducedMotion);
  const playingRef = useRef(isPlaying);

  const { vertices, closed, selection } = state;
  const d = useMemo(() => buildPathData(vertices, closed), [vertices, closed]);
  const flat = useMemo(() => flattenPath(vertices, closed), [vertices, closed]);
  const chevrons = useMemo(() => directionMarkers(flat), [flat]);
  const ghosts = useMemo(() => ghostTrail(flat, state), [flat, state]);
  const startSample = useMemo(() => pointAtFraction(flat, 0), [flat]);
  const endSample = useMemo(() => pointAtFraction(flat, 1), [flat]);
  const easingCss = resolveEasingCss(state.easing, state.bezier);
  const { startDistance, endDistance, duration, delay, iterations, infinite, direction } = state;

  // Mirrors the play state for the animation effect, which must not re-create the Animation just because play was pressed.
  useEffect(() => {
    playingRef.current = isPlaying;
  }, [isPlaying]);

  // Tracks the frame's width so the fixed-size stage can be scaled to fill it.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / STAGE_WIDTH));
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  // Moves the scrub thumb and time readout to match the animation — called every frame while playing and once after any change while paused.
  const syncReadout = useCallback(() => {
    const animation = animationRef.current;
    const { total, delay: delayMs, infinite: endless } = timingRef.current;
    const raw = typeof animation?.currentTime === "number" ? animation.currentTime : 0;
    const elapsed = endless && raw > total && total > delayMs ? delayMs + ((raw - delayMs) % (total - delayMs)) : Math.min(raw, total);
    if (scrubRef.current) scrubRef.current.value = String(Math.round((elapsed / total) * SCRUB_STEPS));
    if (readoutRef.current) readoutRef.current.textContent = `${(elapsed / 1000).toFixed(2)} s`;
  }, []);

  useRequestAnimationFrameLoop(syncReadout, isPlaying);

  /*
    Builds one Animation on offset-distance whenever the timetable changes. The path, rotation and
    anchor are plain inline styles, so dragging a pin never restarts the run; only timing changes
    do, and those resume from wherever the loco had got to.
  */
  useEffect(() => {
    const loco = locoRef.current;
    timingRef.current = { total: Math.max(timelineMs({ delay, duration, iterations, infinite, direction }), 1), delay: delay * 1000, infinite };
    if (!loco || typeof loco.animate !== "function") return;

    const animation = loco.animate([{ offsetDistance: `${startDistance}%` }, { offsetDistance: `${endDistance}%` }], {
      duration: duration * 1000,
      delay: delay * 1000,
      iterations: infinite ? Infinity : iterations,
      direction,
      easing: easingCss,
      fill: "both"
    });
    animation.currentTime = infinite ? savedTimeRef.current : Math.min(savedTimeRef.current, timingRef.current.total);
    if (!playingRef.current) animation.pause();
    animation.onfinish = () => setIsPlaying(false);
    animationRef.current = animation;
    syncReadout();

    return () => {
      savedTimeRef.current = typeof animation.currentTime === "number" ? animation.currentTime : 0;
      animation.onfinish = null;
      animation.cancel();
      if (animationRef.current === animation) animationRef.current = null;
    };
  }, [startDistance, endDistance, duration, delay, iterations, infinite, direction, easingCss, syncReadout]);

  // Play from wherever the loco is, or from the start once a finite run has finished.
  function togglePlay() {
    const animation = animationRef.current;
    if (!animation) return;
    if (isPlaying) {
      animation.pause();
      setIsPlaying(false);
    } else {
      if (animation.playState === "finished") animation.currentTime = 0;
      animation.play();
      setIsPlaying(true);
    }
  }

  // Back to the departure point without changing whether it's running.
  function restart() {
    const animation = animationRef.current;
    if (!animation) return;
    animation.currentTime = 0;
    if (isPlaying) animation.play();
    syncReadout();
  }

  // Scrubbing pauses the run and parks the loco at that moment, the way dragging a video's playhead does.
  function scrub(fraction: number) {
    const animation = animationRef.current;
    if (!animation) return;
    animation.pause();
    setIsPlaying(false);
    animation.currentTime = fraction * timingRef.current.total;
    syncReadout();
  }

  const { activeId, startDrag, handlePointerMove, handlePointerUp } = usePointDrag({
    containerRef: svgRef,
    onDrag: (id, point, modifiers) => {
      const stagePoint = percentToStage(point);
      if (id.startsWith("pin-")) {
        actions.updateVertexPoint(Number(id.slice("pin-".length)), stagePoint);
      } else if (id.startsWith("handle-")) {
        const [, indexText, which] = id.split("-");
        actions.updateVertexHandle(Number(indexText), which === "in" ? "handleIn" : "handleOut", stagePoint, modifiers.altKey);
      }
    },
    onDragEnd: () => actions.commitEdit()
  });

  // A click on bare felt (not a pin, handle or rail) lays the next pin after the last one.
  function handleBoardClick(event: MouseEvent<SVGSVGElement>) {
    if (event.target !== event.currentTarget) return;
    actions.appendVertex(eventToStage(event, event.currentTarget));
  }

  // Starts a drag on a pin or handle, selecting and focusing it so the keyboard can carry on from where the pointer left off.
  function beginDrag(id: string, nextSelection: MotionPathSelection) {
    return (event: PointerEvent<SVGElement>) => {
      const target = event.currentTarget;
      actions.select(nextSelection);
      startDrag(id)(event);
      target.focus({ preventScroll: true });
    };
  }

  // Selects on focus too, so tabbing to a pin makes it the one arrow keys move — skipped when it's already selected to avoid a redundant state update.
  function focusSelect(nextSelection: MotionPathSelection) {
    return () => {
      if (!isSelected(selection, nextSelection.vertexIndex, nextSelection.part)) actions.select(nextSelection);
    };
  }

  // Puts focus back on a pin after an edit that re-rendered it (deleting, or toggling corner/smooth), so keyboard users never lose their place.
  function refocusPin(index: number) {
    window.requestAnimationFrame(() => {
      svgRef.current?.querySelector<SVGElement>(`[data-pin="${index}"]`)?.focus({ preventScroll: true });
    });
  }

  // Keyboard editing for one pin or handle: arrows nudge, Delete removes a pin, S flips smooth/corner, Escape deselects.
  function handleKeyDown(index: number, part: MotionPathSelection["part"]) {
    return (event: KeyboardEvent<SVGElement>) => {
      const vertex = vertices[index];
      if (!vertex) return;

      if (part === "point" && (event.key === "Delete" || event.key === "Backspace")) {
        event.preventDefault();
        actions.deleteVertex(index);
        refocusPin(Math.min(index, vertices.length - 2));
        return;
      }
      if (part === "point" && event.key.toLowerCase() === "s" && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        actions.toggleVertexCurve(index);
        refocusPin(index);
        return;
      }
      if (event.key === "Escape") {
        actions.select(null);
        return;
      }

      const step = event.shiftKey ? NUDGE_FAST : NUDGE;
      const deltas: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
      const delta = deltas[event.key];
      if (!delta) return;
      event.preventDefault();

      if (part === "point") {
        actions.updateVertexPoint(index, { x: vertex.point.x + delta[0], y: vertex.point.y + delta[1] });
      } else if (vertex.type === "curve") {
        const handle = vertex[part];
        actions.updateVertexHandle(index, part, { x: handle.x + delta[0], y: handle.y + delta[1] }, event.altKey);
      }
      actions.commitEdit();
    };
  }

  const edgeCount = closed ? vertices.length : vertices.length - 1;
  const locoStyle: CSSProperties = {
    offsetPath: `path("${d}")`,
    offsetRotate: resolveOffsetRotate(state),
    offsetAnchor: offsetAnchorCss(state),
    offsetDistance: `${startDistance}%`
  };

  return (
    <>
      <BoardCard>
        <BoardFrame ref={frameRef}>
          <Stage style={{ transform: `scale(${scale})` }}>
            <TrackSvg
              ref={svgRef}
              viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`}
              role="group"
              aria-label="Baseboard. Click bare felt to lay a pin after the last one, click the rails to insert a pin. Tab to a pin, then use the arrow keys to move it (Shift for bigger steps), S to switch between smooth and corner, and Delete to pull it up."
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onClick={handleBoardClick}
            >
              <Ballast d={d} />
              <Sleepers d={d} strokeWidth={17} />
              <RailSteel d={d} />
              <RailGap d={d} />
              <Sleepers d={d} strokeWidth={6} />

              {chevrons.map((marker, index) => (
                <Chevron key={index} d="M -2.5 -3 L 1.5 0 L -2.5 3" transform={`translate(${marker.x} ${marker.y}) rotate(${marker.angle})`} />
              ))}

              {!closed && (
                <>
                  <BufferStop transform={`translate(${startSample.x} ${startSample.y}) rotate(${startSample.angle})`}>
                    <rect x={-9} y={-11} width={4} height={22} rx={1} />
                  </BufferStop>
                  <BufferStop transform={`translate(${endSample.x} ${endSample.y}) rotate(${endSample.angle})`}>
                    <rect x={5} y={-11} width={4} height={22} rx={1} />
                  </BufferStop>
                </>
              )}
              <BufferStop>
                <text x={startSample.x} y={startSample.y - 16} textAnchor="middle">
                  {closed ? "START / END" : "START"}
                </text>
                {!closed && (
                  <text x={endSample.x} y={endSample.y - 16} textAnchor="middle">
                    END
                  </text>
                )}
              </BufferStop>

              {ghosts.map((ghost, index) => (
                <GhostMarker
                  key={index}
                  transform={`translate(${ghost.x} ${ghost.y}) rotate(${ghost.angle}) translate(${(-state.anchorX / 100) * GLYPH_WIDTH} ${(-state.anchorY / 100) * GLYPH_HEIGHT})`}
                >
                  <Glyph glyph={state.glyph} customGlyph={state.customGlyph} />
                </GhostMarker>
              ))}

              {Array.from({ length: edgeCount }, (_, index) => {
                const current = vertices[index];
                const next = vertices[(index + 1) % vertices.length];
                const c1 = outgoingControlPoint(current);
                const c2 = incomingControlPoint(next);
                return (
                  <EdgeHit
                    key={index}
                    d={`M ${current.point.x} ${current.point.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${next.point.x} ${next.point.y}`}
                    onClick={(event) => {
                      const svg = svgRef.current;
                      if (svg) actions.insertVertexAfter(index, eventToStage(event, svg));
                    }}
                  />
                );
              })}

              {vertices.map((vertex, index) => (
                <g key={index}>
                  {vertex.type === "curve" && (
                    <>
                      <HandleLine x1={vertex.point.x} y1={vertex.point.y} x2={vertex.handleIn.x} y2={vertex.handleIn.y} />
                      <HandleLine x1={vertex.point.x} y1={vertex.point.y} x2={vertex.handleOut.x} y2={vertex.handleOut.y} />
                      {(["handleIn", "handleOut"] as const).map((part) => (
                        <HandleDot
                          key={part}
                          x={vertex[part].x - HANDLE_HALF}
                          y={vertex[part].y - HANDLE_HALF}
                          width={HANDLE_HALF * 2}
                          height={HANDLE_HALF * 2}
                          tabIndex={0}
                          role="button"
                          aria-label={`${part === "handleIn" ? "Incoming" : "Outgoing"} handle of pin ${index + 1}, at ${Math.round(vertex[part].x)}, ${Math.round(vertex[part].y)}. Arrow keys move it; hold Alt to break the mirror.`}
                          data-selected={boolAttr(isSelected(selection, index, part))}
                          onPointerDown={beginDrag(`handle-${index}-${part === "handleIn" ? "in" : "out"}`, { vertexIndex: index, part })}
                          onFocus={focusSelect({ vertexIndex: index, part })}
                          onKeyDown={handleKeyDown(index, part)}
                        />
                      ))}
                    </>
                  )}
                  <Pin
                    cx={vertex.point.x}
                    cy={vertex.point.y}
                    r={6.5}
                    tabIndex={0}
                    role="button"
                    data-pin={index}
                    aria-label={`Track pin ${index + 1} of ${vertices.length}, ${vertex.type === "curve" ? "smooth" : "corner"}, at ${Math.round(vertex.point.x)}, ${Math.round(vertex.point.y)}.`}
                    data-selected={boolAttr(isSelected(selection, index, "point"))}
                    data-corner={boolAttr(vertex.type === "straight")}
                    data-active={boolAttr(activeId === `pin-${index}`)}
                    onPointerDown={beginDrag(`pin-${index}`, { vertexIndex: index, part: "point" })}
                    onFocus={focusSelect({ vertexIndex: index, part: "point" })}
                    onKeyDown={handleKeyDown(index, "point")}
                    onDoubleClick={() => actions.toggleVertexCurve(index)}
                  />
                </g>
              ))}
            </TrackSvg>

            <Loco ref={locoRef} style={locoStyle} aria-hidden="true">
              <svg width={GLYPH_WIDTH} height={GLYPH_HEIGHT} viewBox={`0 0 ${GLYPH_WIDTH} ${GLYPH_HEIGHT}`} fill="currentColor">
                <Glyph glyph={state.glyph} customGlyph={state.customGlyph} />
              </svg>
              <AnchorMark style={{ left: `${state.anchorX}%`, top: `${state.anchorY}%` }} />
            </Loco>
          </Stage>
        </BoardFrame>

        <PlaybackBar
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onRestart={restart}
          onScrub={scrub}
          scrubRef={(element) => {
            scrubRef.current = element;
          }}
          readoutRef={(element) => {
            readoutRef.current = element;
          }}
        />

        <BoardCaption>
          {GLYPH_LABELS[state.glyph]} on a {STAGE_WIDTH} × {STAGE_HEIGHT} px baseboard · {vertices.length} pins · {closed ? "closed loop" : "open line"} · track length{" "}
          {Math.round(flat.total)} px. Faint ghosts mark equal slices of time, so they bunch up wherever the easing slows the loco down.
        </BoardCaption>
      </BoardCard>
    </>
  );
}

Baseboard.displayName = "Baseboard";
