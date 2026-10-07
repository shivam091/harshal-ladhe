import type { JSX } from "react";
import { PlayIcon, RefreshIcon } from "@/components/Icon";
import { CaseButton } from "@/components/MotionPathBuilder/MotionPathBuilder.styles";
import { PlaybackStrip, ScrubLabel, ScrubInput, TimeReadout } from "@/components/MotionPathBuilder/PlaybackBar/PlaybackBar.styles";
import type { PlaybackBarProps } from "@/components/MotionPathBuilder/MotionPathBuilder.types";

// Resolution of the scrub input — fine enough to step a single frame of a several-second run.
const SCRUB_STEPS = 1000;

/*
  Play/pause, restart and a scrubber for the running animation. Purely presentational: the scrub
  thumb and time readout are moved by the Baseboard's animation loop through refs, so a playing
  loco never re-renders React sixty times a second.
*/
export default function PlaybackBar({ isPlaying, onTogglePlay, onRestart, onScrub, scrubRef, readoutRef }: PlaybackBarProps): JSX.Element {
  return (
    <>
      <PlaybackStrip>
        <CaseButton type="button" onClick={onTogglePlay} aria-pressed={isPlaying} aria-label={isPlaying ? "Pause the loco" : "Play the loco"}>
          {isPlaying ? (
            <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
              <rect x={3} y={2} width={3.5} height={12} rx={1} />
              <rect x={9.5} y={2} width={3.5} height={12} rx={1} />
            </svg>
          ) : (
            <PlayIcon size={16} aria-hidden="true" />
          )}
          {isPlaying ? "Pause" : "Play"}
        </CaseButton>
        <CaseButton type="button" onClick={onRestart} aria-label="Back to the start of the run">
          <RefreshIcon size={16} aria-hidden="true" />
        </CaseButton>
        <ScrubLabel>
          Scrub
          <ScrubInput
            ref={scrubRef}
            type="range"
            min={0}
            max={SCRUB_STEPS}
            step={1}
            defaultValue={0}
            aria-label="Scrub through the run"
            onInput={(event) => onScrub(Number(event.currentTarget.value) / SCRUB_STEPS)}
          />
        </ScrubLabel>
        <TimeReadout ref={readoutRef} aria-live="off">
          0.00 s
        </TimeReadout>
      </PlaybackStrip>
    </>
  );
}

PlaybackBar.displayName = "PlaybackBar";
