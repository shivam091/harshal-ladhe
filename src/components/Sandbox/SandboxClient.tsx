"use client";

import { useState, useCallback, JSX, type ReactNode } from "react";
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
import SandboxToolbar from "@/components/Sandbox/SandboxToolbar";
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
  sandboxHoverTooltipExtension
} from "@/components/Sandbox/Editor/extensions";
import type { Extension } from "@codemirror/state";
import { useSandboxShortcuts } from "@/hooks/use-sandbox-shortcuts";
import SplitPane from "@/components/SplitPane";
import type { SandboxClientBodyProps, EditorCursorInfo } from "@/interfaces/sandbox";
import type { SandboxClientProps } from "@/types/sandbox";
import { FileExplorerColumn, FileExplorerHeader } from "@/components/Sandbox/styles/file-explorer.styles";
import {
  SandboxWrapper,
  SandboxHeader,
  SandboxHeaderMeta,
  SandboxTitle,
  SandboxDescription,
  SandboxToolbarRow,
  SandboxColumn,
  StackedLayout
} from "@/components/Sandbox/Sandbox.styles";

// Below this viewport width the split switches to stacked (vertical) layout: editor on top, output/console on bottom.
const MOBILE_BREAKPOINT = 768;

// Must match MetaBar's own height — carved out of the editor's pixel height in horizontal mode so both fill the pane exactly.
const META_BAR_HEIGHT = 28;

// Stable module-level reference — identity must stay stable across renders.
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
  ...sandboxWhitespaceExtensions,
  sandboxHoverTooltipExtension
];

// Wires up the sandbox's non-CodeMirror keyboard shortcuts — must live inside SandpackProvider since useSandboxShortcuts needs Sandpack's own hooks.
function SandboxKeyboardShortcuts({
  children
}: {
  children: ReactNode;
}): JSX.Element {
  const handleKeyDown = useSandboxShortcuts();

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
  editorWidthPercentage
}: SandboxClientBodyProps): JSX.Element {
  const { showFileExplorer, showLineNumbers, layoutOverride } = useSandboxUIContext();
  const [isVertical, setIsVertical] = useState(false);
  const [cursorInfo, setCursorInfo] = useState<EditorCursorInfo | null>(null);

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
      <FileExplorerColumn
        style={
          isVertical
            ? { inlineSize: "100%", blockSize: 200 }
            : {
                blockSize: effectiveHeight,
                inlineSize: 200,
                flexShrink: 0,
                flexGrow: 0
              }
        }
      >
        <FileExplorerHeader>File Explorer</FileExplorerHeader>
        <SandpackFileExplorer style={{ flex: 1, minBlockSize: 0, overflow: "auto" }} />
      </FileExplorerColumn>
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
            showLineNumbers={showLineNumbers}
            extensions={SANDBOX_CODE_EDITOR_BASE_EXTENSIONS}
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
      <SandboxKeyboardShortcuts>
        <SandboxHeader>
          <SandboxHeaderMeta>
            <SandboxTitle>{meta.title}</SandboxTitle>
            <SandboxDescription>{meta.description}</SandboxDescription>
          </SandboxHeaderMeta>
        </SandboxHeader>

        <SandboxToolbarRow>
          <SandboxToolbar />
        </SandboxToolbarRow>

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
  defaultLayout = null
}: SandboxClientProps): JSX.Element {
  return (
    <>
      <SandboxWrapper>
        <SandpackProvider
          template={meta.template as "react-ts"}
          files={files}
          options={{ activeFile: meta.entry }}
        >
          <SandboxUIProvider defaultShowLineNumbers={defaultShowLineNumbers} defaultLayout={defaultLayout}>
            <PreviewClientProvider>
              <SandboxClientBody
                meta={meta}
                height={height}
                editorWidthPercentage={editorWidthPercentage}
              />
            </PreviewClientProvider>
          </SandboxUIProvider>
        </SandpackProvider>
      </SandboxWrapper>
    </>
  );
}

SandboxClient.displayName = "SandboxClient";
