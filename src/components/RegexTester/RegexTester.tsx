"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/regex-serialize";
import * as edit from "@/helpers/regex-tester-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import PatternControls from "@/components/RegexTester/PatternControls/PatternControls";
import MatchHighlight from "@/components/RegexTester/MatchHighlight/MatchHighlight";
import MatchList from "@/components/RegexTester/MatchList/MatchList";
import ExplainPanel from "@/components/RegexTester/ExplainPanel/ExplainPanel";
import ExportPanel from "@/components/RegexTester/ExportPanel/ExportPanel";
import PresetGallery from "@/components/RegexTester/PresetGallery/PresetGallery";
import ShareControls from "@/components/RegexTester/ShareControls/ShareControls";
import {
  SectionCard,
  PanelTitle,
  GeneratorWrapper,
  ToolbarRow,
  ToolbarButton,
  GeneratorGrid,
  SidePanel,
  MainColumn
} from "@/components/RegexTester/RegexTester.styles";
import type { RegexTesterActions, RegexTesterEditorState, RegexTesterShareableState } from "@/interfaces/regex-tester";

const STORAGE_KEY = "regex-tester:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's own localStorage autosave, then a fresh default pattern — same priority order as every other goodie's own loadInitialState.
function loadInitialState(sharedState: string | null): RegexTesterEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return decoded;
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as RegexTesterShareableState;
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default pattern rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the entire tool's state via useUndoStack, derives one
  RegexTesterActions object every subcomponent shares, and handles the two forms of persistence — a
  `?state=` permalink decoded once on mount, and a debounced localStorage autosave thereafter.
  Structurally a near-mirror of the other goodies' own root component; kept as its own copy rather
  than a shared "generator shell" since none of these tools' state shapes or action sets actually overlap.
*/
export default function RegexTester(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<RegexTesterEditorState>(() => loadInitialState(searchParams.get("state")));
  const { state } = undoStack;

  // Debounced so a fast run of keystrokes in the pattern or test-string field doesn't hit localStorage on every frame — only once activity settles.
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

  const actions: RegexTesterActions = useMemo(
    () => ({
      setPattern: (pattern) => undoStack.setPresent((s) => edit.setPattern(s, pattern)),
      setTestString: (value) => undoStack.setPresent((s) => edit.setTestString(s, value)),
      toggleFlag: (flag) => undoStack.setPresent((s) => edit.toggleFlag(s, flag)),
      commitDrag: () => undoStack.commit(),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetTester: () => undoStack.commit(() => edit.resetTester())
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
            <ToolbarButton type="button" onClick={actions.resetTester} aria-label="Reset">
              <RefreshIcon size={16} />
            </ToolbarButton>
          </Tooltip>
        </ToolbarRow>

        <GeneratorGrid>
          <SidePanel>
            <SectionCard>
              <PanelTitle>Pattern</PanelTitle>
              <PatternControls state={state} actions={actions} />
            </SectionCard>
            <PresetGallery actions={actions} />
            <ShareControls state={state} />
          </SidePanel>

          <MainColumn>
            <MatchHighlight state={state} actions={actions} />
            <MatchList state={state} />
            <ExplainPanel state={state} />
            <ExportPanel state={state} />
          </MainColumn>
        </GeneratorGrid>
      </GeneratorWrapper>
    </>
  );
}

RegexTester.displayName = "RegexTester";
