"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/svg-to-react-serialize";
import { convertSvgToReact } from "@/utils/svg-to-react";
import * as edit from "@/helpers/svg-to-react-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import InputPanel from "@/components/SvgToReactConverter/InputPanel/InputPanel";
import OptionsPanel from "@/components/SvgToReactConverter/OptionsPanel/OptionsPanel";
import PreviewPane from "@/components/SvgToReactConverter/PreviewPane/PreviewPane";
import TransformLog from "@/components/SvgToReactConverter/TransformLog/TransformLog";
import ExportPanel from "@/components/SvgToReactConverter/ExportPanel/ExportPanel";
import PresetGallery from "@/components/SvgToReactConverter/PresetGallery/PresetGallery";
import ShareControls from "@/components/SvgToReactConverter/ShareControls/ShareControls";
import {
  CircuitBoard,
  ToolbarRow,
  BoardLabel,
  PinHeader,
  GoldPin,
  BoardGrid,
  SidePanel,
  MainColumn,
  TraceBus,
  Trace,
  TraceLabel
} from "@/components/SvgToReactConverter/SvgToReactConverter.styles";
import type { SvgToReactActions, SvgToReactEditorState, SvgToReactOptions, SvgToReactShareableState } from "@/components/SvgToReactConverter/SvgToReactConverter.types";

const STORAGE_KEY = "svg-to-react-converter:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// One trace per props-wiring option — the bus lights exactly the props the generated component will accept.
const WIRING_TRACES: Array<{ key: keyof SvgToReactOptions; label: string }> = [
  { key: "spreadProps", label: "...props" },
  { key: "titleProp", label: "title" },
  { key: "sizeProp", label: "size" },
  { key: "forwardRef", label: "ref" },
  { key: "memo", label: "memo" }
];

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's own localStorage autosave, then the default preset — same priority order as every other goodie's own loadInitialState.
function loadInitialState(sharedState: string | null): SvgToReactEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return edit.hydrateState(decoded);
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return edit.hydrateState(JSON.parse(raw) as SvgToReactShareableState);
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default preset rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

/*
  Root client component: owns the tool's state via useUndoStack, runs the conversion pipeline once
  per state change (every panel reads that one memoised result rather than re-parsing), and handles
  the two forms of persistence — a `?state=` permalink decoded once on mount, and a debounced
  localStorage autosave thereafter. Structurally a near-mirror of the other goodies' own root
  component; kept as its own copy since none of their state shapes or action sets overlap.
*/
export default function SvgToReactConverter(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<SvgToReactEditorState>(() => loadInitialState(searchParams.get("state")));
  const { state } = undoStack;
  const result = useMemo(() => convertSvgToReact(state), [state]);

  // Debounced so a fast run of keystrokes in the source field doesn't hit localStorage on every frame — only once activity settles.
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

  const actions: SvgToReactActions = useMemo(
    () => ({
      setSource: (source) => undoStack.setPresent((s) => edit.setSource(s, source)),
      loadFile: (fileName, source) => undoStack.commit((s) => edit.loadFile(s, fileName, source)),
      setComponentName: (name) => undoStack.setPresent((s) => edit.setComponentName(s, name)),
      setOption: (key, value) => undoStack.commit((s) => edit.setOption(s, key, value)),
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

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z work anywhere inside the tool except the source/name fields, whose own native text undo is more precise than a whole-state step.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
    const target = event.target as HTMLElement;
    if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") return;
    event.preventDefault();
    if (event.shiftKey) actions.redo();
    else actions.undo();
  }

  return (
    <>
      <CircuitBoard onKeyDown={handleKeyDown}>
        <ToolbarRow>
          <BoardLabel aria-hidden="true">SVG→JSX rev.A</BoardLabel>
          <PinHeader>
            <Tooltip content="Undo">
              <GoldPin type="button" onClick={actions.undo} disabled={!actions.canUndo} aria-label="Undo">
                <UndoIcon size={16} />
              </GoldPin>
            </Tooltip>
            <Tooltip content="Redo">
              <GoldPin type="button" onClick={actions.redo} disabled={!actions.canRedo} aria-label="Redo">
                <RedoIcon size={16} />
              </GoldPin>
            </Tooltip>
            <Tooltip content="Reset">
              <GoldPin type="button" onClick={actions.resetConverter} aria-label="Reset">
                <RefreshIcon size={16} />
              </GoldPin>
            </Tooltip>
          </PinHeader>
        </ToolbarRow>

        <BoardGrid>
          <SidePanel>
            <InputPanel state={state} result={result} actions={actions} />
            <OptionsPanel state={state} actions={actions} />
            <PresetGallery actions={actions} />
            <ShareControls state={state} />
          </SidePanel>

          <TraceBus aria-hidden="true">
            {WIRING_TRACES.map((trace) => (
              <Trace key={trace.key} data-active={state.options[trace.key] ? "true" : "false"}>
                <TraceLabel>{trace.label}</TraceLabel>
              </Trace>
            ))}
          </TraceBus>

          <MainColumn>
            <PreviewPane result={result} />
            <TransformLog result={result} />
            <ExportPanel state={state} result={result} />
          </MainColumn>
        </BoardGrid>
      </CircuitBoard>
    </>
  );
}

SvgToReactConverter.displayName = "SvgToReactConverter";
