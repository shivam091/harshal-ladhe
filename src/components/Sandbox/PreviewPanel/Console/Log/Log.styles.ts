import { styled } from "@linaria/react";

/*
  One console entry — color keyed off the console method via [data-method]. Flex row so the
  warn/error icon sits beside the message instead of stacking above it.
*/
export const Wrapper = styled.li`
  display: flex;
  gap: var(--space-xs);
  align-items: flex-start;
  padding-block-end: var(--space-sm);
  border-block-end: var(--border-width-default) dashed var(--color-border-muted);
  color: var(--color-fg-default);
  line-height: var(--line-height-base);

  &:last-child {
    border-block-end: none;
  }

  &[data-method="log"] {
    color: var(--color-fg-default);
  }

  &[data-method="info"] {
    color: var(--color-fg-accent);
  }

  &[data-method="warn"] {
    color: var(--color-fg-attention);
  }

  &[data-method="error"],
  &[data-method="assert"] {
    color: var(--color-fg-danger);
  }

  &[data-method="debug"],
  &[data-method="table"],
  &[data-method="time"],
  &[data-method="timeEnd"],
  &[data-method="count"] {
    color: var(--color-fg-default);
  }
`;

/*
  Icon for warn/error entries. Height is pinned to one text line so it centers on the message's
  first line specifically, not the whole (possibly multi-line) block.
*/
export const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  block-size: 1.25rem;
`;

/*
  Holds the entry's logged arguments, separate from IconWrapper so the icon isn't one of the
  flex row's text children.
*/
export const Content = styled.div`
  flex: 1;
  min-inline-size: 0;
`;

/*
  A single logged string, rendered as plain text. Inherits color from Wrapper's [data-method]
  rules instead of hardcoding one, so a plain console.log doesn't render as an error.
*/
export const Message = styled.p`
  color: inherit;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  margin: var(--space-none);
  line-height: var(--line-height-base);

  & + & {
    margin-block-start: var(--space-xs);
  }
`;

// Pretty-printed non-string value (object, array, etc).
export const ObjectDump = styled.pre`
  margin-block: var(--space-xs) var(--space-none);
  margin-inline: var(--space-none);
  padding-block: var(--space-xs);
  padding-inline: var(--space-sm);
  background: var(--color-bg-muted);
  border-radius: var(--border-radius-sm);
  overflow: auto;
  color: var(--color-fg-default);
`;
