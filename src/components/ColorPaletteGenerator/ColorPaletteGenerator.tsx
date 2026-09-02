"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/color-serialize";
import * as edit from "@/helpers/color-palette-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import SeedControls from "@/components/ColorPaletteGenerator/SeedControls/SeedControls";
import ContrastControls from "@/components/ColorPaletteGenerator/ContrastControls/ContrastControls";
import ContrastResult from "@/components/ColorPaletteGenerator/ContrastResult/ContrastResult";
import RampDisplay from "@/components/ColorPaletteGenerator/RampDisplay/RampDisplay";
import ExportPanel from "@/components/ColorPaletteGenerator/ExportPanel/ExportPanel";
import PresetGallery from "@/components/ColorPaletteGenerator/PresetGallery/PresetGallery";
import ShareControls from "@/components/ColorPaletteGenerator/ShareControls/ShareControls";
import {
  SectionCard,
  PanelTitle,
  GeneratorWrapper,
  ToolbarRow,
  ToolbarButton,
  GeneratorGrid,
  SidePanel,
  MainColumn
} from "@/components/ColorPaletteGenerator/ColorPaletteGenerator.styles";
import type { ColorPaletteActions, ColorPaletteEditorState, ColorPaletteShareableState } from "@/interfaces/color-palette";

const STORAGE_KEY = "color-palette-generator:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's own localStorage autosave, then a fresh default palette — same priority order as every other goodie's own loadInitialState.
function loadInitialState(sharedState: string | null): ColorPaletteEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return decoded;
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as ColorPaletteShareableState;
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default palette rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire tool's state via useUndoStack, derives one
  ColorPaletteActions object every subcomponent shares, and handles the two forms of persistence —
  a `?state=` permalink decoded once on mount, and a debounced localStorage autosave thereafter.
  Structurally a near-mirror of the other goodies' own root component; kept as its own copy rather
  than a shared "generator shell" since none of these tools' state shapes or action sets actually overlap.
*/
export default function ColorPaletteGenerator(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<ColorPaletteEditorState>(() => loadInitialState(searchParams.get("state")));
  const { state } = undoStack;

  // Debounced so rapid successive edits (e.g. dragging a native color-picker's own hue slider) don't hit localStorage on every frame — only once activity settles.
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

  const actions: ColorPaletteActions = useMemo(
    () => ({
      setSeedColor: (hex) => undoStack.setPresent((s) => edit.setSeedColor(s, hex)),
      setForeground: (hex) => undoStack.setPresent((s) => edit.setForeground(s, hex)),
      setBackground: (hex) => undoStack.setPresent((s) => edit.setBackground(s, hex)),
      swapContrastPair: () => undoStack.commit((s) => edit.swapContrastPair(s)),
      setRampMode: (mode) => undoStack.commit((s) => edit.setRampMode(s, mode)),
      useAsBackground: (hex) => undoStack.commit((s) => edit.useAsBackground(s, hex)),
      commitDrag: () => undoStack.commit(),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetPalette: () => undoStack.commit(() => edit.resetPalette())
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
          <Tooltip content="Reset">
            <ToolbarButton type="button" onClick={actions.resetPalette} aria-label="Reset">
              <RefreshIcon size={16} />
            </ToolbarButton>
          </Tooltip>
        </ToolbarRow>

        <GeneratorGrid>
          <SidePanel>
            <SectionCard>
              <PanelTitle>Seed</PanelTitle>
              <SeedControls state={state} actions={actions} />
            </SectionCard>
            <SectionCard>
              <PanelTitle>Contrast pair</PanelTitle>
              <ContrastControls state={state} actions={actions} />
            </SectionCard>
            <PresetGallery actions={actions} />
            <ShareControls state={state} />
          </SidePanel>

          <MainColumn>
            <SectionCard>
              <PanelTitle>Contrast check</PanelTitle>
              <ContrastResult state={state} />
            </SectionCard>
            <SectionCard>
              <RampDisplay state={state} actions={actions} />
            </SectionCard>
            <ExportPanel state={state} />
          </MainColumn>
        </GeneratorGrid>
      </GeneratorWrapper>
    </>
  );
}

ColorPaletteGenerator.displayName = "ColorPaletteGenerator";
