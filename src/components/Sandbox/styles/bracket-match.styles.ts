/*
  Cursor-adjacent bracket-match highlight — re-themes CodeMirror's built-in matching/non-matching
  bracket decorations onto this project's own tokens.
*/
export const bracketMatchCss = `
  .cm-matchingBracket {
    background: var(--color-bg-accent-muted) !important;
    border-radius: 2px;
  }

  .cm-nonmatchingBracket {
    background: var(--color-bg-danger-muted) !important;
    border-radius: 2px;
  }
`;
