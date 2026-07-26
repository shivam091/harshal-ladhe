import { Compartment, EditorState, type Extension } from "@codemirror/state";
import { indentUnit } from "@codemirror/language";

// Only 2 and 4, the two widths code is commonly written in.
export const TAB_SIZES = [2, 4] as const;

// One of TAB_SIZES — the width Tab/auto-indent inserts and a literal tab character renders at.
export type SandboxTabSize = (typeof TAB_SIZES)[number];

/*
  2 spaces by default — matches CodeMirror's own indentUnit default, so a sandbox starts identically to
  today until a reader actually changes it.
*/
export const DEFAULT_TAB_SIZE: SandboxTabSize = 2;

// Soft or hard tabs — the only two indentation styles there are.
export const INDENT_STYLES = ["spaces", "tabs"] as const;

/*
  "spaces" (soft tabs) inserts tabSize spaces per indent level; "tabs" (hard tabs) inserts one literal tab
  character, still rendered at tabSize's width.
*/
export type SandboxIndentStyle = (typeof INDENT_STYLES)[number];

/*
  Soft tabs by default — matches CodeMirror's own indentUnit default (a run of spaces), so a sandbox starts
  identically to today until a reader actually changes it.
*/
export const DEFAULT_INDENT_STYLE: SandboxIndentStyle = "spaces";

/*
  Tab size and indent style — keeps indentUnit (what Tab/auto-indent inserts) and
  EditorState.tabSize (how a literal tab renders) moving together as one coherent setting.
*/
export const tabSizeCompartment = new Compartment();

// Rebuilt from the current values on every change, since both settings must move together.
export function sandboxTabSizeExtension(tabSize: SandboxTabSize, indentStyle: SandboxIndentStyle): Extension {
  return [
    indentUnit.of(indentStyle === "tabs" ? "\t" : " ".repeat(tabSize)),
    EditorState.tabSize.of(tabSize)
  ];
}

// Seeded with the defaults, so a sandbox indents normally before anyone changes the setting.
export const sandboxTabSizeExtensions: Extension[] = [
  tabSizeCompartment.of(sandboxTabSizeExtension(DEFAULT_TAB_SIZE, DEFAULT_INDENT_STYLE))
];
