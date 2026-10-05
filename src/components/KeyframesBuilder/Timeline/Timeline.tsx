"use client";

import { useRef, useSyncExternalStore } from "react";
import type { JSX, KeyboardEvent, PointerEvent } from "react";
import { clamp } from "@/utils/number";
import { NUMERIC_PROPERTIES, SHEET_FPS } from "@/utils/keyframes-builder";
import { SectionCard, PanelTitle, HelperText } from "@/components/KeyframesBuilder/KeyframesBuilder.styles";
import {
  TimelineHeader,
  FrameCounter,
  TimelineFrame,
  Ruler,
  RulerMark,
  ScrubInput,
  Track,
  PlayheadLine,
  StopHandle,
  StopLabel
} from "@/components/KeyframesBuilder/Timeline/Timeline.styles";
import type { KeyframeProperty, KeyframeStop, KeyframesPlayback, TimelineProps } from "@/components/KeyframesBuilder/KeyframesBuilder.types";

// Ruler columns every 10% — matching the track's heavier rules so each label sits on a line.
const RULER_MARKS = Array.from({ length: 11 }, (_, index) => index * 10);

// Arrow keys nudge a stop by 1% — the same whole-percent snap a drag uses.
const STEP = 1;
// Shift+arrow (and PageUp/PageDown) jump 10% — one ruler column per press.
const STEP_FAST = 10;

// Keys that move a stop — tracked so keyup knows a nudge (not some other key) just ended and needs checkpointing.
const MOVE_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"]);

// Human labels for each pinnable property, in inspector order — used for a stop's spoken summary.
const PROPERTY_LABELS: Array<{ key: KeyframeProperty; label: string }> = [...NUMERIC_PROPERTIES, { key: "backgroundColor", label: "Background colour" }];

// What a stop pins, as words — the part of its accessible value a sighted user reads off the filled/hollow diamond.
function describeStop(stop: KeyframeStop): string {
  const pinned = PROPERTY_LABELS.filter(({ key }) => stop.values[key] !== undefined).map(({ label }) => label);
  return pinned.length > 0 ? pinned.join(", ") : "nothing pinned";
}

// Subscribes to the playback store — shared by the scrubber, playhead line, and frame counter so each re-renders on playhead movement without the timeline's stops re-rendering too.
function usePlayhead(playback: KeyframesPlayback) {
  return useSyncExternalStore(playback.subscribe, playback.getSnapshot, playback.getSnapshot);
}

// The "fr 12 / 38" counter — the playhead expressed in film frames at the sheet's 24fps, alongside the percentage CSS itself speaks.
function PlayheadCounter({ playback, durationMs }: { playback: KeyframesPlayback; durationMs: number }): JSX.Element {
  const { progress } = usePlayhead(playback);
  const totalFrames = Math.max(1, Math.round((durationMs / 1000) * SHEET_FPS));
  const frame = Math.round((progress / 100) * totalFrames);

  return (
    <>
      {/* aria-live off: an <output> is a polite live region by default, and announcing every frame would drown out everything else. */}
      <FrameCounter aria-live="off">
        {progress.toFixed(1)}% · fr {frame} / {totalFrames}
      </FrameCounter>
    </>
  );
}

PlayheadCounter.displayName = "PlayheadCounter";

// Native range input bound to the playhead — dragging it pauses the preview and parks it on that moment.
function Scrubber({ playback }: { playback: KeyframesPlayback }): JSX.Element {
  const { progress } = usePlayhead(playback);

  return (
    <>
      <ScrubInput
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={progress}
        aria-label="Playhead position"
        aria-valuetext={`${progress.toFixed(1)}%`}
        onChange={(event) => playback.seek(event.target.valueAsNumber)}
      />
    </>
  );
}

Scrubber.displayName = "Scrubber";

// The playhead's line down through the track, tracking whatever the preview is showing.
function Playhead({ playback }: { playback: KeyframesPlayback }): JSX.Element {
  const { progress } = usePlayhead(playback);

  return (
    <>
      <PlayheadLine aria-hidden="true" style={{ left: `${progress}%` }} />
    </>
  );
}

Playhead.displayName = "Playhead";

