import { styled } from "@linaria/react";

// The expression hero — the tool's one unmissable focal point, framed by a hairline gradient sweeping through every field's own accent color.
export const Hero = styled.section`
  position: relative;
  padding: 0.0625rem;
  border-radius: 0.875rem;
  background: linear-gradient(
    120deg,
    hsl(190deg 75% 42%),
    hsl(261deg 60% 62%),
    hsl(35deg 90% 48%),
    hsl(333deg 70% 56%),
    hsl(213deg 80% 58%)
  );
`;

export const HeroInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: clamp(1rem, 3vw, 1.5rem);
  background: var(--color-bg-default);
  border-radius: 0.8125rem;
`;

export const HeroTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
`;

export const TokenRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

// One field's rendered token — background/border tint is derived from `--field-accent`, set inline per instance.
export const Token = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1875rem;
  padding: 0.4375rem 0.6875rem;
  background: color-mix(in srgb, var(--field-accent) 12%, transparent);
  border: 0.0625rem solid color-mix(in srgb, var(--field-accent) 35%, transparent);
  border-radius: 0.5rem;
`;

export const TokenValue = styled.code`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1;
  color: var(--field-accent);
`;

export const TokenLabel = styled.span`
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-fg-muted);
`;

export const CopyExpressionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
  background: var(--color-bg-muted);
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: color 150ms ease, border-color 150ms ease, background 150ms ease;

  &:hover {
    color: var(--color-fg-accent);
    border-color: var(--color-fg-accent);
  }

  &[data-copied="true"] {
    color: var(--color-fg-success);
    border-color: var(--color-fg-success);
  }
`;

export const Sentence = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--color-fg-default);
`;
