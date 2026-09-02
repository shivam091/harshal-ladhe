import { styled } from "@linaria/react";

export const Stage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
`;

export const RatioRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`;

export const RatioValue = styled.span`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-fg-default);
`;

export const RatioLabel = styled.span`
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
`;

export const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

export const Badge = styled.span`
  padding: 0.1875rem 0.5625rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 999px;

  &[data-pass="true"] {
    color: var(--color-fg-success);
    background: var(--color-bg-success-muted);
    border-color: var(--color-border-success-emphasis);
  }

  &[data-pass="false"] {
    color: var(--color-fg-danger);
    background: var(--color-bg-danger-muted);
    border-color: var(--color-border-danger-emphasis);
  }
`;

export const SamplePane = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  border-radius: 0.375rem;
`;

export const SampleLarge = styled.p`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
`;

export const SampleNormal = styled.p`
  margin: 0;
  font-size: 1rem;
`;
