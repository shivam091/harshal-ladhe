"use client";

import { useEffect, useMemo, useState } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { useInterval } from "@/hooks/use-interval";
import { decodeShareableState } from "@/utils/event-loop-serialize";
import { simulateEventLoop } from "@/utils/event-loop-simulate";
import * as edit from "@/helpers/event-loop-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import LeverFrame from "@/components/EventLoopVisualiser/LeverFrame/LeverFrame";
import TrackDiagram from "@/components/EventLoopVisualiser/TrackDiagram/TrackDiagram";
import SourcePanel from "@/components/EventLoopVisualiser/SourcePanel/SourcePanel";
import BlockEditor from "@/components/EventLoopVisualiser/BlockEditor/BlockEditor";
import PredictPanel from "@/components/EventLoopVisualiser/PredictPanel/PredictPanel";
import PresetGallery from "@/components/EventLoopVisualiser/PresetGallery/PresetGallery";
import ShareControls from "@/components/EventLoopVisualiser/ShareControls/ShareControls";
import {
  SignalBox,
  Deck,
  NamePlate,
  PowerLamp,
  ToolbarRow,
  ToolbarButton,
  GeneratorGrid,
  SidePanel,
  MainColumn,
  SectionCard,
  PanelTitle,
  PanelNote
} from "@/components/EventLoopVisualiser/EventLoopVisualiser.styles";
import type { EventLoopActions, EventLoopEditorState, EventLoopPlayback } from "@/components/EventLoopVisualiser/EventLoopVisualiser.types";

// Namespaced per goodie so this tool's autosave never collides with another's.
const STORAGE_KEY = "event-loop-visualiser:state";
// Long enough to coalesce a burst of keystrokes, short enough that a quick refresh still keeps the last edit.
const AUTOSAVE_DEBOUNCE_MS = 400;

// 1× — slow enough to read each explanation as it's announced.
const DEFAULT_SPEED_INDEX = 1;

// Decodes and sanitises a `?state=` value in one go — a link that fails either step is treated exactly like no link at all.
function decodeProgram(sharedState: string | null): EventLoopEditorState | null {
  if (!sharedState) return null;
  const program = edit.sanitizeProgram(decodeShareableState(sharedState));
  return program ? { program } : null;
}

// Deterministic across server and first client render: a shared `?state=` link decodes the same way on both, otherwise the default program. localStorage is restored after mount instead, so hydration never mismatches.
function loadInitialState(sharedState: string | null): EventLoopEditorState {
  return decodeProgram(sharedState) ?? edit.createDefaultEditorState();
}

