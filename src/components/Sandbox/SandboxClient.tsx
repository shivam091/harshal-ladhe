"use client";

import type { JSX} from "react";
import { useState, useCallback, useRef, type ReactNode, type CSSProperties, type RefObject } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackFileExplorer,
  useSandpack
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
  sandboxAutoCloseTagsExtension,
  sandboxWhitespaceExtensions,
  sandboxFoldingExtensions,
  sandboxStickyScrollExtensions,
  sandboxBreadcrumbBarExtensions,
  sandboxActiveLineGutterExtension,
  sandboxMulticursorExtensions,
  sandboxBlockCommentExtensions,
  sandboxRectangularSelectionExtensions,
  sandboxSearchExtensions,
  sandboxLintExtensions,
  sandboxIndentGuideExtensions,
  sandboxSnippetExtensions,
  sandboxBracketColorExtensions,
  sandboxTagMatchExtensions,
  sandboxHoverTooltipExtension,
  sandboxDiffGutterExtensions,
  sandboxWordWrapExtensions,
  sandboxMinimapExtensions,
  sandboxTabSizeExtensions,
  sandboxReadOnlyExtensions
} from "@/components/Sandbox/Editor/extensions";
import type { Extension } from "@codemirror/state";
import { useSandboxShortcuts } from "@/hooks/use-sandbox-shortcuts";
import { useResizableHeight } from "@/hooks/use-resizable-height";
import VisuallyHidden from "@/components/VisuallyHidden";
import SplitPane from "@/components/SplitPane";
import type { SandboxClientBodyProps, EditorCursorInfo, SandboxClientProps } from "@/components/Sandbox/Sandbox.types";
import { FileExplorerColumn, FileExplorerHeader } from "@/components/Sandbox/styles/file-explorer.styles";
import Badge from "@/components/Badge/Badge";
import {
  SandboxWrapper,
  SandboxHeader,
  SandboxHeaderMeta,
  SandboxTitle,
  SandboxDescription,
  SandboxToolbarRow,
  SandboxColumn,
  StackedLayout,
  ReadOnlyBadgeWrapper,
  ResizeHandle
} from "@/components/Sandbox/Sandbox.styles";

// Below this viewport width the split switches to stacked (vertical) layout: editor on top, output/console on bottom.
const MOBILE_BREAKPOINT = 768;

// EditorMetaBar's height, used to size the editor column around it.
const META_BAR_HEIGHT = 28;

