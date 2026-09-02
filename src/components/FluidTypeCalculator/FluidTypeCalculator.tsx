"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/fluid-type-serialize";
import * as edit from "@/helpers/fluid-type-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import ViewportControls from "@/components/FluidTypeCalculator/ViewportControls/ViewportControls";
import StepList from "@/components/FluidTypeCalculator/StepList/StepList";
import StepControls from "@/components/FluidTypeCalculator/StepControls/StepControls";
import PreviewPane from "@/components/FluidTypeCalculator/PreviewPane/PreviewPane";
import ExportPanel from "@/components/FluidTypeCalculator/ExportPanel/ExportPanel";
import PresetGallery from "@/components/FluidTypeCalculator/PresetGallery/PresetGallery";
import ShareControls from "@/components/FluidTypeCalculator/ShareControls/ShareControls";
import {
  SectionCard,
  PanelTitle,
  GeneratorWrapper,
  ToolbarRow,
  ToolbarButton,
  GeneratorGrid,
  SidePanel,
  MainColumn
} from "@/components/FluidTypeCalculator/FluidTypeCalculator.styles";
import type { FluidTypeActions, FluidTypeEditorState, FluidTypeShareableState } from "@/interfaces/fluid-type";

const STORAGE_KEY = "fluid-type-calculator:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's own localStorage autosave, then a fresh default scale — same priority order as every other goodie's own loadInitialState.
function loadInitialState(sharedState: string | null): FluidTypeEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return { ...decoded, selectedStepId: decoded.steps[0]?.id ?? null, previewWidth: decoded.minViewport };
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as FluidTypeShareableState;
        return { ...parsed, selectedStepId: parsed.steps[0]?.id ?? null, previewWidth: parsed.minViewport };
      }
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default scale rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire calculator's state via useUndoStack, derives one
  FluidTypeActions object every subcomponent shares, and handles the two forms of persistence — a
  `?state=` permalink decoded once on mount, and a debounced localStorage autosave thereafter.
  Structurally a near-mirror of the other goodies' own root component; kept as its own copy rather
  than a shared "generator shell" since none of these tools' state shapes or action sets actually overlap.
*/
export default function FluidTypeCalculator(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<FluidTypeEditorState>(() => loadInitialState(searchParams.get("state")));
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

  const actions: FluidTypeActions = useMemo(
    () => ({
      setMinViewport: (px) => undoStack.setPresent((s) => edit.setMinViewport(s, px)),
      setMaxViewport: (px) => undoStack.setPresent((s) => edit.setMaxViewport(s, px)),
      setRootFontSize: (px) => undoStack.setPresent((s) => edit.setRootFontSize(s, px)),
      addStep: () => undoStack.commit((s) => edit.addStep(s)),
      duplicateStep: (id) => undoStack.commit((s) => edit.duplicateStep(s, id)),
      removeStep: (id) => undoStack.commit((s) => edit.removeStep(s, id)),
      selectStep: (id) => undoStack.setPresent((s) => edit.selectStep(s, id)),
      updateStep: (id, patch) => undoStack.setPresent((s) => edit.updateStep(s, id, patch)),
      setPreviewWidth: (px) => undoStack.setPresent((s) => edit.setPreviewWidth(s, px)),
      setPageColor: (color) => undoStack.setPresent((s) => edit.setPageColor(s, color)),
      commitDrag: () => undoStack.commit(),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetCalculator: () => undoStack.commit(() => edit.resetCalculator())
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
            <ToolbarButton type="button" onClick={actions.resetCalculator} aria-label="Reset">
              <RefreshIcon size={16} />
            </ToolbarButton>
          </Tooltip>
        </ToolbarRow>

        <GeneratorGrid>
          <SidePanel>
            <SectionCard>
              <PanelTitle>Viewport</PanelTitle>
              <ViewportControls state={state} actions={actions} />
            </SectionCard>
            <SectionCard>
              <StepList state={state} actions={actions} />
            </SectionCard>
            <SectionCard>
              <PanelTitle>Step</PanelTitle>
              <StepControls state={state} actions={actions} />
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

FluidTypeCalculator.displayName = "FluidTypeCalculator";
