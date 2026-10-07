"use client";

import { useEffect, useMemo, useState } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { analysePath, decodeShareableState, EMPTY_ANALYSIS, getSubjectGeometry, SUBJECT_PATHS } from "@/components/StrokeLab/StrokeLab.utils";
import * as edit from "@/components/StrokeLab/StrokeLab.helpers";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import Stage from "@/components/StrokeLab/Stage/Stage";
import ThreadControls from "@/components/StrokeLab/ThreadControls/ThreadControls";
import DashTape from "@/components/StrokeLab/DashTape/DashTape";
import ThreadSpools from "@/components/StrokeLab/ThreadSpools/ThreadSpools";
import JoinCards from "@/components/StrokeLab/JoinCards/JoinCards";
import SeamGauge from "@/components/StrokeLab/SeamGauge/SeamGauge";
import ScaleDemo from "@/components/StrokeLab/ScaleDemo/ScaleDemo";
import DrawOnPanel from "@/components/StrokeLab/DrawOnPanel/DrawOnPanel";
import ExportPanel from "@/components/StrokeLab/ExportPanel/ExportPanel";
import PresetGallery from "@/components/StrokeLab/PresetGallery/PresetGallery";
import ShareControls from "@/components/StrokeLab/ShareControls/ShareControls";
import {
  Haberdashery,
  ShopSign,
  WovenLabel,
  LabelTitle,
  LabelSub,
  ToolbarRow,
  SewingButton,
  LabGrid,
  StageColumn,
  ControlsColumn,
  TrayRow
} from "@/components/StrokeLab/StrokeLab.styles";
import type { LinejoinSupport, StrokeLabActions, StrokeLabEditorState } from "@/components/StrokeLab/StrokeLab.types";

// Namespaced so the lab's autosave never collides with another goodie's.
const STORAGE_KEY = "stroke-lab:state";

// Long enough to skip the intermediate frames of a slider drag before writing to storage.
const AUTOSAVE_DEBOUNCE_MS = 400;

// Strongest starting state first: a shared `?state=` link, then the last session's autosave, then the defaults — the same order every goodie uses.
function loadInitialState(sharedState: string | null): StrokeLabEditorState {
  if (sharedState) {
    const decoded = edit.sanitiseState(decodeShareableState(sharedState));
    if (decoded) return decoded;
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = edit.sanitiseState(JSON.parse(raw));
        if (saved) return saved;
      }
    } catch {
      // Corrupt or unavailable storage (private browsing, quota) — fall through to the defaults rather than crash.
    }
  }
  return edit.createDefaultEditorState();
}

// Text and number fields keep their own native undo; hijacking Ctrl+Z there would rewind a whole typing run.
function isTextEditingTarget(target: EventTarget): boolean {
  if (target instanceof HTMLTextAreaElement) return true;
  return target instanceof HTMLInputElement && ["text", "search", "url", "email", "number"].includes(target.type);
}

/*
  Root client component: owns the editor state through useUndoStack, parses the subject once per
  change so every panel shares one analysis, and handles persistence — a `?state=` permalink read on
  mount and a debounced localStorage autosave after that. Join support is probed once, since it's a
  property of the browser rather than of the state.
*/
export default function StrokeLab(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<StrokeLabEditorState>(() => loadInitialState(searchParams.get("state")));
  const { state } = undoStack;
  const reducedMotion = usePrefersReducedMotion();
  const [joinSupport] = useState<LinejoinSupport>(() => edit.detectLinejoinSupport());

  // Debounced so a drag writes once when it settles, not on every tick.
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

  // Only the subject's path data matters to the analysis, so stroke tweaks never re-parse.
  const pathData = state.subject === "text" ? null : state.subject === "custom" ? state.customPath : SUBJECT_PATHS[state.subject];
  const analysis = useMemo(() => (pathData === null ? EMPTY_ANALYSIS : analysePath(pathData)), [pathData]);
  const geometry = useMemo(() => getSubjectGeometry(state, analysis), [state, analysis]);

  const actions: StrokeLabActions = useMemo(
    () => ({
      update: (patch) => undoStack.setPresent((s) => edit.patchState(s, patch)),
      apply: (patch) => undoStack.commit((s) => edit.patchState(s, patch)),
      updateOverlays: (patch) => undoStack.commit((s) => edit.patchOverlays(s, patch)),
      updateDrawOn: (patch, record) => (record ? undoStack.commit((s) => edit.patchDrawOn(s, patch)) : undoStack.setPresent((s) => edit.patchDrawOn(s, patch))),
      commitEdit: () => undoStack.commit(),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetLab: () => undoStack.commit(() => edit.createDefaultEditorState())
    }),
    [undoStack]
  );

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z anywhere in the lab except text fields, which keep the browser's finer-grained undo.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
    if (isTextEditingTarget(event.target)) return;
    event.preventDefault();
    if (event.shiftKey) actions.redo();
    else actions.undo();
  }

  return (
    <>
      <Haberdashery onKeyDown={handleKeyDown}>
        <ShopSign>
          <WovenLabel aria-hidden="true">
            <LabelTitle>Stroke Lab</LabelTitle>
            <LabelSub>Haberdashery · threads, stitches &amp; seams</LabelSub>
          </WovenLabel>
          <ToolbarRow>
            <Tooltip content="Undo">
              <SewingButton type="button" onClick={actions.undo} disabled={!actions.canUndo} aria-label="Undo">
                <UndoIcon size={16} />
              </SewingButton>
            </Tooltip>
            <Tooltip content="Redo">
              <SewingButton type="button" onClick={actions.redo} disabled={!actions.canRedo} aria-label="Redo">
                <RedoIcon size={16} />
              </SewingButton>
            </Tooltip>
            <Tooltip content="Reset the lab">
              <SewingButton type="button" onClick={actions.resetLab} aria-label="Reset the lab">
                <RefreshIcon size={16} />
              </SewingButton>
            </Tooltip>
          </ToolbarRow>
        </ShopSign>

        <LabGrid>
          <StageColumn>
            <Stage state={state} actions={actions} geometry={geometry} analysis={analysis} reducedMotion={reducedMotion} joinSupport={joinSupport} />
          </StageColumn>
          <ControlsColumn>
            <ThreadControls state={state} actions={actions} />
            <DashTape state={state} actions={actions} reducedMotion={reducedMotion} />
            <ThreadSpools state={state} actions={actions} />
            <JoinCards state={state} actions={actions} joinSupport={joinSupport} />
            <SeamGauge state={state} actions={actions} analysis={analysis} joinSupport={joinSupport} />
            <ScaleDemo state={state} actions={actions} />
          </ControlsColumn>
        </LabGrid>

        <DrawOnPanel state={state} actions={actions} geometry={geometry} reducedMotion={reducedMotion} />
        <ExportPanel state={state} geometry={geometry} />

        <TrayRow>
          <PresetGallery actions={actions} />
          <ShareControls state={state} />
        </TrayRow>
      </Haberdashery>
    </>
  );
}

StrokeLab.displayName = "StrokeLab";
