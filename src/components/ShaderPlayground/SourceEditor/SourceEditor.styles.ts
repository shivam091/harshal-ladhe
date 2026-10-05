import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/ShaderPlayground/ShaderPlayground.styles";

// Shared by the gutter, the error underlay and the textarea — any drift between the three and the gutter numbers stop lining up with the code.
const LINE_HEIGHT = "1.25rem";

// Matching vertical padding for the same reason — the first line has to start at the same offset in all three layers.
const PADDING_BLOCK = "0.625rem";

// Header row holding the status readout and copy button; also forces the shared CopyButton visible, since it otherwise only appears on a CodeBlock's hover.
export const EditorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;

  & .copy-btn {
    position: static;
    margin: 0;
    opacity: 1;
  }
`;

// Compile status pill — green when the program linked, danger-tinted when the canvas is showing the last good frame instead.
export const StatusReadout = styled.span`
  font-family: ${MONO_FONT};
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.125rem 0.5rem;
  border-radius: 50rem;
  color: var(--color-fg-success);
  background: color-mix(in srgb, var(--color-fg-success) 14%, transparent);

  &[data-state="error"] {
    color: var(--color-fg-danger);
    background: color-mix(in srgb, var(--color-fg-danger) 14%, transparent);
  }
`;

// Gutter + code side by side; the textarea's own height (resizable) drives the row, and the gutter stretches to match it.
export const EditorFrame = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  font-family: ${MONO_FONT};
  font-size: 0.8125rem;
  line-height: ${LINE_HEIGHT};
  background: color-mix(in srgb, black 30%, var(--color-bg-default));
  border: 0.0625rem solid color-mix(in srgb, var(--cabinet-neon) 25%, var(--color-border-default));
  border-radius: 0.375rem;
  overflow: hidden;

  &:focus-within {
    border-color: var(--color-fg-accent);
    box-shadow: 0 0 0 0.1875rem color-mix(in srgb, var(--color-fg-accent) 25%, transparent);
  }
`;

/*
  Line numbers, scrolled in lockstep with the textarea from its onScroll handler — overflow hidden
  so it never shows a scrollbar of its own. The extra end padding gives it at least the textarea's
  scroll range, which grows by the height of the textarea's horizontal scrollbar once a long line appears.
  contain: size stops its rows from growing the grid row past the textarea (which would leave it
  nothing to scroll), so its width is set explicitly from the digit count instead.
*/
export const Gutter = styled.div`
  contain: size;
  overflow: hidden;
  padding-block: ${PADDING_BLOCK} calc(${PADDING_BLOCK} + 2rem);
  padding-inline: 0.5rem 0.375rem;
  color: color-mix(in srgb, var(--color-fg-muted) 75%, transparent);
  background: color-mix(in srgb, black 15%, transparent);
  border-inline-end: 0.0625rem solid var(--color-border-muted);
  text-align: end;
  user-select: none;
`;

// One line number; an errored line swaps its number for a lit danger marker so a glance down the gutter finds every problem.
export const GutterLine = styled.div`
  position: relative;
  min-inline-size: 2.25ch;
  block-size: ${LINE_HEIGHT};
  padding-inline-start: 1rem;

  &[data-error="true"] {
    color: var(--color-fg-danger);
    font-weight: 700;
  }

  &[data-error="true"]::before {
    content: "";
    position: absolute;
    inset-inline-start: 0.125rem;
    inset-block-start: 50%;
    inline-size: 0.5rem;
    block-size: 0.5rem;
    translate: 0 -50%;
    border-radius: 50%;
    background: var(--color-fg-danger);
    box-shadow: 0 0 0.375rem var(--color-fg-danger);
  }
`;

// Holds the error-line underlay and the transparent textarea on top of it; clips the underlay as it scrolls.
export const CodeCell = styled.div`
  position: relative;
  min-inline-size: 0;
  overflow: hidden;
`;

// Danger-tinted bands behind each errored line — translated by the textarea's scroll offset directly (no re-render per scroll event).
export const ErrorUnderlay = styled.div`
  position: absolute;
  inset-inline: 0;
  inset-block-start: ${PADDING_BLOCK};
  pointer-events: none;
`;

// A single errored line's band, positioned by line index rather than by measuring the DOM.
export const ErrorBand = styled.div`
  position: absolute;
  inset-inline: 0;
  block-size: ${LINE_HEIGHT};
  background: color-mix(in srgb, var(--color-fg-danger) 16%, transparent);
  border-inline-start: 0.125rem solid var(--color-fg-danger);
`;

// No wrapping, so a source line is always exactly one gutter row tall; transparent background lets the error bands show through.
export const CodeTextarea = styled.textarea`
  position: relative;
  display: block;
  inline-size: 100%;
  min-block-size: 24rem;
  margin: 0;
  padding-block: ${PADDING_BLOCK};
  padding-inline: 0.625rem;
  font: inherit;
  line-height: ${LINE_HEIGHT};
  color: var(--color-fg-default);
  background: transparent;
  border: none;
  outline: none;
  resize: vertical;
  white-space: pre;
  overflow-wrap: normal;
  overflow: auto;
  tab-size: 2;
  caret-color: var(--color-fg-attention);
  scrollbar-width: thin;
`;

// The full compiler messages, each a button that jumps the caret to its line — the gutter dot says where, this says what.
export const ErrorList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
`;

// One error row; a button rather than a link since it moves focus within the page instead of navigating.
export const ErrorItem = styled.button`
  display: flex;
  gap: 0.5rem;
  inline-size: 100%;
  padding: 0.375rem 0.5rem;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  text-align: start;
  color: var(--color-fg-danger);
  background: color-mix(in srgb, var(--color-fg-danger) 8%, transparent);
  border: 0.0625rem solid color-mix(in srgb, var(--color-fg-danger) 30%, transparent);
  border-radius: 0.25rem;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }

  &:hover:not(:disabled) {
    background: color-mix(in srgb, var(--color-fg-danger) 14%, transparent);
  }
`;

// The "L12" prefix — fixed width so messages align in a column.
export const ErrorLine = styled.span`
  flex: 0 0 auto;
  min-inline-size: 3.5ch;
  font-weight: 700;
`;
