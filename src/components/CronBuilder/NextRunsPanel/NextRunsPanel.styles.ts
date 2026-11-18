import { styled } from "@linaria/react";

// Vertical timeline — a connecting rail behind each run's dot, so 5 upcoming runs read as one continuous schedule rather than a bare list.
export const Timeline = styled.ol`
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
`;

export const Run = styled.li`
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding-block: 0.5rem;
  padding-inline-start: 1.25rem;

  &::before {
    content: "";
    position: absolute;
    inset-inline-start: 0.25rem;
    inset-block-start: 0;
    inset-block-end: -0.5rem;
    inline-size: 0.09375rem;
    background: var(--color-border-muted);
  }

  &:last-child::before {
    inset-block-end: 50%;
  }

  &::after {
    content: "";
    position: absolute;
    inset-inline-start: 0;
    inset-block-start: 0.9375rem;
    inline-size: 0.5rem;
    block-size: 0.5rem;
    border-radius: 50%;
    background: var(--color-border-default);
  }

  &:first-child::after {
    background: var(--color-fg-accent);
    box-shadow: 0 0 0 0.1875rem color-mix(in srgb, var(--color-fg-accent) 20%, transparent);
  }
`;

export const RunDate = styled.span`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
`;

export const RelativeLabel = styled.span`
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;

export const EmptyState = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
`;
