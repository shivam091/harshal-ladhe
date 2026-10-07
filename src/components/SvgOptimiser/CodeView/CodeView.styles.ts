import { styled } from "@linaria/react";

// Monospace for the diff, matching the highlighted output beside it.
const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

// Title, view switch and download share one line on wide screens and wrap on phones, with the title always first.
export const HeaderRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;

  & > h3 {
    margin-inline-end: auto;
  }
`;

// A real fieldset so the view switch is announced under its own legend.
export const ModeGroup = styled.fieldset`
  display: inline-flex;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  border: 0;
`;

// Visually hidden legend — the two options are self-explanatory on screen, but a screen reader needs the group named.
export const ModeLegend = styled.legend`
  position: absolute;
  inline-size: 0.0625rem;
  block-size: 0.0625rem;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

/*
  A radio option painted as a counter tab: the label carries the look, and :has() reads the hidden
  input's checked/focus state, so keyboard focus still shows a visible ring.
*/
export const ModeOption = styled.label`
  position: relative;
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
  cursor: pointer;

  &:has(input:checked) {
    color: white;
    background: var(--po-airmail-blue);
    border-color: var(--po-airmail-blue);
  }

  &:has(input:focus-visible) {
    outline: 0.125rem solid var(--color-outline-focus, var(--color-fg-accent));
    outline-offset: 0.125rem;
  }
`;

// Visually hidden but still in the tab order and arrow-key group — the native radio behaviour is the point.
export const ModeInput = styled.input`
  position: absolute;
  inline-size: 0.0625rem;
  block-size: 0.0625rem;
  margin: -0.0625rem;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;

// Minified output is one enormous line, so the code block wraps anywhere rather than scrolling sideways forever.
export const WrappingCode = styled.div`
  & pre,
  & code {
    white-space: pre-wrap;
    word-break: break-all;
  }
`;

// The diff panel — scrolls on its own so a long file doesn't push the tray off the counter.
export const DiffList = styled.ol`
  max-block-size: 28rem;
  margin: 0;
  padding: 0.5rem 0;
  overflow: auto;
  list-style: none;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  line-height: 1.5;
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
`;

/*
  One diff line with its +/− marker in a gutter. Additions and removals are tinted from the
  success and danger tokens, and the marker character carries the meaning too, so colour is never
  the only signal.
*/
export const DiffRowItem = styled.li`
  position: relative;
  display: grid;
  grid-template-columns: 1.5rem minmax(0, 1fr);
  padding-inline-end: 0.5rem;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--color-fg-default);

  &::before {
    content: attr(data-marker);
    text-align: center;
    color: var(--color-fg-muted);
  }

  &[data-kind="added"] {
    background: color-mix(in srgb, var(--color-fg-success) 14%, transparent);
  }

  &[data-kind="added"]::before {
    color: var(--color-fg-success);
  }

  &[data-kind="removed"] {
    background: color-mix(in srgb, var(--color-fg-danger) 14%, transparent);
    text-decoration: line-through;
    text-decoration-color: color-mix(in srgb, var(--color-fg-danger) 50%, transparent);
  }

  &[data-kind="removed"]::before {
    color: var(--color-fg-danger);
  }

  &[data-kind="fold"] {
    font-style: italic;
    color: var(--color-fg-muted);
  }
`;

// Spoken "Added:"/"Removed:" prefix — the gutter marker is drawn by CSS, which screen readers may skip.
export const HiddenText = styled.span`
  position: absolute;
  inline-size: 0.0625rem;
  block-size: 0.0625rem;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

// Line totals above the diff, in tabular figures.
export const DiffSummary = styled.p`
  margin: 0;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: var(--color-fg-muted);
`;
