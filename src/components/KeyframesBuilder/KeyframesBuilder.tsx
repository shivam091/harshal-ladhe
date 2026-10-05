"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/keyframes-builder-serialize";
import { sanitiseShareableState } from "@/utils/keyframes-builder";
import * as edit from "@/helpers/keyframes-builder-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import { useKeyframesPlayback } from "@/components/KeyframesBuilder/use-keyframes-playback";
import PreviewStage from "@/components/KeyframesBuilder/PreviewStage/PreviewStage";
import Timeline from "@/components/KeyframesBuilder/Timeline/Timeline";
import StopInspector from "@/components/KeyframesBuilder/StopInspector/StopInspector";
import AnimationSettings from "@/components/KeyframesBuilder/AnimationSettings/AnimationSettings";
import ExportPanel from "@/components/KeyframesBuilder/ExportPanel/ExportPanel";
import PresetGallery from "@/components/KeyframesBuilder/PresetGallery/PresetGallery";
import ShareControls from "@/components/KeyframesBuilder/ShareControls/ShareControls";
import {
  DopeSheet,
  SheetHeader,
  SheetTitle,
  SheetSlug,
  ToolbarRow,
  ToolbarButton,
  EditorRow,
  GeneratorGrid,
  MainColumn,
  SidePanel
} from "@/components/KeyframesBuilder/KeyframesBuilder.styles";
import type { KeyframesActions, KeyframesBuilderState } from "@/components/KeyframesBuilder/KeyframesBuilder.types";

// Namespaced per goodie so autosaves from different tools never overwrite each other.
const STORAGE_KEY = "keyframes-animation-builder:state";
// Long enough to let a drag settle, short enough that a quick refresh still keeps the last edit.
const AUTOSAVE_DEBOUNCE_MS = 400;

// Deterministic across server and first client render: a shared `?state=` link decodes the same way on both, otherwise the fresh default sheet. localStorage is deliberately not read here — it doesn't exist on the server, so reading it would mismatch the SSR markup; the autosave is restored in a post-mount effect instead.
function loadInitialState(sharedState: string | null): KeyframesBuilderState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return edit.fromShareableState(decoded);
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the whole sheet's state via useUndoStack, derives one KeyframesActions
  object every subcomponent shares, and handles the two forms of persistence — a `?state=` permalink
  decoded once on mount, and a debounced localStorage autosave thereafter. Playback is the one piece
  of state that deliberately lives OUTSIDE the undo stack (in useKeyframesPlayback): pausing or
  scrubbing is inspecting the animation, not editing it, so it should never be something Ctrl+Z undoes.
*/
export default function KeyframesBuilder(): JSX.Element {
  const searchParams = useSearchParams();
  const sharedState = searchParams.get("state");
  const undoStack = useUndoStack<KeyframesBuilderState>(() => loadInitialState(sharedState));
  const { state, reset } = undoStack;
  const playback = useKeyframesPlayback(state.settings);

  // Restores the last session's autosave once hydrated (skipped when a valid permalink already supplied the state). Validated like a permalink, since a stale autosave from an older build is just as untrusted.
  useEffect(() => {
    if (sharedState && decodeShareableState(sharedState)) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const restored = raw ? sanitiseShareableState(JSON.parse(raw)) : null;
      if (restored) reset(edit.fromShareableState(restored));
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — keep the default sheet.
    }
  }, [sharedState, reset]);

  // Debounced so a drag's stream of setPresent calls doesn't hit localStorage on every frame — only once activity settles.
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

  const actions: KeyframesActions = useMemo(
    () => ({
      addStop: (offset) => undoStack.commit((s) => edit.addStop(s, offset)),
      moveStop: (id, offset) => undoStack.setPresent((s) => edit.moveStop(s, id, offset)),
      removeStop: (id) => undoStack.commit((s) => edit.removeStop(s, id)),
      selectStop: (id) => undoStack.setPresent((s) => edit.selectStop(s, id)),
      setStopValue: (id, key, value) => undoStack.setPresent((s) => edit.setStopValue(s, id, key, value)),
      toggleStopProperty: (id, key, enabled) => undoStack.commit((s) => edit.toggleStopProperty(s, id, key, enabled)),
      setStopTimingFunction: (id, timingFunction) => undoStack.commit((s) => edit.setStopTimingFunction(s, id, timingFunction)),
      setSettingLive: (key, value) => undoStack.setPresent((s) => edit.setSetting(s, key, value)),
      setSetting: (key, value) => undoStack.commit((s) => edit.setSetting(s, key, value)),
      commitDrag: () => undoStack.commit(),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetBuilder: () => undoStack.commit(() => edit.resetBuilder())
    }),
    [undoStack]
  );

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z work anywhere inside the tool, not just while a stop has focus — matches every other goodie's own global shortcut. Left alone inside text fields, where the browser's own text undo is what's expected.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
    if (event.target instanceof HTMLInputElement && event.target.type === "text") return;
    event.preventDefault();
    if (event.shiftKey) actions.redo();
    else actions.undo();
  }

  return (
    <>
      <DopeSheet onKeyDown={handleKeyDown} data-playing={playback.isPlaying ? "true" : undefined}>
        <SheetHeader>
          <SheetTitle>
            Exposure Sheet
            <SheetSlug>
              Sc. 01 · @keyframes {state.stops.length} key{state.stops.length === 1 ? "" : "s"} · 24 fps
            </SheetSlug>
          </SheetTitle>

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
            <Tooltip content="Reset sheet">
              <ToolbarButton type="button" onClick={actions.resetBuilder} aria-label="Reset sheet">
                <RefreshIcon size={16} />
              </ToolbarButton>
            </Tooltip>
          </ToolbarRow>
        </SheetHeader>

        <PreviewStage state={state} playback={playback} />
        <Timeline state={state} actions={actions} playback={playback} />

        <EditorRow>
          <StopInspector state={state} actions={actions} />
          <AnimationSettings state={state} actions={actions} />
        </EditorRow>

        <GeneratorGrid>
          <MainColumn>
            <ExportPanel state={state} />
          </MainColumn>
          <SidePanel>
            <PresetGallery actions={actions} />
            <ShareControls state={state} />
          </SidePanel>
        </GeneratorGrid>
      </DopeSheet>
    </>
  );
}

KeyframesBuilder.displayName = "KeyframesBuilder";
