"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/color-mix-serialize";
import * as edit from "@/helpers/color-mix-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import ColorInputs from "@/components/ColorMixPlayground/ColorInputs/ColorInputs";
import SpaceControls from "@/components/ColorMixPlayground/SpaceControls/SpaceControls";
import Slider from "@/components/ColorMixPlayground/Slider/Slider";
import PreviewPane from "@/components/ColorMixPlayground/PreviewPane/PreviewPane";
import ExportPanel from "@/components/ColorMixPlayground/ExportPanel/ExportPanel";
import PresetGallery from "@/components/ColorMixPlayground/PresetGallery/PresetGallery";
import ShareControls from "@/components/ColorMixPlayground/ShareControls/ShareControls";
import { SectionCard, PanelTitle, GeneratorWrapper, ToolbarRow, ToolbarButton, GeneratorGrid, SidePanel, MainColumn } from "@/components/ColorMixPlayground/ColorMixPlayground.styles";
import type { ColorMixActions, ColorMixEditorState, ColorMixShareableState } from "@/interfaces/color-mix";

const STORAGE_KEY = "color-mix-playground:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Same priority order as every other goodie's own loadInitialState — a shared `?state=` link first, then this session's own localStorage autosave, then a fresh default pair.
function loadInitialState(sharedState: string | null): ColorMixEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return decoded;
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as ColorMixShareableState;
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default pair rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire editor's state via useUndoStack, derives one
  ColorMixActions object every subcomponent shares, and handles the two forms of persistence — a
  `?state=` permalink decoded once on mount, and a debounced localStorage autosave thereafter.
  Its own copy of the GradientGenerator/EasingCurveEditor shell rather than a shared abstraction,
  since none of these tools' state shapes or action sets actually overlap.
*/
export default function ColorMixPlayground(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<ColorMixEditorState>(() => loadInitialState(searchParams.get("state")));
  const { state } = undoStack;

  // Debounced so dragging the ratio slider or a color picker doesn't hit localStorage on every frame — only once activity settles.
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

  const actions: ColorMixActions = useMemo(
    () => ({
      setColor1: (hex) => undoStack.setPresent((s) => edit.setColor1(s, hex)),
      setColor2: (hex) => undoStack.setPresent((s) => edit.setColor2(s, hex)),
      swapColors: () => undoStack.commit((s) => edit.swapColors(s)),
      setSpace: (space) => undoStack.commit((s) => edit.setSpace(s, space)),
      setHueMethod: (hueMethod) => undoStack.commit((s) => edit.setHueMethod(s, hueMethod)),
      setRatio: (ratio) => undoStack.setPresent((s) => edit.setRatio(s, ratio)),
      commitDrag: () => undoStack.commit(),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetMix: () => undoStack.commit(() => edit.resetMix())
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
            <ToolbarButton type="button" onClick={actions.resetMix} aria-label="Reset">
              <RefreshIcon size={16} />
            </ToolbarButton>
          </Tooltip>
        </ToolbarRow>

        <GeneratorGrid>
          <SidePanel>
            <SectionCard>
              <PanelTitle>Colors</PanelTitle>
              <ColorInputs state={state} actions={actions} />
            </SectionCard>
            <SectionCard>
              <SpaceControls state={state} actions={actions} />
            </SectionCard>
            <SectionCard>
              <Slider label="Mix ratio" min={0} max={100} value={state.ratio} suffix="%" onChange={actions.setRatio} onCommit={actions.commitDrag} />
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

ColorMixPlayground.displayName = "ColorMixPlayground";