/*
  The exposure track: the 0–100% ruler, the scrubber, and every keyframe as a draggable diamond.
  Bare track clicks add a stop; stops are role="slider" so arrow keys, Home/End, and PageUp/PageDown
  move them and Delete removes them. A drag streams moveStop (no undo entries) and checkpoints once
  on release, so a whole gesture undoes in one step.
*/
export default function Timeline({ state, actions, playback }: TimelineProps): JSX.Element {
  const trackRef = useRef<HTMLDivElement>(null);
  // The stop being dragged and whether it actually moved — a click without movement is just a selection and shouldn't checkpoint an undo step.
  const dragRef = useRef<{ id: string; moved: boolean } | null>(null);

  // Pointer x → whole-percent offset within the track, read fresh each time so a resize mid-session can't skew it.
  function offsetFromPointer(event: PointerEvent): number {
    const track = trackRef.current;
    if (!track) return 0;
    const { left, width } = track.getBoundingClientRect();
    return Math.round(clamp(((event.clientX - left) / width) * 100, 0, 100));
  }

  // Only the bare track adds a stop — presses on a stop are stopped before they bubble here.
  function handleTrackPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || event.button !== 0) return;
    actions.addStop(offsetFromPointer(event));
  }

  // Captures the pointer so the drag keeps tracking outside the stop's small hit area, and selects the stop straight away.
  function handleStopPointerDown(event: PointerEvent<HTMLButtonElement>, stop: KeyframeStop) {
    event.stopPropagation();
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { id: stop.id, moved: false };
    if (state.selectedStopId !== stop.id) actions.selectStop(stop.id);
  }

  // Streams the new offset only when it actually changes whole percent, so a still pointer doesn't spam state updates.
  function handleStopPointerMove(event: PointerEvent<HTMLButtonElement>, stop: KeyframeStop) {
    if (dragRef.current?.id !== stop.id) return;
    const offset = offsetFromPointer(event);
    if (offset === stop.offset) return;
    dragRef.current.moved = true;
    actions.moveStop(stop.id, offset);
  }

  // Ends the gesture — one undo checkpoint if the stop moved, nothing if it was only a click.
  function handleStopPointerUp() {
    if (dragRef.current?.moved) actions.commitDrag();
    dragRef.current = null;
  }

  // Slider-style keyboard handling; modifier combos fall through so Ctrl/Cmd+Z still reaches the builder's global undo shortcut.
  function handleStopKeyDown(event: KeyboardEvent<HTMLButtonElement>, stop: KeyframeStop) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const step = event.shiftKey ? STEP_FAST : STEP;
    let next: number | null = null;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") next = stop.offset - step;
    else if (event.key === "ArrowRight" || event.key === "ArrowUp") next = stop.offset + step;
    else if (event.key === "PageDown") next = stop.offset - STEP_FAST;
    else if (event.key === "PageUp") next = stop.offset + STEP_FAST;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 100;
    else if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      actions.removeStop(stop.id);
      return;
    }
    if (next === null) return;
    event.preventDefault();
    actions.moveStop(stop.id, next);
  }

  // Checkpoints a run of keyboard nudges once the key comes up, the same live/commit split a slider uses.
  function handleStopKeyUp(event: KeyboardEvent<HTMLButtonElement>) {
    if (MOVE_KEYS.has(event.key)) actions.commitDrag();
  }

  return (
    <>
      <SectionCard aria-labelledby="keyframes-timeline-title">
        <TimelineHeader>
          <PanelTitle id="keyframes-timeline-title">Exposure track</PanelTitle>
          <PlayheadCounter playback={playback} durationMs={state.settings.durationMs} />
        </TimelineHeader>

        <TimelineFrame>
          <Ruler aria-hidden="true">
            {RULER_MARKS.map((mark) => (
              <RulerMark key={mark} style={{ left: `${mark}%` }} data-minor={mark % 20 !== 0 ? "true" : undefined}>
                <span>{mark}%</span>
                <span>{Math.round((mark / 100) * (state.settings.durationMs / 1000) * SHEET_FPS)}</span>
              </RulerMark>
            ))}
          </Ruler>

          <Scrubber playback={playback} />

          <Track ref={trackRef} onPointerDown={handleTrackPointerDown} role="group" aria-label="Keyframes">
            <Playhead playback={playback} />
            {state.stops.map((stop) => {
              const isSelected = stop.id === state.selectedStopId;
              const isEmpty = Object.keys(stop.values).length === 0 && !stop.timingFunction;
              return (
                <StopHandle
                  key={stop.id}
                  type="button"
                  role="slider"
                  aria-label="Keyframe"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={stop.offset}
                  aria-valuetext={`${stop.offset}% — ${describeStop(stop)}`}
                  data-selected={isSelected ? "true" : undefined}
                  data-empty={isEmpty ? "true" : undefined}
                  style={{ left: `${stop.offset}%` }}
                  onFocus={() => {
                    if (!isSelected) actions.selectStop(stop.id);
                  }}
                  onPointerDown={(event) => handleStopPointerDown(event, stop)}
                  onPointerMove={(event) => handleStopPointerMove(event, stop)}
                  onPointerUp={handleStopPointerUp}
                  onPointerCancel={handleStopPointerUp}
                  onKeyDown={(event) => handleStopKeyDown(event, stop)}
                  onKeyUp={handleStopKeyUp}
                >
                  {isSelected && <StopLabel aria-hidden="true">{stop.offset}%</StopLabel>}
                </StopHandle>
              );
            })}
          </Track>
        </TimelineFrame>

        <HelperText>
          Click the track to add a keyframe. Drag a diamond — or focus it and use the arrow keys (Shift for 10%) — to retime it; Delete removes it. Hollow diamonds pin nothing yet.
        </HelperText>
      </SectionCard>
    </>
  );
}

Timeline.displayName = "Timeline";
