"use client";

import type { JSX } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SandpackCodeEditor, useSandpack } from "@codesandbox/sandpack-react";
import { setDiagnostics, type Diagnostic } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";
import { usePreviewClientContext } from "@/hooks/use-preview-client-context";
import type { CodeMirrorHandle, SandboxCodeEditorProps } from "@/components/Sandbox/Editor/SandboxCodeEditor/SandboxCodeEditor.types";
import { sandboxAdditionalLanguages } from "@/components/Sandbox/Editor/additional-languages";
import {
  setErrorLine,
  setShowIndentGuides,
  setShowStickyScroll,
  setShowBreadcrumbs,
  foldingCompartment,
  sandboxFoldingCoreExtension,
  wordWrapCompartment,
  minimapCompartment,
  sandboxMinimapCoreExtension,
  tabSizeCompartment,
  sandboxTabSizeExtension,
  readOnlyCompartment,
  sandboxReadOnlyCoreExtension,
  setOriginalLines,
  setDiffGutterEnabled,
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
  showIndentGuides,
  showStickyScroll,
  showBreadcrumbs,
  showFolding,
  showDiffGutter = true,
  showWordWrap,
  showMinimap,
  tabSize,
  indentStyle,
  fontSize,
  readOnly,
  readOnlyFiles,
  extensions,
  style,
  onCursorChange,
  originalFiles
}: SandboxCodeEditorProps): JSX.Element {
  const editorRef = useRef<CodeMirrorHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { sandpack } = useSandpack();
  const { error } = usePreviewClientContext();

  /*
    Latest bundler-error diagnostic per file, kept so the syntax linter's own dispatch on every
    edit doesn't wipe it out. A Map mutated in place rather than a ref, since the alternatives trip
    react-hooks rules when closed over during render.
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
      Same `line` so the tooltip agrees with the highlight; syntax diagnostics are folded in
      because this dispatch replaces the whole list and would otherwise wipe them out.
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

  /*
    Sandpack mounts a brand-new CodeMirror instance per tab, so these StateField-backed toggles
    always start back at their own `false` default — this re-dispatches every current toggle value
    on every tab switch too, not just when one of them changes, so a freshly-mounted tab's editor
    stays in sync with the toolbar instead of silently resetting to off. One dispatch for all
    three instead of three separate ones, since the whole point is to keep them all in sync at once.
  */
  useEffect(() => {
    const view = editorRef.current?.getCodemirror();
    if (!view) return;

    view.dispatch({
      effects: [
        setShowIndentGuides.of(showIndentGuides),
        setShowStickyScroll.of(showStickyScroll),
        setShowBreadcrumbs.of(showBreadcrumbs)
      ]
    });
  }, [showIndentGuides, showStickyScroll, showBreadcrumbs, sandpack.activeFile]);

  /*
    Unlike the StateField-backed toggles above, folding is reconfigured via a Compartment —
    turning it off removes codeFolding()/foldGutter()/foldKeymap from state entirely instead of
    just hiding their output, so a freshly-mounted tab always starts from the current toggle
    value rather than folding's own default-on extension list.
  */
  useEffect(() => {
    const view = editorRef.current?.getCodemirror();
    if (!view) return;

    view.dispatch({
      effects: foldingCompartment.reconfigure(showFolding ? sandboxFoldingCoreExtension : [])
    });
  }, [showFolding, sandpack.activeFile]);

  /*
    Same Compartment-based reconfigure as folding above — EditorView.lineWrapping is either
    present in state or it isn't, so there's no toggleable-flag extension to leave mounted.
  */
  useEffect(() => {
    const view = editorRef.current?.getCodemirror();
    if (!view) return;

    view.dispatch({
      effects: wordWrapCompartment.reconfigure(showWordWrap ? EditorView.lineWrapping : [])
    });
  }, [showWordWrap, sandpack.activeFile]);

  /*
    Toggles the minimap in/out of state via its Compartment. The follow-up empty dispatch forces
    an immediate paint — without it, the freshly-mounted minimap stays blank until some other
    transaction (an edit or a scroll) happens to trigger its first render.
  */
  useEffect(() => {
    const view = editorRef.current?.getCodemirror();
    if (!view) return;

    view.dispatch({
      effects: minimapCompartment.reconfigure(showMinimap ? sandboxMinimapCoreExtension : [])
    });

    if (showMinimap) {
      view.dispatch({});
    }
  }, [showMinimap, sandpack.activeFile]);

  /*
    A Compartment because indentUnit and tabSize need a fresh extension pair on every change
    rather than a toggleable flag.
  */
  useEffect(() => {
    const view = editorRef.current?.getCodemirror();
    if (!view) return;

    view.dispatch({
      effects: tabSizeCompartment.reconfigure(sandboxTabSizeExtension(tabSize, indentStyle))
    });
  }, [tabSize, indentStyle, sandpack.activeFile]);

  /*
    A Compartment because readOnly is all-or-nothing in state. Locks the active file even when the
    sandbox-wide flag is off, if that file is listed as read-only.
  */
  useEffect(() => {
    const view = editorRef.current?.getCodemirror();
    if (!view) return;

    const activeFileReadOnly = readOnly || readOnlyFiles.includes(sandpack.activeFile);

    view.dispatch({
      effects: readOnlyCompartment.reconfigure(activeFileReadOnly ? sandboxReadOnlyCoreExtension : [])
    });
  }, [readOnly, readOnlyFiles, sandpack.activeFile]);

  /*
    Original content comes from the server-resolved file tree, not Sandpack's already-edited state,
    and is re-dispatched on every tab switch since each file gets its own CodeMirror instance.
  */
  useEffect(() => {
    const view = editorRef.current?.getCodemirror();
    if (!view) return;

    const entry = originalFiles?.[sandpack.activeFile];
    const originalCode = entry == null ? null : typeof entry === "string" ? entry : entry.code;

    view.dispatch({
      effects: [
        setOriginalLines.of(originalCode == null ? null : { lines: originalCode.split("\n"), filePath: sandpack.activeFile })
      ]
    });
  }, [originalFiles, sandpack.activeFile]);

  /*
    Mirrors showDiffGutter into the active CodeMirror instance — re-dispatched on every tab switch
    since diffGutterEnabledField, like originalLinesField, starts fresh (defaulting to enabled) on
    whichever instance Sandpack just mounted for the new tab.
  */
  useEffect(() => {
    const view = editorRef.current?.getCodemirror();
    if (!view) return;

    view.dispatch({ effects: [setDiffGutterEnabled.of(showDiffGutter)] });
  }, [showDiffGutter, sandpack.activeFile]);

  /*
    CodeMirror caches its own line-height and gutter geometry independently of ancestor CSS, so a
    font-size change forces a remeasure instead of waiting on an unrelated interaction.
  */
  useEffect(() => {
    const view = editorRef.current?.getCodemirror();
    if (!view) return;

    view.requestMeasure();
  }, [fontSize]);

  /*
    Dots a modified file's tab like VS Code's unsaved indicator, keyed off the original template
    instead of disk; goes through Sandpack's public tab markup since there's no render prop for a badge.
  */
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !originalFiles) return;

    const modifiedPaths = new Set(
      Object.keys(originalFiles).filter((path) => {
        const entry = originalFiles[path];
        const originalCode = typeof entry === "string" ? entry : entry.code;
        const currentCode = sandpack.files[path]?.code;
        return currentCode != null && currentCode !== originalCode;
      })
    );

    container.querySelectorAll<HTMLElement>(".sp-tab-button[title]").forEach((button) => {
      const path = button.getAttribute("title");
      if (path && modifiedPaths.has(path)) {
        button.dataset.modified = "true";
      } else {
        delete button.dataset.modified;
      }

      const tabContainer = button.parentElement;
      if (path && readOnlyFiles.includes(path)) {
        tabContainer?.setAttribute("data-readonly", "true");
      } else {
        tabContainer?.removeAttribute("data-readonly");
      }
    });
  }, [originalFiles, sandpack.files, readOnlyFiles]);

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
      {/* display:contents keeps this ref anchor invisible to layout. */}
      <div ref={containerRef} style={{ display: "contents" }}>
        <SandpackCodeEditor
          ref={editorRef}
          showTabs
          closableTabs
          showLineNumbers={showLineNumbers}
          extensions={mergedExtensions}
          additionalLanguages={sandboxAdditionalLanguages}
          style={style}
          /*
            Sandpack defers creating each tab's EditorView until an IntersectionObserver fires,
            during which getCodemirror() returns undefined. "immediate" skips that lazy mount so
            the effects above (focus, cursor sync, diagnostics) always find a live view.
          */
          initMode="immediate"
        />
      </div>
    </>
  );
}

SandboxCodeEditor.displayName = "SandboxCodeEditor";
