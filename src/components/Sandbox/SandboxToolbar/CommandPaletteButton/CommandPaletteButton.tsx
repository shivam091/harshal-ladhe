"use client";

import type { JSX} from "react";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { useSpring, animated } from "@react-spring/web";
import { useActiveCode, useSandpack } from "@codesandbox/sandpack-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogHeading,
  DialogBody
} from "@/components/Dialog";
import { Icon } from "@/components/Icon";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import { usePreviewClientContext } from "@/hooks/use-preview-client-context";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatCode, isFormattable } from "@/lib/prettier-format";
import { downloadSandboxZip } from "@/lib/sandbox/zip";
import VisuallyHidden from "@/components/VisuallyHidden";
import ActionButton from "@/components/Sandbox/SandboxToolbar/ActionButton";
import type { CommandPaletteAction } from "@/components/Sandbox/SandboxToolbar/CommandPaletteButton/CommandPaletteButton.types";
import type { CommandPaletteButtonProps } from "@/components/Sandbox/SandboxToolbar/SandboxToolbar.types";
import { Input, List, Item, Label, Shortcut, Empty } from "@/components/Sandbox/SandboxToolbar/CommandPaletteButton/CommandPaletteButton.styles";

// Wraps the generic search icon so react-spring can animate its transform.
const AnimatedIcon = animated(Icon);

// Transform origin for the search icon's boop tilt, centered on the lens itself.
const ICON_TRANSFORM_ORIGIN = `${(10.5 / 24) * 100}% ${(10.5 / 24) * 100}%`;

