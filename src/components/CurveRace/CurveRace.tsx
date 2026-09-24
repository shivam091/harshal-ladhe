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

// Lets readers feel a timing curve over time rather than read it off a static graph; the ghost trail keeps the spacing visible after the marker stops.
export default function CurveRace<T extends string>({ names, initialName = names[0], getLabel, solve }: CurveRaceProps<T>): JSX.Element {
  const [name, setName] = useState<T>(initialName);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [trackRef, boundingBox] = useBoundingBox<HTMLDivElement>();
  const prefersReducedMotion = usePrefersReducedMotion();
  const frameRef = useRef<number | null>(null);

  const label = getLabel(name);

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
          <Select
            value={name}
            options={names.map((curveName) => ({ value: curveName, label: getLabel(curveName) }))}
            onValueChange={(nextName) => {
              // A marker left mid-track would misrepresent the newly selected curve.
              setName(nextName);
              setIsPlaying(false);
              setProgress(0);
            }}
            disabled={isPlaying}
            aria-label="Easing curve to race"
          />

          <PlayButton
            onClick={() => {
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
