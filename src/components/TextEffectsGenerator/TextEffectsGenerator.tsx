"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/text-effects-serialize";
import * as edit from "@/helpers/text-effects-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import TextControls from "@/components/TextEffectsGenerator/TextControls/TextControls";
import ShadowLayerList from "@/components/TextEffectsGenerator/ShadowLayerList/ShadowLayerList";
import ShadowLayerControls from "@/components/TextEffectsGenerator/ShadowLayerControls/ShadowLayerControls";
import GradientFillControls from "@/components/TextEffectsGenerator/GradientFillControls/GradientFillControls";
import PreviewPane from "@/components/TextEffectsGenerator/PreviewPane/PreviewPane";
import ExportPanel from "@/components/TextEffectsGenerator/ExportPanel/ExportPanel";
import PresetGallery from "@/components/TextEffectsGenerator/PresetGallery/PresetGallery";
import ShareControls from "@/components/TextEffectsGenerator/ShareControls/ShareControls";
import {
  SectionCard,
  PanelTitle,
  GeneratorWrapper,
  ToolbarRow,
  ToolbarButton,
  GeneratorGrid,
  SidePanel,
  MainColumn
} from "@/components/TextEffectsGenerator/TextEffectsGenerator.styles";
import type { TextEffectsActions, TextEffectsEditorState, TextEffectsShareableState } from "@/interfaces/text-effects";

const STORAGE_KEY = "text-effects-generator:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's own localStorage autosave, then a fresh default look — same priority order as every other goodie's own loadInitialState.
function loadInitialState(sharedState: string | null): TextEffectsEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return { ...decoded, selectedLayerId: decoded.shadowLayers[0]?.id ?? null };
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as TextEffectsShareableState;
        return { ...parsed, selectedLayerId: parsed.shadowLayers[0]?.id ?? null };
      }
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default look rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire editor's state via useUndoStack, derives one
  TextEffectsActions object every subcomponent shares, and handles the two forms of persistence —
  a `?state=` permalink decoded once on mount, and a debounced localStorage autosave thereafter.
  Structurally a near-mirror of the other eight goodies' own root component; kept as its own copy
  rather than a shared "generator shell" since none of the nine tools' state shapes or action sets
  actually overlap.
*/
export default function TextEffectsGenerator(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<TextEffectsEditorState>(() => loadInitialState(searchParams.get("state")));
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
            <ToolbarButton type="button" onClick={actions.resetEffects} aria-label="Reset">
              <RefreshIcon size={16} />
            </ToolbarButton>
          </Tooltip>
        </ToolbarRow>

        <GeneratorGrid>
          <SidePanel>
            <SectionCard>
              <PanelTitle>Text</PanelTitle>
              <TextControls state={state} actions={actions} />
            </SectionCard>
            <SectionCard>
              <ShadowLayerList state={state} actions={actions} />
            </SectionCard>
            <SectionCard>
              <PanelTitle>Layer</PanelTitle>
              <ShadowLayerControls state={state} actions={actions} />
            </SectionCard>
            <SectionCard>
              <PanelTitle>Gradient fill</PanelTitle>
              <GradientFillControls state={state} actions={actions} />
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

TextEffectsGenerator.displayName = "TextEffectsGenerator";
