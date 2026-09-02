"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/easing-curve-serialize";
import * as edit from "@/helpers/easing-curve-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import CurveGraph from "@/components/EasingCurveEditor/CurveGraph/CurveGraph";
import TransitionControls from "@/components/EasingCurveEditor/TransitionControls/TransitionControls";
import PreviewPane from "@/components/EasingCurveEditor/PreviewPane/PreviewPane";
import ExportPanel from "@/components/EasingCurveEditor/ExportPanel/ExportPanel";
import PresetGallery from "@/components/EasingCurveEditor/PresetGallery/PresetGallery";
import ShareControls from "@/components/EasingCurveEditor/ShareControls/ShareControls";
import {
  SectionCard,
  PanelTitle,
  GeneratorWrapper,
  ToolbarRow,
  ToolbarButton,
  GeneratorGrid,
  SidePanel,
  MainColumn
} from "@/components/EasingCurveEditor/EasingCurveEditor.styles";
import type { EasingCurveActions, EasingCurveEditorState, EasingCurveShareableState } from "@/interfaces/easing-curve-editor";

const STORAGE_KEY = "easing-curve-editor:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's own localStorage autosave, then a fresh default curve — same priority order as every other goodie's own loadInitialState.
function loadInitialState(sharedState: string | null): EasingCurveEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return { ...decoded, selectedPoint: "p1" };
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...(JSON.parse(raw) as EasingCurveShareableState), selectedPoint: "p1" };
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default curve rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire editor's state via useUndoStack, derives one
  EasingCurveActions object every subcomponent shares, and handles the two forms of persistence —
  a `?state=` permalink decoded once on mount, and a debounced localStorage autosave thereafter.
  Structurally a near-mirror of the other seven goodies' own root component; kept as its own copy
  rather than a shared "generator shell" since none of the eight tools' state shapes or action sets
  actually overlap. The curve math and drag mechanics themselves, though, are NOT reimplemented —
  CurveGraph builds directly on BezierGraph/pointerEventToPoint/EASING_CURVES, the same
  infrastructure the site's own "CSS Easing Functions" post already uses.
*/
export default function EasingCurveEditor(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<EasingCurveEditorState>(() => loadInitialState(searchParams.get("state")));
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

  const actions: EasingCurveActions = useMemo(
    () => ({
      setP1: (point) => undoStack.setPresent((s) => edit.setP1(s, point)),
      setP2: (point) => undoStack.setPresent((s) => edit.setP2(s, point)),
      selectPoint: (point) => undoStack.setPresent((s) => edit.selectPoint(s, point)),
      setDurationMs: (ms) => undoStack.setPresent((s) => edit.setDurationMs(s, ms)),
      setDelayMs: (ms) => undoStack.setPresent((s) => edit.setDelayMs(s, ms)),
      setProperty: (property) => undoStack.commit((s) => edit.setProperty(s, property)),
      setPreviewSubject: (subject) => undoStack.commit((s) => edit.setPreviewSubject(s, subject)),
      commitDrag: () => undoStack.commit(),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetCurve: () => undoStack.commit(() => edit.resetCurve())
    }),
    [undoStack]
  );

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z work anywhere inside the tool, not just while a handle has focus — matches every other goodie's own global shortcut.
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
          <Tooltip content="Reset curve">
            <ToolbarButton type="button" onClick={actions.resetCurve} aria-label="Reset curve">
              <RefreshIcon size={16} />
            </ToolbarButton>
          </Tooltip>
        </ToolbarRow>

        <GeneratorGrid>
          <SidePanel>
            <SectionCard>
              <PanelTitle>Curve</PanelTitle>
              <CurveGraph state={state} actions={actions} />
            </SectionCard>
            <SectionCard>
              <PanelTitle>Transition</PanelTitle>
              <TransitionControls state={state} actions={actions} />
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

EasingCurveEditor.displayName = "EasingCurveEditor";
