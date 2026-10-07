"use client";

import { useEffect, useState } from "react";
import type { JSX } from "react";
import { buildPathData, formatSteps } from "@/components/ShapeToPathConverter/ShapeToPathConverter.utils";
import { SectionCard, PanelTitle, PanelHint } from "@/components/ShapeToPathConverter/ShapeToPathConverter.styles";
import {
  WorkingHeading,
  RuleList,
  StepList,
  StepButton,
  StepNumber,
  StepCommand,
  StepText,
  AnswerLine,
  ScrubberRow,
  ScrubberButton,
  ScrubberRange,
  ScrubberStatus,
  WorkingWarning
} from "@/components/ShapeToPathConverter/WorkingOut/WorkingOut.styles";
import type { WorkingOutProps } from "@/components/ShapeToPathConverter/ShapeToPathConverter.types";

// Long enough to read a line of working before the next one is drawn.
const PLAY_INTERVAL_MS = 900;

// data-* booleans render as the string "false" rather than being omitted, so idle lines get no attribute at all.
function boolAttr(value: boolean): "true" | undefined {
  return value ? "true" : undefined;
}

/*
  The written working: the rules that fire before any command (auto radii, clamping, why two
  arcs), then one numbered line per command with its reasoning, then the answer ruled off. The
  stepper writes the path out one command at a time; playback moves in discrete steps rather than
  animating, so it is equally calm with reduced motion on.
*/
export default function WorkingOut({ conversion, mode, precision, progress, hoveredStep, onProgressChange, onHoverStep }: WorkingOutProps): JSX.Element {
  const [playing, setPlaying] = useState(false);
  const { steps, working, warning } = conversion;
  const total = steps.length;
  const commands = formatSteps(steps, mode, precision);
  const d = buildPathData(steps, mode, precision);
  const isPlaying = playing && progress < total;

  // One timer per step rather than an interval, so pausing, scrubbing or editing mid-play always schedules from the latest position.
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      onProgressChange(progress + 1);
      if (progress + 1 >= total) setPlaying(false);
    }, PLAY_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [isPlaying, progress, total, onProgressChange]);

  // Playing from the end starts over from a blank page, which is what "show me again" means.
  function handlePlay() {
    if (isPlaying) {
      setPlaying(false);
      return;
    }
    if (progress >= total) onProgressChange(0);
    setPlaying(true);
  }

  return (
    <>
      <SectionCard aria-labelledby="shape-to-path-working-title">
        <PanelTitle id="shape-to-path-working-title">Working out</PanelTitle>

        <WorkingHeading>Rules</WorkingHeading>
        <RuleList>
          {working.map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </RuleList>

        {warning && <WorkingWarning>{warning}</WorkingWarning>}

        {total > 0 && (
          <>
            <WorkingHeading>Steps</WorkingHeading>
            <PanelHint>Hover or focus a line to trace it on the drawing in red. Click one to draw the path up to it.</PanelHint>
            <StepList onMouseLeave={() => onHoverStep(null)}>
              {steps.map((step, index) => (
                <li key={index}>
                  <StepButton
                    type="button"
                    data-pending={boolAttr(index >= progress)}
                    data-hovered={boolAttr(hoveredStep === index)}
                    aria-current={index === progress - 1 && progress < total ? "step" : undefined}
                    onMouseEnter={() => onHoverStep(index)}
                    onFocus={() => onHoverStep(index)}
                    onBlur={() => onHoverStep(null)}
                    onClick={() => onProgressChange(index + 1)}
                  >
                    <StepNumber>{index + 1}</StepNumber>
                    <StepCommand>{commands[index]}</StepCommand>
                    <StepText>{step.explanation}</StepText>
                  </StepButton>
                </li>
              ))}
            </StepList>

            <ScrubberRow>
              <ScrubberButton type="button" onClick={() => onProgressChange(Math.max(0, progress - 1))} disabled={progress === 0}>
                Back
              </ScrubberButton>
              <ScrubberButton type="button" onClick={handlePlay} aria-pressed={isPlaying}>
                {isPlaying ? "Pause" : "Play"}
              </ScrubberButton>
              <ScrubberButton type="button" onClick={() => onProgressChange(Math.min(total, progress + 1))} disabled={progress >= total}>
                Next
              </ScrubberButton>
              <ScrubberRange
                type="range"
                min={0}
                max={total}
                step={1}
                value={progress}
                aria-label="Steps drawn"
                aria-valuetext={`${progress} of ${total} steps drawn`}
                onChange={(event) => {
                  setPlaying(false);
                  onProgressChange(event.target.valueAsNumber);
                }}
              />
              <ScrubberStatus aria-live="polite">
                Step {progress} of {total}
              </ScrubberStatus>
            </ScrubberRow>

            <AnswerLine>
              <strong>∴ d =</strong>
              {d}
            </AnswerLine>
          </>
        )}
      </SectionCard>
    </>
  );
}

WorkingOut.displayName = "WorkingOut";
