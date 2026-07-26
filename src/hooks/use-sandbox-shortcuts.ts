import { useCallback } from "react";
import { useActiveCode, useSandpack } from "@codesandbox/sandpack-react";
import { formatCode, isFormattable } from "@/lib/prettier-format";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import { usePreviewClientContext } from "@/hooks/use-preview-client-context";

/*
  Every sandbox-level keyboard shortcut that isn't owned by CodeMirror itself — format, reset,
  toggle file explorer/line numbers/output-console tab/split layout, clear console, re-run
  preview, cycle/jump/close tabs, copy the active file, open in CodeSandbox. CodeMirror's own
  bindings (multicursor, folding, search, autocomplete, etc.) are wired directly into its
  extensions instead; this hook only covers what those don't.

  All combos use Ctrl/Cmd+Alt as their base (matching the folding shortcuts already bound
  elsewhere in this editor) except format, which follows VS Code's own Shift+Alt+F "Format
  Document" default instead. Two combos were deliberately avoided for tab-cycling since neither
  ever reaches the browser at all: Ctrl/Cmd+Tab (reserved by the browser chrome itself) and
  Ctrl+Alt+Arrow (GNOME's default workspace-switch shortcut on Linux, and a common Intel-graphics
  screen-rotate shortcut on Windows) — Ctrl/Cmd+Alt+./, is used for Next/Previous tab instead.

  Matched on event.code (the physical key), not event.key: holding Alt/Option remaps .key to a
  composed character on several layouts (e.g. macOS turns Option+R into "®", Windows AltGr
  layouts turn Ctrl+Alt+<letter> into an accented character) — .code stays "KeyR" regardless, so
  every combo below fires consistently across platforms and keyboard layouts.

  Must be called from inside SandpackProvider (reads/writes the active file and file list via
  Sandpack's own hooks) — attach the returned handler to onKeyDown on a wrapping element so it
  fires no matter which focusable element inside the sandbox (a tab, a toolbar button, the editor
  itself) currently has focus.
*/
export function useSandboxShortcuts(closableTabs: boolean) {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
  const {
    toggleFileExplorer,
    toggleLineNumbers,
    activeTab,
    setActiveTab,
    cycleLayoutOverride
  } = useSandboxUIContext();
  const { requestReset, refresh, clearLogs } = usePreviewClientContext();

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const mod = event.metaKey || event.ctrlKey;
      const physicalKey = event.code;

      if (event.altKey && event.shiftKey && physicalKey === "KeyF") {
        event.preventDefault();
        event.stopPropagation();

        if (!isFormattable(sandpack.activeFile)) return;

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
        // Order matters: requestReset() only arms the refresh flag, so it must run before resetAllFiles() actually restores the files that refresh will run against.
        requestReset();
        sandpack.resetAllFiles();
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

      /*
        Mirrors the dead-end guard on the tab UI itself (see SandboxCodeEditor's closableTabs) —
        without the file explorer open, closing a tab would leave no way to reopen it.
      */
      if (mod && event.altKey && physicalKey === "KeyW") {
        event.preventDefault();
        event.stopPropagation();
        if (!closableTabs) return;
        // closeFile already no-ops when it's the last visible file, same as the tab UI's own close button.
        sandpack.closeFile(sandpack.activeFile);
        return;
      }

      /*
        Period/comma, not ArrowRight/ArrowLeft — Ctrl+Alt+Arrow is claimed at the OS level on
        several platforms (GNOME's default workspace-switch shortcut on Linux, Intel graphics'
        screen-rotate shortcut on Windows), so it never reaches the browser at all.
      */
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

      /*
        Sandpack doesn't expose an "open in CodeSandbox" action as a hook — it's a hidden-form
        submit fully encapsulated inside its own button component — so this clicks that button's
        own DOM node (tagged via data-sandbox-action) rather than reimplementing the form submit.
      */
      if (mod && event.altKey && physicalKey === "KeyO") {
        event.preventDefault();
        event.stopPropagation();
        const container = event.currentTarget as HTMLElement;
        container
          .querySelector<HTMLButtonElement>("[data-sandbox-action='open-in-codesandbox']")
          ?.click();
        return;
      }
    },

    [
      code,
      updateCode,
      sandpack,
      toggleFileExplorer,
      toggleLineNumbers,
      activeTab,
      setActiveTab,
      cycleLayoutOverride,
      requestReset,
      refresh,
      clearLogs,
      closableTabs
    ]
  );

  return handleKeyDown;
}
