"use client";

import { useEffect, useMemo, useState } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { decodeShareableState } from "@/utils/shader-playground-serialize";
import { parseUniformControls } from "@/utils/shader-playground-uniforms";
import * as edit from "@/helpers/shader-playground-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import SourceEditor from "@/components/ShaderPlayground/SourceEditor/SourceEditor";
import ShaderCanvas from "@/components/ShaderPlayground/ShaderCanvas/ShaderCanvas";
import UniformControls from "@/components/ShaderPlayground/UniformControls/UniformControls";
import PresetGallery from "@/components/ShaderPlayground/PresetGallery/PresetGallery";
import ShareControls from "@/components/ShaderPlayground/ShareControls/ShareControls";
import {
  ArcadeCabinet,
  Marquee,
  MarqueeTitle,
  ToolbarRow,
  CoinButton,
  GeneratorGrid,
  EditorColumn,
  ScreenColumn,
  TrayRow,
  SectionCard,
  PanelTitle
} from "@/components/ShaderPlayground/ShaderPlayground.styles";
import type { ShaderCompileResult, ShaderPlaygroundActions, ShaderPlaygroundEditorState, ShaderPlaygroundShareableState } from "@/components/ShaderPlayground/ShaderPlayground.types";

const STORAGE_KEY = "shader-playground:state";
const AUTOSAVE_DEBOUNCE_MS = 400;

// Long enough to skip the half-typed states between keystrokes, short enough that the canvas still feels live — compiling per keystroke would flash an error at every unfinished identifier.
const COMPILE_DEBOUNCE_MS = 350;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's own localStorage autosave, then the default shader — same priority order as every other goodie's own loadInitialState.
function loadInitialState(sharedState: string | null): ShaderPlaygroundEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return decoded;
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<ShaderPlaygroundShareableState>;
        if (typeof saved.source === "string") return { source: saved.source, uniformValues: saved.uniformValues ?? {} };
      }
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default shader rather than crash the page.
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
  Root client component: owns the editor state via useUndoStack, derives one ShaderPlaygroundActions
  object every subcomponent shares, and handles both forms of persistence — a `?state=` permalink
  decoded once on mount and a debounced localStorage autosave thereafter. Structurally a near-mirror
  of the other goodies' root components; the one addition is a second, debounced copy of the source,
  which is what actually gets compiled and parsed for uniform annotations.
*/
export default function ShaderPlayground(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<ShaderPlaygroundEditorState>(() => loadInitialState(searchParams.get("state")));
  const { state } = undoStack;
  const [compiledSource, setCompiledSource] = useState(state.source);
  const [compileResult, setCompileResult] = useState<ShaderCompileResult>({ ok: true, errors: [] });

  // Debounced so a fast run of keystrokes doesn't hit localStorage on every one — only once typing settles.
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

  // Feeds the compiler a settled copy of the source rather than every intermediate keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setCompiledSource(state.source), COMPILE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [state.source]);

  // Parsed from the compiled copy, not the live one, so controls never appear for a uniform the running program doesn't have yet.
  const controls = useMemo(() => parseUniformControls(compiledSource), [compiledSource]);

  const actions: ShaderPlaygroundActions = useMemo(
    () => ({
      setSource: (source) => undoStack.setPresent((s) => edit.setSource(s, source)),
      setUniformValue: (name, value) => undoStack.setPresent((s) => edit.setUniformValue(s, name, value)),
      resetUniforms: () => undoStack.commit((s) => edit.resetUniforms(s)),
      commitEdit: () => undoStack.commit(),
      applyPreset: (preset) => undoStack.commit(() => edit.applyPreset(preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetPlayground: () => undoStack.commit(() => edit.resetPlayground())
    }),
    [undoStack]
  );

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z work anywhere inside the tool except inside the source editor itself, which keeps the browser's finer-grained native undo.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
    if (isTextEditingTarget(event.target)) return;
    event.preventDefault();
    if (event.shiftKey) actions.redo();
    else actions.undo();
  }

  return (
    <>
      <ArcadeCabinet onKeyDown={handleKeyDown}>
        <Marquee>
          <MarqueeTitle aria-hidden="true">Shader Arcade</MarqueeTitle>
          <ToolbarRow>
            <Tooltip content="Undo">
              <CoinButton type="button" onClick={actions.undo} disabled={!actions.canUndo} aria-label="Undo">
                <UndoIcon size={16} />
              </CoinButton>
            </Tooltip>
            <Tooltip content="Redo">
              <CoinButton type="button" onClick={actions.redo} disabled={!actions.canRedo} aria-label="Redo">
                <RedoIcon size={16} />
              </CoinButton>
            </Tooltip>
            <Tooltip content="Reset to the default shader">
              <CoinButton type="button" onClick={actions.resetPlayground} aria-label="Reset to the default shader">
                <RefreshIcon size={16} />
              </CoinButton>
            </Tooltip>
          </ToolbarRow>
        </Marquee>

        <GeneratorGrid>
          <EditorColumn>
            <SectionCard>
              <PanelTitle>Fragment shader</PanelTitle>
              <SourceEditor state={state} actions={actions} errors={compileResult.errors} />
            </SectionCard>
          </EditorColumn>

          <ScreenColumn>
            <ShaderCanvas source={compiledSource} controls={controls} uniformValues={state.uniformValues} onCompile={setCompileResult} />
            <UniformControls controls={controls} state={state} actions={actions} />
          </ScreenColumn>
        </GeneratorGrid>

        <TrayRow>
          <PresetGallery actions={actions} />
          <ShareControls state={state} />
        </TrayRow>
      </ArcadeCabinet>
    </>
  );
}

ShaderPlayground.displayName = "ShaderPlayground";