/*
  Cmd/Ctrl+K command palette — fuzzy-searches (via fuse.js, already a site dependency) every
  sandbox-level action this toolbar otherwise spreads across several separate buttons, so any of
  them can be reached without hunting for the right icon. Open/closed state lives in
  SandboxUIContext (commandPaletteOpen/setCommandPaletteOpen) since useSandboxShortcuts' Ctrl/
  Cmd+K binding needs to reach it too.
*/
export default function CommandPaletteButton({ size = 14 }: CommandPaletteButtonProps): JSX.Element {
  const [query, setQuery] = useState("");

  const { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp } = useToggleIconStatus();
  const prefersReducedMotion = usePrefersReducedMotion();
  // Same boop tilt as the header's IconSearch (scale 1.1 + 8° rotate), minus its shimmer sweep.
  const iconStyle = useSpring({
    transform: status === "booped" ? "scale(1.1) rotate(8deg)" : "scale(1) rotate(0deg)",
    config: { tension: 300, friction: 10 },
    immediate: prefersReducedMotion
  });
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
  const { refresh, clearLogs, requestReset } = usePreviewClientContext();
  const {
    toggleFileExplorer,
    toggleLineNumbers,
    showIndentGuides,
    toggleIndentGuides,
    showStickyScroll,
    toggleStickyScroll,
    showBreadcrumbs,
    toggleBreadcrumbs,
    showFolding,
    toggleFolding,
    showDiffGutter,
    toggleDiffGutter,
    showWordWrap,
    toggleWordWrap,
    showMinimap,
    toggleMinimap,
    tabSize,
    toggleTabSize,
    indentStyle,
    toggleIndentStyle,
    showSplitDiffView,
    toggleSplitDiffView,
    hideWhitespaceDiff,
    toggleHideWhitespaceDiff,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    cycleLayoutOverride,
    activeTab,
    setActiveTab,
    wrapperEl,
    showFullscreen,
    toggleFullscreen,
    commandPaletteOpen,
    setCommandPaletteOpen,
    readOnly
  } = useSandboxUIContext();

  // Clears any leftover query text each time the palette re-opens.
  function handleOpenChange(next: boolean) {
    setCommandPaletteOpen(next);
    if (next) setQuery("");
  }

  function runAndClose(run: () => void) {
    run();
    setCommandPaletteOpen(false);
  }

  const actions = useMemo<CommandPaletteAction[]>(
    () => [
      {
        id: "format",
        label: "Format code with Prettier",
        keywords: ["prettier"],
        shortcut: ["Shift+Alt+F"],
        run: () => {
          if (!isFormattable(sandpack.activeFile)) return;
          formatCode(code, sandpack.activeFile)
            .then((formatted) => {
              updateCode(formatted.trimEnd());
              refresh();
            })
            .catch((error) => console.error(`Could not format "${sandpack.activeFile}" with Prettier:`, error));
        }
      },
      {
        id: "reset",
        label: "Reset all files to their original state",
        keywords: ["revert", "discard"],
        shortcut: ["Ctrl+Alt+R", "⌘+Alt+R"],
        run: () => {
          requestReset();
          sandpack.resetAllFiles();
        }
      },
      {
        id: "rerun",
        label: "Rerun the preview",
        keywords: ["refresh", "restart"],
        shortcut: ["Ctrl+Alt+P", "⌘+Alt+P"],
        run: refresh
      },
      {
        id: "clear-console",
        label: "Clear console",
        keywords: ["logs"],
        shortcut: ["Ctrl+Alt+K", "⌘+Alt+K"],
        run: clearLogs
      },
      {
        id: "toggle-tab",
        label: activeTab === "output" ? "Switch to Console tab" : "Switch to Output tab",
        shortcut: ["Ctrl+Alt+V", "⌘+Alt+V"],
        run: () => setActiveTab(activeTab === "output" ? "console" : "output")
      },
      {
        id: "toggle-explorer",
        label: "Toggle file explorer",
        keywords: ["files", "sidebar"],
        shortcut: ["Ctrl+Shift+E", "⌘+Shift+E"],
        run: toggleFileExplorer
      },
      {
        id: "toggle-line-numbers",
        label: "Toggle line numbers",
        keywords: ["gutter"],
        shortcut: ["Ctrl+Alt+N", "⌘+Alt+N"],
        run: toggleLineNumbers
      },
      {
        id: "toggle-indent-guides",
        label: showIndentGuides ? "Hide indent guides" : "Show indent guides",
        keywords: ["indentation", "vertical lines"],
        shortcut: ["Ctrl+Alt+I", "⌘+Alt+I"],
        run: toggleIndentGuides
      },
      {
        id: "toggle-sticky-rows",
        label: showStickyScroll ? "Hide sticky rows" : "Show sticky rows",
        keywords: ["sticky scroll", "pin", "pinned", "header"],
        shortcut: ["Ctrl+Alt+H", "⌘+Alt+H"],
        run: toggleStickyScroll
      },
      {
        id: "toggle-breadcrumbs",
        label: showBreadcrumbs ? "Hide breadcrumbs" : "Show breadcrumbs",
        keywords: ["symbol path", "outline"],
        shortcut: ["Ctrl+Alt+B", "⌘+Alt+B"],
        run: toggleBreadcrumbs
      },
      {
        id: "toggle-folding",
        label: showFolding ? "Disable code folding" : "Enable code folding",
        keywords: ["fold gutter", "collapse"],
        shortcut: ["Ctrl+Alt+F", "⌘+Alt+F"],
        run: toggleFolding
      },
      {
        id: "toggle-diff-gutter",
        label: showDiffGutter ? "Hide diff markers" : "Show diff markers",
        keywords: ["diff", "gutter", "changed lines"],
        shortcut: ["Ctrl+Alt+U", "⌘+Alt+U"],
        run: toggleDiffGutter
      },
      {
        id: "toggle-word-wrap",
        label: showWordWrap ? "Disable word wrap" : "Enable word wrap",
        keywords: ["wrap lines", "line wrap"],
        shortcut: ["Ctrl+Alt+L", "⌘+Alt+L"],
        run: toggleWordWrap
      },
      {
        id: "toggle-minimap",
        label: showMinimap ? "Hide minimap" : "Show minimap",
        keywords: ["overview", "code map", "scrollbar preview"],
        shortcut: ["Ctrl+Alt+A", "⌘+Alt+A"],
        run: toggleMinimap
      },
      {
        id: "toggle-tab-size",
        label: tabSize === 4 ? "Switch to 2-space tabs" : "Switch to 4-space tabs",
        keywords: ["indent", "spaces", "indentation"],
        shortcut: ["Ctrl+Alt+Y", "⌘+Alt+Y"],
        run: toggleTabSize
      },
      {
        id: "toggle-indent-style",
        label: indentStyle === "tabs" ? "Switch to soft tabs (spaces)" : "Switch to hard tabs",
        keywords: ["indent", "spaces", "tab character", "indentation"],
        shortcut: ["Ctrl+Alt+X", "⌘+Alt+X"],
        run: toggleIndentStyle
      },
      {
        id: "toggle-split-diff-view",
        label: showSplitDiffView ? "Switch Diff tab to unified view" : "Switch Diff tab to split view",
        keywords: ["diff", "side by side", "unified"],
        shortcut: ["Ctrl+Alt+J", "⌘+Alt+J"],
        run: toggleSplitDiffView
      },
      {
        id: "toggle-hide-whitespace-diff",
        label: hideWhitespaceDiff ? "Show whitespace changes in diff" : "Hide whitespace changes in diff",
        keywords: ["diff", "whitespace", "ignore whitespace"],
        shortcut: ["Ctrl+Alt+Q", "⌘+Alt+Q"],
        run: toggleHideWhitespaceDiff
      },
      {
        id: "increase-font-size",
        label: "Increase editor font size",
        keywords: ["zoom in", "bigger", "text size"],
        shortcut: ["Ctrl+Alt++", "⌘+Alt++"],
        run: increaseFontSize
      },
      {
        id: "decrease-font-size",
        label: "Decrease editor font size",
        keywords: ["zoom out", "smaller", "text size"],
        shortcut: ["Ctrl+Alt+-", "⌘+Alt+-"],
        run: decreaseFontSize
      },
      {
        id: "reset-font-size",
        label: "Reset editor font size",
        keywords: ["default", "text size"],
        shortcut: ["Ctrl+Alt+0", "⌘+Alt+0"],
        run: resetFontSize
      },
      {
        id: "cycle-layout",
        label: "Cycle split layout",
        keywords: ["stacked", "side by side"],
        shortcut: ["Ctrl+Alt+S", "⌘+Alt+S"],
        run: cycleLayoutOverride
      },
      {
        id: "download-zip",
        label: "Download sandbox as .zip",
        keywords: ["export", "save"],
        shortcut: ["Ctrl+Alt+Z", "⌘+Alt+Z"],
        run: () => {
          downloadSandboxZip(sandpack.files).catch((error) =>
            console.error("Could not build the sandbox .zip:", error)
          );
        }
      },
      {
        id: "open-codesandbox",
        label: "Open in CodeSandbox",
        shortcut: ["Ctrl+Alt+O", "⌘+Alt+O"],
        run: () => {
          document
            .querySelector<HTMLButtonElement>("[data-sandbox-action='open-in-codesandbox']")
            ?.click();
        }
      },
      {
        id: "toggle-fullscreen",
        label: showFullscreen ? "Exit fullscreen" : "Enter fullscreen",
        shortcut: ["Ctrl+Alt+M", "⌘+Alt+M"],
        run: toggleFullscreen
      }
    ],
    [
      code,
      updateCode,
      sandpack,
      refresh,
      requestReset,
      clearLogs,
      activeTab,
      setActiveTab,
      toggleFileExplorer,
      toggleLineNumbers,
      showIndentGuides,
      toggleIndentGuides,
      showStickyScroll,
      toggleStickyScroll,
      showBreadcrumbs,
      toggleBreadcrumbs,
      showFolding,
      toggleFolding,
      showDiffGutter,
      toggleDiffGutter,
      showWordWrap,
      toggleWordWrap,
      showMinimap,
      toggleMinimap,
      tabSize,
      toggleTabSize,
      indentStyle,
      toggleIndentStyle,
      showSplitDiffView,
      toggleSplitDiffView,
      hideWhitespaceDiff,
      toggleHideWhitespaceDiff,
      increaseFontSize,
      decreaseFontSize,
      resetFontSize,
      cycleLayoutOverride,
      showFullscreen,
      toggleFullscreen
    ]
  );

  /*
    "format"/"reset" are the only actions that mutate code — dropped entirely while read-only, same set
    FormatButton/ResetButton/useSandboxShortcuts disable.
  */
  const visibleActions = useMemo(
    () => (readOnly ? actions.filter((action) => action.id !== "format" && action.id !== "reset") : actions),
    [actions, readOnly]
  );

  const fuse = useMemo(() => new Fuse(visibleActions, { keys: ["label", "keywords"], threshold: 0.4 }), [visibleActions]);
  const results = query.trim() ? fuse.search(query).map((result) => result.item) : visibleActions;

  return (
    <>
      <Dialog open={commandPaletteOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger>
          <ActionButton
            type="button"
            aria-label="Open command palette"
            title="Open command palette (Ctrl/⌘+K)"
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <AnimatedIcon
              name="search"
              size={size}
              style={{
                overflow: "visible",
                opacity: status !== "idle" ? 1 : 0.7,
                transformOrigin: ICON_TRANSFORM_ORIGIN,
                ...iconStyle
              }}
            />
            <VisuallyHidden>Open command palette</VisuallyHidden>
          </ActionButton>
        </DialogTrigger>

        <DialogContent container={showFullscreen ? wrapperEl : undefined}>
          <DialogHeader>
            <DialogTitle>
              <DialogHeading>Command Palette</DialogHeading>
            </DialogTitle>
            <DialogClose>
              <ActionButton type="button" aria-label="Close">
                <Icon name="close" size={16} />
              </ActionButton>
            </DialogClose>
          </DialogHeader>

          <DialogDescription>
            <VisuallyHidden>Search and run a sandbox action.</VisuallyHidden>
          </DialogDescription>

          <DialogBody>
            <Input
              type="text"
              autoFocus
              placeholder="Type a command…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {results.length === 0 ? (
              <Empty>No matching commands.</Empty>
            ) : (
              <List>
                {results.map((action) => (
                  <Item key={action.id}>
                    <button type="button" onClick={() => runAndClose(action.run)}>
                      <Label>{action.label}</Label>
                      {action.shortcut && (
                        <Shortcut aria-hidden>
                          {action.shortcut.map((combo, index) => (
                            <span key={combo}>
                              {index > 0 && " / "}
                              <kbd>{combo}</kbd>
                            </span>
                          ))}
                        </Shortcut>
                      )}
                    </button>
                  </Item>
                ))}
              </List>
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
}

CommandPaletteButton.displayName = "CommandPaletteButton";
