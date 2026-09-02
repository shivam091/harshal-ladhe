"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/cron-serialize";
import * as edit from "@/helpers/cron-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import FieldGrid from "@/components/CronBuilder/FieldGrid/FieldGrid";
import DescriptionPanel from "@/components/CronBuilder/DescriptionPanel/DescriptionPanel";
import NextRunsPanel from "@/components/CronBuilder/NextRunsPanel/NextRunsPanel";
import ExportPanel from "@/components/CronBuilder/ExportPanel/ExportPanel";
import PresetGallery from "@/components/CronBuilder/PresetGallery/PresetGallery";
import ShareControls from "@/components/CronBuilder/ShareControls/ShareControls";
import { GeneratorWrapper, ToolbarRow, ToolbarButton, GeneratorGrid, SidePanel, MainColumn } from "@/components/CronBuilder/CronBuilder.styles";
import type { CronActions, CronEditorState, CronShareableState } from "@/interfaces/cron-builder";

const STORAGE_KEY = "cron-expression-builder:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's own localStorage autosave, then a fresh default schedule — same priority order as every other goodie's own loadInitialState.
function loadInitialState(sharedState: string | null): CronEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return decoded;
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as CronShareableState;
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default schedule rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire builder's state via useUndoStack, derives one CronActions
  object every subcomponent shares, and handles the two forms of persistence — a `?state=` permalink
  decoded once on mount, and a debounced localStorage autosave thereafter. Structurally a near-mirror
  of the other goodies' own root component; kept as its own copy rather than a shared "generator
  shell" since none of these tools' state shapes or action sets actually overlap.
*/
export default function CronBuilder(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<CronEditorState>(() => loadInitialState(searchParams.get("state")));
  const { state } = undoStack;

  // Debounced so switching a field's mode or typing in a custom field doesn't hit localStorage on every keystroke — only once activity settles.
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

  const actions: CronActions = useMemo(
    () => ({
      setField: (key, raw) => undoStack.setPresent((s) => edit.setField(s, key, raw)),
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

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z work anywhere inside the tool, not just while a field has focus — matches every other goodie's own global shortcut.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
    event.preventDefault();
    if (event.shiftKey) actions.redo();
    else actions.undo();
  }

  return (
    <>
      <GeneratorWrapper onKeyDown={handleKeyDown}>
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
          <Tooltip content="Reset">
            <ToolbarButton type="button" onClick={actions.resetBuilder} aria-label="Reset">
              <RefreshIcon size={16} />
            </ToolbarButton>
          </Tooltip>
        </ToolbarRow>

        <GeneratorGrid>
          <SidePanel>
            <FieldGrid state={state} actions={actions} />
            <PresetGallery actions={actions} />
            <ShareControls state={state} />
          </SidePanel>

          <MainColumn>
            <DescriptionPanel state={state} />
            <NextRunsPanel state={state} />
            <ExportPanel state={state} />
          </MainColumn>
        </GeneratorGrid>
      </GeneratorWrapper>
    </>
  );
}

CronBuilder.displayName = "CronBuilder";
