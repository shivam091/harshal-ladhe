"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/clip-path-serialize";
import * as edit from "@/helpers/clip-path-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import ShapeControls from "@/components/ClipPathGenerator/ShapeControls/ShapeControls";
import PreviewPane from "@/components/ClipPathGenerator/PreviewPane/PreviewPane";
import ExportPanel from "@/components/ClipPathGenerator/ExportPanel/ExportPanel";
import MorphControls from "@/components/ClipPathGenerator/MorphControls/MorphControls";
import PresetGallery from "@/components/ClipPathGenerator/PresetGallery/PresetGallery";
import ShareControls from "@/components/ClipPathGenerator/ShareControls/ShareControls";
import {
  SectionCard,
  PanelTitle,
  CuttingMat,
  ToolbarRow,
  ToolbarButton,
  GeneratorGrid,
  SidePanel,
  MainColumn
} from "@/components/ClipPathGenerator/ClipPathGenerator.styles";
import type { ClipPathActions, ClipPathEditorState, ClipPathShareableState } from "@/interfaces/clip-path";

const STORAGE_KEY = "clip-path-generator:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's own localStorage autosave, then a fresh default shape — in that order of intent (a link is a deliberate share, a reload should restore unfinished work, and only then does a brand new visitor get the neutral default).
function loadInitialState(sharedState: string | null): ClipPathEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return { ...decoded, selection: null };
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...(JSON.parse(raw) as ClipPathShareableState), selection: null };
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default shape rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire editor's state via useUndoStack, derives one ClipPathActions
  object every subcomponent shares (mirrors DemoControlField's onChange callback style, just widened
  to the many discrete edits this editor supports), and handles the two forms of persistence — a
  `?state=` permalink decoded once on mount, and a debounced localStorage autosave thereafter.
*/
export default function ClipPathGenerator(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<ClipPathEditorState>(() => loadInitialState(searchParams.get("state")));
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

  const actions: ClipPathActions = useMemo(
    () => ({
      setFamily: (family) => undoStack.commit((s) => edit.applyFamily(s, family)),
      updateVertexPoint: (index, point) => undoStack.setPresent((s) => edit.updateVertexPoint(s, index, point)),
      updateVertexHandle: (index, which, point, altKey) => undoStack.setPresent((s) => edit.updateVertexHandle(s, index, which, point, altKey)),
      commitDrag: () => undoStack.commit(),
      toggleVertexCurve: (index) => undoStack.commit((s) => edit.toggleVertexCurve(s, index)),
      insertVertexAfter: (index, point) => undoStack.commit((s) => edit.insertVertexAfter(s, index, point)),
      deleteVertex: (index) => undoStack.commit((s) => edit.deleteVertex(s, index)),
      select: (selection) => undoStack.setPresent((s) => ({ ...s, selection })),
      updateCircle: (patch) => undoStack.setPresent((s) => edit.updateCircle(s, patch)),
      updateEllipse: (patch) => undoStack.setPresent((s) => edit.updateEllipse(s, patch)),
      updateInset: (patch) => undoStack.setPresent((s) => edit.updateInset(s, patch)),
      applyPreset: (shape) => undoStack.commit((s) => edit.applyPreset(s, shape)),
      shuffle: () => undoStack.commit((s) => edit.shuffleShape(s)),
      // Discrete, worth an undo step.
      setPreviewSubject: (subject) => undoStack.commit((s) => ({ ...s, previewSubject: subject })),
      // Continuous (color-picker drag / keystroke) and purely cosmetic — deliberately not undo-tracked, only shape-affecting and discrete choices are.
      setPreviewColor: (color) => undoStack.setPresent((s) => ({ ...s, previewColor: color })),
      setPreviewImageId: (id) => undoStack.commit((s) => ({ ...s, previewImageId: id })),
      setPreviewText: (text) => undoStack.setPresent((s) => ({ ...s, previewText: text })),
      toggleMorph: (enabled) => undoStack.commit((s) => edit.toggleMorph(s, enabled)),
      setMorphShapeB: (shape) => undoStack.commit((s) => edit.setMorphShapeB(s, shape)),
      setMorphT: (t) => undoStack.setPresent((s) => edit.setMorphT(s, t)),
      setMorphDuration: (duration) => undoStack.commit((s) => edit.setMorphDuration(s, duration)),
      setMorphEasing: (easing) => undoStack.commit((s) => edit.setMorphEasing(s, easing)),
      syncMorphTopology: () => undoStack.commit((s) => edit.syncMorphTopology(s)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetShape: () => undoStack.commit((s) => edit.resetShape(s))
    }),
    [undoStack]
  );

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z work anywhere inside the tool, not just while a handle has focus — matches every vector editor's own global shortcut, rather than requiring the SVG overlay specifically to be focused first.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
    event.preventDefault();
    if (event.shiftKey) actions.redo();
    else actions.undo();
  }

  return (
    <>
      <CuttingMat onKeyDown={handleKeyDown}>
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
          <Tooltip content="Reset shape">
            <ToolbarButton type="button" onClick={actions.resetShape} aria-label="Reset shape">
              <RefreshIcon size={16} />
            </ToolbarButton>
          </Tooltip>
        </ToolbarRow>

        <GeneratorGrid>
          <SidePanel>
            <SectionCard>
              <PanelTitle>Shape</PanelTitle>
              <ShapeControls state={state} actions={actions} />
            </SectionCard>
            <PresetGallery actions={actions} />
            <MorphControls state={state} actions={actions} />
            <ShareControls state={state} />
          </SidePanel>

          <MainColumn>
            <PreviewPane state={state} actions={actions} />
            <ExportPanel state={state} />
          </MainColumn>
        </GeneratorGrid>
      </CuttingMat>
    </>
  );
}

ClipPathGenerator.displayName = "ClipPathGenerator";
