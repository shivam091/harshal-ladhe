"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/popover-anchor-builder-serialize";
import * as edit from "@/helpers/popover-anchor-builder-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import AnchorSideControls from "@/components/PopoverAnchorBuilder/AnchorSideControls/AnchorSideControls";
import BehaviorControls from "@/components/PopoverAnchorBuilder/BehaviorControls/BehaviorControls";
import PreviewPane from "@/components/PopoverAnchorBuilder/PreviewPane/PreviewPane";
import ExportPanel from "@/components/PopoverAnchorBuilder/ExportPanel/ExportPanel";
import PresetGallery from "@/components/PopoverAnchorBuilder/PresetGallery/PresetGallery";
import ShareControls from "@/components/PopoverAnchorBuilder/ShareControls/ShareControls";
import {
  SectionCard,
  PanelTitle,
  GeneratorWrapper,
  ToolbarRow,
  ToolbarButton,
  GeneratorGrid,
  SidePanel,
  MainColumn
} from "@/components/PopoverAnchorBuilder/PopoverAnchorBuilder.styles";
import type { PopoverAnchorActions, PopoverAnchorEditorState, PopoverAnchorShareableState } from "@/interfaces/popover-anchor-builder";

const STORAGE_KEY = "popover-anchor-builder:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's own localStorage autosave, then a fresh default shape — same priority order as every other goodie's own loadInitialState.
function loadInitialState(sharedState: string | null): PopoverAnchorEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return decoded;
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as PopoverAnchorShareableState;
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default shape rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire tool's state via useUndoStack, derives one
  PopoverAnchorActions object every subcomponent shares, and handles the two forms of persistence —
  a `?state=` permalink decoded once on mount, and a debounced localStorage autosave thereafter.
  Structurally a near-mirror of TriangleGenerator's own root component; kept as its own copy rather
  than a shared "generator shell" since none of these tools' state shapes or action sets actually
  overlap.
*/
export default function PopoverAnchorBuilder(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<PopoverAnchorEditorState>(() => loadInitialState(searchParams.get("state")));
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

  const actions: PopoverAnchorActions = useMemo(
    () => ({
      setAnchorSide: (side) => undoStack.commit((s) => edit.setAnchorSide(s, side)),
      setOffset: (offset) => undoStack.setPresent((s) => edit.setOffset(s, offset)),
      commitDrag: () => undoStack.commit(),
      setMode: (mode) => undoStack.commit((s) => edit.setMode(s, mode)),
      setBackdrop: (backdrop) => undoStack.commit((s) => edit.setBackdrop(s, backdrop)),
      setEntranceAnimation: (enabled) => undoStack.commit((s) => edit.setEntranceAnimation(s, enabled)),
      setFallback: (enabled) => undoStack.commit((s) => edit.setFallback(s, enabled)),
      setContent: (content) => undoStack.commit((s) => edit.setContent(s, content)),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetShape: () => undoStack.commit(() => edit.resetShape())
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
            <ToolbarButton type="button" onClick={actions.resetShape} aria-label="Reset">
              <RefreshIcon size={16} />
            </ToolbarButton>
          </Tooltip>
        </ToolbarRow>

        <GeneratorGrid>
          <SidePanel>
            <SectionCard>
              <PanelTitle>Anchor placement</PanelTitle>
              <AnchorSideControls state={state} actions={actions} />
            </SectionCard>
            <SectionCard>
              <PanelTitle>Behavior</PanelTitle>
              <BehaviorControls state={state} actions={actions} />
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

PopoverAnchorBuilder.displayName = "PopoverAnchorBuilder";
