"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/box-shadow-serialize";
import * as edit from "@/helpers/box-shadow-editor";
import { BoxShadowIcon, UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import LayerList from "@/components/BoxShadowGenerator/LayerList/LayerList";
import LayerControls from "@/components/BoxShadowGenerator/LayerControls/LayerControls";
import SurfaceControls from "@/components/BoxShadowGenerator/SurfaceControls/SurfaceControls";
import PreviewPane from "@/components/BoxShadowGenerator/PreviewPane/PreviewPane";
import ExportPanel from "@/components/BoxShadowGenerator/ExportPanel/ExportPanel";
import PresetGallery from "@/components/BoxShadowGenerator/PresetGallery/PresetGallery";
import ShareControls from "@/components/BoxShadowGenerator/ShareControls/ShareControls";
import { Tabletop, TabletopHeader, TabletopTitle, AmbientPulse, ToolTray, ToolTrayButton, Layout, MainColumn, SidePanel } from "@/components/BoxShadowGenerator/BoxShadowGenerator.styles";
import type { BoxShadowActions, BoxShadowEditorState, BoxShadowShareableState } from "@/interfaces/box-shadow";

const STORAGE_KEY = "box-shadow-generator:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Deterministic across server and first client render: a shared `?state=` link decodes the same way on both, otherwise the fresh default shadow. Never touches localStorage here — that varies between the server (no `window`) and the client's hydration render, which would mismatch the SSR markup. The last session's own autosave is instead restored in a post-mount effect below.
function loadInitialState(sharedState: string | null): BoxShadowEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return { ...decoded, selectedLayerId: decoded.layers[0]?.id ?? null };
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire editor's state via useUndoStack, derives one
  BoxShadowActions object every subcomponent shares, and handles the two forms of persistence — a
  `?state=` permalink decoded once on mount, and a debounced localStorage autosave thereafter.
  Structurally a near-mirror of CronBuilder/RegexTester's own root components.
*/
export default function BoxShadowGenerator(): JSX.Element {
  const searchParams = useSearchParams();
  const sharedState = searchParams.get("state");
  const undoStack = useUndoStack<BoxShadowEditorState>(() => loadInitialState(sharedState));
  const { state, reset } = undoStack;

  // Runs once after hydration to restore the last session's autosave — localStorage is unavailable during SSR/the client's first render, so reading it here (rather than in the lazy initial-state above) keeps that first render identical on server and client. Skipped when a `?state=` permalink already supplied the initial state.
  useEffect(() => {
    if (sharedState && decodeShareableState(sharedState)) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as BoxShadowShareableState;
        reset({ ...parsed, selectedLayerId: parsed.layers[0]?.id ?? null });
      }
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — keep the default shadow.
    }
  }, [sharedState, reset]);

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

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z work anywhere inside the tool, not just while a field has focus.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
    event.preventDefault();
    if (event.shiftKey) actions.redo();
    else actions.undo();
  }

  return (
    <>
      <Tabletop onKeyDown={handleKeyDown}>
        <TabletopHeader>
          <TabletopTitle>
            <AmbientPulse aria-hidden="true" />
            <BoxShadowIcon size={16} aria-hidden="true" />
            Elevation Stack
          </TabletopTitle>

          <ToolTray>
            <Tooltip content="Undo">
              <ToolTrayButton type="button" onClick={actions.undo} disabled={!actions.canUndo} aria-label="Undo">
                <UndoIcon size={16} />
              </ToolTrayButton>
            </Tooltip>
            <Tooltip content="Redo">
              <ToolTrayButton type="button" onClick={actions.redo} disabled={!actions.canRedo} aria-label="Redo">
                <RedoIcon size={16} />
              </ToolTrayButton>
            </Tooltip>
            <Tooltip content="Reset shadow">
              <ToolTrayButton type="button" onClick={actions.resetShadow} aria-label="Reset shadow">
                <RefreshIcon size={16} />
              </ToolTrayButton>
            </Tooltip>
          </ToolTray>
        </TabletopHeader>

        <Layout>
          <MainColumn>
            <PreviewPane state={state} />
            <LayerList state={state} actions={actions} />
            <ExportPanel state={state} />
          </MainColumn>

          <SidePanel>
            <LayerControls state={state} actions={actions} />
            <SurfaceControls state={state} actions={actions} />
            <PresetGallery actions={actions} />
            <ShareControls state={state} />
          </SidePanel>
        </Layout>
      </Tabletop>
    </>
  );
}

BoxShadowGenerator.displayName = "BoxShadowGenerator";
