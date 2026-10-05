"use client";

import { useMemo, useRef, useState } from "react";
import type { JSX, KeyboardEvent, UIEvent } from "react";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { PanelHint } from "@/components/ShaderPlayground/ShaderPlayground.styles";
import {
  EditorHeader,
  StatusReadout,
  EditorFrame,
  Gutter,
  GutterLine,
  CodeCell,
  ErrorUnderlay,
  ErrorBand,
  CodeTextarea,
  ErrorList,
  ErrorItem,
  ErrorLine
} from "@/components/ShaderPlayground/SourceEditor/SourceEditor.styles";
import type { SourceEditorProps } from "@/components/ShaderPlayground/ShaderPlayground.types";

// Two spaces per Tab — what every preset is indented with, and narrow enough that nested ray-march loops still fit beside the canvas.
const INDENT = "  ";

// Mirrors the styles' 1.25rem line-height — error bands and jump-to-line scrolling are positioned by line index, so the two must agree.
const LINE_HEIGHT_REM = 1.25;

/*
  Inserts text at the caret through the browser's own editing pipeline where it still exists, so
  the textarea's native undo (Ctrl+Z while typing) treats an inserted indent like any keystroke.
  execCommand is deprecated but has no replacement for this; the fallback writes the value
  through React and restores the caret, at the cost of that one step not being natively undoable.
*/
function insertAtCaret(textarea: HTMLTextAreaElement, text: string, onFallback: (next: string) => void): void {
  textarea.focus();
  if (document.execCommand?.("insertText", false, text)) return;
  const { selectionStart, selectionEnd, value } = textarea;
  const next = value.slice(0, selectionStart) + text + value.slice(selectionEnd);
  onFallback(next);
  const caret = selectionStart + text.length;
  requestAnimationFrame(() => textarea.setSelectionRange(caret, caret));
}

/*
  A deliberately small textarea editor rather than CodeMirror: the only CodeMirror setup in this
  repo is welded into the Sandbox component, and GLSL has no CodeMirror or Shiki grammar here
  anyway — so the features that actually matter for shaders (line numbers that match compiler
  output, error markers, Tab-to-indent) are built directly. Tab is trapped for indenting; Escape
  releases it so keyboard users can still Tab out, the same escape hatch CodeMirror itself offers.
*/
export default function SourceEditor({ state, actions, errors }: SourceEditorProps): JSX.Element {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const underlayRef = useRef<HTMLDivElement>(null);
  const [tabReleased, setTabReleased] = useState(false);
  const [copyTrigger, setCopyTrigger] = useState(0);

  const lineCount = state.source.split("\n").length;

  // Line → messages, so the gutter can mark a line once (with every message in its tooltip) however many errors land on it.
  const errorsByLine = useMemo(() => {
    const map = new Map<number, string[]>();
    for (const error of errors) {
      if (error.line === null) continue;
      map.set(error.line, [...(map.get(error.line) ?? []), error.message]);
    }
    return map;
  }, [errors]);

  // Scroll sync writes straight to the DOM: re-rendering hundreds of gutter rows per scroll event would visibly lag on long shaders.
  function handleScroll(event: UIEvent<HTMLTextAreaElement>) {
    const { scrollTop } = event.currentTarget;
    if (gutterRef.current) gutterRef.current.scrollTop = scrollTop;
    if (underlayRef.current) underlayRef.current.style.transform = `translateY(${-scrollTop}px)`;
  }

  // Tab indents, Enter carries the current line's indentation forward, Escape hands Tab back to the browser for one press.
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    const textarea = event.currentTarget;
    if (event.key === "Escape") {
      setTabReleased(true);
      return;
    }
    if (event.key === "Tab" && !event.shiftKey && !tabReleased && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      insertAtCaret(textarea, INDENT, actions.setSource);
      return;
    }
    if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const lineStart = textarea.value.lastIndexOf("\n", textarea.selectionStart - 1) + 1;
      const indent = /^[ \t]*/.exec(textarea.value.slice(lineStart, textarea.selectionStart))?.[0] ?? "";
      if (!indent) return;
      event.preventDefault();
      insertAtCaret(textarea, `\n${indent}`, actions.setSource);
    }
    if (tabReleased) setTabReleased(false);
  }

  // Selects the whole offending line so it's both visible and immediately retypeable.
  function jumpToLine(line: number) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const lines = textarea.value.split("\n");
    const start = lines.slice(0, line - 1).reduce((sum, text) => sum + text.length + 1, 0);
    textarea.focus();
    textarea.setSelectionRange(start, start + (lines[line - 1]?.length ?? 0));
    const lineHeightPx = LINE_HEIGHT_REM * parseFloat(getComputedStyle(document.documentElement).fontSize);
    textarea.scrollTop = Math.max(0, (line - 3) * lineHeightPx);
  }

  return (
    <>
      <EditorHeader>
        <StatusReadout role="status" data-state={errors.length > 0 ? "error" : "ok"}>
          {errors.length > 0 ? `${errors.length} error${errors.length === 1 ? "" : "s"} · last good frame` : "Compiled"}
        </StatusReadout>
        <CopyButton code={state.source} onCopy={() => setCopyTrigger((prev) => prev + 1)} />
      </EditorHeader>

      <EditorFrame>
        <Gutter ref={gutterRef} aria-hidden="true" style={{ inlineSize: `calc(${Math.max(2.25, String(lineCount).length)}ch + 1.875rem)` }}>
          {Array.from({ length: lineCount }, (_, index) => {
            const messages = errorsByLine.get(index + 1);
            return (
              <GutterLine key={index} data-error={messages ? "true" : undefined} title={messages?.join("\n")}>
                {index + 1}
              </GutterLine>
            );
          })}
        </Gutter>
        <CodeCell>
          <ErrorUnderlay ref={underlayRef} aria-hidden="true">
            {[...errorsByLine.keys()].map((line) => (
              <ErrorBand key={line} style={{ insetBlockStart: `${(line - 1) * LINE_HEIGHT_REM}rem` }} />
            ))}
          </ErrorUnderlay>
          <CodeTextarea
            ref={textareaRef}
            aria-label="GLSL fragment shader source"
            aria-invalid={errors.length > 0}
            aria-describedby="shader-playground-editor-hint"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            wrap="off"
            value={state.source}
            onChange={(event) => actions.setSource(event.target.value)}
            onBlur={actions.commitEdit}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
          />
        </CodeCell>
        <Shimmer trigger={copyTrigger} />
      </EditorFrame>

      <PanelHint id="shader-playground-editor-hint">
        Write <code>mainImage(out vec4 fragColor, in vec2 fragCoord)</code>. Tab indents; press Esc, then Tab, to move focus on.
      </PanelHint>

      {errors.length > 0 && (
        <ErrorList aria-label="Compile errors">
          {errors.map((error, index) => (
            <li key={`${error.line}-${index}`}>
              <ErrorItem type="button" disabled={error.line === null} onClick={() => error.line !== null && jumpToLine(error.line)}>
                <ErrorLine>{error.line === null ? "—" : `L${error.line}`}</ErrorLine>
                <span>{error.message}</span>
              </ErrorItem>
            </li>
          ))}
        </ErrorList>
      )}
    </>
  );
}

SourceEditor.displayName = "SourceEditor";
