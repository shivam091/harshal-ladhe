"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, JSX, KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { clamp, normalize } from "@/utils/number";
import { range } from "@/utils/math";
import { useBoundingBox } from "@/hooks/use-bounding-box";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import Button from "@/components/Button";
import RemoveButton from "@/components/RemoveButton";
import Select from "@/components/Select";
import { PlayIcon, ClipboardIcon, CheckIcon, PlusIcon, RefreshIcon } from "@/components/Icon";
import PreviewSlide from "@/components/LinearEasingPlayground/PreviewSlide";
import StopNumberInput from "@/components/LinearEasingPlayground/StopNumberInput";
import { LINEAR_EASING_PRESETS } from "@/constants/linear-easing-presets";
import type { LinearEasingPlaygroundProps } from "@/components/LinearEasingPlayground/LinearEasingPlayground.types";
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
  pointerEventToLinearStop
} from "@/utils/linear-easing";
import type { LinearEasingStop } from "@/utils/linear-easing";
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
  ControlButton,
  StopList,
  StopRow,
  StopLabel,
  PinLabel
} from "@/components/LinearEasingPlayground/LinearEasingPlayground.styles";

// Big enough to grab comfortably, small enough that neighbouring stops don't overlap.
const HANDLE_RADIUS = 7;

// Must match PreviewBox's 1.5rem size so the box stops flush with the track's end.
const PREVIEW_BOX_SIZE_PX = 24;

// Denser than the race trails, since a linear() curve can change direction between samples.
const GHOST_TRAIL_STEPS = 24;

// Long enough to notice the confirmation without it lingering.
const COPY_RESET_DELAY_MS = 2000;

// Built once, since the presets never change at runtime.
const PRESET_OPTIONS = Object.entries(LINEAR_EASING_PRESETS).map(([key, preset]) => ({ value: key, label: preset.label }));

// Each preset's CSS, so the picker can tick whichever preset the current curve still exactly matches.
const PRESET_CSS_VALUES = Object.entries(LINEAR_EASING_PRESETS).map(([key, preset]) => [key, formatLinearEasing(preset.stops)] as const);

// Opens on the post's running overshoot-and-settle example so the readout matches code readers have just seen; first/last stay unpinned to keep it free of redundant percentages.
const DEFAULT_STOPS: LinearEasingStop[] = [
  { id: "default-0", value: 0, position: null },
  { id: "default-1", value: 0.63, position: 25 },
  { id: "default-2", value: 0.9, position: 45 },
  { id: "default-3", value: 1.04, position: 65 },
  { id: "default-4", value: 1, position: null },
];

