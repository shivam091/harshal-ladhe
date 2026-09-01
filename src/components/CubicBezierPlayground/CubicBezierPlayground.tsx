"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type JSX,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { clamp } from "@/utils/number";
import { range } from "@/utils/math";
import { solveBezierY, toPlotPoint } from "@/utils/bezier";
import { useBoundingBox } from "@/hooks/use-bounding-box";
import Button from "@/components/Button";
import BezierGraph from "@/components/BezierGraph";
import { PlayIcon, ClipboardIcon, CheckIcon } from "@/components/Icon";
import type { BezierPoint } from "@/types/bezier";
import type { CubicBezierPlaygroundProps } from "@/interfaces/cubic-bezier-playground";
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
  Code,
} from "@/components/CubicBezierPlayground/CubicBezierPlayground.styles";

// Radius of each draggable control-point handle, in the same px space as the plot's `size`.
const HANDLE_RADIUS = 8;

// How long the preview box takes to slide across the track on each Play.
const PREVIEW_DURATION_MS = 900;

// PreviewBox's inline-size in px.
const PREVIEW_BOX_SIZE_PX = 24;

// Number of static ghost dots sampled across the track.
const GHOST_TRAIL_STEPS = 10;

// How long the readout's copy button shows its "copied" checkmark before reverting.
const COPY_RESET_DELAY_MS = 2000;

// Slides the preview box across the track once mounted.
function PreviewSlide({
  cssValue,
  travelDistance,
  onDone,
}: {
  cssValue: string;
  travelDistance: number;
  onDone: () => void;
}): JSX.Element {
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setHasStarted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <PreviewBox
        onTransitionEnd={onDone}
        style={{
          transform: `translate(${hasStarted ? travelDistance : 0}px, -50%)`,
          transitionProperty: "transform",
          transitionDuration: `${PREVIEW_DURATION_MS}ms`,
          transitionTimingFunction: cssValue,
        }}
      />
    </>
  );
}

// Draggable two-handle cubic-bezier() editor.
export default function CubicBezierPlayground({
  initialP1 = [0.65, 0],
  initialP2 = [0.35, 1],
  size = 260,
}: CubicBezierPlaygroundProps): JSX.Element {
  const [p1, setP1] = useState<BezierPoint>(initialP1);
  const [p2, setP2] = useState<BezierPoint>(initialP2);
  const [playKey, setPlayKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const [trackRef, trackBoundingBox] = useBoundingBox<HTMLDivElement>();
  // Cleanup for the active drag's window listeners.
  const dragCleanupRef = useRef<(() => void) | null>(null);
  // Timer for reverting the copy icon.
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => dragCleanupRef.current?.(), []);
  useEffect(() => () => {
    if (copyResetRef.current) clearTimeout(copyResetRef.current);
  }, []);

  const cssValue = formatCubicBezier(p1, p2);
  const [x1, y1] = toPlotPoint(p1, size);
  const [x2, y2] = toPlotPoint(p2, size);

  const availableWidth = (trackBoundingBox?.width ?? 0) - PREVIEW_BOX_SIZE_PX;

  // Copies the current cubic-bezier() value and briefly swaps the readout's icon to a checkmark.
  async function handleCopy() {
    await navigator.clipboard.writeText(cssValue);
    setIsCopied(true);

    if (copyResetRef.current) clearTimeout(copyResetRef.current);
    copyResetRef.current = setTimeout(() => setIsCopied(false), COPY_RESET_DELAY_MS);
  }

  // Starts a drag on the given control point.
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

  // Arrow-key nudging for the given control point.
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
            <GuideLine x1={0} y1={size} x2={x1} y2={y1} />
            <GuideLine x1={size} y1={0} x2={x2} y2={y2} />
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
                return <Ghost key={step} style={{ "--offset": `${offset}px` } as CSSProperties} />;
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
            disabled={isPlaying}
            aria-label="Play preview"
          >
            <PlayIcon size={18} />
          </Button>
        </PreviewRow>
      </Wrapper>
    </>
  );
}

CubicBezierPlayground.displayName = "CubicBezierPlayground";
