"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, JSX, KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { clamp } from "@/utils/number";
import { range } from "@/utils/math";
import { solveBezierY, toPlotPoint } from "@/utils/bezier";
import type { BezierPoint } from "@/utils/bezier";
import { useBoundingBox } from "@/hooks/use-bounding-box";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import Button from "@/components/Button";
import BezierGraph from "@/components/BezierGraph";
import { PlayIcon, ClipboardIcon, CheckIcon } from "@/components/Icon";
import PreviewSlide from "@/components/CubicBezierPlayground/PreviewSlide";
import type { CubicBezierPlaygroundProps } from "@/components/CubicBezierPlayground/CubicBezierPlayground.types";
import { pointerEventToPoint, formatCubicBezier } from "@/components/CubicBezierPlayground/CubicBezierPlayground.helpers";
import {
  Wrapper,
  GraphWrapper,
  GuideLine,
  Handle,
  PreviewRow,
  PreviewTrack,
  PreviewBox,
  Ghost,
  Readout,
  Code
} from "@/components/CubicBezierPlayground/CubicBezierPlayground.styles";

// Slightly larger than the linear() handles, since there are only ever two to grab.
const HANDLE_RADIUS = 8;

// Must match PreviewBox's 1.5rem size so the box stops flush with the track's end.
const PREVIEW_BOX_SIZE_PX = 24;

// Few enough that each dot stays distinct on a narrow track.
const GHOST_TRAIL_STEPS = 10;

// Long enough to notice the confirmation without it lingering.
const COPY_RESET_DELAY_MS = 2000;

