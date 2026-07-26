import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { yaml } from "@codemirror/lang-yaml";
import type { CustomLanguage } from "@codesandbox/sandpack-react";

/*
  Real CodeMirror grammars for extensions Sandpack has none of (see getLanguageFromFile /
  getCodeMirrorLanguage in @codesandbox/sandpack-react) — without this, .json/.md/.yaml files
  silently fall back to Sandpack's JavaScript grammar, which both colors them wrong and trips
  false "Syntax error" diagnostics for perfectly valid content (a top-level JSON object or a
  Markdown heading isn't valid JS). Passed to SandpackCodeEditor's `additionalLanguages` prop,
  checked before Sandpack's own built-in fallback.

  Keep this in sync with Shiki's SUPPORTED_LANGS (src/lib/shiki/shiki.mjs) where a real
  CodeMirror grammar package exists — currently still missing here: "sass" (indented syntax,
  no sandbox example uses it yet) and "mdx" (no maintained CodeMirror grammar distinguishes it
  from plain Markdown).
*/
export const sandboxAdditionalLanguages: CustomLanguage[] = [
  { name: "json", extensions: ["json"], language: json() },
  { name: "yaml", extensions: ["yaml", "yml"], language: yaml() },
  { name: "markdown", extensions: ["md", "markdown"], language: markdown() }
];
