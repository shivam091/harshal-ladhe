"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/grid-template-builder-serialize";
import * as edit from "@/helpers/grid-template-builder-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import TrackControls from "@/components/GridTemplateBuilder/TrackControls/TrackControls";
import AreaPainter from "@/components/GridTemplateBuilder/AreaPainter/AreaPainter";
import PreviewPane from "@/components/GridTemplateBuilder/PreviewPane/PreviewPane";
import ExportPanel from "@/components/GridTemplateBuilder/ExportPanel/ExportPanel";
import PresetGallery from "@/components/GridTemplateBuilder/PresetGallery/PresetGallery";
import ShareControls from "@/components/GridTemplateBuilder/ShareControls/ShareControls";
import {
  SectionCard,
  PanelTitle,
  Ledger,
  ToolbarRow,
  ToolbarButton,
  GeneratorGrid,
  SidePanel,
  MainColumn
} from "@/components/GridTemplateBuilder/GridTemplateBuilder.styles";
import type { GridTemplateBuilderActions, GridTemplateBuilderEditorState, GridTemplateBuilderShareableState } from "@/interfaces/grid-template-builder";

const STORAGE_KEY = "grid-template-builder:state";
const AUTOSAVE_DEBOUNCE_MS = 400;
// Freshly loaded/shared state carries no brush selection of its own (activeAreaName is excluded from the shareable slice) — "header" gives painting mode something sensible to start with immediately rather than an empty brush.
const DEFAULT_ACTIVE_AREA_NAME = "header";

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's own localStorage autosave, then a fresh default grid — same priority order as every other goodie's own loadInitialState.
function loadInitialState(sharedState: string | null): GridTemplateBuilderEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return { ...decoded, activeAreaName: DEFAULT_ACTIVE_AREA_NAME };
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GridTemplateBuilderShareableState;
        return { ...parsed, activeAreaName: DEFAULT_ACTIVE_AREA_NAME };
      }
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default grid rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire tool's state via useUndoStack, derives one
  GridTemplateBuilderActions object every subcomponent shares, and handles the two forms of
  persistence — a `?state=` permalink decoded once on mount, and a debounced localStorage autosave
  thereafter. Structurally a near-mirror of the other goodies' own root component; kept as its own
  copy rather than a shared "generator shell" since none of these tools' state shapes or action sets
  actually overlap.
*/
export default function GridTemplateBuilder(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<GridTemplateBuilderEditorState>(() => loadInitialState(searchParams.get("state")));
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

  const actions: GridTemplateBuilderActions = useMemo(
    () => ({
      addColumnTrack: () => undoStack.commit((s) => edit.addColumnTrack(s)),
      removeColumnTrack: (id) => undoStack.commit((s) => edit.removeColumnTrack(s, id)),
      updateColumnTrack: (id, patch) => undoStack.setPresent((s) => edit.updateColumnTrack(s, id, patch)),
      addRowTrack: () => undoStack.commit((s) => edit.addRowTrack(s)),
      removeRowTrack: (id) => undoStack.commit((s) => edit.removeRowTrack(s, id)),
      updateRowTrack: (id, patch) => undoStack.setPresent((s) => edit.updateRowTrack(s, id, patch)),
      setRowGap: (gap) => undoStack.setPresent((s) => edit.setRowGap(s, gap)),
      setColumnGap: (gap) => undoStack.setPresent((s) => edit.setColumnGap(s, gap)),
      setAreasEnabled: (enabled) => undoStack.commit((s) => edit.setAreasEnabled(s, enabled)),
      setActiveAreaName: (name) => undoStack.setPresent((s) => edit.setActiveAreaName(s, name)),
      paintArea: (rowStart, rowEnd, colStart, colEnd, name) => undoStack.commit((s) => edit.paintArea(s, rowStart, rowEnd, colStart, colEnd, name)),
      clearAreaName: (name) => undoStack.commit((s) => edit.clearAreaName(s, name)),
      commitDrag: () => undoStack.commit(),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetGrid: () => undoStack.commit(() => edit.resetGrid())
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
      <Ledger onKeyDown={handleKeyDown}>
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
          <Tooltip content="Reset grid">
            <ToolbarButton type="button" onClick={actions.resetGrid} aria-label="Reset grid">
              <RefreshIcon size={16} />
            </ToolbarButton>
          </Tooltip>
        </ToolbarRow>

        <GeneratorGrid>
          <SidePanel>
            <SectionCard>
              <PanelTitle>Tracks &amp; gap</PanelTitle>
              <TrackControls state={state} actions={actions} />
            </SectionCard>
            <SectionCard>
              <PanelTitle>Areas</PanelTitle>
              <AreaPainter state={state} actions={actions} />
            </SectionCard>
            <PresetGallery actions={actions} />
            <ShareControls state={state} />
          </SidePanel>

          <MainColumn>
            <PreviewPane state={state} />
            <ExportPanel state={state} />
          </MainColumn>
        </GeneratorGrid>
      </Ledger>
    </>
  );
}

GridTemplateBuilder.displayName = "GridTemplateBuilder";
