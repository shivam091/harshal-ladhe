import { styled } from "@linaria/react";

/*
  The stage is itself a stacking context (isolation: isolate) so the demo's z-index: 9999 tooltip can never escape
  over the site header or nearby code blocks — the very technique the post teaches, applied to the post.
*/
export const Stage = styled.div`
  position: relative;
  isolation: isolate;
  display: flow-root;
  padding: 1rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
  overflow: clip;
`;

/*
  Backgrounds are layered over the page colour so the muted tokens can't turn translucent — an overlap is only
  readable if the card on top genuinely hides what's beneath it.
*/
export const CardA = styled.div`
  position: relative;
  inline-size: min(100%, 16rem);
  block-size: 5.5rem;
  padding: 0.625rem 0.875rem;
  background: linear-gradient(var(--color-bg-accent-muted), var(--color-bg-accent-muted)), var(--color-bg-default);
  border: 0.125rem solid var(--color-border-accent-emphasis);
  border-radius: 0.5rem;
`;

// Offset by a fixed amount rather than right-aligned, so it overlaps the tooltip at every stage width.
export const CardB = styled.div`
  position: relative;
  inline-size: min(calc(100% - 4rem), 18rem);
  block-size: 5.5rem;
  margin-block-start: 1.25rem;
  margin-inline-start: 4rem;
  padding: 0.625rem 0.875rem;
  background: linear-gradient(var(--color-bg-success-muted), var(--color-bg-success-muted)), var(--color-bg-default);
  border: 0.125rem solid var(--color-border-success-emphasis);
  border-radius: 0.5rem;
`;

// Hangs out of Card A's bottom edge and deep into Card B, so whichever paints on top is unmistakable.
export const Tooltip = styled.div`
  position: absolute;
  inset-block-start: calc(100% - 1rem);
  inset-inline-start: 40%;
  inline-size: max-content;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: var(--color-fg-on-emphasis);
  background: var(--color-bg-attention-emphasis);
  border-radius: 0.375rem;
  box-shadow: var(--box-shadow-sm);
`;

// Card name — the bold anchor readers scan for when matching a card to its controls.
export const CardTitle = styled.strong`
  display: block;
  font-size: 0.9375rem;
  color: var(--color-fg-default);
`;

// The element's current declaration, echoed on the element itself so the stage reads without the controls.
export const CardCode = styled.code`
  display: block;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;

// Same declaration echo as CardCode, recoloured for the tooltip's emphasis background.
export const TooltipCode = styled(CardCode)`
  color: inherit;
`;