// Stable module-level reference — identity must stay stable across renders.
const SANDBOX_CODE_EDITOR_BASE_EXTENSIONS: Extension[] = [
  ...sandboxAutocompleteExtensions,
  sandboxAutoCloseTagsExtension,
  ...sandboxFoldingExtensions,
  ...sandboxStickyScrollExtensions,
  ...sandboxBreadcrumbBarExtensions,
  ...sandboxLintExtensions,
  sandboxActiveLineGutterExtension,
  ...sandboxMulticursorExtensions,
  ...sandboxBlockCommentExtensions,
  ...sandboxRectangularSelectionExtensions,
  ...sandboxSearchExtensions,
  ...sandboxSnippetExtensions,
  ...sandboxBracketColorExtensions,
  ...sandboxTagMatchExtensions,
  ...sandboxIndentGuideExtensions,
  ...sandboxWhitespaceExtensions,
  sandboxHoverTooltipExtension,
  ...sandboxDiffGutterExtensions,
  ...sandboxWordWrapExtensions,
  ...sandboxMinimapExtensions,
  ...sandboxTabSizeExtensions,
  ...sandboxReadOnlyExtensions
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

// Renders the sandbox's editor/file-explorer/preview layout, driven by SandboxUIContext's toggle state.
function SandboxClientBody({
  meta,
  files,
  height,
  editorWidthPercentage
}: SandboxClientBodyProps): JSX.Element {
  const {
    showFileExplorer,
    showLineNumbers,
    showIndentGuides,
    showStickyScroll,
    showBreadcrumbs,
    showFolding,
    showDiffGutter,
    showWordWrap,
    showMinimap,
    tabSize,
    indentStyle,
    fontSize,
    layoutOverride,
    showFullscreen,
    readOnly,
    readOnlyFiles
  } = useSandboxUIContext();
  const { sandpack } = useSandpack();
  const [isVertical, setIsVertical] = useState(false);
  const [cursorInfo, setCursorInfo] = useState<EditorCursorInfo | null>(null);
  // Per-file counterpart to the sandbox-wide `readOnly` flag.
  const activeFileReadOnly = readOnlyFiles.includes(sandpack.activeFile);

  // Stable identity so SplitPane's onDirectionChange effect doesn't re-fire on every render.
  const handleDirectionChange = useCallback(
    (direction: "horizontal" | "vertical") =>
      setIsVertical(direction === "vertical"),
    []
  );

  // Whether the layout sizes itself via flex (stacked/fullscreen) rather than a fixed pixel height.
  const useFlexSizing = isVertical || showFullscreen;
  // Total height budget for the split, scaled up when stacked.
  const effectiveHeight = isVertical ? height * 1.5 : height;
  // Height the side-by-side file explorer sizes itself to.
  const layoutHeight = showFullscreen ? "100%" : effectiveHeight;
  const childHeight = useFlexSizing ? "100%" : effectiveHeight;
  // SandpackLayout's own cross-axis size.
  const sandpackLayoutStyle = showFullscreen
    ? { flex: "1 1 auto", minBlockSize: 0 }
    : { blockSize: layoutHeight };

  // Editor's own size within its column, leaving room for EditorMetaBar underneath it.
  const editorSurfaceStyle = useFlexSizing
    ? { flex: 1, minBlockSize: 0 }
    : { blockSize: effectiveHeight - META_BAR_HEIGHT };

  /*
    Fixed-height row when stacked vs. fixed-width column when side-by-side — only rendered while
    showFileExplorer is on.
  */
  const fileExplorer = showFileExplorer && (
    <>
      <FileExplorerColumn
        style={
          isVertical
            ? { inlineSize: "100%", blockSize: 200 }
            : {
                blockSize: layoutHeight,
                inlineSize: 200,
                flexShrink: 0,
                flexGrow: 0
              }
        }
      >
        <FileExplorerHeader>File Explorer</FileExplorerHeader>
        {/*
          autoHiddenFiles defaults to false — without it, Sandpack's file tree ignores each file's
          own `hidden` flag and lists everything, including the imported-but-uneditable /shared/
          chrome that the tab bar already keeps out of sight.
        */}
        <SandpackFileExplorer autoHiddenFiles style={{ flex: 1, minBlockSize: 0, overflow: "auto" }} />
      </FileExplorerColumn>
    </>
  );

  const splitPane = (
    <>
      <SplitPane
        splitRatio={editorWidthPercentage / 100}
        direction={layoutOverride ?? "horizontal"}
        /*
          Disabled while manually overridden — otherwise the viewport-width breakpoint would keep
          fighting the forced direction.
          */
        mobileBreakpoint={layoutOverride ? undefined : MOBILE_BREAKPOINT}
        onDirectionChange={handleDirectionChange}
      >
        <SandboxColumn>
          <SandboxCodeEditor
            showLineNumbers={showLineNumbers}
            showIndentGuides={showIndentGuides}
            showStickyScroll={showStickyScroll}
            showBreadcrumbs={showBreadcrumbs}
            showFolding={showFolding}
            showDiffGutter={showDiffGutter}
            showWordWrap={showWordWrap}
            showMinimap={showMinimap}
            tabSize={tabSize}
            indentStyle={indentStyle}
            fontSize={fontSize}
            readOnly={readOnly}
            readOnlyFiles={readOnlyFiles}
            extensions={SANDBOX_CODE_EDITOR_BASE_EXTENSIONS}
            style={editorSurfaceStyle}
            onCursorChange={setCursorInfo}
            originalFiles={files}
          />
          {(readOnly || activeFileReadOnly) && (
            <ReadOnlyBadgeWrapper>
              <Badge>Read-only</Badge>
            </ReadOnlyBadgeWrapper>
          )}
          <EditorMetaBar cursorInfo={cursorInfo} />
        </SandboxColumn>
        <PreviewPanel height={childHeight} originalFiles={files} />
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

        <SandpackLayout style={sandpackLayoutStyle}>
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

// Owns the SandboxWrapper DOM node and wraps SandpackProvider so Sandpack's own theme div nests inside it.
function SandboxClientFrame({
  meta,
  files,
  height,
  editorWidthPercentage
}: SandboxClientBodyProps & { files: SandboxClientProps["files"] }): JSX.Element {
  const { wrapperRefCallback, showFullscreen, fontSize } = useSandboxUIContext();
  const resizeHandleRef = useRef<HTMLButtonElement>(null);
  const resizedHeight = useResizableHeight({
    defaultHeight: height,
    handleRef: resizeHandleRef as RefObject<HTMLElement | null>
  });

  return (
    <>
      <SandboxWrapper
        ref={wrapperRefCallback}
        data-fullscreen={showFullscreen}
        style={{ "--sandbox-editor-font-size": `${fontSize}px` } as CSSProperties}
      >
        <SandpackProvider
          template={meta.template as "react-ts"}
          files={files}
          options={{ activeFile: meta.entry }}
        >
          <PreviewClientProvider>
            <SandboxClientBody
              meta={meta}
              files={files}
              height={resizedHeight}
              editorWidthPercentage={editorWidthPercentage}
            />
          </PreviewClientProvider>
        </SandpackProvider>
        {/*
          Hidden in fullscreen: that mode already sizes the wrapper to fill the viewport via flex,
          so there's no fixed height left to drag.
        */}
        {!showFullscreen && (
          <ResizeHandle ref={resizeHandleRef}>
            <VisuallyHidden>Resize sandbox height. Use up/down arrows.</VisuallyHidden>
          </ResizeHandle>
        )}
      </SandboxWrapper>
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
  defaultLayout = null,
  readOnly = false
}: SandboxClientProps): JSX.Element {
  return (
    <>
      <SandboxUIProvider
        defaultShowLineNumbers={defaultShowLineNumbers}
        defaultLayout={defaultLayout}
        readOnly={readOnly}
        readOnlyFiles={meta.readOnlyFiles}
        slug={meta.slug}
      >
        <SandboxClientFrame
          meta={meta}
          files={files}
          height={height}
          editorWidthPercentage={editorWidthPercentage}
        />
      </SandboxUIProvider>
    </>
  );
}

SandboxClient.displayName = "SandboxClient";
