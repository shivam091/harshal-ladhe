"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/unit-converter-serialize";
import * as edit from "@/helpers/unit-converter-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import ContextControls from "@/components/UnitConverter/ContextControls/ContextControls";
import ConversionTable from "@/components/UnitConverter/ConversionTable/ConversionTable";
import MeasuringTape from "@/components/UnitConverter/MeasuringTape/MeasuringTape";
import UnitNotes from "@/components/UnitConverter/UnitNotes/UnitNotes";
import BatchConverter from "@/components/UnitConverter/BatchConverter/BatchConverter";
import ExportPanel from "@/components/UnitConverter/ExportPanel/ExportPanel";
import PresetGallery from "@/components/UnitConverter/PresetGallery/PresetGallery";
import ShareControls from "@/components/UnitConverter/ShareControls/ShareControls";
import {
  SectionCard,
  PanelTitle,
  TailorsBench,
  ToolbarRow,
  ToolbarButton,
  GeneratorGrid,
  SidePanel,
  MainColumn
} from "@/components/UnitConverter/UnitConverter.styles";
import type { UnitConverterActions, UnitConverterEditorState, UnitConverterShareableState } from "@/components/UnitConverter/UnitConverter.types";

// Namespaced like every other goodie's key so two tools' autosaves can never overwrite each other.
const STORAGE_KEY = "unit-converter:state";

// Long enough to skip the per-frame writes of a tape drag, short enough that a closed tab rarely loses anything.
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's own localStorage autosave, then a fresh default — same priority order as every other goodie's own loadInitialState.
function loadInitialState(sharedState: string | null): UnitConverterEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return edit.normaliseState(decoded);
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return edit.normaliseState(JSON.parse(raw) as UnitConverterShareableState);
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the whole converter's state via useUndoStack, derives one
  UnitConverterActions object every subcomponent shares, and handles both forms of persistence — a
  `?state=` permalink decoded once on mount, and a debounced localStorage autosave thereafter.
  Structurally a near-mirror of the other goodies' own root component; kept as its own copy rather
  than a shared "generator shell" since none of these tools' state shapes or action sets overlap.
*/
export default function UnitConverter(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<UnitConverterEditorState>(() => loadInitialState(searchParams.get("state")));
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

  // Typed and dragged edits use setPresent and checkpoint on blur/release; picking from a list commits straight away since it's already one discrete step.
  const actions: UnitConverterActions = useMemo(
    () => ({
      setValue: (unit, value) => undoStack.setPresent((s) => edit.setValue(s, unit, value)),
      setLengthPx: (px) => undoStack.setPresent((s) => edit.setLengthPx(s, px)),
      setContext: (patch) => undoStack.setPresent((s) => edit.setContext(s, patch)),
      setPrecision: (decimals) => undoStack.setPresent((s) => edit.setPrecision(s, decimals)),
      setBatchInput: (text) => undoStack.setPresent((s) => edit.setBatchInput(s, text)),
      setBatchUnit: (unit) => undoStack.commit((s) => edit.setBatchUnit(s, unit)),
      setBatchPrefix: (prefix) => undoStack.setPresent((s) => edit.setBatchPrefix(s, prefix)),
      commitDrag: () => undoStack.commit(),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetConverter: () => undoStack.commit(() => edit.resetConverter())
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
      <TailorsBench onKeyDown={handleKeyDown}>
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
          <Tooltip content="Reset">
            <ToolbarButton type="button" onClick={actions.resetConverter} aria-label="Reset">
              <RefreshIcon size={16} />
            </ToolbarButton>
          </Tooltip>
        </ToolbarRow>

        <GeneratorGrid>
          <SidePanel>
            <SectionCard>
              <PanelTitle>Context</PanelTitle>
              <ContextControls state={state} actions={actions} />
            </SectionCard>
            <PresetGallery actions={actions} />
            <ShareControls state={state} />
          </SidePanel>

          <MainColumn>
            <ConversionTable state={state} actions={actions} />
            <MeasuringTape state={state} actions={actions} />
            <UnitNotes state={state} />
            <BatchConverter state={state} actions={actions} />
            <ExportPanel state={state} />
          </MainColumn>
        </GeneratorGrid>
      </TailorsBench>
    </>
  );
}

UnitConverter.displayName = "UnitConverter";
