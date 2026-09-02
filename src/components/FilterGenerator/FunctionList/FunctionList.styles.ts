import { styled } from "@linaria/react";

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// One function's row: a toggle + name always visible, its slider only once enabled — a plain border rather than a full card, since these sit densely stacked (up to 10 rows) rather than as separate boxed items like a preset gallery.
export const FunctionRow = styled.div`
  padding-block-end: 0.5rem;
  border-block-end: 0.0625rem solid var(--color-border-muted);

  &:last-child {
    border-block-end: none;
    padding-block-end: 0;
  }
`;

export const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

export const FunctionName = styled.span`
  flex: 1 1 auto;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-default);
`;

export const SliderWrapper = styled.div`
  margin-block-start: 0.5rem;
  padding-inline-start: 1.5rem;
`;

export const DropShadowFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-block-start: 0.5rem;
  padding-inline-start: 1.5rem;
`;
