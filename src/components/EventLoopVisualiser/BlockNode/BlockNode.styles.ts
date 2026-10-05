import { styled } from "@linaria/react";

/*
  One block in the editor tree, drawn as a wagon-label card. --kind-colour comes from data-kind so
  each primitive is told apart by the same colour its work uses on the track diagram — timers in
  the task colour, microtask producers in the microtask colour, rAF in the render colour.
*/
export const Node = styled.li`
  --kind-colour: var(--color-fg-muted);

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  background: color-mix(in oklab, var(--kind-colour) 7%, var(--signal-enamel-deep));
  border: 0.0625rem solid color-mix(in oklab, var(--kind-colour) 35%, var(--color-border-muted));
  border-inline-start-width: 0.25rem;
  border-radius: 0.3125rem;

  &[data-kind="timeout"],
  &[data-kind="fetch"] {
    --kind-colour: var(--color-fg-accent);
  }
  &[data-kind="promise"],
  &[data-kind="microtask"],
  &[data-kind="async"] {
    --kind-colour: var(--color-fg-success);
  }
  &[data-kind="raf"] {
    --kind-colour: var(--color-fg-danger);
  }
  &[data-kind="log"] {
    --kind-colour: var(--color-fg-attention);
  }
`;

// Badge, fields, and tools on one wrapping row — wraps rather than overflows on a phone.
export const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.375rem 0.5rem;
`;

// The block's kind, set in the same monospace as the generated source so the editor and the code read as one thing.
export const KindBadge = styled.span`
  font-family: var(--signal-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--kind-colour);
`;

// Label + input pair; the label stays visible (not just a placeholder) so every field is named for assistive tech and sighted users alike.
export const Field = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6875rem;
  color: var(--color-fg-muted);
`;

// Shared by text and number fields; numbers get a narrower box.
export const TextInput = styled.input`
  inline-size: 8.5rem;
  max-inline-size: 100%;
  padding: 0.1875rem 0.375rem;
  font-family: var(--signal-mono);
  font-size: 0.75rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;

  &:focus-visible {
    outline: 0.125rem solid var(--kind-colour);
    outline-offset: 0.0625rem;
  }

  &[type="number"] {
    inline-size: 4.5rem;
  }
`;

// Reorder/delete tools pushed to the row's end so they line up down the whole tree.
export const NodeTools = styled.div`
  display: inline-flex;
  gap: 0.125rem;
  margin-inline-start: auto;
`;

// Quiet icon buttons — visible enough to find, quiet enough not to compete with the fields.
export const ToolButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.625rem;
  block-size: 1.625rem;
  padding: 0;
  color: var(--color-fg-muted);
  background: transparent;
  border: 0.0625rem solid transparent;
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    color: var(--color-fg-default);
    border-color: var(--color-border-muted);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--kind-colour);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

// A nested callback body, indented behind a rail-coloured rule so the nesting reads at a glance.
export const Branch = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding-inline-start: 0.625rem;
  border-inline-start: 0.125rem dashed color-mix(in oklab, var(--kind-colour) 45%, transparent);
`;

// Names a callback body the way the generated code reads it.
export const BranchLabel = styled.span`
  font-family: var(--signal-mono);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-fg-muted);
`;

// Sibling blocks as a real list, so a screen reader announces "item 2 of 4" while moving through the tree.
export const NodeList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin: 0;
  padding: 0;
  list-style: none;
`;

// Text-style buttons for adding/removing a `.then` link — secondary to the main add-block control.
export const ChainButton = styled.button`
  align-self: flex-start;
  padding: 0.125rem 0.375rem;
  font-family: var(--signal-mono);
  font-size: 0.6875rem;
  color: var(--kind-colour);
  background: transparent;
  border: 0.0625rem dashed color-mix(in oklab, var(--kind-colour) 55%, transparent);
  border-radius: 0.25rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// Add/remove .then buttons side by side.
export const ChainRow = styled.div`
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
`;
