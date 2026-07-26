"use client";

import { useState, useCallback, useMemo, JSX, type ReactNode } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackFileExplorer
} from "@codesandbox/sandpack-react";
import PreviewPanel from "@/components/Sandbox/PreviewPanel";
import SandboxCodeEditor from "@/components/Sandbox/Editor/SandboxCodeEditor";
import EditorMetaBar from "@/components/Sandbox/Editor/EditorMetaBar";
import { PreviewClientProvider } from "@/components/Sandbox/PreviewPanel/PreviewClientContext";
import { SandboxUIProvider } from "@/components/Sandbox/SandboxUIContext";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import Toolbar from "@/components/Sandbox/Toolbar";
import {
  sandboxAutocompleteExtensions,
  sandboxWhitespaceExtensions,
  sandboxFoldingExtensions,
  sandboxActiveLineGutterExtension,
  sandboxMulticursorExtensions,
  sandboxRectangularSelectionExtensions,
  sandboxSearchExtensions,
  sandboxLintExtensions,
  sandboxIndentGuideExtensions,
  sandboxSnippetExtensions,
  sandboxBracketColorExtensions,
  sandboxStickyScrollExtensions,
  sandboxBreadcrumbBarExtensions
} from "@/components/Sandbox/Editor/extensions";
import type { Extension } from "@codemirror/state";
import { useSandboxShortcuts } from "@/hooks/use-sandbox-shortcuts";
import SplitPane from "@/components/SplitPane";
import type { SandboxClientBodyProps, EditorCursorInfo } from "@/interfaces/sandbox";
import type { SandboxClientProps } from "@/types/sandbox";
import {
  SandboxWrapper,
  SandboxHeader,
  SandboxHeaderMeta,
  SandboxTitle,
  SandboxDescription,
  SandboxColumn,
  StackedLayout
} from "@/components/Sandbox/Sandbox.styles";

// Below this viewport width the split switches to stacked (vertical) layout: editor on top, output/console on bottom.
const MOBILE_BREAKPOINT = 768;

// Must match MetaBar's own height — carved out of the editor's pixel height in horizontal mode so both fill the pane exactly.
const META_BAR_HEIGHT = 28;

// Stable module-level reference for extensions with no toolbar toggle (breadcrumbs/sticky scroll are opt-in, added conditionally below instead) — identity must stay stable across renders.
const SANDBOX_CODE_EDITOR_BASE_EXTENSIONS: Extension[] = [
  ...sandboxAutocompleteExtensions,
  ...sandboxFoldingExtensions,
  ...sandboxLintExtensions,
  sandboxActiveLineGutterExtension,
  ...sandboxMulticursorExtensions,
  ...sandboxRectangularSelectionExtensions,
  ...sandboxSearchExtensions,
  ...sandboxSnippetExtensions,
  ...sandboxBracketColorExtensions,
  ...sandboxIndentGuideExtensions,
  ...sandboxWhitespaceExtensions
];

// Wires up the sandbox's non-CodeMirror keyboard shortcuts — must live inside SandpackProvider since useSandboxShortcuts needs Sandpack's own hooks.
function SandboxKeyboardShortcuts({
  closableTabs,
  children
}: {
  closableTabs: boolean;
  children: ReactNode;
}): JSX.Element {
  const handleKeyDown = useSandboxShortcuts(closableTabs);

  return (
    <>
      <div onKeyDown={handleKeyDown} style={{ display: "contents" }}>
        {children}
      </div>
    </>
  );
}

