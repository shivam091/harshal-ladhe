"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import * as edit from "@/components/MotionPathBuilder/MotionPathBuilder.helpers";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import Baseboard from "@/components/MotionPathBuilder/Baseboard/Baseboard";
import PathControls from "@/components/MotionPathBuilder/PathControls/PathControls";
import ControllerPanel from "@/components/MotionPathBuilder/ControllerPanel/ControllerPanel";
import EasingControls from "@/components/MotionPathBuilder/EasingControls/EasingControls";
import RollingStock from "@/components/MotionPathBuilder/RollingStock/RollingStock";
import ExportPanel from "@/components/MotionPathBuilder/ExportPanel/ExportPanel";
import PresetGallery from "@/components/MotionPathBuilder/PresetGallery/PresetGallery";
import ShareControls from "@/components/MotionPathBuilder/ShareControls/ShareControls";
import {
  RailwayLayout,
  NameBoard,
  Nameplate,
  ToolbarRow,
  CaseButton,
  LayoutGrid,
  MainColumn,
  SideColumn,
  TrayRow
} from "@/components/MotionPathBuilder/MotionPathBuilder.styles";
import type { MotionPathActions, MotionPathEditorState } from "@/components/MotionPathBuilder/MotionPathBuilder.types";

const STORAGE_KEY = "motion-path-builder:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's autosave, then the default wave layout.
function loadInitialState(sharedState: string | null): MotionPathEditorState {
  if (sharedState) {
    const decoded = edit.decodeShareableState(sharedState);
    if (decoded) return decoded;
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return edit.sanitiseState(JSON.parse(raw));
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default layout rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

// Text fields keep their own native undo; hijacking Ctrl+Z there would rewind the layout when someone meant to undo a typed character.
function isTextEditingTarget(target: EventTarget): boolean {
  if (target instanceof HTMLTextAreaElement) return true;
  return target instanceof HTMLInputElement && ["text", "search", "url", "email", "number"].includes(target.type);
}

/*
  Root client component: owns the layout via useUndoStack, derives one MotionPathActions object
  every panel shares, and handles both kinds of persistence — a `?state=` permalink decoded once on
  mount and a debounced localStorage autosave thereafter. Playback state lives in Baseboard
  instead, since undoing an edit should rewind the track, not whether the loco was running.
*/
export default function MotionPathBuilder(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<MotionPathEditorState>(() => loadInitialState(searchParams.get("state")));
  const { state } = undoStack;

  // Debounced so a pin drag's stream of updates doesn't hit localStorage every frame.
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(edit.toShareableState(state)));
      } catch {
        // Storage unavailable or full — autosave is a convenience, not a guarantee.
      }
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [state]);

  const actions: MotionPathActions = useMemo(
    () => ({
      updateVertexPoint: (index, point) => undoStack.setPresent((s) => edit.updateVertexPoint(s, index, point)),
      updateVertexHandle: (index, which, point, altKey) => undoStack.setPresent((s) => edit.updateVertexHandle(s, index, which, point, altKey)),
      commitEdit: () => undoStack.commit(),
      toggleVertexCurve: (index) => undoStack.commit((s) => edit.toggleVertexCurve(s, index)),
      insertVertexAfter: (index, point) => undoStack.commit((s) => edit.insertVertexAfter(s, index, point)),
      appendVertex: (point) => undoStack.commit((s) => edit.appendVertex(s, point)),
      extendTrack: () => undoStack.commit((s) => edit.extendTrack(s)),
      deleteVertex: (index) => undoStack.commit((s) => edit.deleteVertex(s, index)),
      select: (selection) => undoStack.setPresent((s) => ({ ...s, selection })),
      setPenMode: (mode) => undoStack.commit((s) => edit.setPenMode(s, mode)),
      toggleClosed: () => undoStack.commit((s) => edit.toggleClosed(s)),
      loadPath: (vertices, closed) => undoStack.commit((s) => edit.loadPath(s, vertices, closed)),
      previewSetting: (key, value) => undoStack.setPresent((s) => edit.setSetting(s, key, value)),
      applySetting: (key, value) => undoStack.commit((s) => edit.setSetting(s, key, value)),
      setEasingKeyword: (keyword) => undoStack.commit((s) => edit.setEasingKeyword(s, keyword)),
      setBezierValue: (index, value) => undoStack.commit((s) => edit.setBezierValue(s, index, value)),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetLayout: () => undoStack.commit(() => edit.resetLayout())
    }),
    [undoStack]
  );

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z work anywhere in the tool except inside text fields, which keep the browser's own finer-grained undo.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
    if (isTextEditingTarget(event.target)) return;
    event.preventDefault();
    if (event.shiftKey) actions.redo();
    else actions.undo();
  }

  return (
    <>
      <RailwayLayout onKeyDown={handleKeyDown}>
        <NameBoard>
          <Nameplate aria-hidden="true">Motion Path Junction</Nameplate>
          <ToolbarRow>
            <Tooltip content="Undo">
              <CaseButton type="button" onClick={actions.undo} disabled={!actions.canUndo} aria-label="Undo">
                <UndoIcon size={16} />
              </CaseButton>
            </Tooltip>
            <Tooltip content="Redo">
              <CaseButton type="button" onClick={actions.redo} disabled={!actions.canRedo} aria-label="Redo">
                <RedoIcon size={16} />
              </CaseButton>
            </Tooltip>
            <Tooltip content="Reset to the default layout">
              <CaseButton type="button" onClick={actions.resetLayout} aria-label="Reset to the default layout">
                <RefreshIcon size={16} />
              </CaseButton>
            </Tooltip>
          </ToolbarRow>
        </NameBoard>

        <LayoutGrid>
          <MainColumn>
            <Baseboard state={state} actions={actions} />
            <PathControls state={state} actions={actions} />
          </MainColumn>
          <SideColumn>
            <ControllerPanel state={state} actions={actions} />
            <EasingControls state={state} actions={actions} />
            <RollingStock state={state} actions={actions} />
          </SideColumn>
        </LayoutGrid>

        <ExportPanel state={state} />

        <TrayRow>
          <PresetGallery actions={actions} />
          <ShareControls state={state} />
        </TrayRow>
      </RailwayLayout>
    </>
  );
}

MotionPathBuilder.displayName = "MotionPathBuilder";
