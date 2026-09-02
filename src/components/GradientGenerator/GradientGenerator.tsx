"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/gradient-serialize";
import * as edit from "@/helpers/gradient-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import TypeControls from "@/components/GradientGenerator/TypeControls/TypeControls";
import GeometryControls from "@/components/GradientGenerator/GeometryControls/GeometryControls";
import StopEditor from "@/components/GradientGenerator/StopEditor/StopEditor";
import ColorSpaceControls from "@/components/GradientGenerator/ColorSpaceControls/ColorSpaceControls";
import PreviewPane from "@/components/GradientGenerator/PreviewPane/PreviewPane";
import ExportPanel from "@/components/GradientGenerator/ExportPanel/ExportPanel";
import PresetGallery from "@/components/GradientGenerator/PresetGallery/PresetGallery";
import ShareControls from "@/components/GradientGenerator/ShareControls/ShareControls";
import {
  SectionCard,
  PanelTitle,
  GeneratorWrapper,
  ToolbarRow,
  ToolbarButton,
  GeneratorGrid,
  SidePanel,
  MainColumn
} from "@/components/GradientGenerator/GradientGenerator.styles";
import type { GradientActions, GradientEditorState, GradientShareableState } from "@/interfaces/gradient";

const STORAGE_KEY = "gradient-generator:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's own localStorage autosave, then a fresh default gradient — same priority order as ClipPathGenerator's loadInitialState, for the same reason (a link is a deliberate share, a reload should restore unfinished work, only a brand new visitor gets the neutral default).
function loadInitialState(sharedState: string | null): GradientEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return { ...decoded, selectedStopId: null };
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...(JSON.parse(raw) as GradientShareableState), selectedStopId: null };
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default gradient rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire editor's state via useUndoStack, derives one
  GradientActions object every subcomponent shares, and handles the two forms of persistence — a
  `?state=` permalink decoded once on mount, and a debounced localStorage autosave thereafter.
  Structurally a near-mirror of ClipPathGenerator.tsx; kept as its own copy rather than a shared
  "generator shell" abstraction since the two tools' state shapes and action sets don't actually overlap.
*/
export default function GradientGenerator(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<GradientEditorState>(() => loadInitialState(searchParams.get("state")));
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

  const actions: GradientActions = useMemo(
    () => ({
      setType: (type) => undoStack.commit((s) => edit.applyType(s, type)),
      setAngle: (angle) => undoStack.setPresent((s) => edit.setAngle(s, angle)),
      setPosition: (position) => undoStack.setPresent((s) => edit.setPosition(s, position)),
      setRadialShape: (shape) => undoStack.commit((s) => edit.setRadialShape(s, shape)),
      setRadialSize: (size) => undoStack.commit((s) => edit.setRadialSize(s, size)),
      commitDrag: () => undoStack.commit(),
      addStop: (position) => undoStack.commit((s) => edit.addStop(s, position)),
      updateStopColor: (id, color) => undoStack.setPresent((s) => edit.updateStopColor(s, id, color)),
      updateStopPosition: (id, position) => undoStack.setPresent((s) => edit.updateStopPosition(s, id, position)),
      removeStop: (id) => undoStack.commit((s) => edit.removeStop(s, id)),
      // Pure UI state (which stop's row is highlighted) — rides along via setPresent rather than its own undo step, same as ClipPathGenerator's `select`.
      selectStop: (id) => undoStack.setPresent((s) => edit.selectStop(s, id)),
      setColorSpace: (colorSpace) => undoStack.commit((s) => edit.setColorSpace(s, colorSpace)),
      setHueInterpolation: (hueInterpolation) => undoStack.commit((s) => edit.setHueInterpolation(s, hueInterpolation)),
      toggleRepeating: (repeating) => undoStack.commit((s) => edit.toggleRepeating(s, repeating)),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetGradient: () => undoStack.commit((s) => edit.resetGradient(s))
    }),
    [undoStack]
  );

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z work anywhere inside the tool, not just while a handle has focus — matches ClipPathGenerator's own global shortcut.
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
          <Tooltip content="Reset gradient">
            <ToolbarButton type="button" onClick={actions.resetGradient} aria-label="Reset gradient">
              <RefreshIcon size={16} />
            </ToolbarButton>
          </Tooltip>
        </ToolbarRow>

        <GeneratorGrid>
          <SidePanel>
            <SectionCard>
              <PanelTitle>Type</PanelTitle>
              <TypeControls state={state} actions={actions} />
            </SectionCard>
            <SectionCard>
              <PanelTitle>Geometry</PanelTitle>
              <GeometryControls state={state} actions={actions} />
            </SectionCard>
            <SectionCard>
              <StopEditor state={state} actions={actions} />
            </SectionCard>
            <SectionCard>
              <ColorSpaceControls state={state} actions={actions} />
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

GradientGenerator.displayName = "GradientGenerator";