// Moving the two control points by hand is the fastest way to learn what each one does.
export default function CubicBezierPlayground({ initialP1 = [0.65, 0], initialP2 = [0.35, 1], size = 260 }: CubicBezierPlaygroundProps): JSX.Element {
  const [p1, setP1] = useState<BezierPoint>(initialP1);
  const [p2, setP2] = useState<BezierPoint>(initialP2);
  const [playKey, setPlayKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const [trackRef, trackBoundingBox] = useBoundingBox<HTMLDivElement>();
  const prefersReducedMotion = usePrefersReducedMotion();
  // Lets an unmount mid-drag remove its window listeners.
  const dragCleanupRef = useRef<(() => void) | null>(null);
  // Cleared on unmount so the icon reset never fires after the component is gone.
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => dragCleanupRef.current?.(), []);
  useEffect(() => () => {
    if (copyResetRef.current) {
      clearTimeout(copyResetRef.current);
    }
  }, []);

  const cssValue = formatCubicBezier(p1, p2);
  // Guides start at the curve's own anchors, which sit inset from the axis corners.
  const [startX, startY] = toPlotPoint([0, 0], size);
  const [endX, endY] = toPlotPoint([1, 1], size);
  const [x1, y1] = toPlotPoint(p1, size);
  const [x2, y2] = toPlotPoint(p2, size);

  const availableWidth = (trackBoundingBox?.width ?? 0) - PREVIEW_BOX_SIZE_PX;

  // Swaps to a tick briefly so readers know the copy worked, without a toast.
  async function handleCopy() {
    await navigator.clipboard.writeText(cssValue);
    setIsCopied(true);

    if (copyResetRef.current) clearTimeout(copyResetRef.current);
    copyResetRef.current = setTimeout(() => setIsCopied(false), COPY_RESET_DELAY_MS);
  }

  // Listens on window rather than the handle, so a fast drag that slips off the handle isn't dropped.
  const handlePointerDown = useCallback((event: ReactPointerEvent<SVGCircleElement>, point: "p1" | "p2") => {
    event.preventDefault();

    function handleMove(moveEvent: PointerEvent) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;

      const next = pointerEventToPoint(moveEvent.clientX, moveEvent.clientY, rect, size);
      if (point === "p1") setP1(next); else setP2(next);
    }

    function handleUp() {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      dragCleanupRef.current = null;
    }

    dragCleanupRef.current = handleUp;
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }, [size]);

  // Gives keyboard users the same control as dragging, within the same limits.
  function handleKeyDown(point: "p1" | "p2") {
    return (event: ReactKeyboardEvent<SVGCircleElement>) => {
      const step = event.shiftKey ? 0.05 : 0.01;
      const deltasByKey: Record<string, BezierPoint> = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, step],
        ArrowDown: [0, -step],
      };

      const delta = deltasByKey[event.key];
      if (!delta) return;
      event.preventDefault();

      const current = point === "p1" ? p1 : p2;
      const next: BezierPoint = [clamp(current[0] + delta[0], 0, 1), clamp(current[1] + delta[1], -1, 2)];
      if (point === "p1") setP1(next); else setP2(next);
    };
  }

  return (
    <>
      <Wrapper>
        <GraphWrapper>
          <BezierGraph
            ref={svgRef}
            p1={p1}
            p2={p2}
            size={size}
            ariaLabel={`Draggable cubic-bezier editor, currently ${cssValue}`}
          >
            <GuideLine x1={startX} y1={startY} x2={x1} y2={y1} />
            <GuideLine x1={endX} y1={endY} x2={x2} y2={y2} />
            <Handle
              cx={x1}
              cy={y1}
              r={HANDLE_RADIUS}
              tabIndex={0}
              onPointerDown={(event) => handlePointerDown(event, "p1")}
              onKeyDown={handleKeyDown("p1")}
              aria-label={`Control point 1, x ${p1[0].toFixed(2)}, y ${p1[1].toFixed(2)}. Drag or use arrow keys to adjust, hold shift for larger steps.`}
            />
            <Handle
              cx={x2}
              cy={y2}
              r={HANDLE_RADIUS}
              tabIndex={0}
              onPointerDown={(event) => handlePointerDown(event, "p2")}
              onKeyDown={handleKeyDown("p2")}
              aria-label={`Control point 2, x ${p2[0].toFixed(2)}, y ${p2[1].toFixed(2)}. Drag or use arrow keys to adjust, hold shift for larger steps.`}
            />
          </BezierGraph>
        </GraphWrapper>

        <Readout>
          <Code>{cssValue}</Code>
          <Button
            type="button"
            size="sm"
            shape="square"
            onClick={handleCopy}
            aria-label={isCopied ? "Copied" : "Copy cubic-bezier() value"}
          >
            {isCopied ? <CheckIcon size={14} stroke="var(--color-fg-success)" /> : <ClipboardIcon size={14} />}
          </Button>
        </Readout>

        <PreviewRow>
          <PreviewTrack ref={trackRef} aria-hidden="true">
            {trackBoundingBox &&
              range(0, GHOST_TRAIL_STEPS - 1).map((step) => {
                const t = step / (GHOST_TRAIL_STEPS - 1);
                const offset = solveBezierY(t, p1, p2) * availableWidth;
                // Tints the first and last dots so the trail's start and end points read at a glance.
                const isEndpoint = step === 0 || step === GHOST_TRAIL_STEPS - 1;
                return (
                  <Ghost
                    key={step}
                    data-endpoint={isEndpoint || undefined}
                    style={{ "--offset": `${offset}px` } as CSSProperties}
                  />
                );
              })}
            {trackBoundingBox &&
              (playKey > 0 ? (
                <PreviewSlide
                  key={playKey}
                  cssValue={cssValue}
                  travelDistance={availableWidth}
                  onDone={() => setIsPlaying(false)}
                />
              ) : (
                <PreviewBox style={{ transform: "translate(0, -50%)" }} />
              ))}
          </PreviewTrack>

          <Button
            type="button"
            size="lg"
            shape="square"
            onClick={() => {
              setIsPlaying(true);
              setPlayKey((key) => key + 1);
            }}
            disabled={isPlaying || prefersReducedMotion}
            aria-label={prefersReducedMotion ? "Motion reduced — play disabled" : "Play preview"}
          >
            <PlayIcon size={18} />
          </Button>
        </PreviewRow>
      </Wrapper>
    </>
  );
}

CubicBezierPlayground.displayName = "CubicBezierPlayground";
