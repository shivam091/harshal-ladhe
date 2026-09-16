"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/border-radius-serialize";
import * as edit from "@/helpers/border-radius-editor";
import { BlobIcon, UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import FamilyControls from "@/components/BorderRadiusGenerator/FamilyControls/FamilyControls";
import CornerFields from "@/components/BorderRadiusGenerator/CornerFields/CornerFields";
import SurfaceControls from "@/components/BorderRadiusGenerator/SurfaceControls/SurfaceControls";
import PreviewPane from "@/components/BorderRadiusGenerator/PreviewPane/PreviewPane";
import ExportPanel from "@/components/BorderRadiusGenerator/ExportPanel/ExportPanel";
import PresetGallery from "@/components/BorderRadiusGenerator/PresetGallery/PresetGallery";
import ShareControls from "@/components/BorderRadiusGenerator/ShareControls/ShareControls";
import { Studio, StudioHeader, StudioTitle, StatusDab, ToolTray, ToolTrayButton, Layout, MainColumn, SidePanel } from "@/components/BorderRadiusGenerator/BorderRadiusGenerator.styles";
import type { BorderRadiusActions, BorderRadiusEditorState } from "@/interfaces/border-radius";

const STORAGE_KEY = "border-radius-generator:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Deterministic across server and first client render: a shared `?state=` link decodes the same way on both, otherwise the fresh default lump. Never touches localStorage here — that varies between the server (no `window`) and the client's hydration render, which would mismatch the SSR markup. The last session's own autosave is instead restored in a post-mount effect below.
function loadInitialState(sharedState: string | null): BorderRadiusEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return { ...decoded, selectedCorner: null };
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire editor's state via useUndoStack, derives one
  BorderRadiusActions object every subcomponent shares, and handles the two forms of persistence —
  a `?state=` permalink decoded once on mount, and a debounced localStorage autosave thereafter.
  Structurally a near-mirror of the other six goodies' own root component; kept as its own copy
  rather than a shared "generator shell" since none of these tools' state shapes or action sets
  actually overlap.
*/
export default function BorderRadiusGenerator(): JSX.Element {
  const searchParams = useSearchParams();
  const sharedState = searchParams.get("state");
  const undoStack = useUndoStack<BorderRadiusEditorState>(() => loadInitialState(sharedState));
  const { state, reset } = undoStack;

  // Runs once after hydration to restore the last session's autosave — localStorage is unavailable during SSR/the client's first render, so reading it here (rather than in the lazy initial-state above) keeps that first render identical on server and client. Skipped when a `?state=` permalink already supplied the initial state.
  useEffect(() => {
    if (sharedState && decodeShareableState(sharedState)) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) reset({ ...(JSON.parse(raw) as ReturnType<typeof edit.toShareableState>), selectedCorner: null });
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — keep the default lump.
    }
  }, [sharedState, reset]);

  // Debounced so a drag's stream of setPresent calls doesn't hit localStorage on every frame — only once activity settles. Persists the shareable slice only, matching what a permalink itself carries.
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
      setCorner: (corner, patch) => undoStack.setPresent((s) => edit.setCorner(s, corner, patch)),
      setUniformRadius: (value) => undoStack.setPresent((s) => edit.setUniformRadius(s, value)),
      toggleUniform: (uniform) => undoStack.commit((s) => edit.toggleUniform(s, uniform)),
      selectCorner: (corner) => undoStack.setPresent((s) => edit.selectCorner(s, corner)),
      setCurvature: (curvature) => undoStack.setPresent((s) => edit.setCurvature(s, curvature)),
      setSurfaceColor: (color) => undoStack.setPresent((s) => edit.setSurfaceColor(s, color)),
      setPageColor: (color) => undoStack.setPresent((s) => edit.setPageColor(s, color)),
      setSize: (size) => undoStack.setPresent((s) => edit.setSize(s, size)),
      commitDrag: () => undoStack.commit(),
      applyFamilyShape: (shape) => undoStack.commit((s) => edit.applyFamilyShape(s, shape)),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetBlob: () => undoStack.commit(() => edit.resetBlob())
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
      <Studio onKeyDown={handleKeyDown}>
        <StudioHeader>
          <StudioTitle>
            <StatusDab aria-hidden="true" />
            <BlobIcon size={18} aria-hidden="true" />
            Clay Studio
          </StudioTitle>

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
            <Tooltip content="Reset shape">
              <ToolTrayButton type="button" onClick={actions.resetBlob} aria-label="Reset shape">
                <RefreshIcon size={16} />
              </ToolTrayButton>
            </Tooltip>
          </ToolTray>
        </StudioHeader>

        <Layout>
          <MainColumn>
            <PreviewPane state={state} actions={actions} />
            <ExportPanel state={state} />
          </MainColumn>

          <SidePanel>
            <FamilyControls state={state} actions={actions} />
            <CornerFields state={state} actions={actions} />
            <SurfaceControls state={state} actions={actions} />
            <PresetGallery actions={actions} />
            <ShareControls state={state} />
          </SidePanel>
        </Layout>
      </Studio>
    </>
  );
}

BorderRadiusGenerator.displayName = "BorderRadiusGenerator";
