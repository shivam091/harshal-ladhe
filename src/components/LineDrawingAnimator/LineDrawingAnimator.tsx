"use client";

import { useEffect, useMemo, useState } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import * as edit from "@/components/LineDrawingAnimator/LineDrawingAnimator.helpers";
import { buildTimeline, decodeShareableState, prepareArtwork, resolveOrder } from "@/components/LineDrawingAnimator/LineDrawingAnimator.utils";
import StagePane from "@/components/LineDrawingAnimator/StagePane/StagePane";
import StrokeLedger from "@/components/LineDrawingAnimator/StrokeLedger/StrokeLedger";
import InputPanel from "@/components/LineDrawingAnimator/InputPanel/InputPanel";
import SettingsPanel from "@/components/LineDrawingAnimator/SettingsPanel/SettingsPanel";
import ExportPanel from "@/components/LineDrawingAnimator/ExportPanel/ExportPanel";
import PresetGallery from "@/components/LineDrawingAnimator/PresetGallery/PresetGallery";
import ShareControls from "@/components/LineDrawingAnimator/ShareControls/ShareControls";
import {
  WritingDesk,
  DeskHeader,
  HeaderLead,
  InkWell,
  Nameplate,
  ToolbarRow,
  BrassButton,
  DeskGrid,
  DeskColumn,
  TrayRow
} from "@/components/LineDrawingAnimator/LineDrawingAnimator.styles";
import type { LineDrawingActions, LineDrawingEditorState, LineDrawingExportInput, LineDrawingShareableState, StrokeMeasurements } from "@/components/LineDrawingAnimator/LineDrawingAnimator.types";

// Namespaced so this tool's autosave can't collide with any other goodie's.
const STORAGE_KEY = "line-drawing-animator:state";

// Batches a burst of edits into one localStorage write.
const AUTOSAVE_DEBOUNCE_MS = 400;

// Long enough to skip the half-typed markup between keystrokes — each parse remounts the page and re-measures every stroke.
const PARSE_DEBOUNCE_MS = 300;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's autosave, then the default signature — same priority order as every other goodie.
function loadInitialState(sharedState: string | null): LineDrawingEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return edit.hydrateState(decoded);
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return edit.hydrateState(JSON.parse(raw) as LineDrawingShareableState);
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default drawing rather than crash the page.
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
  Root client component: owns the editor state via useUndoStack, derives the artwork, sequence and
  timeline once per change (every panel reads those same memoised results), and handles both
  forms of persistence — a `?state=` permalink decoded once on mount and a debounced localStorage
  autosave thereafter. Browser measurements live outside the undo stack, since they describe the
  rendered artwork rather than anything someone edited.
*/
export default function LineDrawingAnimator(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<LineDrawingEditorState>(() => loadInitialState(searchParams.get("state")));
  const { state } = undoStack;
  const [artworkSource, setArtworkSource] = useState(state.source);
  const [measurements, setMeasurements] = useState<StrokeMeasurements>({});

  // Debounced so a fast run of edits doesn't hit localStorage on every one.
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

  // Feeds the parser a settled copy of the source rather than every intermediate keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setArtworkSource(state.source), PARSE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [state.source]);

  const artwork = useMemo(() => prepareArtwork(artworkSource), [artworkSource]);
  const order = useMemo(() => resolveOrder(artwork.strokes, measurements, state.settings, state.customOrder), [artwork.strokes, measurements, state.settings, state.customOrder]);
  const timeline = useMemo(() => buildTimeline(artwork, order, measurements, state.settings, state.overrides), [artwork, order, measurements, state.settings, state.overrides]);
  const exportInput: LineDrawingExportInput = useMemo(() => ({ artwork, timeline, settings: state.settings }), [artwork, timeline, state.settings]);

  const actions: LineDrawingActions = useMemo(
    () => ({
      setSource: (source) => undoStack.setPresent((s) => edit.setSource(s, source)),
      loadFile: (source) => undoStack.commit((s) => edit.setSource(s, source)),
      setSettingLive: (key, value) => undoStack.setPresent((s) => edit.setSetting(s, key, value)),
      setSetting: (key, value) => undoStack.commit((s) => edit.setSetting(s, key, value)),
      setOverride: (index, patch) => undoStack.commit((s) => edit.setOverride(s, index, patch)),
      setOverrideLive: (index, patch) => undoStack.setPresent((s) => edit.setOverride(s, index, patch)),
      clearOverrides: () => undoStack.commit((s) => edit.clearOverrides(s)),
      moveStroke: (sequence, from, to) => undoStack.commit((s) => edit.moveStroke(s, sequence, from, to)),
      commitEdit: () => undoStack.commit(),
      applyPreset: (preset) => undoStack.commit(() => edit.applyPreset(preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetAnimator: () => undoStack.commit(() => edit.resetAnimator())
    }),
    [undoStack]
  );

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z work anywhere inside the tool except text fields, which keep the browser's finer-grained native undo.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
    if (isTextEditingTarget(event.target)) return;
    event.preventDefault();
    if (event.shiftKey) actions.redo();
    else actions.undo();
  }

  return (
    <>
      <WritingDesk onKeyDown={handleKeyDown}>
        <DeskHeader>
          <HeaderLead aria-hidden="true">
            <InkWell />
            <Nameplate>Line Drawing Animator</Nameplate>
          </HeaderLead>
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
            <Tooltip content="Reset to the default signature">
              <BrassButton type="button" onClick={actions.resetAnimator} aria-label="Reset to the default signature">
                <RefreshIcon size={16} />
              </BrassButton>
            </Tooltip>
          </ToolbarRow>
        </DeskHeader>

        <DeskGrid>
          <DeskColumn>
            <StagePane key={artworkSource} artwork={artwork} timeline={timeline} settings={state.settings} measurements={measurements} onMeasure={setMeasurements} />
            <StrokeLedger artwork={artwork} timeline={timeline} state={state} actions={actions} />
          </DeskColumn>
          <DeskColumn>
            <InputPanel state={state} artwork={artwork} actions={actions} />
            <SettingsPanel settings={state.settings} actions={actions} />
          </DeskColumn>
        </DeskGrid>

        <ExportPanel input={exportInput} />

        <TrayRow>
          <PresetGallery actions={actions} />
          <ShareControls state={state} />
        </TrayRow>
      </WritingDesk>
    </>
  );
}

LineDrawingAnimator.displayName = "LineDrawingAnimator";
