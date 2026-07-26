import { EditorState } from "@codemirror/state";
import { syntaxTree, type LanguageSupport } from "@codemirror/language";
import { highlightTree } from "@lezer/highlight";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { yaml } from "@codemirror/lang-yaml";
import { sandboxSyntaxHighlightStyle } from "@/components/Sandbox/Editor/extensions/syntax-colors";
import { diffLineWords, type CharRange, type DiffRow } from "@/components/Sandbox/Editor/extensions/diff-engine";

/*
  Diff views have no live CodeMirror view to borrow highlighting from — removed lines don't even
  exist in the current document — so a throwaway EditorState per file side runs the parser instead.
*/

// Reuses only the language packages already installed for the live editor, so diffs highlight like the editor.
function languageForFile(filePath: string): LanguageSupport | null {
  const extension = filePath.split(".").pop()?.toLowerCase() ?? "";

  switch (extension) {
    case "ts":
      return javascript({ typescript: true });
    case "tsx":
      return javascript({ jsx: true, typescript: true });
    case "js":
    case "mjs":
    case "cjs":
      return javascript();
    case "jsx":
      return javascript({ jsx: true });
    case "css":
      return css();
    case "html":
    case "htm":
      return html();
    case "json":
      return json();
    case "md":
    case "markdown":
      return markdown();
    case "yaml":
    case "yml":
      return yaml();
    default:
      return null;
  }
}

/*
  One syntax-highlighted sub-range of a line, in line-relative character offsets — `classes` is the
  space-separated `cm-sbx-*` class list HighlightStyle produced for that range ("" for plain, untagged text).
*/
export interface SyntaxToken {
  from: number;
  to: number;
  classes: string;
}

// Cheap per-line token lookup over an already-parsed syntax tree — what createLineHighlighter returns.
export interface LineHighlighter {
  tokensForLine(oneBasedLine: number): SyntaxToken[];
}

/*
  Parses `fullText` once with `filePath`'s language (or not at all, if the extension isn't
  recognized — tokensForLine then just returns each line unstyled) and returns a cheap per-line
  token lookup over the resulting tree. One of these is built per file *side* (original vs
  current) since a removed line's highlighting has to come from the original text's own tree.
*/
export function createLineHighlighter(fullText: string, filePath: string): LineHighlighter {
  const language = languageForFile(filePath);
  const state = EditorState.create({ doc: fullText, extensions: language ? [language] : [] });
  const tree = syntaxTree(state);

  return {
    tokensForLine(oneBasedLine: number): SyntaxToken[] {
      if (oneBasedLine < 1 || oneBasedLine > state.doc.lines) return [];

      const line = state.doc.line(oneBasedLine);
      if (line.length === 0) return [];

      const tokens: SyntaxToken[] = [];
      let pos = line.from;

      highlightTree(
        tree,
        sandboxSyntaxHighlightStyle,
        (from, to, classes) => {
          if (from > pos) tokens.push({ from: pos - line.from, to: from - line.from, classes: "" });
          tokens.push({ from: from - line.from, to: to - line.from, classes });
          pos = to;
        },
        line.from,
        line.to
      );

      if (pos < line.to) tokens.push({ from: pos - line.from, to: line.to - line.from, classes: "" });
      if (tokens.length === 0) tokens.push({ from: 0, to: line.length, classes: "" });

      return tokens;
    }
  };
}

// One rendered sub-span of a diff row's text: a syntax class (possibly none) plus whether it falls inside a word-level change.
export interface RenderSegment {
  text: string;
  classes: string;
  changed: boolean;
}

/*
  Merges a line's full syntax partition with a (possibly empty, possibly partial) set of
  word-changed ranges into the finest sub-spans that each carry both a syntax class and a changed
  flag — the two segmentations rarely share boundaries (grammar tokens vs. word/punctuation runs),
  so this cuts at every boundary either one introduces and looks up each resulting piece in both.
*/
export function composeLineSegments(lineText: string, syntaxTokens: SyntaxToken[], changedRanges: CharRange[]): RenderSegment[] {
  if (lineText.length === 0) return [];

  const cuts = new Set<number>([0, lineText.length]);
  for (const token of syntaxTokens) {
    cuts.add(token.from);
    cuts.add(token.to);
  }
  for (const range of changedRanges) {
    cuts.add(Math.max(0, Math.min(lineText.length, range.from)));
    cuts.add(Math.max(0, Math.min(lineText.length, range.to)));
  }

  const points = Array.from(cuts).sort((a, b) => a - b);
  const segments: RenderSegment[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    if (from === to) continue;

    const token = syntaxTokens.find((candidate) => candidate.from <= from && to <= candidate.to);
    const changed = changedRanges.some((range) => range.from < to && range.to > from);
    segments.push({ text: lineText.slice(from, to), classes: token?.classes ?? "", changed });
  }

  return segments;
}

/*
  Highlighted from the correct side's tree, and word-diffed against its counterpart when it's half
  of a replaced-line pair.
*/
export function highlightRow(row: DiffRow, origHighlighter: LineHighlighter, curHighlighter: LineHighlighter): RenderSegment[] {
  if (row.type === "context") {
    return composeLineSegments(row.text, curHighlighter.tokensForLine(row.newLine), []);
  }

  const highlighter = row.type === "removed" ? origHighlighter : curHighlighter;
  const lineNumber = row.type === "removed" ? row.oldLine : row.newLine;
  const syntaxTokens = highlighter.tokensForLine(lineNumber);

  if (row.pairedText == null) {
    return composeLineSegments(row.text, syntaxTokens, []);
  }

  const { oldChanged, newChanged } = row.type === "removed" ? diffLineWords(row.text, row.pairedText) : diffLineWords(row.pairedText, row.text);
  return composeLineSegments(row.text, syntaxTokens, row.type === "removed" ? oldChanged : newChanged);
}
