"use client";

import { createContext, useCallback, useEffect, useMemo, useRef, useState, JSX } from "react";
import type {
  SandboxUIContextValue,
  SandboxUIProviderProps
} from "@/interfaces/sandbox";
import type { PreviewPanelTab } from "@/types/sandbox";
import type { SplitPaneDirection } from "@/types/split-pane";
import type { SandboxTabSize, SandboxIndentStyle } from "@/components/Sandbox/Editor/extensions/tab-size";
import { DEFAULT_TAB_SIZE, DEFAULT_INDENT_STYLE } from "@/components/Sandbox/Editor/extensions/tab-size";

// Backing context for useSandboxUIContext — exported so that hook can read it without owning the Provider.
export const SandboxUIContext = createContext<SandboxUIContextValue | null>(
  null
);

// Font-size bounds/step for IncreaseFontSizeButton/DecreaseFontSizeButton.
const MIN_FONT_SIZE = 10;
const MAX_FONT_SIZE = 24;
const FONT_SIZE_STEP = 1;
const DEFAULT_FONT_SIZE = 14;

/*
  Bridges file-explorer/line-numbers/active-tab/layout-override state between SandboxClient and the
  toolbar/PreviewPanel's own toggles, which are siblings, not parent/child.
*/
export function SandboxUIProvider({
  defaultShowLineNumbers,
  defaultLayout = null,
  readOnly = false,
  children
}: SandboxUIProviderProps): JSX.Element {
  // Every sandbox starts with its file explorer closed — reopen it via FileExplorerButton in the toolbar.
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(defaultShowLineNumbers);
  // Toggles the editor's vertical indent-guide lines. On by default.
  const [showIndentGuides, setShowIndentGuides] = useState(true);
  // Toggles the editor's sticky rows and breadcrumb bar. Both off by default.
  const [showStickyScroll, setShowStickyScroll] = useState(false);
  const [showBreadcrumbs, setShowBreadcrumbs] = useState(false);
  // Toggles the editor's code-folding gutter/keymap. On by default.
  const [showFolding, setShowFolding] = useState(true);
  // Whether the diff gutter's markers/popup show at all. On by default.
  const [showDiffGutter, setShowDiffGutter] = useState(true);
  // Toggles the editor's line-wrapping behavior. Off by default.
  const [showWordWrap, setShowWordWrap] = useState(false);
  // Toggles the editor's overview-strip minimap. On by default.
  const [showMinimap, setShowMinimap] = useState(true);
  // Indent width in spaces. Defaults to 2.
  const [tabSize, setTabSize] = useState<SandboxTabSize>(DEFAULT_TAB_SIZE);
  // Soft (spaces) or hard (tab character) indentation. Defaults to soft.
  const [indentStyle, setIndentStyle] = useState<SandboxIndentStyle>(DEFAULT_INDENT_STYLE);
  // Whether the Diff tab renders old/new side by side instead of one unified readout. Off by default.
  const [showSplitDiffView, setShowSplitDiffView] = useState(false);
  // Whether the Diff tab's diffing ignores whitespace-only differences. Off by default.
  const [hideWhitespaceDiff, setHideWhitespaceDiff] = useState(false);
  // Editor + gutter font size in px — see MIN/MAX/DEFAULT_FONT_SIZE above for its bounds.
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [activeTab, setActiveTab] = useState<PreviewPanelTab>("output");
  const [layoutOverride, setLayoutOverride] = useState<SplitPaneDirection | null>(defaultLayout);
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Mirrors wrapperRef.current as reactive state — see the SandboxUIContextValue.wrapperEl doc comment for why this needs to exist alongside the ref.
  const [wrapperEl, setWrapperEl] = useState<HTMLDivElement | null>(null);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Passed to SandboxWrapper as its `ref` in place of a plain wrapperRef, so one attach point keeps both in sync.
  const setWrapperNode = useCallback((node: HTMLDivElement | null) => {
    wrapperRef.current = node;
    setWrapperEl(node);
  }, []);

  const toggleFileExplorer = useCallback(() => setShowFileExplorer((v) => !v), []);
  const toggleLineNumbers = useCallback(() => setShowLineNumbers((v) => !v), []);
  const toggleIndentGuides = useCallback(() => setShowIndentGuides((v) => !v), []);
  const toggleStickyScroll = useCallback(() => setShowStickyScroll((v) => !v), []);
  const toggleBreadcrumbs = useCallback(() => setShowBreadcrumbs((v) => !v), []);
  const toggleFolding = useCallback(() => setShowFolding((v) => !v), []);
  const toggleDiffGutter = useCallback(() => setShowDiffGutter((v) => !v), []);
  const toggleWordWrap = useCallback(() => setShowWordWrap((v) => !v), []);
  const toggleMinimap = useCallback(() => setShowMinimap((v) => !v), []);
  const toggleTabSize = useCallback(() => setTabSize((v) => (v === 2 ? 4 : 2)), []);
  const toggleIndentStyle = useCallback(() => setIndentStyle((v) => (v === "spaces" ? "tabs" : "spaces")), []);
  const toggleSplitDiffView = useCallback(() => setShowSplitDiffView((v) => !v), []);
  const toggleHideWhitespaceDiff = useCallback(() => setHideWhitespaceDiff((v) => !v), []);
  const toggleCommandPalette = useCallback(() => setCommandPaletteOpen((v) => !v), []);
  const increaseFontSize = useCallback(
    () => setFontSize((v) => Math.min(MAX_FONT_SIZE, v + FONT_SIZE_STEP)),
    []
  );
  const decreaseFontSize = useCallback(
    () => setFontSize((v) => Math.max(MIN_FONT_SIZE, v - FONT_SIZE_STEP)),
    []
  );
  const resetFontSize = useCallback(() => setFontSize(DEFAULT_FONT_SIZE), []);

  // Auto -> Stacked -> Side-by-side -> Auto, so a forced layout always has a way back to the responsive default.
  const cycleLayoutOverride = useCallback(
    () =>
      setLayoutOverride((current) => {
        if (current === null) return "vertical";
        if (current === "vertical") return "horizontal";
        return null;
      }),
    []
  );

  // Requests/exits fullscreen on wrapperRef's element — call from a user-triggered handler, not an effect.
  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      wrapperRef.current?.requestFullscreen().catch(() => {});
    }
  }, []);

  // Keeps showFullscreen in sync with exits that bypass toggleFullscreen entirely (Escape key, browser chrome).
  useEffect(() => {
    function handleFullscreenChange() {
      setShowFullscreen(document.fullscreenElement === wrapperRef.current);
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Memoized so a single toggle doesn't hand every consumer a new object reference and force them all to re-render.
  const value = useMemo<SandboxUIContextValue>(
    () => ({
      showFileExplorer,
      toggleFileExplorer,
      showLineNumbers,
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
      fontSize,
      increaseFontSize,
      decreaseFontSize,
      resetFontSize,
      canIncreaseFontSize: fontSize < MAX_FONT_SIZE,
      canDecreaseFontSize: fontSize > MIN_FONT_SIZE,
      canResetFontSize: fontSize !== DEFAULT_FONT_SIZE,
      activeTab,
      setActiveTab,
      layoutOverride,
      cycleLayoutOverride,
      wrapperRef,
      wrapperEl,
      wrapperRefCallback: setWrapperNode,
      showFullscreen,
      toggleFullscreen,
      commandPaletteOpen,
      setCommandPaletteOpen,
      toggleCommandPalette,
      readOnly
    }),
    [
      showFileExplorer,
      toggleFileExplorer,
      showLineNumbers,
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
      fontSize,
      increaseFontSize,
      decreaseFontSize,
      resetFontSize,
      activeTab,
      layoutOverride,
      cycleLayoutOverride,
      wrapperEl,
      setWrapperNode,
      showFullscreen,
      toggleFullscreen,
      commandPaletteOpen,
      toggleCommandPalette,
      readOnly
    ]
  );

  return (
    <SandboxUIContext.Provider value={value}>
      {children}
    </SandboxUIContext.Provider>
  );
}
