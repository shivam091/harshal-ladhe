"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/text-effects-serialize";
import * as edit from "@/helpers/text-effects-editor";
import { TextEffectsIcon, UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import TextControls from "@/components/TextEffectsGenerator/TextControls/TextControls";
import ShadowLayerList from "@/components/TextEffectsGenerator/ShadowLayerList/ShadowLayerList";
import ShadowLayerControls from "@/components/TextEffectsGenerator/ShadowLayerControls/ShadowLayerControls";
import GradientFillControls from "@/components/TextEffectsGenerator/GradientFillControls/GradientFillControls";
import PreviewPane from "@/components/TextEffectsGenerator/PreviewPane/PreviewPane";
import ExportPanel from "@/components/TextEffectsGenerator/ExportPanel/ExportPanel";
import PresetGallery from "@/components/TextEffectsGenerator/PresetGallery/PresetGallery";
import ShareControls from "@/components/TextEffectsGenerator/ShareControls/ShareControls";
import { Broadsheet, MastheadRow, MastheadRule, MastheadTitle, PressDot, ProofTray, ProofButton, Layout, MainColumn, SidePanel, Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/TextEffectsGenerator/TextEffectsGenerator.styles";
import type { TextEffectsActions, TextEffectsEditorState, TextEffectsShareableState } from "@/interfaces/text-effects";

const STORAGE_KEY = "text-effects-generator:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Deterministic across server and first client render: a shared `?state=` link decodes the same way on both, otherwise the fresh default look. Never touches localStorage here — that varies between the server (no `window`) and the client's hydration render, which would mismatch the SSR markup. The last session's own autosave is instead restored in a post-mount effect below.
function loadInitialState(sharedState: string | null): TextEffectsEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return { ...decoded, selectedLayerId: decoded.shadowLayers[0]?.id ?? null };
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire editor's state via useUndoStack, derives one
  TextEffectsActions object every subcomponent shares, and handles the two forms of persistence —
  a `?state=` permalink decoded once on mount, and a debounced localStorage autosave thereafter.
  Structurally a near-mirror of BoxShadowGenerator/CronBuilder/RegexTester's own root components.
*/
export default function TextEffectsGenerator(): JSX.Element {
  const searchParams = useSearchParams();
  const sharedState = searchParams.get("state");
  const undoStack = useUndoStack<TextEffectsEditorState>(() => loadInitialState(sharedState));
  const { state, reset } = undoStack;

  // Runs once after hydration to restore the last session's autosave — localStorage is unavailable during SSR/the client's first render, so reading it here (rather than in the lazy initial-state above) keeps that first render identical on server and client. Skipped when a `?state=` permalink already supplied the initial state.
  useEffect(() => {
    if (sharedState && decodeShareableState(sharedState)) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as TextEffectsShareableState;
        reset({ ...parsed, selectedLayerId: parsed.shadowLayers[0]?.id ?? null });
      }
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — keep the default look.
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

  const actions: TextEffectsActions = useMemo(
    () => ({
      setText: (text) => undoStack.setPresent((s) => edit.setText(s, text)),
      setFontSize: (size) => undoStack.setPresent((s) => edit.setFontSize(s, size)),
      setFontWeight: (weight) => undoStack.setPresent((s) => edit.setFontWeight(s, weight)),
      setTextColor: (color) => undoStack.setPresent((s) => edit.setTextColor(s, color)),
      addShadowLayer: () => undoStack.commit((s) => edit.addShadowLayer(s)),
      duplicateShadowLayer: (id) => undoStack.commit((s) => edit.duplicateShadowLayer(s, id)),
      removeShadowLayer: (id) => undoStack.commit((s) => edit.removeShadowLayer(s, id)),
      selectLayer: (id) => undoStack.setPresent((s) => edit.selectLayer(s, id)),
      updateShadowLayer: (id, patch) => undoStack.setPresent((s) => edit.updateShadowLayer(s, id, patch)),
      toggleGradientFill: (enabled) => undoStack.commit((s) => edit.toggleGradientFill(s, enabled)),
      setGradientType: (type) => undoStack.commit((s) => edit.setGradientType(s, type)),
      setGradientAngle: (angle) => undoStack.setPresent((s) => edit.setGradientAngle(s, angle)),
      addGradientStop: () => undoStack.commit((s) => edit.addGradientStop(s)),
      removeGradientStop: (id) => undoStack.commit((s) => edit.removeGradientStop(s, id)),
      updateGradientStop: (id, patch) => undoStack.setPresent((s) => edit.updateGradientStop(s, id, patch)),
      setPageColor: (color) => undoStack.setPresent((s) => edit.setPageColor(s, color)),
      commitDrag: () => undoStack.commit(),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetEffects: () => undoStack.commit((s) => edit.resetEffects(s))
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
      <Broadsheet onKeyDown={handleKeyDown}>
        <MastheadRow>
          <MastheadTitle>
            <PressDot aria-hidden="true" />
            <TextEffectsIcon size={16} aria-hidden="true" />
            Editorial Stage
          </MastheadTitle>

          <ProofTray>
            <Tooltip content="Undo">
              <ProofButton type="button" onClick={actions.undo} disabled={!actions.canUndo} aria-label="Undo">
                <UndoIcon size={16} />
              </ProofButton>
            </Tooltip>
            <Tooltip content="Redo">
              <ProofButton type="button" onClick={actions.redo} disabled={!actions.canRedo} aria-label="Redo">
                <RedoIcon size={16} />
              </ProofButton>
            </Tooltip>
            <Tooltip content="Reset">
              <ProofButton type="button" onClick={actions.resetEffects} aria-label="Reset">
                <RefreshIcon size={16} />
              </ProofButton>
            </Tooltip>
          </ProofTray>

          <MastheadRule aria-hidden="true" />
        </MastheadRow>

        <Layout>
          <MainColumn>
            <PreviewPane state={state} />
            <ExportPanel state={state} />
          </MainColumn>

          <SidePanel>
            <Panel>
              <PanelHeader>
                <PanelTitle>Text</PanelTitle>
              </PanelHeader>
              <PanelBody>
                <TextControls state={state} actions={actions} />
              </PanelBody>
            </Panel>

            <ShadowLayerList state={state} actions={actions} />

            <Panel>
              <PanelHeader>
                <PanelTitle>Layer spec</PanelTitle>
              </PanelHeader>
              <PanelBody>
                <ShadowLayerControls state={state} actions={actions} />
              </PanelBody>
            </Panel>

            <Panel>
              <PanelHeader>
                <PanelTitle>Gradient fill</PanelTitle>
              </PanelHeader>
              <PanelBody>
                <GradientFillControls state={state} actions={actions} />
              </PanelBody>
            </Panel>

            <PresetGallery actions={actions} />
            <ShareControls state={state} />
          </SidePanel>
        </Layout>
      </Broadsheet>
    </>
  );
}

TextEffectsGenerator.displayName = "TextEffectsGenerator";
