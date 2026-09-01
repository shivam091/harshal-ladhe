"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type JSX,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { clamp, normalize } from "@/utils/number";
import { range } from "@/utils/math";
import { useBoundingBox } from "@/hooks/use-bounding-box";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import Button from "@/components/Button";
import { PlayIcon, ClipboardIcon, CheckIcon, PlusIcon, CloseIcon, RefreshIcon } from "@/components/Icon";
import { LINEAR_EASING_PRESETS } from "@/constants/linear-easing-presets";
import type { LinearEasingStop } from "@/interfaces/linear-easing";
import type { LinearEasingPlaygroundProps } from "@/interfaces/linear-easing-playground";
import GraphFrame from "@/components/GraphFrame";
import {
  LINEAR_EASING_VALUE_MIN,
  LINEAR_EASING_VALUE_MAX,
  resolveLinearEasingStops,
  formatLinearEasing,
  solveLinearEasingY,
  buildLinearEasingPoints,
  toLinearPlotPoint,
  valueToPlotY,
  getPlotInset,
  pointerEventToLinearStop,
} from "@/utils/linear-easing";
import {
  Wrapper,
  GraphWrapper,
  GuideLine,
  Curve,
  Handle,
  Readout,
  Code,
  PreviewRow,
  PreviewTrack,
  PreviewBox,
  Ghost,
  Controls,
  SelectWrapper,
  Select,
  StopList,
  StopRow,
  StopLabel,
  NumberField,
  PinLabel,
} from "@/components/LinearEasingPlayground/LinearEasingPlayground.styles";

// Radius of each draggable stop handle, in the same px space as the plot's `size`.
const HANDLE_RADIUS = 7;

// How long the preview box takes to slide across the track on each Play.
const PREVIEW_DURATION_MS = 1400;

// PreviewBox's inline-size in px.
const PREVIEW_BOX_SIZE_PX = 24;

// Number of static ghost dots sampled across the track.
const GHOST_TRAIL_STEPS = 24;

// How long the readout's copy button shows its "copied" checkmark before reverting.
const COPY_RESET_DELAY_MS = 2000;

// The bounce-and-settle example used throughout the post — the exact stops from its very first linear() example. First/last are left auto (null) so the readout matches that example's minimal, redundant-percentage-free form.
const DEFAULT_STOPS: LinearEasingStop[] = [
  { id: "default-0", value: 0, position: null },
  { id: "default-1", value: 0.63, position: 25 },
  { id: "default-2", value: 0.9, position: 45 },
  { id: "default-3", value: 1.04, position: 65 },
  { id: "default-4", value: 1, position: null },
];

// Slides the preview box across the track once mounted, using the current linear() value as its timing function.
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

