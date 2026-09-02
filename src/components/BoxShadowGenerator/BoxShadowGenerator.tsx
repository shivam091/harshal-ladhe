"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/box-shadow-serialize";
import * as edit from "@/helpers/box-shadow-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import LayerList from "@/components/BoxShadowGenerator/LayerList/LayerList";
import LayerControls from "@/components/BoxShadowGenerator/LayerControls/LayerControls";
import SurfaceControls from "@/components/BoxShadowGenerator/SurfaceControls/SurfaceControls";
import PreviewPane from "@/components/BoxShadowGenerator/PreviewPane/PreviewPane";
import ExportPanel from "@/components/BoxShadowGenerator/ExportPanel/ExportPanel";
import PresetGallery from "@/components/BoxShadowGenerator/PresetGallery/PresetGallery";
import ShareControls from "@/components/BoxShadowGenerator/ShareControls/ShareControls";
import {
  SectionCard,
  PanelTitle,
  GeneratorWrapper,
  ToolbarRow,
  ToolbarButton,
  GeneratorGrid,
  SidePanel,
  MainColumn
} from "@/components/BoxShadowGenerator/BoxShadowGenerator.styles";
import type { BoxShadowActions, BoxShadowEditorState, BoxShadowShareableState } from "@/interfaces/box-shadow";

const STORAGE_KEY = "box-shadow-generator:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's own localStorage autosave, then a fresh default shadow — same priority order as ClipPathGenerator/GradientGenerator's own loadInitialState, for the same reason.
function loadInitialState(sharedState: string | null): BoxShadowEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return { ...decoded, selectedLayerId: decoded.layers[0]?.id ?? null };
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as BoxShadowShareableState;
        return { ...parsed, selectedLayerId: parsed.layers[0]?.id ?? null };
      }
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default shadow rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire editor's state via useUndoStack, derives one
  BoxShadowActions object every subcomponent shares, and handles the two forms of persistence — a
  `?state=` permalink decoded once on mount, and a debounced localStorage autosave thereafter.
  Structurally a near-mirror of ClipPathGenerator.tsx/GradientGenerator.tsx; kept as its own copy
  rather than a shared "generator shell" since the three tools' state shapes and action sets don't
  actually overlap.
*/
export default function BoxShadowGenerator(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<BoxShadowEditorState>(() => loadInitialState(searchParams.get("state")));
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

  const actions: BoxShadowActions = useMemo(
    () => ({
      addLayer: () => undoStack.commit((s) => edit.addLayer(s)),
      duplicateLayer: (id) => undoStack.commit((s) => edit.duplicateLayer(s, id)),
      removeLayer: (id) => undoStack.commit((s) => edit.removeLayer(s, id)),
      selectLayer: (id) => undoStack.setPresent((s) => edit.selectLayer(s, id)),
      moveLayerUp: (id) => undoStack.commit((s) => edit.moveLayerUp(s, id)),
      moveLayerDown: (id) => undoStack.commit((s) => edit.moveLayerDown(s, id)),
      updateLayer: (id, patch) => undoStack.setPresent((s) => edit.updateLayer(s, id, patch)),
      toggleInset: (id, inset) => undoStack.commit((s) => edit.toggleInset(s, id, inset)),
      commitDrag: () => undoStack.commit(),
      setSurfaceColor: (color) => undoStack.setPresent((s) => edit.setSurfaceColor(s, color)),
      setPageColor: (color) => undoStack.setPresent((s) => edit.setPageColor(s, color)),
      setBorderRadius: (radius) => undoStack.setPresent((s) => edit.setBorderRadius(s, radius)),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetShadow: () => undoStack.commit(() => edit.resetShadow())
    }),
    [undoStack]
  );

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z work anywhere inside the tool, not just while a field has focus — matches ClipPathGenerator/GradientGenerator's own global shortcut.
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
          <Tooltip content="Reset shadow">
            <ToolbarButton type="button" onClick={actions.resetShadow} aria-label="Reset shadow">
              <RefreshIcon size={16} />
            </ToolbarButton>
          </Tooltip>
        </ToolbarRow>

        <GeneratorGrid>
          <SidePanel>
            <SectionCard>
              <PanelTitle>Layers</PanelTitle>
              <LayerList state={state} actions={actions} />
            </SectionCard>
            <SectionCard>
              <PanelTitle>Layer</PanelTitle>
              <LayerControls state={state} actions={actions} />
            </SectionCard>
            <SectionCard>
              <PanelTitle>Surface</PanelTitle>
              <SurfaceControls state={state} actions={actions} />
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

BoxShadowGenerator.displayName = "BoxShadowGenerator";
