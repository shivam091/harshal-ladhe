"use client";

import { useEffect, useMemo, useState } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import * as edit from "@/components/ViewboxExplorer/ViewboxExplorer.helpers";
import { TOUR_STEPS, computeExtent, computeViewBoxTransform, isTextEditingTarget, parseDrawing } from "@/components/ViewboxExplorer/ViewboxExplorer.utils";
import LightBox from "@/components/ViewboxExplorer/LightBox/LightBox";
import PrintStage from "@/components/ViewboxExplorer/PrintStage/PrintStage";
import AlignmentPanel from "@/components/ViewboxExplorer/AlignmentPanel/AlignmentPanel";
import ReadoutPanel from "@/components/ViewboxExplorer/ReadoutPanel/ReadoutPanel";
import EaselControls from "@/components/ViewboxExplorer/EaselControls/EaselControls";
import DrawingPanel from "@/components/ViewboxExplorer/DrawingPanel/DrawingPanel";
import ExportPanel from "@/components/ViewboxExplorer/ExportPanel/ExportPanel";
import PresetGallery from "@/components/ViewboxExplorer/PresetGallery/PresetGallery";
import ShareControls from "@/components/ViewboxExplorer/ShareControls/ShareControls";
import {
  Darkroom,
  SafelightHeader,
  HeaderSign,
  Lamp,
  HeaderTitle,
  ToolbarRow,
  TimerButton,
  BenchGrid,
  BenchColumn,
  ControlGrid,
  TrayRow
} from "@/components/ViewboxExplorer/ViewboxExplorer.styles";
import type { OverlayToggles, ViewboxExplorerActions, ViewboxExplorerEditorState } from "@/components/ViewboxExplorer/ViewboxExplorer.types";

// Debounced so a drag doesn't hit localStorage on every frame — only once it settles.
const AUTOSAVE_DEBOUNCE_MS = 400;

// Long enough to read the explanation and see the print settle, short enough that nineteen stops don't drag.
const TOUR_INTERVAL_MS = 2200;

// Everything on by default — the overlays are the lesson; switching them off is for admiring the print.
const DEFAULT_OVERLAYS: OverlayToggles = { grid: true, outline: true, borders: true };

// Finds where the current settings sit on the tour route, so stepping starts from what's on screen rather than from the beginning.
function tourIndexOf(state: ViewboxExplorerEditorState): number {
  return TOUR_STEPS.findIndex((step) => step.align === state.align && (step.align === "none" || step.meetOrSlice === state.meetOrSlice));
}

