"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/filter-serialize";
import * as edit from "@/helpers/filter-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import TargetControls from "@/components/FilterGenerator/TargetControls/TargetControls";
import FunctionList from "@/components/FilterGenerator/FunctionList/FunctionList";
import PanelControls from "@/components/FilterGenerator/PanelControls/PanelControls";
import PreviewPane from "@/components/FilterGenerator/PreviewPane/PreviewPane";
import ExportPanel from "@/components/FilterGenerator/ExportPanel/ExportPanel";
import PresetGallery from "@/components/FilterGenerator/PresetGallery/PresetGallery";
import ShareControls from "@/components/FilterGenerator/ShareControls/ShareControls";
import {
  SectionCard,
  PanelTitle,
  GeneratorWrapper,
  ToolbarRow,
  ToolbarButton,
  GeneratorGrid,
  SidePanel,
  MainColumn
} from "@/components/FilterGenerator/FilterGenerator.styles";
import type { FilterActions, FilterEditorState } from "@/interfaces/filter";

const STORAGE_KEY = "filter-generator:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's own localStorage autosave, then a fresh default filter — same priority order as every other goodie's own loadInitialState.
function loadInitialState(sharedState: string | null): FilterEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return decoded;
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as FilterEditorState;
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default filter rather than crash the page.
    }
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
  const undoStack = useUndoStack<FilterEditorState>(() => loadInitialState(searchParams.get("state")));
  const { state } = undoStack;

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
          <Tooltip content="Reset filter">
            <ToolbarButton type="button" onClick={actions.resetFilter} aria-label="Reset filter">
              <RefreshIcon size={16} />
            </ToolbarButton>
          </Tooltip>
        </ToolbarRow>

        <GeneratorGrid>
          <SidePanel>
            <SectionCard>
              <PanelTitle>Target</PanelTitle>
              <TargetControls state={state} actions={actions} />
            </SectionCard>
            <SectionCard>
              <PanelTitle>Functions</PanelTitle>
              <FunctionList state={state} actions={actions} />
            </SectionCard>
            <SectionCard>
              <PanelTitle>Preview</PanelTitle>
              <PanelControls state={state} actions={actions} />
            </SectionCard>
            <PresetGallery actions={actions} />
            <ShareControls state={state} />
          </SidePanel>

          <MainColumn>
            <PreviewPane state={state} />
            <ExportPanel state={state} />
          </MainColumn>
        </GeneratorGrid>
      </GeneratorWrapper>
    </>
  );
}

FilterGenerator.displayName = "FilterGenerator";
