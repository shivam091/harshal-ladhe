"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import * as edit from "@/components/ShapeToPathConverter/ShapeToPathConverter.helpers";
import { buildPathData, convertShape } from "@/components/ShapeToPathConverter/ShapeToPathConverter.utils";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import ShapeControls from "@/components/ShapeToPathConverter/ShapeControls/ShapeControls";
import ExerciseCanvas from "@/components/ShapeToPathConverter/ExerciseCanvas/ExerciseCanvas";
import WorkingOut from "@/components/ShapeToPathConverter/WorkingOut/WorkingOut";
import ExportPanel from "@/components/ShapeToPathConverter/ExportPanel/ExportPanel";
import PasteConverter from "@/components/ShapeToPathConverter/PasteConverter/PasteConverter";
import PresetGallery from "@/components/ShapeToPathConverter/PresetGallery/PresetGallery";
import ShareControls from "@/components/ShapeToPathConverter/ShareControls/ShareControls";
import {
  ExerciseBook,
  BookHeader,
  BookLabel,
  BookLabelValue,
  ToolbarRow,
  ToolbarButton,
  GeneratorGrid,
  SidePanel,
  MainColumn,
  SectionCard,
  PanelTitle
} from "@/components/ShapeToPathConverter/ShapeToPathConverter.styles";
import type { ShapeToPathActions, ShapeToPathEditorState } from "@/components/ShapeToPathConverter/ShapeToPathConverter.types";

// Namespaced per goodie so this tool's autosave never collides with another's.
const STORAGE_KEY = "shape-to-path:state";

// Long enough to let a drag settle before writing, short enough that a quick refresh still keeps the last edit.
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's autosave, then the default exercise — the same priority order as every other goodie.
function loadInitialState(sharedState: string | null): ShapeToPathEditorState {
  if (sharedState) {
    const decoded = edit.decodeShareableState(sharedState);
    if (decoded) return decoded;
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const saved = raw ? edit.sanitiseState(JSON.parse(raw)) : null;
      if (saved) return saved;
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default exercise rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

// Text and number fields keep their own native undo; hijacking Ctrl+Z there would rewind a whole edit when someone meant to undo one keystroke.
function isTextEditingTarget(target: EventTarget): boolean {
  if (target instanceof HTMLTextAreaElement) return true;
  return target instanceof HTMLInputElement && ["text", "search", "url", "email", "number"].includes(target.type);
}

/*
  Root client component: owns the geometry via useUndoStack, derives one ShapeToPathActions object
  every subcomponent shares, and handles both forms of persistence. The scrubber position and the
  hovered step live in plain state beside it, since they describe where the reader is in the
  working, not the sum itself, and undo should never rewind them.
*/
export default function ShapeToPathConverter(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<ShapeToPathEditorState>(() => loadInitialState(searchParams.get("state")));
  const { state } = undoStack;
  // null means "fully drawn", so a finished drawing stays finished as the step count changes under it.
  const [progress, setProgress] = useState<number | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const shape = state.shapes[state.kind];
  const conversion = useMemo(() => convertShape(shape), [shape]);
  const d = useMemo(() => buildPathData(conversion.steps, state.mode, state.precision), [conversion, state.mode, state.precision]);
  const drawnSteps = progress === null ? conversion.steps.length : Math.min(progress, conversion.steps.length);

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

  const actions: ShapeToPathActions = useMemo(
    () => ({
      setKind: (kind) => undoStack.commit((s) => edit.setKind(s, kind)),
      setShape: (next) => undoStack.setPresent((s) => edit.setShape(s, next)),
      loadShape: (next) => undoStack.commit((s) => edit.setShape(s, next)),
      commitEdit: () => undoStack.commit(),
      setMode: (mode) => undoStack.commit((s) => edit.setMode(s, mode)),
      setPrecision: (precision) => undoStack.commit((s) => edit.setPrecision(s, precision)),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetShape: () => undoStack.commit((s) => edit.resetShape(s))
    }),
    [undoStack]
  );

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z work anywhere inside the tool except inside text fields, which keep the browser's finer-grained native undo.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
    if (isTextEditingTarget(event.target)) return;
    event.preventDefault();
    if (event.shiftKey) actions.redo();
    else actions.undo();
  }

  // Dragging the scrubber all the way to the end hands control back to "fully drawn", so later edits keep showing the whole path.
  const stepCount = conversion.steps.length;
  const handleProgressChange = useCallback((next: number) => setProgress(next >= stepCount ? null : next), [stepCount]);

  return (
    <>
      <ExerciseBook onKeyDown={handleKeyDown}>
        <BookHeader>
          <BookLabel aria-hidden="true">
            <span>Subject</span>
            <BookLabelValue>Maths: basic shapes</BookLabelValue>
            <span>Exercise</span>
            <BookLabelValue>
              {`<${state.kind}>`} → {"<path>"}
            </BookLabelValue>
          </BookLabel>
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
            <Tooltip content="Reset this shape">
              <ToolbarButton type="button" onClick={actions.resetShape} aria-label="Reset this shape">
                <RefreshIcon size={16} />
              </ToolbarButton>
            </Tooltip>
          </ToolbarRow>
        </BookHeader>

        <GeneratorGrid>
          <SidePanel>
            <SectionCard>
              <PanelTitle>Question</PanelTitle>
              <ShapeControls state={state} actions={actions} />
            </SectionCard>
            <PresetGallery actions={actions} />
            <ShareControls state={state} />
          </SidePanel>

          <MainColumn>
            <ExerciseCanvas
              shape={shape}
              conversion={conversion}
              mode={state.mode}
              precision={state.precision}
              progress={drawnSteps}
              hoveredStep={hoveredStep}
              actions={actions}
            />
            <WorkingOut
              conversion={conversion}
              mode={state.mode}
              precision={state.precision}
              progress={drawnSteps}
              hoveredStep={hoveredStep}
              onProgressChange={handleProgressChange}
              onHoverStep={setHoveredStep}
            />
            <ExportPanel shape={shape} d={d} />
          </MainColumn>
        </GeneratorGrid>

        <PasteConverter mode={state.mode} precision={state.precision} actions={actions} />
      </ExerciseBook>
    </>
  );
}

ShapeToPathConverter.displayName = "ShapeToPathConverter";
