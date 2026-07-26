"use client";

import { useCallback, useEffect, useMemo, useRef, useState, JSX } from "react";
import { SandpackCodeEditor, useSandpack } from "@codesandbox/sandpack-react";
import { setDiagnostics, type Diagnostic } from "@codemirror/lint";
import { usePreviewClientContext } from "@/hooks/use-preview-client-context";
import type { CodeMirrorHandle, SandboxCodeEditorProps } from "@/interfaces/sandbox";
import { sandboxAdditionalLanguages } from "@/components/Sandbox/Editor/additional-languages";
import {
  setErrorLine,
  errorLineHighlightExtension,
  sandboxSyntaxColorExtension,
  createCursorTrackingExtension,
  computeCursorInfo,
  computeErrorDiagnostics,
  computeSyntaxDiagnostics,
  createSyntaxLintExtension
} from "@/components/Sandbox/Editor/extensions";

/*
  Wraps SandpackCodeEditor to restore the red error-line highlight lost when the preview client
  stopped being registered with SandpackProvider — reimplemented via our own extension and
  setErrorLine effect instead of Sandpack's unreachable internal handling.
*/
export default function SandboxCodeEditor({
  showLineNumbers,
  extensions,
  style,
  onCursorChange
}: SandboxCodeEditorProps): JSX.Element {
  const editorRef = useRef<CodeMirrorHandle>(null);
  const { sandpack } = useSandpack();
  const { error } = usePreviewClientContext();

  /*
    Latest bundler-error diagnostic (at most one line) per file, read by createSyntaxLintExtension's
    updateListener so its own setDiagnostics dispatch on every edit doesn't wipe it out. A Map
    mutated via .set()/.get() rather than a ref (or a plain object reassigned via `.current =`) —
    both trip react-hooks rules when closed over and passed into an extension factory during render.
  */
  const [bundlerDiagnosticsByFile] = useState(
    () => new Map<string, Diagnostic[]>()
  );
  const getBundlerDiagnostics = useCallback(
    () => bundlerDiagnosticsByFile.get(sandpack.activeFile) ?? [],
    [bundlerDiagnosticsByFile, sandpack.activeFile]
  );

  /*
    extensions/onCursorChange must be stable references — rebuilding them inline can loop via
    the cursor listener re-firing onCursorChange on every reconfigure.
  */
  const mergedExtensions = useMemo(() => {
    const result = [
      ...extensions,
      errorLineHighlightExtension,
      sandboxSyntaxColorExtension,
      createSyntaxLintExtension(getBundlerDiagnostics)
    ];
    if (onCursorChange) {
      result.push(createCursorTrackingExtension(onCursorChange));
    }

    return result;
  }, [extensions, onCursorChange, getBundlerDiagnostics]);

  useEffect(() => {
    const view = editorRef.current?.getCodemirror();
    if (!view) return;

    // error.path is unset for free-form console/notification errors — assume it's the active file.
    const matchesActiveFile = error?.path == null || error.path === sandpack.activeFile;
    const line = matchesActiveFile ? (error?.line ?? null) : null;

    // Only highlights the error line — doesn't move the cursor or scroll, to avoid disrupting typing.
    view.dispatch({ effects: [setErrorLine.of(line)] });

    /*
      Same `line`, so the diagnostic tooltip always agrees with the line highlight. Folds in
      computeSyntaxDiagnostics too — this dispatch fully replaces the diagnostics list, so it'd
      otherwise wipe out whatever createSyntaxLintExtension last set on a keystroke.
    */
    const bundlerDiagnosticsForFile = computeErrorDiagnostics(view, line, error?.message);
    bundlerDiagnosticsByFile.set(sandpack.activeFile, bundlerDiagnosticsForFile);
    view.dispatch(
      setDiagnostics(view.state, [
        ...computeSyntaxDiagnostics(view),
        ...bundlerDiagnosticsForFile
      ])
    );
  }, [error, sandpack.activeFile, bundlerDiagnosticsByFile]);

  // Skips the focus-stealing below on the very first render — only actual tab switches should grab focus.
  const isInitialFileRef = useRef(true);

  /*
    Update-listener only fires on edit/caret move, so this syncs cursor info on mount and on
    tab switch (Sandpack remounts CodeMirror per tab) to avoid a stale footer reading. Also
    (re)focuses the new tab's editor so it has a visible caret right away, matching every other
    code tab UI — skipped on first mount so loading the page doesn't itself steal focus.
  */
  useEffect(() => {
    const view = editorRef.current?.getCodemirror();
    if (!view) return;

    if (isInitialFileRef.current) {
      isInitialFileRef.current = false;
    } else {
      view.contentDOM.focus();
    }

    if (onCursorChange) {
      onCursorChange(computeCursorInfo(view));
    }
  }, [sandpack.activeFile, onCursorChange]);

  return (
    <>
      <SandpackCodeEditor
        ref={editorRef}
        showTabs
        closableTabs
        showLineNumbers={showLineNumbers}
        extensions={mergedExtensions}
        additionalLanguages={sandboxAdditionalLanguages}
        style={style}
        /*
          Sandpack mounts a brand-new CodeMirror instance per tab (keyed by file path), and by
          default defers actually creating its EditorView until an IntersectionObserver fires —
          so on every tab switch there's a window where getCodemirror() returns undefined and
          the effects above (focus, cursor sync, diagnostics) silently no-op. "immediate" skips
          that lazy dance so those effects always find a live view.
        */
        initMode="immediate"
      />
    </>
  );
}

SandboxCodeEditor.displayName = "SandboxCodeEditor";
