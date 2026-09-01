"use client";

import { useEffect, useRef, useState, type CSSProperties, type JSX } from "react";
import Button from "@/components/Button";
import { PlayIcon } from "@/components/Icon";
import VisuallyHidden from "@/components/VisuallyHidden";
import { useBoundingBox } from "@/hooks/use-bounding-box";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { range } from "@/utils/math";
import type { CurveRaceProps } from "@/interfaces/curve-race";
import {
  Wrapper,
  Track,
  Ghost,
  Marker,
  Controls,
  SelectWrapper,
  Select
} from "@/components/CurveRace/CurveRace.styles";

// How long one race takes, end to end.
const RACE_DURATION_MS = 1500;

// Number of static ghost dots sampled across the timeline.
const GHOST_TRAIL_STEPS = 16;

// Marker diameter in px.
const MARKER_SIZE = 24;

// Races a marker across a track using a curve resolved by name via `solve`, with a static ghost trail of sampled positions — the generic engine behind every curve-family race demo (TimingFunctionRace, LinearEasingRace, StepsEasingRace).
export default function CurveRace<T extends string>({ names, initialName = names[0], getLabel, solve }: CurveRaceProps<T>): JSX.Element {
  const [name, setName] = useState<T>(initialName);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [trackRef, boundingBox] = useBoundingBox<HTMLDivElement>();
  const prefersReducedMotion = usePrefersReducedMotion();
  const frameRef = useRef<number | null>(null);

  const label = getLabel(name);

  // Drives the marker for exactly RACE_DURATION_MS once Play is pressed, then stops.
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
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [isPlaying]);

  const availableWidth = (boundingBox?.width ?? 0) - MARKER_SIZE;
  const markerOffset = solve(name, progress) * availableWidth;

  return (
    <>
      <Wrapper>
        <Track ref={trackRef} aria-hidden="true">
          {boundingBox &&
            range(0, GHOST_TRAIL_STEPS - 1).map((step) => {
              const t = step / (GHOST_TRAIL_STEPS - 1);
              const offset = solve(name, t) * availableWidth;
              return <Ghost key={step} style={{ "--offset": `${offset}px` } as CSSProperties} />;
            })}
          {boundingBox && <Marker data-playing={isPlaying || undefined} style={{ "--offset": `${markerOffset}px` } as CSSProperties} />}
        </Track>
        <VisuallyHidden>
          Visual demo: a marker races across a track using the {label} easing curve, with a static trail showing how its speed is distributed over time.
        </VisuallyHidden>

        <Controls>
          <SelectWrapper>
            <Select
              value={name}
              onChange={(event) => {
                // Resets the race when a new curve is selected.
                setName(event.target.value as T);
                setIsPlaying(false);
                setProgress(0);
              }}
              aria-label="Easing curve to race"
            >
              {names.map((curveName) => (
                <option key={curveName} value={curveName}>
                  {getLabel(curveName)}
                </option>
              ))}
            </Select>
          </SelectWrapper>

          <Button
            type="button"
            size="lg"
            shape="square"
            onClick={() => {
              setProgress(0);
              setIsPlaying(true);
            }}
            disabled={isPlaying || prefersReducedMotion}
            aria-label={prefersReducedMotion ? "Motion reduced — play disabled" : "Play"}
          >
            <PlayIcon size={18} />
          </Button>
        </Controls>
      </Wrapper>
    </>
  );
}

CurveRace.displayName = "CurveRace";