// Draggable, open-stop-count linear() editor — add, remove, pin, and drag stops, then copy the generated value.
export default function LinearEasingPlayground({
  initialStops = DEFAULT_STOPS,
  size = 260,
}: LinearEasingPlaygroundProps): JSX.Element {
  const [stops, setStops] = useState<LinearEasingStop[]>(initialStops);
  const [playKey, setPlayKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const [trackRef, trackBoundingBox] = useBoundingBox<HTMLDivElement>();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Cleanup for the active drag's window listeners.
  const dragCleanupRef = useRef<(() => void) | null>(null);
  // Timer for reverting the copy icon.
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Counter feeding fresh ids to stops inserted via "Add stop".
  const nextIdRef = useRef(initialStops.length);

  useEffect(() => () => dragCleanupRef.current?.(), []);
  useEffect(() => () => {
    if (copyResetRef.current) clearTimeout(copyResetRef.current);
  }, []);

  const resolvedStops = useMemo(() => resolveLinearEasingStops(stops), [stops]);
  // Kept alongside state so pointer-move/keyboard handlers can read the latest resolved layout without becoming a dependency of their own callbacks.
  const resolvedStopsRef = useRef(resolvedStops);
  useEffect(() => {
    resolvedStopsRef.current = resolvedStops;
  }, [resolvedStops]);

  const cssValue = formatLinearEasing(stops);
  const points = buildLinearEasingPoints(resolvedStops, size, LINEAR_EASING_VALUE_MIN, LINEAR_EASING_VALUE_MAX);
  const inset = getPlotInset(size);
  const zeroLineY = valueToPlotY(0, size, LINEAR_EASING_VALUE_MIN, LINEAR_EASING_VALUE_MAX);
  const oneLineY = valueToPlotY(1, size, LINEAR_EASING_VALUE_MIN, LINEAR_EASING_VALUE_MAX);

  const availableWidth = (trackBoundingBox?.width ?? 0) - PREVIEW_BOX_SIZE_PX;

  // Copies the current linear() value and briefly swaps the readout's icon to a checkmark.
  async function handleCopy() {
    await navigator.clipboard.writeText(cssValue);
    setIsCopied(true);

    if (copyResetRef.current) clearTimeout(copyResetRef.current);
    copyResetRef.current = setTimeout(() => setIsCopied(false), COPY_RESET_DELAY_MS);
  }

  // Starts a drag on the given stop's handle.
  const handlePointerDown = useCallback((event: ReactPointerEvent<SVGCircleElement>, index: number) => {
    event.preventDefault();
    const isBoundary = index === 0 || index === stops.length - 1;

    function handleMove(moveEvent: PointerEvent) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;

      const next = pointerEventToLinearStop(moveEvent.clientX, moveEvent.clientY, rect, size, LINEAR_EASING_VALUE_MIN, LINEAR_EASING_VALUE_MAX);

      setStops((previous) => previous.map((stop, i) => {
        if (i !== index) return stop;
        if (isBoundary || stop.position === null) return { ...stop, value: next.value };

        const resolved = resolvedStopsRef.current;
        const lowerBound = i > 0 ? resolved[i - 1].resolvedPosition : 0;
        const upperBound = i < resolved.length - 1 ? resolved[i + 1].resolvedPosition : 100;
        return { ...stop, value: next.value, position: clamp(next.position, lowerBound, upperBound) };
      }));
    }

    function handleUp() {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      dragCleanupRef.current = null;
    }

    dragCleanupRef.current = handleUp;
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }, [size, stops.length]);

  // Arrow-key nudging for a stop: up/down always adjusts value; left/right pins and adjusts position (disabled on the fixed first/last stops).
  function handleKeyDown(index: number) {
    return (event: ReactKeyboardEvent<SVGCircleElement>) => {
      const step = event.shiftKey ? 0.05 : 0.01;
      const isBoundary = index === 0 || index === stops.length - 1;

      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        const delta = event.key === "ArrowUp" ? step : -step;
        setStops((previous) => previous.map((stop, i) => (i === index ? { ...stop, value: clamp(stop.value + delta, LINEAR_EASING_VALUE_MIN, LINEAR_EASING_VALUE_MAX) } : stop)));
        return;
      }

      if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && !isBoundary) {
        event.preventDefault();
        const resolved = resolvedStopsRef.current;
        const lowerBound = resolved[index - 1].resolvedPosition;
        const upperBound = resolved[index + 1].resolvedPosition;
        const current = stops[index].position ?? resolved[index].resolvedPosition;
        const delta = (event.key === "ArrowRight" ? step : -step) * 100;
        const position = clamp(current + delta, lowerBound, upperBound);
        setStops((previous) => previous.map((stop, i) => (i === index ? { ...stop, position } : stop)));
      }
    };
  }

  // Inserts a new auto-spaced stop at the midpoint of the widest gap between existing stops.
  function handleAddStop() {
    const resolved = resolvedStopsRef.current;
    if (resolved.length < 2) return;

    let widestGap = -1;
    let gapIndex = 0;
    for (let i = 0; i < resolved.length - 1; i++) {
      const gap = resolved[i + 1].resolvedPosition - resolved[i].resolvedPosition;
      if (gap > widestGap) {
        widestGap = gap;
        gapIndex = i;
      }
    }

    const before = resolved[gapIndex];
    const after = resolved[gapIndex + 1];
    const midpointValue = Number(((before.value + after.value) / 2).toFixed(2));
    const newStop: LinearEasingStop = { id: `added-${nextIdRef.current++}`, value: midpointValue, position: null };

    setStops((previous) => {
      const next = [...previous];
      next.splice(gapIndex + 1, 0, newStop);
      return next;
    });
  }

  // Removes a non-boundary stop, keeping at least the fixed first and last.
  function handleRemoveStop(index: number) {
    setStops((previous) => previous.filter((_, i) => i !== index));
  }

  // Flips a non-boundary stop between auto-spaced (position: null) and pinned at its current resolved position.
  function handleTogglePin(index: number) {
    setStops((previous) => previous.map((stop, i) => {
      if (i !== index) return stop;
      if (stop.position !== null) return { ...stop, position: null };
      const resolvedPosition = resolvedStopsRef.current[i]?.resolvedPosition ?? 0;
      return { ...stop, position: Number(resolvedPosition.toFixed(1)) };
    }));
  }

  function handleValueInputChange(index: number, rawValue: number) {
    if (Number.isNaN(rawValue)) return;
    const value = clamp(rawValue, LINEAR_EASING_VALUE_MIN, LINEAR_EASING_VALUE_MAX);
    setStops((previous) => previous.map((stop, i) => (i === index ? { ...stop, value } : stop)));
  }

  function handlePositionInputChange(index: number, rawPosition: number) {
    if (Number.isNaN(rawPosition)) return;
    const resolved = resolvedStopsRef.current;
    const lowerBound = index > 0 ? resolved[index - 1].resolvedPosition : 0;
    const upperBound = index < resolved.length - 1 ? resolved[index + 1].resolvedPosition : 100;
    const position = clamp(rawPosition, lowerBound, upperBound);
    setStops((previous) => previous.map((stop, i) => (i === index ? { ...stop, position } : stop)));
  }

  // Loads a curated preset, replacing the current stop list entirely.
  function handlePresetChange(key: string) {
    const preset = LINEAR_EASING_PRESETS[key];
    if (!preset) return;
    setStops(preset.stops.map((stop) => ({ ...stop })));
    nextIdRef.current = preset.stops.length;
  }

  return (
    <>
      <Wrapper>
        <Controls>
          <SelectWrapper>
            <Select
              defaultValue=""
              onChange={(event) => {
                handlePresetChange(event.target.value);
                event.target.value = "";
              }}
              aria-label="Load a preset shape"
            >
              <option value="" disabled>
                Load a preset&hellip;
              </option>
              {Object.entries(LINEAR_EASING_PRESETS).map(([key, preset]) => (
                <option key={key} value={key}>
                  {preset.label}
                </option>
              ))}
            </Select>
          </SelectWrapper>

          <Button type="button" size="sm" variant="soft" intent="accent" iconLeft={<PlusIcon size={14} />} onClick={handleAddStop}>
            Add stop
          </Button>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            iconLeft={<RefreshIcon size={14} />}
            onClick={() => {
              setStops(initialStops.map((stop) => ({ ...stop })));
              nextIdRef.current = initialStops.length;
            }}
          >
            Reset
          </Button>
        </Controls>

        <GraphWrapper>
          <GraphFrame
            ref={svgRef}
            size={size}
            inset={inset}
            ariaLabel={`Draggable linear() editor with ${stops.length} stops, currently ${cssValue}`}
          >
            <GuideLine x1={inset} y1={zeroLineY} x2={size - inset} y2={zeroLineY} />
            <GuideLine x1={inset} y1={oneLineY} x2={size - inset} y2={oneLineY} />
            <Curve points={points} />
            {resolvedStops.map((stop, index) => {
              const [x, y] = toLinearPlotPoint(stop, size, LINEAR_EASING_VALUE_MIN, LINEAR_EASING_VALUE_MAX);
              return (
                <Handle
                  key={stop.id}
                  cx={x}
                  cy={y}
                  r={HANDLE_RADIUS}
                  tabIndex={0}
                  data-auto={stop.position === null || undefined}
                  onPointerDown={(event) => handlePointerDown(event, index)}
                  onKeyDown={handleKeyDown(index)}
                  aria-label={`Stop ${index + 1}, value ${stop.value.toFixed(2)}, ${stop.position === null ? `auto-spaced around ${stop.resolvedPosition.toFixed(0)}%` : `pinned at ${stop.position.toFixed(0)}%`}. Drag or use arrow keys to adjust, hold shift for larger steps.`}
                />
              );
            })}
          </GraphFrame>
        </GraphWrapper>

        <Readout>
          <Code>{cssValue}</Code>
          <Button
            type="button"
            size="sm"
            shape="square"
            onClick={handleCopy}
            aria-label={isCopied ? "Copied" : "Copy linear() value"}
          >
            {isCopied ? <CheckIcon size={14} stroke="var(--color-fg-success)" /> : <ClipboardIcon size={14} />}
          </Button>
        </Readout>

        <PreviewRow>
          <PreviewTrack ref={trackRef} aria-hidden="true">
            {trackBoundingBox &&
              range(0, GHOST_TRAIL_STEPS - 1).map((step) => {
                const t = step / (GHOST_TRAIL_STEPS - 1);
                const offset = normalize(solveLinearEasingY(t, resolvedStops), 0, 1, 0, availableWidth);
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
            disabled={isPlaying || prefersReducedMotion}
            aria-label={prefersReducedMotion ? "Motion reduced — play disabled" : "Play preview"}
          >
            <PlayIcon size={18} />
          </Button>
        </PreviewRow>

        <StopList>
          {stops.map((stop, index) => {
            const isBoundary = index === 0 || index === stops.length - 1;
            const resolved = resolvedStops[index];

            return (
              <StopRow key={stop.id}>
                <StopLabel>Stop {index + 1}</StopLabel>

                <label>
                  <StopLabel>value</StopLabel>{" "}
                  <NumberField
                    type="number"
                    step={0.01}
                    value={stop.value}
                    onChange={(event) => handleValueInputChange(index, Number(event.target.value))}
                    aria-label={`Stop ${index + 1} value`}
                  />
                </label>

                {isBoundary ? (
                  <StopLabel>fixed at {resolved.resolvedPosition.toFixed(0)}%</StopLabel>
                ) : (
                  <PinLabel>
                    <input
                      type="checkbox"
                      checked={stop.position !== null}
                      onChange={() => handleTogglePin(index)}
                      aria-label={`Pin stop ${index + 1} to an exact percentage`}
                    />
                    pin at
                    <NumberField
                      type="number"
                      step={0.1}
                      min={0}
                      max={100}
                      disabled={stop.position === null}
                      value={stop.position ?? Number(resolved.resolvedPosition.toFixed(1))}
                      onChange={(event) => handlePositionInputChange(index, Number(event.target.value))}
                      aria-label={`Stop ${index + 1} position percent`}
                    />
                    %
                  </PinLabel>
                )}

                {!isBoundary && stops.length > 2 && (
                  <Button
                    type="button"
                    size="sm"
                    shape="square"
                    variant="ghost"
                    intent="danger"
                    onClick={() => handleRemoveStop(index)}
                    aria-label={`Remove stop ${index + 1}`}
                  >
                    <CloseIcon size={12} />
                  </Button>
                )}
              </StopRow>
            );
          })}
        </StopList>
      </Wrapper>
    </>
  );
}

LinearEasingPlayground.displayName = "LinearEasingPlayground";
