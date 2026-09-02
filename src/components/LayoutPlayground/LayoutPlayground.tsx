"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/layout-playground-serialize";
import * as edit from "@/helpers/layout-playground-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import ModeControls from "@/components/LayoutPlayground/ModeControls/ModeControls";
import FlexContainerControls from "@/components/LayoutPlayground/FlexContainerControls/FlexContainerControls";
import GridContainerControls from "@/components/LayoutPlayground/GridContainerControls/GridContainerControls";
import ItemList from "@/components/LayoutPlayground/ItemList/ItemList";
import ItemControls from "@/components/LayoutPlayground/ItemControls/ItemControls";
import PreviewPane from "@/components/LayoutPlayground/PreviewPane/PreviewPane";
import ExportPanel from "@/components/LayoutPlayground/ExportPanel/ExportPanel";
import PresetGallery from "@/components/LayoutPlayground/PresetGallery/PresetGallery";
import ShareControls from "@/components/LayoutPlayground/ShareControls/ShareControls";
import {
  SectionCard,
  PanelTitle,
  GeneratorWrapper,
  ToolbarRow,
  ToolbarButton,
  GeneratorGrid,
  SidePanel,
  MainColumn
} from "@/components/LayoutPlayground/LayoutPlayground.styles";
import type { LayoutActions, LayoutEditorState, LayoutShareableState } from "@/interfaces/layout-playground";

const STORAGE_KEY = "layout-playground:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's own localStorage autosave, then a fresh default layout — same priority order as every other goodie's own loadInitialState.
function loadInitialState(sharedState: string | null): LayoutEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return { ...decoded, selectedItemId: decoded.items[0]?.id ?? null };
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as LayoutShareableState;
        return { ...parsed, selectedItemId: parsed.items[0]?.id ?? null };
      }
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default layout rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire editor's state via useUndoStack, derives one
  LayoutActions object every subcomponent shares, and handles the two forms of persistence — a
  `?state=` permalink decoded once on mount, and a debounced localStorage autosave thereafter.
  Structurally a near-mirror of the other five goodies' own root component; kept as its own copy
  rather than a shared "generator shell" since none of the six tools' state shapes or action sets
  actually overlap.
*/
export default function LayoutPlayground(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<LayoutEditorState>(() => loadInitialState(searchParams.get("state")));
  const { state } = undoStack;

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

  const actions: LayoutActions = useMemo(
    () => ({
      setMode: (mode) => undoStack.commit((s) => edit.setMode(s, mode)),
      setGap: (gap) => undoStack.setPresent((s) => edit.setGap(s, gap)),
      setContainerWidth: (width) => undoStack.setPresent((s) => edit.setContainerWidth(s, width)),
      updateFlexContainer: (patch) => undoStack.commit((s) => edit.updateFlexContainer(s, patch)),
      updateGridContainer: (patch) => undoStack.commit((s) => edit.updateGridContainer(s, patch)),
      addColumnTrack: () => undoStack.commit((s) => edit.addColumnTrack(s)),
      removeColumnTrack: (id) => undoStack.commit((s) => edit.removeColumnTrack(s, id)),
      updateColumnTrack: (id, patch) => undoStack.setPresent((s) => edit.updateColumnTrack(s, id, patch)),
      addRowTrack: () => undoStack.commit((s) => edit.addRowTrack(s)),
      removeRowTrack: (id) => undoStack.commit((s) => edit.removeRowTrack(s, id)),
      updateRowTrack: (id, patch) => undoStack.setPresent((s) => edit.updateRowTrack(s, id, patch)),
      addItem: () => undoStack.commit((s) => edit.addItem(s)),
      duplicateItem: (id) => undoStack.commit((s) => edit.duplicateItem(s, id)),
      removeItem: (id) => undoStack.commit((s) => edit.removeItem(s, id)),
      selectItem: (id) => undoStack.setPresent((s) => edit.selectItem(s, id)),
      updateFlexItem: (id, patch) => undoStack.setPresent((s) => edit.updateFlexItem(s, id, patch)),
      updateGridItem: (id, patch) => undoStack.setPresent((s) => edit.updateGridItem(s, id, patch)),
      commitDrag: () => undoStack.commit(),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetLayout: () => undoStack.commit(() => edit.resetLayout())
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
          <Tooltip content="Reset layout">
            <ToolbarButton type="button" onClick={actions.resetLayout} aria-label="Reset layout">
              <RefreshIcon size={16} />
            </ToolbarButton>
          </Tooltip>
        </ToolbarRow>

        <GeneratorGrid>
          <SidePanel>
            <SectionCard>
              <PanelTitle>Container</PanelTitle>
              <ModeControls state={state} actions={actions} />
              {state.mode === "flex" ? <FlexContainerControls state={state} actions={actions} /> : <GridContainerControls state={state} actions={actions} />}
            </SectionCard>
            <SectionCard>
              <ItemList state={state} actions={actions} />
            </SectionCard>
            <SectionCard>
              <PanelTitle>Item</PanelTitle>
              <ItemControls state={state} actions={actions} />
            </SectionCard>
            <PresetGallery actions={actions} />
            <ShareControls state={state} />
          </SidePanel>

          <MainColumn>
            <PreviewPane state={state} actions={actions} />
            <ExportPanel state={state} />
          </MainColumn>
        </GeneratorGrid>
      </GeneratorWrapper>
    </>
  );
}

LayoutPlayground.displayName = "LayoutPlayground";