/*
  Root client component: owns the program via useUndoStack, derives one EventLoopActions object
  every subcomponent shares, and handles the two forms of persistence — a `?state=` permalink and
  a debounced localStorage autosave. Playback (step, play/pause, speed) and the prediction game
  are deliberately ordinary useState outside the undo stack: stepping through a run is viewing,
  not editing, and must never fill the undo history.
*/
export default function EventLoopVisualiser(): JSX.Element {
  const searchParams = useSearchParams();
  const sharedState = searchParams.get("state");
  const undoStack = useUndoStack<EventLoopEditorState>(() => loadInitialState(sharedState));
  const { state, reset } = undoStack;

  // Runs once after hydration to restore the last session's autosave — skipped when a valid permalink already supplied the program.
  useEffect(() => {
    if (decodeProgram(sharedState)) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const program = raw ? edit.sanitizeProgram(JSON.parse(raw)) : null;
      if (program) reset({ program });
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — keep the default program.
    }
  }, [sharedState, reset]);

  // Debounced so typing a log message doesn't hit localStorage on every keystroke — only once activity settles.
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(edit.toShareableState(state)));
      } catch {
        // Storage unavailable/full — autosave is a convenience, not a guarantee.
      }
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [state]);

  const actions: EventLoopActions = useMemo(
    () => ({
      updateBlock: (id, patch) => undoStack.setPresent((s) => edit.updateBlock(s, id, patch)),
      commitEdit: () => undoStack.commit(),
      addBlock: (target, kind) => undoStack.commit((s) => edit.insertBlock(s, target, kind)),
      removeBlock: (id) => undoStack.commit((s) => edit.removeBlock(s, id)),
      moveBlock: (id, direction) => undoStack.commit((s) => edit.moveBlock(s, id, direction)),
      addThen: (id) => undoStack.commit((s) => edit.addThen(s, id)),
      removeThen: (id) => undoStack.commit((s) => edit.removeThen(s, id)),
      applyPreset: (preset) => undoStack.commit(() => edit.applyPreset(preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetProgram: () => undoStack.commit(() => edit.resetProgram())
    }),
    [undoStack]
  );

  // The whole run is compiled up front, so every playback control below is just an index into this list.
  const simulation = useMemo(() => simulateEventLoop(state.program), [state.program]);
  const { snapshots } = simulation;
  const stepCount = snapshots.length;
  const finalConsole = snapshots[stepCount - 1].console;

  const [requestedStep, setRequestedStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(DEFAULT_SPEED_INDEX);
  const [predictOn, setPredictOn] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [guess, setGuess] = useState<string[]>([]);
  const [trackedProgram, setTrackedProgram] = useState(state.program);

  // A changed program means a different answer, so any half-made prediction is cleared — adjusted during render (React's documented pattern) rather than in an effect, so a stale guess never paints.
  if (trackedProgram !== state.program) {
    setTrackedProgram(state.program);
    setGuess([]);
    setRevealed(false);
  }

  // Clamped rather than reset when the program changes, so editing a log message mid-run keeps your place.
  const stepIndex = Math.min(requestedStep, stepCount - 1);
  const locked = predictOn && !revealed;
  const snapshot = snapshots[locked ? 0 : stepIndex];

  useInterval(
    () => {
      if (stepIndex >= stepCount - 1) setPlaying(false);
      else setRequestedStep(stepIndex + 1);
    },
    playing && !locked ? edit.EVENT_LOOP_SPEEDS[speedIndex].intervalMs : null
  );

  const playback: EventLoopPlayback = {
    stepIndex: locked ? 0 : stepIndex,
    stepCount,
    playing: playing && !locked,
    speedIndex,
    locked,
    goTo: (index) => setRequestedStep(Math.max(0, Math.min(stepCount - 1, index))),
    stepBy: (delta) => {
      setPlaying(false);
      setRequestedStep(Math.max(0, Math.min(stepCount - 1, stepIndex + delta)));
    },
    // Pressing play on the final step starts over — the only useful thing "play" can mean once the run has finished.
    togglePlay: () => {
      if (!playing && stepIndex >= stepCount - 1) setRequestedStep(0);
      setPlaying(!playing);
    },
    setSpeedIndex,
    restart: () => {
      setPlaying(false);
      setRequestedStep(0);
    }
  };

  // Turning the game on or off always starts from a clean slate and the first step, so the diagram never hints at the answer.
  function togglePredict() {
    setPredictOn(!predictOn);
    setGuess([]);
    setRevealed(false);
    setPlaying(false);
    setRequestedStep(0);
  }

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z work anywhere inside the tool, not just while a field has focus.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
    event.preventDefault();
    if (event.shiftKey) actions.redo();
    else actions.undo();
  }

  const explanation = locked ? "Playback is locked until you reveal your prediction — order the logged lines first." : snapshot.explanation;

  return (
    <>
      <SignalBox onKeyDown={handleKeyDown}>
        <Deck>
          <NamePlate>
            <PowerLamp aria-hidden="true" />
            Event Loop Signal Box
          </NamePlate>

          <ToolbarRow>
            <Tooltip content="Undo">
              <ToolbarButton type="button" onClick={actions.undo} disabled={!actions.canUndo} aria-label="Undo">
                <UndoIcon size={16} />
              </ToolbarButton>
            </Tooltip>
            <Tooltip content="Redo">
              <ToolbarButton type="button" onClick={actions.redo} disabled={!actions.canRedo} aria-label="Redo">
                <RedoIcon size={16} />
              </ToolbarButton>
            </Tooltip>
            <Tooltip content="Reset program">
              <ToolbarButton type="button" onClick={actions.resetProgram} aria-label="Reset program">
                <RefreshIcon size={16} />
              </ToolbarButton>
            </Tooltip>
          </ToolbarRow>
        </Deck>

        <GeneratorGrid>
          <SidePanel>
            <SourcePanel program={state.program} activeLine={locked ? null : snapshot.activeLine} />
            <PredictPanel
              answer={finalConsole}
              enabled={predictOn}
              revealed={revealed}
              guess={guess}
              onToggle={togglePredict}
              onPick={(id) => setGuess((prev) => (prev.includes(id) ? prev : [...prev, id]))}
              onUndoPick={() => setGuess((prev) => prev.slice(0, -1))}
              onClear={() => setGuess([])}
              onReveal={() => {
                setRevealed(true);
                setRequestedStep(0);
              }}
            />
          </SidePanel>

          <MainColumn>
            <SectionCard>
              <PanelTitle>Lever frame</PanelTitle>
              <LeverFrame playback={playback} explanation={explanation} />
            </SectionCard>
            <SectionCard>
              <PanelTitle>Track diagram</PanelTitle>
              <TrackDiagram snapshot={snapshot} hideConsole={locked} />
              {simulation.truncated && <PanelNote>This program is long enough to hit the step limit, so the run stops early.</PanelNote>}
            </SectionCard>
          </MainColumn>
        </GeneratorGrid>

        <GeneratorGrid>
          <SidePanel>
            <PresetGallery actions={actions} />
            <ShareControls state={state} />
          </SidePanel>

          <MainColumn>
            <BlockEditor program={state.program} actions={actions} />
          </MainColumn>
        </GeneratorGrid>
      </SignalBox>
    </>
  );
}

EventLoopVisualiser.displayName = "EventLoopVisualiser";
