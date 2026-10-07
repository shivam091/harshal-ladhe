"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import * as edit from "@/components/SvgPathMorph/SvgPathMorph.helpers";
import { buildMorph, readKeyframe } from "@/components/SvgPathMorph/SvgPathMorph.utils";
import MorphBench from "@/components/SvgPathMorph/MorphBench/MorphBench";
import KeyframeLabels from "@/components/SvgPathMorph/KeyframeLabels/KeyframeLabels";
import AlignmentControls from "@/components/SvgPathMorph/AlignmentControls/AlignmentControls";
import CompatibilityReport from "@/components/SvgPathMorph/CompatibilityReport/CompatibilityReport";
import ExportPanel from "@/components/SvgPathMorph/ExportPanel/ExportPanel";
import PresetGallery from "@/components/SvgPathMorph/PresetGallery/PresetGallery";
import ShareControls from "@/components/SvgPathMorph/ShareControls/ShareControls";
import { Workbench, BenchHeader, Nameplate, ToolbarRow, BrassButton, WorkGrid, Column, TrayRow } from "@/components/SvgPathMorph/SvgPathMorph.styles";
import type { SvgPathMorphActions, SvgPathMorphState } from "@/components/SvgPathMorph/SvgPathMorph.types";

// Namespaced so this tool's autosave can't collide with any other goodie's.
const STORAGE_KEY = "svg-path-morph:state";

// Batches a burst of keystrokes into one localStorage write.
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's autosave, then the default recipe — the same priority order as every other goodie.
function loadInitialState(sharedState: string | null): SvgPathMorphState {
  if (sharedState) {
    const decoded = edit.decodeShareableState(sharedState);
    if (decoded) return decoded;
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const restored = raw ? edit.sanitiseShareableState(JSON.parse(raw)) : null;
      if (restored) return restored;
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default recipe rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

// Text fields keep their own native undo history; hijacking Ctrl+Z there would rewind a whole typing run when someone meant to undo one word.
function isTextEditingTarget(target: EventTarget): boolean {
  if (target instanceof HTMLTextAreaElement) return true;
  return target instanceof HTMLInputElement && ["text", "search", "url", "email", "number"].includes(target.type);
}

/*
  Root client component: owns the recipe via useUndoStack, runs the matcher once per change (the
  bench, report and exports all read the same memoised outcome), and handles both forms of
  persistence — a `?state=` permalink decoded once on mount and a debounced localStorage autosave.
  Playback lives in the bench, outside the undo stack, since pausing is inspecting, not editing.
*/
export default function SvgPathMorph(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<SvgPathMorphState>(() => loadInitialState(searchParams.get("state")));
  const { state } = undoStack;

  // Debounced so a fast run of keystrokes doesn't hit localStorage on every one.
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

  const outcome = useMemo(
    () => buildMorph({ keyframes: state.keyframes, autoAlign: state.autoAlign, allowReverse: state.allowReverse, startOffset: state.startOffset }),
    [state.keyframes, state.autoAlign, state.allowReverse, state.startOffset]
  );

  // Every keyframe's own parse error, not just the first — so each label can say what's wrong with it.
  const errors = useMemo(() => state.keyframes.map((d) => {
    const read = readKeyframe(d);
    return read.ok ? null : read.error;
  }), [state.keyframes]);

  const actions: SvgPathMorphActions = useMemo(
    () => ({
      setKeyframe: (index, d) => undoStack.setPresent((s) => edit.setKeyframe(s, index, d)),
      commitEdit: () => undoStack.commit(),
      addKeyframe: () => undoStack.commit((s) => edit.addKeyframe(s)),
      removeKeyframe: (index) => undoStack.commit((s) => edit.removeKeyframe(s, index)),
      reverseKeyframes: () => undoStack.commit((s) => edit.reverseKeyframes(s)),
      setSetting: (key, value) => undoStack.commit((s) => edit.setSetting(s, key, value)),
      setSettingLive: (key, value) => undoStack.setPresent((s) => edit.setSetting(s, key, value)),
      applyPreset: (preset) => undoStack.commit(() => edit.applyPreset(preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetMorph: () => undoStack.commit(() => edit.resetMorph())
    }),
    [undoStack]
  );

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z anywhere on the bench except inside a path label, which keeps the browser's finer-grained native undo.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
    if (isTextEditingTarget(event.target)) return;
    event.preventDefault();
    if (event.shiftKey) actions.redo();
    else actions.undo();
  }

  return (
    <>
      <Workbench onKeyDown={handleKeyDown}>
        <BenchHeader>
          <Nameplate>Alchemist&apos;s Workbench</Nameplate>
          <ToolbarRow>
            <Tooltip content="Undo">
              <BrassButton type="button" onClick={actions.undo} disabled={!actions.canUndo} aria-label="Undo">
                <UndoIcon size={16} />
              </BrassButton>
            </Tooltip>
            <Tooltip content="Redo">
              <BrassButton type="button" onClick={actions.redo} disabled={!actions.canRedo} aria-label="Redo">
                <RedoIcon size={16} />
              </BrassButton>
            </Tooltip>
            <Tooltip content="Reset to the default recipe">
              <BrassButton type="button" onClick={actions.resetMorph} aria-label="Reset to the default recipe">
                <RefreshIcon size={16} />
              </BrassButton>
            </Tooltip>
          </ToolbarRow>
        </BenchHeader>

        <MorphBench state={state} actions={actions} outcome={outcome} />

        <WorkGrid>
          <Column>
            <KeyframeLabels state={state} actions={actions} errors={errors} />
            <AlignmentControls state={state} actions={actions} />
          </Column>
          <Column>
            <CompatibilityReport outcome={outcome} />
          </Column>
        </WorkGrid>

        <ExportPanel state={state} outcome={outcome} />

        <TrayRow>
          <PresetGallery actions={actions} />
          <ShareControls state={state} />
        </TrayRow>
      </Workbench>
    </>
  );
}

SvgPathMorph.displayName = "SvgPathMorph";