/*
  Root client component: owns the editor state via useUndoStack, derives one ViewboxExplorerActions
  object every subcomponent shares, and handles both forms of persistence — a `?state=` permalink
  decoded once on mount and a debounced localStorage autosave thereafter. On top of the usual
  goodie shape it parses the drawing once per source, computes the viewBox transform once per
  change for every panel to read, and runs the auto-tour.
*/
export default function ViewboxExplorer(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<ViewboxExplorerEditorState>(() => edit.loadInitialState(searchParams.get("state")));
  const { state } = undoStack;
  const [overlays, setOverlays] = useState<OverlayToggles>(DEFAULT_OVERLAYS);
  const [isTouring, setIsTouring] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const source = edit.activeSource(state);
  const drawing = useMemo(() => parseDrawing(source), [source]);
  const extent = computeExtent(drawing.bounds, state.viewBox);
  const transform = computeViewBoxTransform(state.viewBox, state.viewport, state.align, state.meetOrSlice);
  const currentTourIndex = tourIndexOf(state);
  const tourIndex = currentTourIndex >= 0 ? currentTourIndex : null;

  // Debounced so a drag or a slider scrub writes once, after it settles.
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.localStorage.setItem(edit.STORAGE_KEY, JSON.stringify(edit.toShareableState(state)));
      } catch {
        // Storage unavailable/full — autosave is a convenience, not a guarantee.
      }
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [state]);

  const actions: ViewboxExplorerActions = useMemo(
    () => ({
      setViewBoxLive: (viewBox) => undoStack.setPresent((s) => edit.setViewBox(s, viewBox)),
      setViewBox: (viewBox) => undoStack.commit((s) => edit.setViewBox(s, viewBox)),
      setViewportLive: (viewport) => undoStack.setPresent((s) => edit.setViewport(s, viewport)),
      setAlign: (align) => {
        setIsTouring(false);
        undoStack.commit((s) => edit.setAlign(s, align));
      },
      setMeetOrSlice: (meetOrSlice) => {
        setIsTouring(false);
        undoStack.commit((s) => edit.setMeetOrSlice(s, meetOrSlice));
      },
      setTourStepLive: (step) => undoStack.setPresent((s) => edit.setTourStep(s, step)),
      selectSample: (slug) => undoStack.commit((s) => edit.selectSample(s, slug)),
      loadCustomDrawing: (customSource, bounds) => undoStack.commit((s) => edit.loadCustomDrawing(s, customSource, bounds)),
      fitToDrawing: () => undoStack.commit((s) => edit.fitToDrawing(s, drawing.bounds)),
      matchViewportRatio: () => undoStack.commit((s) => edit.matchViewportRatio(s, extent)),
      commitEdit: () => undoStack.commit(),
      applyPreset: (preset) => {
        setIsTouring(false);
        undoStack.commit(() => edit.applyPreset(preset));
      },
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetExplorer: () => {
        setIsTouring(false);
        undoStack.commit(() => edit.resetExplorer());
      }
    }),
    [undoStack, drawing.bounds, extent]
  );

  // One step along the route. While touring the steps are live-only (the whole tour becomes one undo step when it stops); by hand each step is its own.
  function stepTour(direction: 1 | -1) {
    const from = tourIndex ?? (direction === 1 ? -1 : 0);
    const next = TOUR_STEPS[(from + direction + TOUR_STEPS.length) % TOUR_STEPS.length];
    if (isTouring) actions.setTourStepLive(next);
    else undoStack.commit((s) => edit.setTourStep(s, next));
  }

  // Starting checkpoints nothing; stopping folds every stop the tour made into a single undo step.
  function toggleTour() {
    if (isTouring) {
      setIsTouring(false);
      actions.commitEdit();
    } else {
      setIsTouring(true);
    }
  }

  // A timeout per stop rather than an interval, so every render restarts the clock from the stop actually on screen.
  useEffect(() => {
    if (!isTouring || prefersReducedMotion) return;
    const timer = setTimeout(() => {
      const from = tourIndex ?? -1;
      actions.setTourStepLive(TOUR_STEPS[(from + 1) % TOUR_STEPS.length]);
    }, TOUR_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [isTouring, prefersReducedMotion, tourIndex, actions]);

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z work anywhere inside the tool except text fields, which keep the browser's own undo.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
    if (isTextEditingTarget(event.target)) return;
    event.preventDefault();
    setIsTouring(false);
    if (event.shiftKey) actions.redo();
    else actions.undo();
  }

  return (
    <>
      <Darkroom onKeyDown={handleKeyDown}>
        <SafelightHeader>
          <HeaderSign aria-hidden="true">
            <Lamp />
            <HeaderTitle>Darkroom · viewBox enlarger</HeaderTitle>
          </HeaderSign>
          <ToolbarRow>
            <Tooltip content="Undo">
              <TimerButton type="button" onClick={actions.undo} disabled={!actions.canUndo} aria-label="Undo">
                <UndoIcon size={16} />
              </TimerButton>
            </Tooltip>
            <Tooltip content="Redo">
              <TimerButton type="button" onClick={actions.redo} disabled={!actions.canRedo} aria-label="Redo">
                <RedoIcon size={16} />
              </TimerButton>
            </Tooltip>
            <Tooltip content="Reset to the letterbox example">
              <TimerButton type="button" onClick={actions.resetExplorer} aria-label="Reset to the letterbox example">
                <RefreshIcon size={16} />
              </TimerButton>
            </Tooltip>
          </ToolbarRow>
        </SafelightHeader>

        <BenchGrid>
          <BenchColumn>
            <LightBox drawing={drawing} extent={extent} state={state} transform={transform} overlays={overlays} actions={actions} />
            <EaselControls state={state} extent={extent} overlays={overlays} onOverlaysChange={setOverlays} actions={actions} />
          </BenchColumn>
          <BenchColumn>
            <PrintStage drawing={drawing} extent={extent} state={state} transform={transform} overlays={overlays} />
            <AlignmentPanel
              state={state}
              actions={actions}
              tourIndex={tourIndex}
              isTouring={isTouring && !prefersReducedMotion}
              prefersReducedMotion={prefersReducedMotion}
              onToggleTour={toggleTour}
              onStepTour={stepTour}
            />
          </BenchColumn>
        </BenchGrid>

        <ControlGrid>
          <ReadoutPanel state={state} transform={transform} />
          <DrawingPanel state={state} drawing={drawing} actions={actions} />
        </ControlGrid>

        <TrayRow>
          <PresetGallery actions={actions} />
          <BenchColumn>
            <ExportPanel state={state} transform={transform} />
            <ShareControls state={state} />
          </BenchColumn>
        </TrayRow>
      </Darkroom>
    </>
  );
}

ViewboxExplorer.displayName = "ViewboxExplorer";
