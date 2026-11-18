import { styled } from "@linaria/react";

// The editable test-string field the annotated HighlightPane below reflects.
export const TestTextarea = styled.textarea`
  inline-size: 100%;
  min-block-size: 8rem;
  padding: 0.625rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.5rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--color-fg-attention);
    box-shadow: 0 0 0 0.1875rem color-mix(in srgb, var(--color-fg-attention) 20%, transparent);
  }
`;

// The annotated readout — plain background so a match's highlighter-tape color reads true, framed like a page pulled out for markup rather than another plain textarea.
export const HighlightPane = styled.div`
  padding: 0.75rem 0.625rem;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.8;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem dashed var(--color-border-muted);
  border-radius: 0.5rem;
  transition: opacity 150ms ease;

  &[data-pending="true"] {
    opacity: 0.6;
  }
`;

/*
  A single match rendered as a highlighter-tape stroke: a translucent tint in this match's own
  `--tape-color`, uneven "torn" corner radii standing in for a real highlighter's slightly irregular
  ends, and box-decoration-break so a match that happens to wrap across lines gets its own tape
  treatment on each line fragment instead of one box stretched across both.
*/
export const MatchTape = styled.mark`
  position: relative;
  display: inline;
  padding: 0.05em 0.3em;
  margin-inline: 0.0625em;
  color: var(--color-fg-default);
  background: color-mix(in srgb, var(--tape-color, var(--color-fg-attention)) 38%, transparent);
  border-radius: 0.15em 0.6em 0.2em 0.5em / 0.5em 0.2em 0.6em 0.15em;
  box-shadow: inset 0 -0.09em 0 color-mix(in srgb, var(--tape-color, var(--color-fg-attention)) 55%, transparent);
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
`;

// A zero-length match (`\b`, `^`, `x*` between letters) has no text to tape over, so it gets a thin upright stroke in the match's colour at the exact position instead.
export const EmptyMatchMarker = styled.mark`
  display: inline-block;
  inline-size: 0.125rem;
  block-size: 1.1em;
  margin-inline: 0.0625rem;
  vertical-align: text-bottom;
  background: var(--tape-color, var(--color-fg-attention));
  border-radius: 0.0625rem;
`;

// Small superscript annotation marks for a match's capture groups — the "second ink color" that nests groups inside a highlighted match, distinct from the tape color itself.
export const GroupMarks = styled.sup`
  margin-inline-start: 0.0625rem;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.0125em;
  color: var(--color-fg-accent);
  vertical-align: super;
`;

// "N matches" (or "No matches") readout above the annotated pane.
export const SummaryRow = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
`;

// Shown in place of the annotated pane when the pattern itself is invalid.
export const ErrorBanner = styled.p`
  margin: 0;
  padding: 0.5rem 0.625rem;
  font-size: 0.8125rem;
  color: var(--color-fg-danger);
  background: var(--color-bg-danger-muted);
  border: 0.0625rem dashed var(--color-border-danger-emphasis);
  border-radius: 0.375rem;
`;
