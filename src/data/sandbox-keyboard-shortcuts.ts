/*
  One shortcut row — `keys` holds one chip-group per platform variant actually bound (a single
  entry when the combo is identical across platforms); `note` is optional trailing text for a
  secondary combo that isn't worth its own chip (e.g. "or Ctrl+Y").
*/
export interface SandboxKeyboardShortcut {
  description: string;
  keys: string[];
  note?: string;
}

/*
  A titled group of related shortcuts (e.g. "Search", "Code folding") shown together in the
  shortcuts reference modal.
*/
export interface SandboxKeyboardShortcutGroup {
  title: string;
  shortcuts: SandboxKeyboardShortcut[];
}

/*
  Curated to every binding a reader would actually reach for, not every CodeMirror default —
  redundant and legacy combos (like the Mac emacs-style keymap) are skipped.
*/
export const sandboxKeyboardShortcuts: SandboxKeyboardShortcutGroup[] = [
  {
    title: "Sandbox",
    shortcuts: [
      { description: "Format code with Prettier", keys: ["Shift+Alt+F"] },
      { description: "Reset all files to original", keys: ["Ctrl+Alt+R", "⌘+Alt+R"] },
      { description: "Toggle file explorer", keys: ["Ctrl+Shift+E", "⌘+Shift+E"] },
      { description: "Toggle line numbers", keys: ["Ctrl+Alt+N", "⌘+Alt+N"] },
      { description: "Toggle indent guides", keys: ["Ctrl+Alt+I", "⌘+Alt+I"] },
      { description: "Toggle sticky rows", keys: ["Ctrl+Alt+H", "⌘+Alt+H"] },
      { description: "Toggle breadcrumbs", keys: ["Ctrl+Alt+B", "⌘+Alt+B"] },
      { description: "Toggle code folding", keys: ["Ctrl+Alt+F", "⌘+Alt+F"] },
      { description: "Toggle diff markers", keys: ["Ctrl+Alt+U", "⌘+Alt+U"] },
      { description: "Toggle word wrap", keys: ["Ctrl+Alt+L", "⌘+Alt+L"] },
      { description: "Toggle minimap", keys: ["Ctrl+Alt+A", "⌘+Alt+A"] },
      { description: "Toggle tab size (2 / 4 spaces)", keys: ["Ctrl+Alt+Y", "⌘+Alt+Y"] },
      { description: "Toggle indent style (soft / hard tabs)", keys: ["Ctrl+Alt+X", "⌘+Alt+X"] },
      { description: "Toggle split diff view", keys: ["Ctrl+Alt+J", "⌘+Alt+J"] },
      { description: "Toggle hide whitespace in diff", keys: ["Ctrl+Alt+Q", "⌘+Alt+Q"] },
      { description: "Increase editor font size", keys: ["Ctrl+Alt++", "⌘+Alt++"] },
      { description: "Decrease editor font size", keys: ["Ctrl+Alt+-", "⌘+Alt+-"] },
      { description: "Reset editor font size", keys: ["Ctrl+Alt+0", "⌘+Alt+0"] },
      { description: "Clear console", keys: ["Ctrl+Alt+K", "⌘+Alt+K"] },
      { description: "Re-run preview", keys: ["Ctrl+Alt+P", "⌘+Alt+P"] },
      { description: "Next tab", keys: ["Ctrl+Alt+.", "⌘+Alt+."] },
      { description: "Previous tab", keys: ["Ctrl+Alt+,", "⌘+Alt+,"] },
      { description: "Jump to tab", keys: ["Ctrl+Alt+1-9", "⌘+Alt+1-9"] },
      { description: "Close active tab", keys: ["Ctrl+Alt+W", "⌘+Alt+W"], note: "only when tabs are closable" },
      { description: "Switch output / console tab", keys: ["Ctrl+Alt+V", "⌘+Alt+V"] },
      { description: "Cycle split layout", keys: ["Ctrl+Alt+S", "⌘+Alt+S"], note: "auto, stacked, side-by-side" },
      { description: "Copy active file", keys: ["Ctrl+Alt+C", "⌘+Alt+C"] },
      { description: "Download sandbox as .zip", keys: ["Ctrl+Alt+Z", "⌘+Alt+Z"] },
      { description: "Open in CodeSandbox", keys: ["Ctrl+Alt+O", "⌘+Alt+O"] },
      { description: "Open command palette", keys: ["Ctrl+K", "⌘+K"] },
      { description: "Toggle fullscreen", keys: ["Ctrl+Alt+M", "⌘+Alt+M"] }
    ]
  },
  {
    title: "Code folding",
    shortcuts: [
      { description: "Fold all", keys: ["Ctrl+Alt+["] },
      { description: "Unfold all", keys: ["Ctrl+Alt+]"] },
      { description: "Fold at cursor", keys: ["Ctrl+Shift+[", "⌘+Alt+["] },
      { description: "Unfold at cursor", keys: ["Ctrl+Shift+]", "⌘+Alt+]"] }
    ]
  },
  {
    title: "Search",
    shortcuts: [
      { description: "Find in file", keys: ["Ctrl+F", "⌘+F"] },
      { description: "Find next match", keys: ["F3", "Ctrl+G", "⌘+G"] },
      { description: "Find previous match", keys: ["Shift+F3", "Ctrl+Shift+G", "⌘+Shift+G"] },
      { description: "Go to line", keys: ["Ctrl+Alt+G", "⌘+Alt+G"] },
      { description: "Close search panel", keys: ["Esc"] }
    ]
  },
  {
    title: "Multi-cursor & selection",
    shortcuts: [
      {
        description: "Add cursor above / below",
        keys: ["Ctrl+Alt+↑/↓", "⌘+Alt+↑/↓", "Ctrl+Shift+↑/↓", "⌘+Shift+↑/↓"],
        note: "Ctrl+Alt+↑/↓ may be claimed by your OS (e.g. GNOME workspace switching)"
      },
      { description: "Add cursor at click", keys: ["Ctrl+Click", "⌘+Click"] },
      { description: "Column (box) selection", keys: ["Alt+Drag"] },
      { description: "Select next occurrence", keys: ["Ctrl+D", "⌘+D"] },
      { description: "Select all occurrences", keys: ["Ctrl+Shift+L", "⌘+Shift+L"] },
      { description: "Select all", keys: ["Ctrl+A", "⌘+A"] }
    ]
  },
  {
    title: "Editing",
    shortcuts: [
      { description: "Undo", keys: ["Ctrl+Z", "⌘+Z"] },
      { description: "Redo", keys: ["Ctrl+Shift+Z", "⌘+Shift+Z"], note: "or Ctrl+Y" },
      { description: "Toggle line comment", keys: ["Ctrl+/", "⌘+/"] },
      {
        description: "Toggle block comment",
        keys: ["Shift+Alt+A", "Ctrl+Shift+/", "⌘+Shift+/"],
        note: "syntax picked per file type — /* */, <!-- -->, etc.; the Ctrl/⌘+Shift+/ fallback helps if your browser or an extension has claimed Shift+Alt+A"
      },
      { description: "Delete line", keys: ["Ctrl+Shift+K", "⌘+Shift+K"] },
      { description: "Move line up / down", keys: ["Alt+↑/↓"] },
      { description: "Copy line up / down", keys: ["Shift+Alt+↑/↓"] },
      { description: "Indent / outdent selection", keys: ["Tab", "Shift+Tab"] }
    ]
  },
  {
    title: "Autocomplete",
    shortcuts: [
      {
        description: "Trigger suggestions",
        keys: ["Ctrl+Space", "Alt+`", "Alt+I"],
        note: "the last two are macOS-only fallbacks, since Ctrl+Space is often claimed by the OS's own input-source switcher there"
      },
      { description: "Accept suggestion", keys: ["Enter"] },
      { description: "Dismiss suggestions", keys: ["Esc"] }
    ]
  },
  {
    title: "Diagnostics",
    shortcuts: [
      { description: "Open problems panel", keys: ["Ctrl+Shift+M", "⌘+Shift+M"] },
      { description: "Jump to next problem", keys: ["F8"] }
    ]
  }
];
