"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/color-serialize";
import * as edit from "@/helpers/color-palette-editor";
import { ColorPaletteIcon, UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import SeedControls from "@/components/ColorPaletteGenerator/SeedControls/SeedControls";
import ContrastControls from "@/components/ColorPaletteGenerator/ContrastControls/ContrastControls";
import ContrastResult from "@/components/ColorPaletteGenerator/ContrastResult/ContrastResult";
import RampDisplay from "@/components/ColorPaletteGenerator/RampDisplay/RampDisplay";
import ExportPanel from "@/components/ColorPaletteGenerator/ExportPanel/ExportPanel";
import PresetGallery from "@/components/ColorPaletteGenerator/PresetGallery/PresetGallery";
import ShareControls from "@/components/ColorPaletteGenerator/ShareControls/ShareControls";
import {
  SwatchBook,
  RegistrationMark,
  PunchHole,
  SwatchBookHeader,
  SwatchBookTitle,
  StampRail,
  StampButton,
  Spread,
  SidePage,
  MainPage
} from "@/components/ColorPaletteGenerator/ColorPaletteGenerator.styles";
import type { ColorPaletteActions, ColorPaletteEditorState } from "@/interfaces/color-palette";

const STORAGE_KEY = "color-palette-generator:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Deterministic across server and first client render: a shared `?state=` link decodes the same way on both, otherwise the fresh default palette. Never touches localStorage here — that varies between the server (no `window`) and the client's hydration render, which would mismatch the SSR markup. The last session's own autosave is instead restored in a post-mount effect below.
function loadInitialState(sharedState: string | null): ColorPaletteEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return decoded;
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire palette's state via useUndoStack, derives one
  ColorPaletteActions object every subcomponent shares, and handles the two forms of persistence —
  a `?state=` permalink decoded once on mount, and a debounced localStorage autosave thereafter.
  Structurally a near-mirror of the other goodies' own root component; kept as its own copy rather
  than a shared "generator shell" since none of these tools' state shapes or action sets actually overlap.
*/
export default function ColorPaletteGenerator(): JSX.Element {
  const searchParams = useSearchParams();
  const sharedState = searchParams.get("state");
  const undoStack = useUndoStack<ColorPaletteEditorState>(() => loadInitialState(sharedState));
  const { state, reset } = undoStack;

  // Runs once after hydration to restore the last session's autosave — localStorage is unavailable during SSR/the client's first render, so reading it here (rather than in the lazy initial-state above) keeps that first render identical on server and client. Skipped when a `?state=` permalink already supplied the initial state.
  useEffect(() => {
    if (sharedState && decodeShareableState(sharedState)) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) reset(JSON.parse(raw) as ColorPaletteEditorState);
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — keep the default palette.
    }
  }, [sharedState, reset]);

  // Debounced so rapid successive edits (e.g. dragging a native color-picker's own hue slider) don't hit localStorage on every frame — only once activity settles. Persists the shareable slice only, matching what a permalink itself carries.
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

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z work anywhere inside the tool, not just while a field has focus.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
    event.preventDefault();
    if (event.shiftKey) actions.redo();
    else actions.undo();
  }

  return (
    <>
      <SwatchBook onKeyDown={handleKeyDown}>
        <RegistrationMark data-side="left" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="1" />
          <line x1="1" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="1" />
        </RegistrationMark>
        <PunchHole aria-hidden="true" />
        <RegistrationMark data-side="right" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="1" />
          <line x1="1" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="1" />
        </RegistrationMark>

        <SwatchBookHeader>
          <SwatchBookTitle>
            <ColorPaletteIcon size={18} aria-hidden="true" />
            Swatch Fan
          </SwatchBookTitle>

          <StampRail>
            <Tooltip content="Undo">
              <StampButton type="button" onClick={actions.undo} disabled={!actions.canUndo} aria-label="Undo">
                <UndoIcon size={16} />
              </StampButton>
            </Tooltip>
            <Tooltip content="Redo">
              <StampButton type="button" onClick={actions.redo} disabled={!actions.canRedo} aria-label="Redo">
                <RedoIcon size={16} />
              </StampButton>
            </Tooltip>
            <Tooltip content="Reset palette">
              <StampButton type="button" onClick={actions.resetPalette} aria-label="Reset palette">
                <RefreshIcon size={16} />
              </StampButton>
            </Tooltip>
          </StampRail>
        </SwatchBookHeader>

        <Spread>
          <SidePage>
            <SeedControls state={state} actions={actions} />
            <ContrastControls state={state} actions={actions} />
            <PresetGallery actions={actions} />
            <ShareControls state={state} />
          </SidePage>

          <MainPage>
            <ContrastResult state={state} />
            <RampDisplay state={state} actions={actions} />
            <ExportPanel state={state} />
          </MainPage>
        </Spread>
      </SwatchBook>
    </>
  );
}

ColorPaletteGenerator.displayName = "ColorPaletteGenerator";
