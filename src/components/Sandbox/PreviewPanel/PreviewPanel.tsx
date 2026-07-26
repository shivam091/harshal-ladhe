"use client";

import { useMemo, useState, JSX } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import { usePreviewClientContext } from "@/hooks/use-preview-client-context";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import IconRefresh from "@/icons/IconRefresh";
import IconCircleSlash from "@/icons/IconCircleSlash";
import { Icon } from "@/components/Icon";
import { toolbarIconButtonCx } from "@/components/Sandbox/Sandbox.styles";
import { ACCENT_COLOR } from "@/components/Sandbox/SandboxToolbar/constants";
import { diffStats } from "@/components/Sandbox/Editor/extensions/diff-engine";
import Console from "@/components/Sandbox/PreviewPanel/Console";
import DiffView from "@/components/Sandbox/PreviewPanel/DiffView";
import PreviewErrorOverlay from "@/components/Sandbox/PreviewPanel/PreviewErrorOverlay";
import PreviewLoadingOverlay from "@/components/Sandbox/PreviewPanel/PreviewLoadingOverlay";
import MetaBar from "@/components/Sandbox/MetaBar";
import { formatDuration } from "@/utils/time";
import type { PreviewPanelProps } from "@/interfaces/sandbox";
import { Metric } from "@/components/Sandbox/MetaBar/MetaBar.styles";
import {
  Pane,
  TabBar,
  Content,
  TabButton,
  TabStat,
  Tabs,
  TabActions,
  Wrapper,
  PreviewIframe,
  ViewportFrame,
  ErrorBadge
} from "@/components/Sandbox/PreviewPanel/PreviewPanel.styles";

