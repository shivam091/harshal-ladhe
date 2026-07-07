import type { JSX } from "react";
import { useId } from "react";
import type { LoaderProps } from "@/interfaces/navigation-progress";
import { WAVE_PATH, computeWaveLevelY } from "@/components/NavigationProgress/loaders/WaveLoader/WaveLoader.helpers";
import { Backdrop } from "@/components/NavigationProgress/NavigationProgress.styles";
import {
  WaveSvg,
  WaveGuide,
  WaveLevel,
  WaveShape,
  WaveShapeBack
} from "@/components/NavigationProgress/loaders/WaveLoader/WaveLoader.styles";

/*
 * Liquid-fill loader — a literal progress readout rather than a loop running on its own
 * timer. The water level tracks the real `progress` value (0-100), so completion is the
 * water reaching the brim, not an arbitrary animation ending.
 */
export default function WaveLoader({ state, progress, backdrop }: LoaderProps): JSX.Element {
  const clipId = useId();
  const done = state === "done";
  const levelY = computeWaveLevelY(progress);

  return (
    <>
      {backdrop && <Backdrop />}
      <WaveSvg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id={clipId}>
            <circle cx="40" cy="40" r="32" />
          </clipPath>
        </defs>

        <WaveGuide cx="40" cy="40" r="32" />

        <g clipPath={`url(#${clipId})`}>
          <WaveLevel style={{ transform: `translateY(${levelY}px)` }}>
            <WaveShapeBack d={WAVE_PATH} data-state={done ? "done" : undefined} />
            <WaveShape d={WAVE_PATH} data-state={done ? "done" : undefined} />
          </WaveLevel>
        </g>
      </WaveSvg>
    </>
  );
}

WaveLoader.displayName = "WaveLoader";
