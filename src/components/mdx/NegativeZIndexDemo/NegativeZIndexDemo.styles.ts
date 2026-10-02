import { styled } from "@linaria/react";

/*
  The stage is the stacking context the child falls back to when the parent doesn't form one. Its stripes are the
  stage's own background — the layer even a z-index: -1 child stays above — so readers can see where the child went.
*/
export const Stage = styled.div`
  position: relative;
  isolation: isolate;
  padding: 1.25rem;
  background: repeating-linear-gradient(
    -45deg,
    var(--color-bg-muted) 0 0.5rem,
    var(--color-bg-default) 0.5rem 1rem
  );
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
  overflow: clip;
`;

// Opaque by layering over the page colour, so a child painted beneath it is genuinely hidden rather than tinted.
export const Parent = styled.div`
  position: relative;
  inline-size: min(100%, 17rem);
  min-block-size: 7rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-fg-default);
  background: linear-gradient(var(--color-bg-accent-muted), var(--color-bg-accent-muted)), var(--color-bg-default);
  border: 0.125rem solid var(--color-border-accent-emphasis);
  border-radius: 0.5rem;
`;

/*
  Sized from the parent's box so a corner always pokes outside the parent, whichever layer it lands on — in
  percentages, so the overhang stays inside the stage's padding even on a phone.
*/
export const Decoration = styled.div`
  position: absolute;
  inset-block-start: 3.25rem;
  inset-inline-start: 45%;
  inline-size: 60%;
  block-size: 5rem;
  padding: 0.375rem 0.625rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-on-emphasis);
  background: var(--color-bg-danger-emphasis);
  border-radius: 0.5rem;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;

// Leaves room under the parent for the decoration's overhang, so it never collides with the stage edge.
export const Spacer = styled.div`
  block-size: 2.5rem;
`;