// Split out from SandboxClient so it can read showFileExplorer/showLineNumbers from SandboxUIContext (can't consume a context its own body provides).
function SandboxClientBody({
  meta,
  height,
  editorWidthPercentage,
  showFormatButton,
  showResetButton,
  showOpenInSandboxButton,
  showFileExplorerButton,
  showBreadcrumbs,
  showStickyScroll
}: SandboxClientBodyProps): JSX.Element {
  const { showFileExplorer, showLineNumbers, layoutOverride } = useSandboxUIContext();
  const [isVertical, setIsVertical] = useState(false);
  const [cursorInfo, setCursorInfo] = useState<EditorCursorInfo | null>(null);

  // showBreadcrumbs/showStickyScroll are static per-embed props — only reason this is a useMemo rather than a module-level constant.
  const editorExtensions = useMemo(
    () => [
      ...SANDBOX_CODE_EDITOR_BASE_EXTENSIONS,
      ...(showBreadcrumbs ? sandboxBreadcrumbBarExtensions : []),
      ...(showStickyScroll ? sandboxStickyScrollExtensions : [])
    ],
    [showBreadcrumbs, showStickyScroll]
  );

  // Stable identity so SplitPane's onDirectionChange effect doesn't re-fire on every render.
  const handleDirectionChange = useCallback(
    (direction: "horizontal" | "vertical") =>
      setIsVertical(direction === "vertical"),
    []
  );

  // Stacked panes need more total height budget than side-by-side ones. A concrete pixel number (not '100%') avoids a CodeMirror mount-time race at certain zoom levels; vertical mode splits via flex '100%' instead since it was never subject to that race.
  const effectiveHeight = isVertical ? height * 1.5 : height;
  const childHeight = isVertical ? "100%" : effectiveHeight;

  // Editor shares its column with EditorMetaBar now — horizontal mode carves out the bar's height from the concrete pixel value above; vertical mode just flexes alongside it.
  const editorSurfaceStyle = isVertical
    ? { flex: 1, minBlockSize: 0 }
    : { blockSize: effectiveHeight - META_BAR_HEIGHT };

  // Fixed-height row when stacked vs. fixed-width column when side-by-side — only rendered while showFileExplorer is on.
  const fileExplorer = showFileExplorer && (
    <>
      <SandpackFileExplorer
        style={
          isVertical
            ? { inlineSize: "100%", blockSize: 200, overflow: "auto" }
            : {
                blockSize: effectiveHeight,
                inlineSize: 200,
                flexShrink: 0,
                flexGrow: 0
              }
        }
      />
    </>
  );

  const splitPane = (
    <>
      <SplitPane
        splitRatio={editorWidthPercentage / 100}
        direction={layoutOverride ?? "horizontal"}
        // Disabled while manually overridden — otherwise the viewport-width breakpoint would keep fighting the forced direction.
        mobileBreakpoint={layoutOverride ? undefined : MOBILE_BREAKPOINT}
        onDirectionChange={handleDirectionChange}
      >
        <SandboxColumn>
          <SandboxCodeEditor
            // Closing a tab is a dead end without the file explorer to reopen it from.
            closableTabs={showFileExplorerButton}
            showLineNumbers={showLineNumbers}
            extensions={editorExtensions}
            style={editorSurfaceStyle}
            onCursorChange={setCursorInfo}
          />
          <EditorMetaBar cursorInfo={cursorInfo} />
        </SandboxColumn>
        <PreviewPanel height={childHeight} />
      </SplitPane>
    </>
  );

  return (
    <>
      <SandboxKeyboardShortcuts closableTabs={showFileExplorerButton}>
        <SandboxHeader>
          <SandboxHeaderMeta>
            <SandboxTitle>{meta.title}</SandboxTitle>
            <SandboxDescription>{meta.description}</SandboxDescription>
          </SandboxHeaderMeta>

          <Toolbar
            showFileExplorerButton={showFileExplorerButton}
            showFormatButton={showFormatButton}
            showResetButton={showResetButton}
            showOpenInSandboxButton={showOpenInSandboxButton}
          />
        </SandboxHeader>

        <SandpackLayout style={{ blockSize: effectiveHeight }}>
          {/*
            Grid (not SandpackLayout's flex-wrap) so the explorer gets a content-sized row and the
            split pane fills the rest via 1fr.
          */}
          <StackedLayout data-stacked={isVertical}>
            {fileExplorer}
            {splitPane}
          </StackedLayout>
        </SandpackLayout>
      </SandboxKeyboardShortcuts>
    </>
  );
}

/*
  Everything about a sandbox that only makes sense in the browser — Sandpack, toolbar state,
  and the responsive split-pane layout.
*/
export default function SandboxClient({
  meta,
  files,
  height = 600,
  editorWidthPercentage = 60,
  defaultShowLineNumbers = true,
  defaultShowFileExplorer = false,
  showFormatButton = true,
  showResetButton = true,
  showOpenInSandboxButton = true,
  showFileExplorerButton = false,
  showBreadcrumbs = false,
  showStickyScroll = false
}: SandboxClientProps): JSX.Element {
  return (
    <>
      <SandboxWrapper>
        <SandpackProvider
          template={meta.template as "react-ts"}
          files={files}
          options={{ activeFile: meta.entry }}
        >
          <SandboxUIProvider
            defaultShowFileExplorer={defaultShowFileExplorer}
            defaultShowLineNumbers={defaultShowLineNumbers}
          >
            <PreviewClientProvider>
              <SandboxClientBody
                meta={meta}
                height={height}
                editorWidthPercentage={editorWidthPercentage}
                showFormatButton={showFormatButton}
                showResetButton={showResetButton}
                showOpenInSandboxButton={showOpenInSandboxButton}
                showFileExplorerButton={showFileExplorerButton}
                showBreadcrumbs={showBreadcrumbs}
                showStickyScroll={showStickyScroll}
              />
            </PreviewClientProvider>
          </SandboxUIProvider>
        </SandpackProvider>
      </SandboxWrapper>
    </>
  );
}

SandboxClient.displayName = "SandboxClient";
