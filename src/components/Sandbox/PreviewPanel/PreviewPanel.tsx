"use client";

import { useState, JSX } from "react";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import { usePreviewClientContext } from "@/hooks/use-preview-client-context";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import IconRefresh from "@/icons/IconRefresh";
import IconCircleSlash from "@/icons/IconCircleSlash";
import { toolbarIconButtonCx } from "@/components/Sandbox/Sandbox.styles";
import Console from "@/components/Sandbox/PreviewPanel/Console";
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
  Tabs,
  Wrapper,
  PreviewIframe
} from "@/components/Sandbox/PreviewPanel/PreviewPanel.styles";

/*
  Output/console tabbed pane — owns the preview iframe, its error/loading overlays, the console
  log, and the rerun/clear-console tab actions.
*/
export default function PreviewPanel({ height }: PreviewPanelProps): JSX.Element {
  const { activeTab, setActiveTab } = useSandboxUIContext();
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
  const [rotation, setRotation] = useState(0);

  function handleRerun() {
    setRotation((current) => current + 180);
    refresh();
  }

  function handleClearConsole() {
    setRotation((current) => current + 180);
    clearLogs();
  }

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
            </TabButton>
          </Tabs>
          {activeTab === "output" ? (
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
          ) : (
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
        </TabBar>

        <Content>
          <Pane data-visible={activeTab === "output"}>
            {/*
              Plain iframe, not Sandpack's <SandpackPreview> — bundler client is created/managed by
              PreviewClientProvider so showErrorScreen: false can be passed through.
            */}
            <PreviewIframe ref={iframeRef} title="Sandpack Preview" />
            {/* Error takes priority — both could theoretically be true in a rare race, only one should render. */}
            {error ? (
              <PreviewErrorOverlay error={error} onRestart={refresh} />
            ) : (
              <PreviewLoadingOverlay isLoading={isLoading} message={loadingMessage} />
            )}
          </Pane>
          <Pane data-visible={activeTab === "console"}>
            <Console logs={logs} />
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