/*
  Output/console/diff tabbed pane — owns the preview iframe, its error/loading overlays, the
  console log, the full-file diff readout, and each tab's own action icons (rerun, clear console,
  and the Diff tab's split-view/hide-whitespace toggles).
*/
export default function PreviewPanel({ height, originalFiles }: PreviewPanelProps): JSX.Element {
  const {
    activeTab,
    setActiveTab,
    showSplitDiffView,
    toggleSplitDiffView,
    hideWhitespaceDiff,
    toggleHideWhitespaceDiff
  } = useSandboxUIContext();
  const { sandpack } = useSandpack();
  const {
    iframeRef,
    error,
    logs,
    clearLogs,
    refresh,
    isLoading,
    loadingMessage,
    initDurationMs,
    lastUpdateDurationMs
  } = usePreviewClientContext();
  const { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp } = useToggleIconStatus();
  /*
    Independent of the shared status above — both of these can be visible (and hovered) at once, unlike
    the output/console actions, which are never shown together.
  */
  const splitDiffViewStatus = useToggleIconStatus();
  const hideWhitespaceDiffStatus = useToggleIconStatus();
  const [rotation, setRotation] = useState(0);

  /*
    Same-file stat the Diff tab's own header shows in full — a lightweight preview so switching
    tabs isn't the only way to see whether the active file has any changes at all. Respects
    hideWhitespaceDiff so this badge never disagrees with what the Diff tab itself renders.
  */
  const activeFileStats = useMemo(() => {
    const entry = originalFiles?.[sandpack.activeFile];
    const originalCode = entry == null ? null : typeof entry === "string" ? entry : entry.code;
    if (originalCode == null) return null;

    const currentCode = sandpack.files[sandpack.activeFile]?.code ?? "";
    return diffStats(originalCode.split("\n"), currentCode.split("\n"), hideWhitespaceDiff);
  }, [originalFiles, sandpack.activeFile, sandpack.files, hideWhitespaceDiff]);

  function handleRerun() {
    setRotation((current) => current + 180);
    refresh();
  }

  function handleClearConsole() {
    setRotation((current) => current + 180);
    clearLogs();
  }

  const errorCount = logs.filter((entry) => entry.method === "error").length;

  return (
    <>
      <Wrapper style={{ height }}>
        <TabBar>
          <Tabs>
            <TabButton
              data-active={activeTab === "output"}
              onClick={() => setActiveTab("output")}
            >
              Output
            </TabButton>
            <TabButton
              data-active={activeTab === "console"}
              onClick={() => setActiveTab("console")}
            >
              Console
              {errorCount > 0 && (
                <ErrorBadge aria-label={`${errorCount} console error${errorCount === 1 ? "" : "s"}`}>
                  {errorCount}
                </ErrorBadge>
              )}
            </TabButton>
            <TabButton
              data-active={activeTab === "diff"}
              onClick={() => setActiveTab("diff")}
            >
              Diff
              {activeFileStats && (activeFileStats.added > 0 || activeFileStats.removed > 0) && (
                <TabStat>
                  {activeFileStats.added > 0 && <span className="added">+{activeFileStats.added}</span>}
                  {activeFileStats.removed > 0 && <span className="removed">−{activeFileStats.removed}</span>}
                </TabStat>
              )}
            </TabButton>
          </Tabs>
          <TabActions>
            {activeTab === "output" && (
              <button
                type="button"
                className={toolbarIconButtonCx}
                onClick={handleRerun}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                aria-label="Rerun the preview"
                title="Rerun the preview"
              >
                <IconRefresh status={status} rotation={rotation} size={13} />
              </button>
            )}
            {activeTab === "console" && (
              <button
                type="button"
                className={toolbarIconButtonCx}
                onClick={handleClearConsole}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                aria-label="Clear console"
                title="Clear console"
              >
                <IconCircleSlash status={status} rotation={rotation} size={13} />
              </button>
            )}
            {activeTab === "diff" && (
              <>
                <button
                  type="button"
                  className={toolbarIconButtonCx}
                  onClick={toggleSplitDiffView}
                  onPointerEnter={splitDiffViewStatus.onPointerEnter}
                  onPointerLeave={splitDiffViewStatus.onPointerLeave}
                  onPointerDown={splitDiffViewStatus.onPointerDown}
                  onPointerUp={splitDiffViewStatus.onPointerUp}
                  aria-pressed={showSplitDiffView}
                  aria-label={showSplitDiffView ? "Switch to unified view" : "Switch to split view"}
                  title={showSplitDiffView ? "Switch to unified view" : "Switch to split view"}
                >
                  <Icon
                    name="columns"
                    size={13}
                    style={{
                      opacity: showSplitDiffView || splitDiffViewStatus.status !== "idle" ? 1 : 0.7,
                      color: showSplitDiffView ? ACCENT_COLOR : undefined
                    }}
                  />
                </button>
                <button
                  type="button"
                  className={toolbarIconButtonCx}
                  onClick={toggleHideWhitespaceDiff}
                  onPointerEnter={hideWhitespaceDiffStatus.onPointerEnter}
                  onPointerLeave={hideWhitespaceDiffStatus.onPointerLeave}
                  onPointerDown={hideWhitespaceDiffStatus.onPointerDown}
                  onPointerUp={hideWhitespaceDiffStatus.onPointerUp}
                  aria-pressed={hideWhitespaceDiff}
                  aria-label={hideWhitespaceDiff ? "Show whitespace changes" : "Hide whitespace changes"}
                  title={hideWhitespaceDiff ? "Show whitespace changes" : "Hide whitespace changes"}
                >
                  <Icon
                    name="pilcrow"
                    size={13}
                    style={{
                      opacity: hideWhitespaceDiff || hideWhitespaceDiffStatus.status !== "idle" ? 1 : 0.7,
                      color: hideWhitespaceDiff ? ACCENT_COLOR : undefined
                    }}
                  />
                </button>
              </>
            )}
          </TabActions>
        </TabBar>

        <Content>
          <Pane data-visible={activeTab === "output"}>
            <ViewportFrame>
              {/* The preview iframe that PreviewClientProvider's bundler client attaches to. */}
              <PreviewIframe ref={iframeRef} title="Sandpack Preview" />
              {/* Error takes priority when both are present. */}
              {error ? (
                <PreviewErrorOverlay error={error} onRestart={refresh} />
              ) : (
                <PreviewLoadingOverlay isLoading={isLoading} message={loadingMessage} />
              )}
            </ViewportFrame>
          </Pane>
          <Pane data-visible={activeTab === "console"}>
            <Console logs={logs} />
          </Pane>
          <Pane data-visible={activeTab === "diff"}>
            <DiffView originalFiles={originalFiles} />
          </Pane>
        </Content>

        <MetaBar>
          {initDurationMs != null && (
            <Metric>Ready in {formatDuration(initDurationMs)}</Metric>
          )}
          {lastUpdateDurationMs != null && (
            <Metric>Updated in {formatDuration(lastUpdateDurationMs)}</Metric>
          )}
        </MetaBar>
      </Wrapper>
    </>
  );
}

PreviewPanel.displayName = "PreviewPanel";
