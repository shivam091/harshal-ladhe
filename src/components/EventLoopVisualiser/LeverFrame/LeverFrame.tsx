"use client";

import { useId } from "react";
import type { JSX } from "react";
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import { EVENT_LOOP_SPEEDS } from "@/helpers/event-loop-editor";
import {
  Frame,
  LeverRow,
  Lever,
  LeverPlate,
  PauseGlyph,
  ScrubRow,
  ScrubInput,
  SpeedSelect,
  Explanation,
  StepCounter
} from "@/components/EventLoopVisualiser/LeverFrame/LeverFrame.styles";
import type { LeverFrameProps } from "@/components/EventLoopVisualiser/EventLoopVisualiser.types";

/*
  Playback controls as a lever frame plus the step readout. The explanation lives in an aria-live
  region so a screen-reader user hears each step's "why" as they move through it — the visual
  diagram alone would leave them with nothing to follow.
*/
export default function LeverFrame({ playback, explanation }: LeverFrameProps): JSX.Element {
  const scrubId = useId();
  const speedId = useId();
  const { stepIndex, stepCount, playing, locked } = playback;
  const atStart = stepIndex === 0;
  const atEnd = stepIndex >= stepCount - 1;

  return (
    <>
      <Frame>
        <LeverRow role="group" aria-label="Playback">
          <Tooltip content="Back to the start">
            <Lever type="button" data-lever="blue" onClick={playback.restart} disabled={locked || atStart} aria-label="Back to the start">
              <RefreshIcon size={16} aria-hidden="true" />
              <LeverPlate>Reset</LeverPlate>
            </Lever>
          </Tooltip>
          <Tooltip content="Step back">
            <Lever type="button" onClick={() => playback.stepBy(-1)} disabled={locked || atStart} aria-label="Step back">
              <ChevronLeftIcon size={16} aria-hidden="true" />
              <LeverPlate>Back</LeverPlate>
            </Lever>
          </Tooltip>
          <Tooltip content={playing ? "Pause" : "Play"}>
            <Lever
              type="button"
              data-lever="red"
              data-pulled={playing ? "true" : undefined}
              onClick={playback.togglePlay}
              disabled={locked || stepCount < 2}
              aria-label={playing ? "Pause" : "Play"}
              aria-pressed={playing}
            >
              {playing ? <PauseGlyph aria-hidden="true" /> : <PlayIcon size={16} aria-hidden="true" />}
              <LeverPlate>{playing ? "Pause" : "Play"}</LeverPlate>
            </Lever>
          </Tooltip>
          <Tooltip content="Step forward">
            <Lever type="button" data-lever="yellow" onClick={() => playback.stepBy(1)} disabled={locked || atEnd} aria-label="Step forward">
              <ChevronRightIcon size={16} aria-hidden="true" />
              <LeverPlate>Step</LeverPlate>
            </Lever>
          </Tooltip>
        </LeverRow>

        <ScrubRow>
          <label htmlFor={scrubId}>Step</label>
          <ScrubInput
            id={scrubId}
            type="range"
            min={0}
            max={Math.max(0, stepCount - 1)}
            value={stepIndex}
            disabled={locked}
            onChange={(event) => playback.goTo(event.target.valueAsNumber)}
            aria-valuetext={`Step ${stepIndex + 1} of ${stepCount}`}
          />
          <SpeedSelect id={speedId} aria-label="Playback speed" value={playback.speedIndex} onChange={(event) => playback.setSpeedIndex(Number(event.target.value))}>
            {EVENT_LOOP_SPEEDS.map((speed, index) => (
              <option key={speed.label} value={index}>
                {speed.label}
              </option>
            ))}
          </SpeedSelect>
        </ScrubRow>

        <Explanation aria-live="polite" aria-atomic="true">
          <StepCounter>
            Step {stepIndex + 1} of {stepCount}
          </StepCounter>
          {explanation}
        </Explanation>
      </Frame>
    </>
  );
}

LeverFrame.displayName = "LeverFrame";
