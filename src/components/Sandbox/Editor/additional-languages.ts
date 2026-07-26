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
  Real CodeMirror grammars for extensions Sandpack has none of, or gets wrong (see
  getLanguageFromFile / getCodeMirrorLanguage in @codesandbox/sandpack-react) — without this,
  .json/.md/.yaml files silently fall back to Sandpack's JavaScript grammar (colors them wrong,
  trips false "Syntax error" diagnostics on perfectly valid content), .scss gets the plain CSS
  grammar (misses nesting/@mixin/interpolation, so real SCSS trips false errors too), and
  .mts/.cts get a non-TypeScript JS grammar (misses type annotations, so real TS syntax trips
  false errors). Passed to SandpackCodeEditor's `additionalLanguages` prop, checked before
  Sandpack's own built-in fallback.

  Keep this in sync with Shiki's SUPPORTED_LANGS (src/lib/shiki/shiki.mjs) where a real
  CodeMirror grammar package exists — currently still missing here: "mdx" (no maintained
  CodeMirror grammar distinguishes it from plain Markdown), "ssh-config" and "bat" (no
  CodeMirror grammar exists for either — not even in @codemirror/legacy-modes — so .bat/ssh
  config files still fall back to JavaScript). ".less" still falls back to the plain CSS
  grammar too — Lezer has no maintained Less parser.
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
