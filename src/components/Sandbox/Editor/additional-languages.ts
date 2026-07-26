import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { sass } from "@codemirror/lang-sass";
import { xml } from "@codemirror/lang-xml";
import { yaml } from "@codemirror/lang-yaml";
import { LanguageSupport, StreamLanguage } from "@codemirror/language";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import type { CustomLanguage } from "@codesandbox/sandpack-react";

/*
  Real grammars for extensions Sandpack has none of or gets wrong — otherwise .json/.md/.yaml fall
  back to JavaScript, .scss to plain CSS and .mts/.cts to non-TypeScript JS, all tripping false
  syntax errors on valid content.

  Keep in sync with Shiki's SUPPORTED_LANGS where a CodeMirror grammar exists; mdx, ssh-config,
  bat and .less still have no maintained grammar.
*/
export const sandboxAdditionalLanguages: CustomLanguage[] = [
  { name: "json", extensions: ["json"], language: json() },
  { name: "yaml", extensions: ["yaml", "yml"], language: yaml() },
  { name: "markdown", extensions: ["md", "markdown"], language: markdown() },
  { name: "html", extensions: ["html", "htm"], language: html() },
  { name: "xml", extensions: ["xml"], language: xml() },
  { name: "css", extensions: ["css"], language: css() },
  { name: "scss", extensions: ["scss"], language: sass() },
  { name: "sass", extensions: ["sass"], language: sass({ indented: true }) },
  {
    name: "typescript",
    extensions: ["mts", "cts"],
    language: javascript({ jsx: true, typescript: true })
  },
  { name: "bash", extensions: ["sh", "bash", "zsh"], language: new LanguageSupport(StreamLanguage.define(shell)) }
];
