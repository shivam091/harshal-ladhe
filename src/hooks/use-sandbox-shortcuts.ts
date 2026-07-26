import { useCallback } from "react";
import { useActiveCode, useSandpack } from "@codesandbox/sandpack-react";
import { formatCode, isFormattable } from "@/lib/prettier-format";
import { downloadSandboxZip } from "@/lib/sandbox/zip";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import { usePreviewClientContext } from "@/hooks/use-preview-client-context";
import { trackEvent } from "@/lib/analytics";

/*
  Only the shortcuts CodeMirror doesn't own. The handler goes on a wrapping element so it fires
  whichever element inside the sandbox has focus; must be called inside SandpackProvider.
*/
export function useSandboxShortcuts() {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
  const {
    toggleFileExplorer,
    toggleLineNumbers,
    toggleIndentGuides,
    toggleStickyScroll,
    toggleBreadcrumbs,
    toggleFolding,
    toggleDiffGutter,
    toggleWordWrap,
    toggleMinimap,
    toggleTabSize,
    toggleIndentStyle,
    toggleSplitDiffView,
    toggleHideWhitespaceDiff,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    activeTab,
    setActiveTab,
    cycleLayoutOverride,
    toggleFullscreen,
    toggleCommandPalette,
    readOnly,
    readOnlyFiles,
    slug
  } = useSandboxUIContext();
  const { requestReset, refresh, clearLogs } = usePreviewClientContext();

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const mod = event.metaKey || event.ctrlKey;
      const physicalKey = event.code;

      if (event.altKey && event.shiftKey && physicalKey === "KeyF") {
        event.preventDefault();
        event.stopPropagation();

        if (readOnly || readOnlyFiles.includes(sandpack.activeFile) || !isFormattable(sandpack.activeFile)) return;

        formatCode(code, sandpack.activeFile)
          .then((formatted) => {
            updateCode(formatted.trimEnd());
            refresh();
          })
          .catch((error) => {
            console.error(`Could not format "${sandpack.activeFile}" with Prettier:`, error);
          });
        return;
      }

      if (mod && event.altKey && physicalKey === "KeyR") {
        event.preventDefault();
        event.stopPropagation();

        if (readOnly) return;

        // requestReset() must run before resetAllFiles().
        requestReset();
        sandpack.resetAllFiles();
        trackEvent("sandbox_reset", { event_label: slug });
        return;
      }

      if (mod && event.shiftKey && physicalKey === "KeyE") {
        event.preventDefault();
        event.stopPropagation();
        toggleFileExplorer();
        return;
      }

      if (mod && event.altKey && physicalKey === "KeyN") {
        event.preventDefault();
        event.stopPropagation();
        toggleLineNumbers();
        return;
      }

      if (mod && event.altKey && physicalKey === "KeyI") {
        event.preventDefault();
        event.stopPropagation();
        toggleIndentGuides();
        return;
      }

      if (mod && event.altKey && physicalKey === "KeyH") {
        event.preventDefault();
        event.stopPropagation();
        toggleStickyScroll();
        return;
      }

      if (mod && event.altKey && physicalKey === "KeyB") {
        event.preventDefault();
        event.stopPropagation();
        toggleBreadcrumbs();
        return;
      }

      if (mod && event.altKey && physicalKey === "KeyF") {
        event.preventDefault();
        event.stopPropagation();
        toggleFolding();
        return;
      }

      if (mod && event.altKey && physicalKey === "KeyU") {
        event.preventDefault();
        event.stopPropagation();
        if (readOnly) return;
        toggleDiffGutter();
        return;
      }

      if (mod && event.altKey && physicalKey === "KeyL") {
        event.preventDefault();
        event.stopPropagation();
        toggleWordWrap();
        return;
      }

      if (mod && event.altKey && physicalKey === "KeyA") {
        event.preventDefault();
        event.stopPropagation();
        toggleMinimap();
        return;
      }

      if (mod && event.altKey && physicalKey === "KeyJ") {
        event.preventDefault();
        event.stopPropagation();
        if (readOnly) return;
        toggleSplitDiffView();
        return;
      }

      if (mod && event.altKey && physicalKey === "KeyY") {
        event.preventDefault();
        event.stopPropagation();
        toggleTabSize();
        return;
      }

      if (mod && event.altKey && physicalKey === "KeyX") {
        event.preventDefault();
        event.stopPropagation();
        toggleIndentStyle();
        return;
      }

      if (mod && event.altKey && physicalKey === "KeyQ") {
        event.preventDefault();
        event.stopPropagation();
        if (readOnly) return;
        toggleHideWhitespaceDiff();
        return;
      }

      if (mod && event.altKey && physicalKey === "Equal") {
        event.preventDefault();
        event.stopPropagation();
        increaseFontSize();
        return;
      }

      if (mod && event.altKey && physicalKey === "Minus") {
        event.preventDefault();
        event.stopPropagation();
        decreaseFontSize();
        return;
      }

      if (mod && event.altKey && physicalKey === "Digit0") {
        event.preventDefault();
        event.stopPropagation();
        resetFontSize();
        return;
      }

      if (mod && event.altKey && physicalKey === "KeyK") {
        event.preventDefault();
        event.stopPropagation();
        clearLogs();
        return;
      }

      if (mod && event.altKey && physicalKey === "KeyP") {
        event.preventDefault();
        event.stopPropagation();
        refresh();
        trackEvent("sandbox_run", { event_label: slug });
        return;
      }

      if (mod && event.altKey && physicalKey === "KeyV") {
        event.preventDefault();
        event.stopPropagation();
        setActiveTab(activeTab === "output" ? "console" : "output");
        return;
      }

      if (mod && event.altKey && physicalKey === "KeyS") {
        event.preventDefault();
        event.stopPropagation();
        cycleLayoutOverride();
        return;
      }

      if (mod && event.altKey && physicalKey === "KeyC") {
        event.preventDefault();
        event.stopPropagation();
        navigator.clipboard?.writeText(code).catch((error) => {
          console.error(`Could not copy "${sandpack.activeFile}" to the clipboard:`, error);
        });
        return;
      }

      if (mod && event.altKey && physicalKey === "KeyW") {
        event.preventDefault();
        event.stopPropagation();
        // closeFile already no-ops when it's the last visible file, same as the tab UI's own close button.
        sandpack.closeFile(sandpack.activeFile);
        return;
      }

      // Cycles to the next/previous tab.
      if (mod && event.altKey && (physicalKey === "Period" || physicalKey === "Comma")) {
        event.preventDefault();
        event.stopPropagation();

        const files = sandpack.visibleFiles;
        if (files.length < 2) return;

        const currentIndex = files.indexOf(sandpack.activeFile);
        const delta = physicalKey === "Period" ? 1 : -1;
        const nextIndex = (currentIndex + delta + files.length) % files.length;
        sandpack.setActiveFile(files[nextIndex]);
        return;
      }

      const digitMatch = /^Digit([1-9])$/.exec(physicalKey);
      if (mod && event.altKey && digitMatch) {
        event.preventDefault();
        event.stopPropagation();

        const files = sandpack.visibleFiles;
        const index = Number(digitMatch[1]) - 1;
        if (index >= files.length) return;

        sandpack.setActiveFile(files[index]);
        return;
      }

      // Opens the sandbox in CodeSandbox, via the toolbar's own hidden button (no hook is exposed for this action).
      if (mod && event.altKey && physicalKey === "KeyO") {
        event.preventDefault();
        event.stopPropagation();
        const container = event.currentTarget as HTMLElement;
        container
          .querySelector<HTMLButtonElement>("[data-sandbox-action='open-in-codesandbox']")
          ?.click();
        return;
      }

      if (mod && event.altKey && physicalKey === "KeyM") {
        event.preventDefault();
        event.stopPropagation();
        toggleFullscreen();
        return;
      }

      if (mod && event.altKey && physicalKey === "KeyZ") {
        event.preventDefault();
        event.stopPropagation();
        downloadSandboxZip(sandpack.files)
          .then(() => trackEvent("sandbox_download", { event_label: slug }))
          .catch((error) => {
            console.error("Could not build the sandbox .zip:", error);
          });
        return;
      }

      if (mod && !event.altKey && !event.shiftKey && physicalKey === "KeyK") {
        event.preventDefault();
        event.stopPropagation();
        toggleCommandPalette();
        return;
      }
    },

    [
      code,
      updateCode,
      sandpack,
      toggleFileExplorer,
      toggleLineNumbers,
      toggleIndentGuides,
      toggleStickyScroll,
      toggleBreadcrumbs,
      toggleFolding,
      toggleDiffGutter,
      toggleWordWrap,
      toggleMinimap,
      toggleTabSize,
      toggleIndentStyle,
      toggleSplitDiffView,
      toggleHideWhitespaceDiff,
      increaseFontSize,
      decreaseFontSize,
      resetFontSize,
      activeTab,
      setActiveTab,
      cycleLayoutOverride,
      requestReset,
      refresh,
      clearLogs,
      toggleFullscreen,
      toggleCommandPalette,
      readOnly,
      readOnlyFiles,
      slug
    ]
  );

  return handleKeyDown;
}
