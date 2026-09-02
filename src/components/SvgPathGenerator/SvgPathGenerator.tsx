"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/svg-path-serialize";
import * as edit from "@/helpers/svg-path-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import PathControls from "@/components/SvgPathGenerator/PathControls/PathControls";
import PreviewPane from "@/components/SvgPathGenerator/PreviewPane/PreviewPane";
import ExportPanel from "@/components/SvgPathGenerator/ExportPanel/ExportPanel";
import PresetGallery from "@/components/SvgPathGenerator/PresetGallery/PresetGallery";
import ShareControls from "@/components/SvgPathGenerator/ShareControls/ShareControls";
import {
  SectionCard,
  PanelTitle,
  GeneratorWrapper,
  ToolbarRow,
  ToolbarButton,
  GeneratorGrid,
  SidePanel,
  MainColumn
} from "@/components/SvgPathGenerator/SvgPathGenerator.styles";
import type { SvgPathActions, SvgPathEditorState, SvgPathShareableState } from "@/interfaces/svg-path";

const STORAGE_KEY = "svg-path-generator:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's own localStorage autosave, then a fresh default path — in that order of intent (a link is a deliberate share, a reload should restore unfinished work, and only then does a brand new visitor get the neutral default).
function loadInitialState(sharedState: string | null): SvgPathEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return { ...decoded, selection: null };
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...(JSON.parse(raw) as SvgPathShareableState), selection: null };
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default path rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire editor's state via useUndoStack, derives one SvgPathActions
  object every subcomponent shares, and handles the two forms of persistence — a `?state=` permalink
  decoded once on mount, and a debounced localStorage autosave thereafter. Deliberately mirrors
  ClipPathGenerator's own shape (same undo stack, same load-order, same autosave debounce) since it
  reuses that tool's bezier-drag engine almost unchanged — the vertex/handle editing verbs are
  identical, only the shape model (open-or-closed single path, not four shape families) differs.
*/
export default function SvgPathGenerator(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<SvgPathEditorState>(() => loadInitialState(searchParams.get("state")));
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

  const actions: SvgPathActions = useMemo(
    () => ({
      updateVertexPoint: (index, point) => undoStack.setPresent((s) => edit.updateVertexPoint(s, index, point)),
      updateVertexHandle: (index, which, point, altKey) => undoStack.setPresent((s) => edit.updateVertexHandle(s, index, which, point, altKey)),
      commitDrag: () => undoStack.commit(),
      toggleVertexCurve: (index) => undoStack.commit((s) => edit.toggleVertexCurve(s, index)),
      insertVertexAfter: (index, point) => undoStack.commit((s) => edit.insertVertexAfter(s, index, point)),
      appendVertex: (point) => undoStack.commit((s) => edit.appendVertex(s, point)),
      deleteVertex: (index) => undoStack.commit((s) => edit.deleteVertex(s, index)),
      select: (selection) => undoStack.setPresent((s) => ({ ...s, selection })),
      toggleClosed: () => undoStack.commit((s) => edit.toggleClosed(s)),
      setStrokeColor: (color) => undoStack.setPresent((s) => edit.setStrokeColor(s, color)),
      setStrokeWidth: (width) => undoStack.setPresent((s) => edit.setStrokeWidth(s, width)),
      setLineCap: (cap) => undoStack.commit((s) => edit.setLineCap(s, cap)),
      setLineJoin: (join) => undoStack.commit((s) => edit.setLineJoin(s, join)),
      setFillEnabled: (enabled) => undoStack.commit((s) => edit.setFillEnabled(s, enabled)),
      setFillColor: (color) => undoStack.setPresent((s) => edit.setFillColor(s, color)),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      shuffle: () => undoStack.commit((s) => edit.shuffle(s)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetPath: () => undoStack.commit((s) => edit.resetPath(s))
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
          <Tooltip content="Reset path">
            <ToolbarButton type="button" onClick={actions.resetPath} aria-label="Reset path">
              <RefreshIcon size={16} />
            </ToolbarButton>
          </Tooltip>
        </ToolbarRow>

        <GeneratorGrid>
          <SidePanel>
            <SectionCard>
              <PanelTitle>Path</PanelTitle>
              <PathControls state={state} actions={actions} />
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

SvgPathGenerator.displayName = "SvgPathGenerator";
