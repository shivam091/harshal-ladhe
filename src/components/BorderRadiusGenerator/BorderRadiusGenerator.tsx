"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/border-radius-serialize";
import * as edit from "@/helpers/border-radius-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import FamilyControls from "@/components/BorderRadiusGenerator/FamilyControls/FamilyControls";
import CornerFields from "@/components/BorderRadiusGenerator/CornerFields/CornerFields";
import SurfaceControls from "@/components/BorderRadiusGenerator/SurfaceControls/SurfaceControls";
import PreviewPane from "@/components/BorderRadiusGenerator/PreviewPane/PreviewPane";
import ExportPanel from "@/components/BorderRadiusGenerator/ExportPanel/ExportPanel";
import PresetGallery from "@/components/BorderRadiusGenerator/PresetGallery/PresetGallery";
import ShareControls from "@/components/BorderRadiusGenerator/ShareControls/ShareControls";
import {
  SectionCard,
  PanelTitle,
  GeneratorWrapper,
  ToolbarRow,
  ToolbarButton,
  GeneratorGrid,
  SidePanel,
  MainColumn
} from "@/components/BorderRadiusGenerator/BorderRadiusGenerator.styles";
import type { BorderRadiusActions, BorderRadiusEditorState, BorderRadiusShareableState } from "@/interfaces/border-radius";

const STORAGE_KEY = "border-radius-generator:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's own localStorage autosave, then a fresh default shape — same priority order as every other goodie's own loadInitialState.
function loadInitialState(sharedState: string | null): BorderRadiusEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return { ...decoded, selectedCorner: null };
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...(JSON.parse(raw) as BorderRadiusShareableState), selectedCorner: null };
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default shape rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire editor's state via useUndoStack, derives one
  BorderRadiusActions object every subcomponent shares, and handles the two forms of persistence —
  a `?state=` permalink decoded once on mount, and a debounced localStorage autosave thereafter.
  Structurally a near-mirror of the other three goodies' own root component; kept as its own copy
  rather than a shared "generator shell" since none of the four tools' state shapes or action sets
  actually overlap.
*/
export default function BorderRadiusGenerator(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<BorderRadiusEditorState>(() => loadInitialState(searchParams.get("state")));
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

  const actions: BorderRadiusActions = useMemo(
    () => ({
      setFamily: (family) => undoStack.commit((s) => edit.setFamily(s, family)),
      setCorner: (corner, patch) => undoStack.setPresent((s) => edit.setCorner(s, corner, patch)),
      setUniformRadius: (value) => undoStack.setPresent((s) => edit.setUniformRadius(s, value)),
      toggleUniform: (uniform) => undoStack.commit((s) => edit.toggleUniform(s, uniform)),
      selectCorner: (corner) => undoStack.setPresent((s) => edit.selectCorner(s, corner)),
      setCurvature: (curvature) => undoStack.setPresent((s) => edit.setCurvature(s, curvature)),
      setSurfaceColor: (color) => undoStack.setPresent((s) => edit.setSurfaceColor(s, color)),
      setPageColor: (color) => undoStack.setPresent((s) => edit.setPageColor(s, color)),
      setSize: (size) => undoStack.setPresent((s) => edit.setSize(s, size)),
      commitDrag: () => undoStack.commit(),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetBlob: () => undoStack.commit(() => edit.resetBlob())
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
          <Tooltip content="Reset shape">
            <ToolbarButton type="button" onClick={actions.resetBlob} aria-label="Reset shape">
              <RefreshIcon size={16} />
            </ToolbarButton>
          </Tooltip>
        </ToolbarRow>

        <GeneratorGrid>
          <SidePanel>
            <SectionCard>
              <PanelTitle>Shape</PanelTitle>
              <FamilyControls state={state} actions={actions} />
            </SectionCard>
            <SectionCard>
              <PanelTitle>Radius</PanelTitle>
              <CornerFields state={state} actions={actions} />
            </SectionCard>
            <SectionCard>
              <PanelTitle>Surface</PanelTitle>
              <SurfaceControls state={state} actions={actions} />
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

BorderRadiusGenerator.displayName = "BorderRadiusGenerator";
