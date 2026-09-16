"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/filter-serialize";
import * as edit from "@/helpers/filter-editor";
import { FrostedPanelIcon, UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import TargetControls from "@/components/FilterGenerator/TargetControls/TargetControls";
import FunctionList from "@/components/FilterGenerator/FunctionList/FunctionList";
import PanelControls from "@/components/FilterGenerator/PanelControls/PanelControls";
import PreviewPane from "@/components/FilterGenerator/PreviewPane/PreviewPane";
import ExportPanel from "@/components/FilterGenerator/ExportPanel/ExportPanel";
import PresetGallery from "@/components/FilterGenerator/PresetGallery/PresetGallery";
import ShareControls from "@/components/FilterGenerator/ShareControls/ShareControls";
import { Bench, BenchHeader, BenchTitle, StatusLED, ControlDeck, ControlDeckButton, Layout, MainColumn, SidePanel } from "@/components/FilterGenerator/FilterGenerator.styles";
import type { FilterActions, FilterEditorState } from "@/interfaces/filter";

const STORAGE_KEY = "filter-generator:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Deterministic across server and first client render: a shared `?state=` link decodes the same way on both, otherwise the fresh default filter. Never touches localStorage here — that varies between the server (no `window`) and the client's hydration render, which would mismatch the SSR markup. The last session's own autosave is instead restored in a post-mount effect below.
function loadInitialState(sharedState: string | null): FilterEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return decoded;
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire editor's state via useUndoStack, derives one
  FilterActions object every subcomponent shares, and handles the two forms of persistence — a
  `?state=` permalink decoded once on mount, and a debounced localStorage autosave thereafter.
  Structurally a near-mirror of the other four goodies' own root component; kept as its own copy
  rather than a shared "generator shell" since none of the five tools' state shapes or action sets
  actually overlap.
*/
export default function FilterGenerator(): JSX.Element {
  const searchParams = useSearchParams();
  const sharedState = searchParams.get("state");
  const undoStack = useUndoStack<FilterEditorState>(() => loadInitialState(sharedState));
  const { state, reset } = undoStack;

  // Runs once after hydration to restore the last session's autosave — localStorage is unavailable during SSR/the client's first render, so reading it here (rather than in the lazy initial-state above) keeps that first render identical on server and client. Skipped when a `?state=` permalink already supplied the initial state.
  useEffect(() => {
    if (sharedState && decodeShareableState(sharedState)) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) reset(JSON.parse(raw) as FilterEditorState);
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — keep the default filter.
    }
  }, [sharedState, reset]);

  // Debounced so a drag's stream of setPresent calls doesn't hit localStorage on every frame — only once activity settles.
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Storage unavailable/full — autosave is a convenience, not a guarantee.
      }
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [state]);

  const actions: FilterActions = useMemo(
    () => ({
      setTarget: (target) => undoStack.commit((s) => edit.setTarget(s, target)),
      toggleFunction: (name, enabled) => undoStack.commit((s) => edit.toggleFunction(s, name, enabled)),
      setFunctionValue: (name, value) => undoStack.setPresent((s) => edit.setFunctionValue(s, name, value)),
      toggleDropShadow: (enabled) => undoStack.commit((s) => edit.toggleDropShadow(s, enabled)),
      updateDropShadow: (patch) => undoStack.setPresent((s) => edit.updateDropShadow(s, patch)),
      setPreviewSubject: (subject) => undoStack.commit((s) => edit.setPreviewSubject(s, subject)),
      setPreviewImageId: (id) => undoStack.commit((s) => edit.setPreviewImageId(s, id)),
      setPanelColor: (color) => undoStack.setPresent((s) => edit.setPanelColor(s, color)),
      setPanelOpacity: (opacity) => undoStack.setPresent((s) => edit.setPanelOpacity(s, opacity)),
      commitDrag: () => undoStack.commit(),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetFilter: () => undoStack.commit(() => edit.resetFilter())
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
      <Bench onKeyDown={handleKeyDown}>
        <BenchHeader>
          <BenchTitle>
            <StatusLED aria-hidden="true" />
            <FrostedPanelIcon size={16} aria-hidden="true" />
            Optics Bench
          </BenchTitle>

          <ControlDeck>
            <Tooltip content="Undo">
              <ControlDeckButton type="button" onClick={actions.undo} disabled={!actions.canUndo} aria-label="Undo">
                <UndoIcon size={16} />
              </ControlDeckButton>
            </Tooltip>
            <Tooltip content="Redo">
              <ControlDeckButton type="button" onClick={actions.redo} disabled={!actions.canRedo} aria-label="Redo">
                <RedoIcon size={16} />
              </ControlDeckButton>
            </Tooltip>
            <Tooltip content="Reset filter">
              <ControlDeckButton type="button" onClick={actions.resetFilter} aria-label="Reset filter">
                <RefreshIcon size={16} />
              </ControlDeckButton>
            </Tooltip>
          </ControlDeck>
        </BenchHeader>

        <Layout>
          <MainColumn>
            <PreviewPane state={state} />
            <FunctionList state={state} actions={actions} />
            <ExportPanel state={state} />
          </MainColumn>

          <SidePanel>
            <TargetControls state={state} actions={actions} />
            <PanelControls state={state} actions={actions} />
            <PresetGallery actions={actions} />
            <ShareControls state={state} />
          </SidePanel>
        </Layout>
      </Bench>
    </>
  );
}

FilterGenerator.displayName = "FilterGenerator";