// Dragging stops builds an intuition for linear() that a table of percentages alone can't.
export default function LinearEasingPlayground({ initialStops = DEFAULT_STOPS, size = 260 }: LinearEasingPlaygroundProps): JSX.Element {
  const [stops, setStops] = useState<LinearEasingStop[]>(initialStops);
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
  // Fresh ids stop React reusing a removed stop's handle for a newly added one.
  const nextIdRef = useRef(initialStops.length);

  useEffect(() => () => dragCleanupRef.current?.(), []);
  useEffect(() => () => {
    if (copyResetRef.current) clearTimeout(copyResetRef.current);
  }, []);

  const resolvedStops = useMemo(() => resolveLinearEasingStops(stops), [stops]);
  // Lets drag and key handlers read the latest layout without being recreated on every change.
  const resolvedStopsRef = useRef(resolvedStops);
  useEffect(() => {
    resolvedStopsRef.current = resolvedStops;
  }, [resolvedStops]);

  const cssValue = formatLinearEasing(stops);
  // Derived rather than stored, so any edit that turns a preset into a custom curve clears the tick by itself.
  const activePresetKey = PRESET_CSS_VALUES.find(([, presetCss]) => presetCss === cssValue)?.[0] ?? null;
  const points = buildLinearEasingPoints(resolvedStops, size, LINEAR_EASING_VALUE_MIN, LINEAR_EASING_VALUE_MAX);
  const inset = getPlotInset(size);
  const zeroLineY = valueToPlotY(0, size, LINEAR_EASING_VALUE_MIN, LINEAR_EASING_VALUE_MAX);
  const oneLineY = valueToPlotY(1, size, LINEAR_EASING_VALUE_MIN, LINEAR_EASING_VALUE_MAX);

  const availableWidth = (trackBoundingBox?.width ?? 0) - PREVIEW_BOX_SIZE_PX;

  // Swaps to a tick briefly so readers know the copy worked, without a toast.
  async function handleCopy() {
    await navigator.clipboard.writeText(cssValue);
    setIsCopied(true);

    if (copyResetRef.current) clearTimeout(copyResetRef.current);
    copyResetRef.current = setTimeout(() => setIsCopied(false), COPY_RESET_DELAY_MS);
  }

  // Listens on window rather than the handle, so a fast drag that slips off the handle isn't dropped.
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

  // Gives keyboard users the same control as dragging; the first and last stops only move vertically because their time is fixed.
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

  // Adds the new bend where the curve has the most room, so it's never squeezed between two close stops.
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

  // Only middle stops can go, since a linear() curve always needs both ends.
  function handleRemoveStop(index: number) {
    setStops((previous) => previous.filter((_, i) => i !== index));
  }

  // Pins at the stop's current spot, so toggling never makes the curve jump.
  function handleTogglePin(index: number) {
    setStops((previous) => previous.map((stop, i) => {
      if (i !== index) return stop;
      if (stop.position !== null) return { ...stop, position: null };
      const resolvedPosition = resolvedStopsRef.current[i]?.resolvedPosition ?? 0;
      return { ...stop, position: Number(resolvedPosition.toFixed(1)) };
    }));
  }

  // Clamped to the plotted range so a typed value can't disappear off the graph.
  function handleValueInputChange(index: number, rawValue: number) {
    if (Number.isNaN(rawValue)) return;
    const value = clamp(rawValue, LINEAR_EASING_VALUE_MIN, LINEAR_EASING_VALUE_MAX);
    setStops((previous) => previous.map((stop, i) => (i === index ? { ...stop, value } : stop)));
  }

  // Clamped between the neighbouring stops so a typed percentage can't reorder the curve.
  function handlePositionInputChange(index: number, rawPosition: number) {
    if (Number.isNaN(rawPosition)) return;
    const resolved = resolvedStopsRef.current;
    const lowerBound = index > 0 ? resolved[index - 1].resolvedPosition : 0;
    const upperBound = index < resolved.length - 1 ? resolved[index + 1].resolvedPosition : 100;
    const position = clamp(rawPosition, lowerBound, upperBound);
    setStops((previous) => previous.map((stop, i) => (i === index ? { ...stop, position } : stop)));
  }

  // Copies the preset's stops so later edits never change the shared preset data.
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
          <Select
            size="sm"
            value={activePresetKey}
            placeholder="Load a preset…"
            options={PRESET_OPTIONS}
            onValueChange={handlePresetChange}
            aria-label="Load a preset shape"
          />

          <ControlButton type="button" size="sm" variant="soft" intent="accent" iconLeft={<PlusIcon size={14} />} onClick={handleAddStop}>
            Add stop
          </ControlButton>

          <ControlButton
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
          </ControlButton>
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

        <StopList>
          {stops.map((stop, index) => {
            const isBoundary = index === 0 || index === stops.length - 1;
            const resolved = resolvedStops[index];

            return (
              <StopRow key={stop.id}>
                <StopLabel>Stop {index + 1}</StopLabel>

                <label>
                  <StopLabel>value</StopLabel>{" "}
                  <StopNumberInput
                    step={0.01}
                    min={LINEAR_EASING_VALUE_MIN}
                    max={LINEAR_EASING_VALUE_MAX}
                    value={stop.value}
                    onValueChange={(value) => handleValueInputChange(index, value)}
                    label={`Stop ${index + 1} value`}
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
                    <StopNumberInput
                      step={0.1}
                      min={resolvedStops[index - 1].resolvedPosition}
                      max={resolvedStops[index + 1].resolvedPosition}
                      disabled={stop.position === null}
                      value={stop.position ?? Number(resolved.resolvedPosition.toFixed(1))}
                      onValueChange={(position) => handlePositionInputChange(index, position)}
                      label={`Stop ${index + 1} position percent`}
                    />
                    %
                  </PinLabel>
                )}

                {!isBoundary && stops.length > 2 && (
                  <RemoveButton onClick={() => handleRemoveStop(index)} aria-label={`Remove stop ${index + 1}`} />
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
