"use client";

import { useEffect, useRef, useState, type CSSProperties, type JSX } from "react";
import PlayButton from "@/components/PlayButton";
import Select from "@/components/Select";
import VisuallyHidden from "@/components/VisuallyHidden";
import { useBoundingBox } from "@/hooks/use-bounding-box";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { range } from "@/utils/math";
import type { CurveRaceProps } from "@/components/CurveRace/CurveRace.types";
import {
  Wrapper,
  Lanes,
  LaneLabel,
  Track,
  Ghost,
  Marker,
  Controls
} from "@/components/CurveRace/CurveRace.styles";

// Long enough to follow the marker's pacing by eye, short enough to replay often.
const RACE_DURATION_MS = 1500;

// Enough samples to show the curve's spacing without the dots merging into a line.
const GHOST_TRAIL_STEPS = 16;

// Must match Marker's 1.5rem size so the marker stops flush with the track's end.
const MARKER_SIZE = 24;

// Long enough to see where every marker finished before they head back to the start.
const FINISH_HOLD_MS = 600;

// Lets readers feel a timing curve over time rather than read it off a static graph; the ghost trail keeps the spacing visible after the marker stops.
export default function CurveRace<T extends string>({ names, initialName = names[0], getLabel, solve, stacked = false }: CurveRaceProps<T>): JSX.Element {
  const [name, setName] = useState<T>(initialName);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  const [trackRef, boundingBox] = useBoundingBox<HTMLDivElement>();
  const prefersReducedMotion = usePrefersReducedMotion();
  const frameRef = useRef<number | null>(null);
  const returnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const label = getLabel(name);
  // Stacked mode races every curve at once, one lane each, so their trails can be compared directly.
  const laneNames = stacked ? names : [name];

  // Runs on rAF rather than a CSS transition so the marker follows `solve` exactly, the same curve the ghost trail is sampled from.
  useEffect(() => {
    if (!isPlaying) return;

    let start: number | null = null;

    function tick(timestamp: number) {
      if (start === null) start = timestamp;
      const ratio = Math.min((timestamp - start) / RACE_DURATION_MS, 1);
      setProgress(ratio);

      if (ratio < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setIsPlaying(false);
        // Resets the race for the next run, so it never sits waiting at the finish line.
        returnTimerRef.current = setTimeout(() => {
          setIsReturning(true);
          setProgress(0);
        }, FINISH_HOLD_MS);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [isPlaying]);

  // A pending return would otherwise fire after unmount.
  useEffect(() => () => {
    if (returnTimerRef.current !== null) clearTimeout(returnTimerRef.current);
  }, []);

  // Drops a pending or in-flight return so a new run or curve always starts cleanly from 0.
  function cancelReturn() {
    if (returnTimerRef.current !== null) clearTimeout(returnTimerRef.current);
    returnTimerRef.current = null;
    setIsReturning(false);
  }

  const availableWidth = (boundingBox?.width ?? 0) - MARKER_SIZE;

  return (
    <>
      <Wrapper>
        <Lanes aria-hidden="true">
          {laneNames.map((laneName, index) => (
            <div key={laneName}>
              {stacked && <LaneLabel>{getLabel(laneName)}</LaneLabel>}
              {/* Every lane is the same width, so measuring the first one sizes them all. */}
              <Track ref={index === 0 ? trackRef : undefined}>
                {boundingBox &&
                  range(0, GHOST_TRAIL_STEPS - 1).map((step) => {
                    const t = step / (GHOST_TRAIL_STEPS - 1);
                    const offset = solve(laneName, t) * availableWidth;
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
                {boundingBox && (
                  <Marker
                    data-playing={isPlaying || undefined}
                    data-returning={isReturning || undefined}
                    onTransitionEnd={() => setIsReturning(false)}
                    style={{ "--offset": `${solve(laneName, progress) * availableWidth}px` } as CSSProperties}
                  />
                )}
              </Track>
            </div>
          ))}
        </Lanes>
        <VisuallyHidden>
          {stacked
            ? `Visual demo: markers race side by side on stacked tracks, one per easing curve (${names.map(getLabel).join(", ")}), each with a static trail showing how its speed is distributed over time.`
            : `Visual demo: a marker races across a track using the ${label} easing curve, with a static trail showing how its speed is distributed over time.`}
        </VisuallyHidden>

        <Controls>
          {!stacked && (
            <Select
              value={name}
              options={names.map((curveName) => ({ value: curveName, label: getLabel(curveName) }))}
              onValueChange={(nextName) => {
                // A marker left mid-track would misrepresent the newly selected curve.
                cancelReturn();
                setName(nextName);
                setIsPlaying(false);
                setProgress(0);
              }}
              disabled={isPlaying}
              aria-label="Easing curve to race"
            />
          )}

          <PlayButton
            onClick={() => {
              cancelReturn();
              setProgress(0);
              setIsPlaying(true);
            }}
            disabled={isPlaying || prefersReducedMotion}
            aria-label={prefersReducedMotion ? "Motion reduced — play disabled" : "Play"}
          />
        </Controls>
      </Wrapper>
    </>
  );
}

CurveRace.displayName = "CurveRace";
