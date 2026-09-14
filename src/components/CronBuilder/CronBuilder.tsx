"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/cron-serialize";
import * as edit from "@/helpers/cron-editor";
import { CronIcon, UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import FieldGrid from "@/components/CronBuilder/FieldGrid/FieldGrid";
import DescriptionPanel from "@/components/CronBuilder/DescriptionPanel/DescriptionPanel";
import NextRunsPanel from "@/components/CronBuilder/NextRunsPanel/NextRunsPanel";
import ExportPanel from "@/components/CronBuilder/ExportPanel/ExportPanel";
import PresetGallery from "@/components/CronBuilder/PresetGallery/PresetGallery";
import ShareControls from "@/components/CronBuilder/ShareControls/ShareControls";
import { Console, Deck, DeckTitle, LivePulse, ToolbarRow, ToolbarButton, Layout, MainColumn, SidePanel } from "@/components/CronBuilder/CronBuilder.styles";
import type { CronActions, CronEditorState, CronShareableState } from "@/interfaces/cron-builder";

const STORAGE_KEY = "cron-expression-builder:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Deterministic across server and first client render: a shared `?state=` link decodes the same way on both, otherwise the fresh default schedule. Never touches localStorage here — that varies between the server (no `window`) and the client's hydration render, which would mismatch the SSR markup. The last session's own autosave is instead restored in a post-mount effect below.
function loadInitialState(sharedState: string | null): CronEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return decoded;
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire builder's state via useUndoStack, derives one CronActions
  object every subcomponent shares, and handles the two forms of persistence — a `?state=` permalink
  decoded once on mount, and a debounced localStorage autosave thereafter.
*/
export default function CronBuilder(): JSX.Element {
  const searchParams = useSearchParams();
  const sharedState = searchParams.get("state");
  const undoStack = useUndoStack<CronEditorState>(() => loadInitialState(sharedState));
  const { state, reset } = undoStack;

  // Runs once after hydration to restore the last session's autosave — localStorage is unavailable during SSR/the client's first render, so reading it here (rather than in the lazy initial-state above) keeps that first render identical on server and client. Skipped when a `?state=` permalink already supplied the initial state.
  useEffect(() => {
    if (sharedState && decodeShareableState(sharedState)) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) reset(JSON.parse(raw) as CronShareableState);
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — keep the default schedule.
    }
  }, [sharedState, reset]);

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

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z work anywhere inside the tool, not just while a field has focus.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
    event.preventDefault();
    if (event.shiftKey) actions.redo();
    else actions.undo();
  }

  return (
    <>
      <Console onKeyDown={handleKeyDown}>
        <Deck>
          <DeckTitle>
            <LivePulse aria-hidden="true" />
            <CronIcon size={16} aria-hidden="true" />
            Cron Console
          </DeckTitle>

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
        </Deck>

        <DescriptionPanel state={state} />

        <Layout>
          <MainColumn>
            <FieldGrid state={state} actions={actions} />
            <NextRunsPanel state={state} />
            <ExportPanel state={state} />
          </MainColumn>

          <SidePanel>
            <PresetGallery actions={actions} />
            <ShareControls state={state} />
          </SidePanel>
        </Layout>
      </Console>
    </>
  );
}

CronBuilder.displayName = "CronBuilder";
