"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/gradient-serialize";
import * as edit from "@/helpers/gradient-editor";
import { GradientIcon, UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
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
  Canvas,
  CanvasBody,
  CanvasHeader,
  CanvasTitle,
  GlowPulse,
  Toolbar,
  ToolbarButton,
  Layout,
  MainColumn,
  SidePanel
} from "@/components/GradientGenerator/GradientGenerator.styles";
import type { GradientActions, GradientEditorState, GradientShareableState } from "@/interfaces/gradient";

const STORAGE_KEY = "gradient-generator:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Deterministic across server and first client render: a shared `?state=` link decodes the same way on both, otherwise a fresh default gradient. Never touches localStorage here — that varies between the server (no `window`) and the client's hydration render, which would mismatch the SSR markup. The last session's own autosave is instead restored in a post-mount effect below, matching RegexTester's own loadInitialState rather than an unsafe synchronous `typeof window !== "undefined"` read.
function loadInitialState(sharedState: string | null): GradientEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return { ...decoded, selectedStopId: null };
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire editor's state via useUndoStack, derives one
  GradientActions object every subcomponent shares, and handles the two forms of persistence — a
  `?state=` permalink decoded once on mount, and a debounced localStorage autosave thereafter.
  Structurally a near-mirror of CronBuilder/RegexTester's own root components.
*/
export default function GradientGenerator(): JSX.Element {
  const searchParams = useSearchParams();
  const sharedState = searchParams.get("state");
  const undoStack = useUndoStack<GradientEditorState>(() => loadInitialState(sharedState));
  const { state, reset } = undoStack;

  // Runs once after hydration to restore the last session's autosave — localStorage is unavailable during SSR/the client's first render, so reading it here (rather than in the lazy initial-state above) keeps that first render identical on server and client. Skipped when a `?state=` permalink already supplied the initial state.
  useEffect(() => {
    if (sharedState && decodeShareableState(sharedState)) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) reset({ ...(JSON.parse(raw) as GradientShareableState), selectedStopId: null });
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — keep the default gradient.
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
      // Pure UI state (which stop's row/handle is highlighted) — rides along via setPresent rather than its own undo step.
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

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z work anywhere inside the tool, not just while a handle has focus.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
    event.preventDefault();
    if (event.shiftKey) actions.redo();
    else actions.undo();
  }

  return (
    <>
      <Canvas onKeyDown={handleKeyDown}>
        <CanvasBody>
          <CanvasHeader>
            <CanvasTitle>
              <GlowPulse aria-hidden="true" />
              <GradientIcon size={16} aria-hidden="true" />
              Live Canvas
            </CanvasTitle>

            <Toolbar>
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
            </Toolbar>
          </CanvasHeader>

          <PreviewPane state={state} />

          <Layout>
            <MainColumn>
              <TypeControls state={state} actions={actions} />
              <GeometryControls state={state} actions={actions} />
              <StopEditor state={state} actions={actions} />
              <ColorSpaceControls state={state} actions={actions} />
              <ExportPanel state={state} />
            </MainColumn>

            <SidePanel>
              <PresetGallery actions={actions} />
              <ShareControls state={state} />
            </SidePanel>
          </Layout>
        </CanvasBody>
      </Canvas>
    </>
  );
}

GradientGenerator.displayName = "GradientGenerator";
