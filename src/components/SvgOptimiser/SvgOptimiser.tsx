"use client";

import { useDeferredValue, useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { optimiseSvg } from "@/components/SvgOptimiser/SvgOptimiser.utils";
import * as edit from "@/components/SvgOptimiser/SvgOptimiser.helpers";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import ParcelInput from "@/components/SvgOptimiser/ParcelInput/ParcelInput";
import PostageStamps from "@/components/SvgOptimiser/PostageStamps/PostageStamps";
import WeighingScale from "@/components/SvgOptimiser/WeighingScale/WeighingScale";
import ParcelPreview from "@/components/SvgOptimiser/ParcelPreview/ParcelPreview";
import CodeView from "@/components/SvgOptimiser/CodeView/CodeView";
import PresetGallery from "@/components/SvgOptimiser/PresetGallery/PresetGallery";
import ShareControls from "@/components/SvgOptimiser/ShareControls/ShareControls";
import { ParcelCounter, CounterSign, SignTitle, ToolbarRow, BrassButton, CounterGrid, CounterColumn, TrayRow } from "@/components/SvgOptimiser/SvgOptimiser.styles";
import type { SvgOptimiserActions, SvgOptimiserEditorState, SvgOptimiserShareableState } from "@/components/SvgOptimiser/SvgOptimiser.types";

// Namespaced so this tool's autosave can't collide with another goodie's.
const STORAGE_KEY = "svg-optimiser:state";

// Long enough that a run of keystrokes writes to localStorage once, not per key.
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link, then this browser's autosave, then the default parcel.
function loadInitialState(sharedState: string | null): SvgOptimiserEditorState {
  if (sharedState) {
    const decoded = edit.decodeShareableState(sharedState);
    if (decoded) return decoded;
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return edit.hydrateState(JSON.parse(raw) as Partial<SvgOptimiserShareableState>);
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default parcel rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

// Text fields keep their own native undo history; hijacking Ctrl+Z there would rewind a whole typing run when someone meant to undo one word.
function isTextEditingTarget(target: EventTarget): boolean {
  if (target instanceof HTMLTextAreaElement) return true;
  return target instanceof HTMLInputElement && ["text", "search", "url", "email", "number"].includes(target.type);
}

/*
  Root client component: owns the state via useUndoStack, runs every pass once per settled state
  (deferred, so typing into a large file stays responsive while the scale catches up), and handles
  both forms of persistence — a `?state=` permalink read on mount and a debounced localStorage
  autosave thereafter.
*/
export default function SvgOptimiser(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<SvgOptimiserEditorState>(() => loadInitialState(searchParams.get("state")));
  const { state } = undoStack;
  const deferredState = useDeferredValue(state);
  const result = useMemo(() => optimiseSvg(deferredState), [deferredState]);

  // Debounced so a fast run of keystrokes doesn't hit localStorage on every one.
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(edit.toShareableState(state)));
      } catch {
        // Storage unavailable or full — autosave is a convenience, not a guarantee.
      }
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [state]);

  const actions: SvgOptimiserActions = useMemo(
    () => ({
      setSource: (source) => undoStack.setPresent((s) => edit.setSource(s, source)),
      loadFile: (fileName, source) => undoStack.commit((s) => edit.loadFile(s, fileName, source)),
      togglePass: (id, enabled) => undoStack.commit((s) => edit.togglePass(s, id, enabled)),
      setAllPasses: (enabled) => undoStack.commit((s) => edit.setAllPasses(s, enabled)),
      setPrecision: (precision) => undoStack.setPresent((s) => edit.setPrecision(s, precision)),
      commitEdit: () => undoStack.commit(),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetOptimiser: () => undoStack.commit(() => edit.resetOptimiser())
    }),
    [undoStack]
  );

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z work anywhere inside the tool except text fields, which keep the browser's finer-grained native undo.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
    if (isTextEditingTarget(event.target)) return;
    event.preventDefault();
    if (event.shiftKey) actions.redo();
    else actions.undo();
  }

  return (
    <>
      <ParcelCounter onKeyDown={handleKeyDown}>
        <CounterSign>
          <SignTitle aria-hidden="true">Parcels · SVG Counter</SignTitle>
          <ToolbarRow>
            <Tooltip content="Undo">
              <BrassButton type="button" onClick={actions.undo} disabled={!actions.canUndo} aria-label="Undo">
                <UndoIcon size={16} />
              </BrassButton>
            </Tooltip>
            <Tooltip content="Redo">
              <BrassButton type="button" onClick={actions.redo} disabled={!actions.canRedo} aria-label="Redo">
                <RedoIcon size={16} />
              </BrassButton>
            </Tooltip>
            <Tooltip content="Reset to the default parcel">
              <BrassButton type="button" onClick={actions.resetOptimiser} aria-label="Reset to the default parcel">
                <RefreshIcon size={16} />
              </BrassButton>
            </Tooltip>
          </ToolbarRow>
        </CounterSign>

        <CounterGrid>
          <CounterColumn>
            <ParcelInput state={state} result={result} actions={actions} />
            <PostageStamps state={state} result={result} actions={actions} />
          </CounterColumn>
          <CounterColumn>
            <WeighingScale source={deferredState.source} result={result} />
            <ParcelPreview result={result} />
            <CodeView state={state} result={result} />
          </CounterColumn>
        </CounterGrid>

        <TrayRow>
          <PresetGallery actions={actions} />
          <ShareControls state={state} />
        </TrayRow>
      </ParcelCounter>
    </>
  );
}

SvgOptimiser.displayName = "SvgOptimiser";
