import { autoCloseTags } from "@codemirror/lang-javascript";
import type { Extension } from "@codemirror/state";

/*
  Typing "<div" then ">" (or a closing "</") auto-inserts the matching tag, same as VS Code.
  HTML files already get this for free — html()'s own config defaults autoCloseTags to true (see
  additional-languages.ts) — but Sandpack's built-in JS/TS/JSX/TSX language support doesn't pull
  in lang-javascript's own version of the same extension, so .jsx/.tsx files were missing it.
  Scoped to JSX tag syntax internally, so including it globally is inert for plain .js/.ts files.
*/
export const sandboxAutoCloseTagsExtension: Extension = autoCloseTags;
