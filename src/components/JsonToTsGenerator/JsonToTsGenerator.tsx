"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/json-to-ts-serialize";
import * as edit from "@/helpers/json-to-ts-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import InputPanel from "@/components/JsonToTsGenerator/InputPanel/InputPanel";
import ResultPanel from "@/components/JsonToTsGenerator/ResultPanel/ResultPanel";
import PresetGallery from "@/components/JsonToTsGenerator/PresetGallery/PresetGallery";
import ShareControls from "@/components/JsonToTsGenerator/ShareControls/ShareControls";
import { SectionCard, PanelTitle, GeneratorWrapper, ToolbarRow, ToolbarButton, GeneratorGrid, SidePanel, MainColumn } from "@/components/JsonToTsGenerator/JsonToTsGenerator.styles";
import type { JsonToTsActions, JsonToTsEditorState, JsonToTsShareableState } from "@/interfaces/json-to-ts";

const STORAGE_KEY = "json-to-ts-generator:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's own localStorage autosave, then a fresh default example — same priority order as every other goodie's own loadInitialState.
function loadInitialState(sharedState: string | null): JsonToTsEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return decoded;
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as JsonToTsShareableState;
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default example rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire tool's state via useUndoStack, derives one
  JsonToTsActions object every subcomponent shares, and handles the two forms of persistence — a
  `?state=` permalink decoded once on mount, and a debounced localStorage autosave thereafter.
  Structurally a near-mirror of the other goodies' own root component; kept as its own copy rather
  than a shared "generator shell" since none of these tools' state shapes or action sets actually overlap.
*/
export default function JsonToTsGenerator(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<JsonToTsEditorState>(() => loadInitialState(searchParams.get("state")));
  const { state } = undoStack;

  // Debounced so a fast run of keystrokes while pasting/editing source doesn't hit localStorage on every frame — only once activity settles.
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

  const actions: JsonToTsActions = useMemo(
    () => ({
      setDirection: (direction) => undoStack.setPresent((s) => edit.setDirection(s, direction)),
      setJsonSource: (source) => undoStack.setPresent((s) => edit.setJsonSource(s, source)),
      setTsSource: (source) => undoStack.setPresent((s) => edit.setTsSource(s, source)),
      setRootName: (name) => undoStack.setPresent((s) => edit.setRootName(s, name)),
      commitDrag: () => undoStack.commit(),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetConverter: () => undoStack.commit(() => edit.resetConverter())
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
            <ToolbarButton type="button" onClick={actions.resetConverter} aria-label="Reset">
              <RefreshIcon size={16} />
            </ToolbarButton>
          </Tooltip>
        </ToolbarRow>

        <GeneratorGrid>
          <SidePanel>
            <SectionCard>
              <PanelTitle>Input</PanelTitle>
              <InputPanel state={state} actions={actions} />
            </SectionCard>
            <PresetGallery actions={actions} />
            <ShareControls state={state} />
          </SidePanel>

          <MainColumn>
            <ResultPanel state={state} />
          </MainColumn>
        </GeneratorGrid>
      </GeneratorWrapper>
    </>
  );
}

JsonToTsGenerator.displayName = "JsonToTsGenerator";
