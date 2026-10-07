import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/FillRuleVisualiser/FillRuleVisualiser.styles";

// The subpath list — a stack of rows, each one a strip of came holding that subpath's controls.
export const SubpathList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin: 0;
  padding: 0;
  list-style: none;
`;

// One subpath's row; the active one is backlit amber so it's obvious where the next click will land.
export const SubpathRow = styled.li`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem 0.5rem;
  padding: 0.375rem 0.5rem;
  background: color-mix(in oklab, var(--color-bg-default) 96%, var(--color-fg-muted));
  border: 0.125rem solid color-mix(in oklab, var(--came) 55%, transparent);
  border-radius: 0.375rem;

  &[data-active="true"] {
    background: color-mix(in oklab, var(--color-bg-default) 80%, var(--glass-amber));
    border-color: var(--came);
  }
`;

// The subpath's name as a selectable button, so choosing the active subpath works from the keyboard.
export const SubpathName = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.375rem;
  font-family: ${MONO_FONT};
  font-size: 0.8125rem;
  font-weight: 800;
  color: var(--color-fg-default);
  background: none;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;

  &:focus-visible {
    outline: 0.1875rem solid var(--color-fg-accent);
    outline-offset: 0.0625rem;
  }
`;

// A tiny diamond of the subpath's glass colour, matching its chevrons when it's active.
export const Quarry = styled.span`
  inline-size: 0.625rem;
  block-size: 0.625rem;
  background: var(--color-bg-default);
  border: 0.125rem solid var(--came);
  transform: rotate(45deg);

  &[data-active="true"] {
    background: var(--glass-amber);
  }
`;

// Point count and drawing direction, kept quiet next to the name.
export const SubpathMeta = styled.span`
  flex: 1 1 8rem;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;

// The d-string field: a monospace textarea that grows with long paths up to a point.
export const PathTextarea = styled.textarea`
  inline-size: 100%;
  min-block-size: 5.5rem;
  padding: 0.5rem;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--color-fg-default);
  background: color-mix(in oklab, var(--color-bg-default) 96%, var(--glass-amber));
  border: 0.125rem solid var(--came);
  border-radius: 0.375rem;
  resize: vertical;

  &:focus-visible {
    outline: 0.1875rem solid var(--color-fg-accent);
    outline-offset: 0.0625rem;
  }
`;

// Label above the textarea.
export const FieldLabel = styled.label`
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-fg-default);
`;

// Parse errors and fit notices under the textarea.
export const FieldMessage = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);

  &[data-error="true"] {
    color: var(--color-fg-danger);
    font-weight: 600;
  }
`;
