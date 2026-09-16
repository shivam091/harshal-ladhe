import { styled } from "@linaria/react";

// Pairs the QC stamp with its numeric readout — a stamped seal beside the paperwork it's certifying, wrapping to stack on narrow viewports.
export const Seal = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
`;

/*
  The flagship flourish: a circular quality-control stamp, inked in a color that reflects the actual
  WCAG grade (driven by `data-tone`, set in ContrastResult.tsx) rather than a plain colored pill or
  bare number — a double ring and a slight off-axis rotation read as a real hand-stamped impression.
*/
export const StampBadge = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  inline-size: 6.5rem;
  block-size: 6.5rem;
  border-radius: 50%;
  border: 0.1875rem solid currentColor;
  transform: rotate(-7deg);
  color: var(--color-fg-muted);
  transition: color 200ms ease, transform 200ms ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0.3125rem;
    border: 0.0625rem solid currentColor;
    border-radius: 50%;
    opacity: 0.55;
  }

  &[data-tone="pass-high"] {
    color: var(--color-fg-success);
  }

  &[data-tone="pass"] {
    color: var(--color-fg-accent);
  }

  &[data-tone="fail"] {
    color: var(--color-fg-danger);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: color 200ms ease;
  }
`;

// The stamp's own large ink text — the grade letters (AAA/AA/FAIL), set bold and wide like real stamp typography.
export const StampGrade = styled.span`
  font-size: 1.375rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  line-height: 1;
`;

// Small caption text curving the "spec" the stamp is certifying against, printed under the grade inside the ring.
export const StampCaption = styled.span`
  margin-block-start: 0.1875rem;
  font-size: 0.5625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.8;
`;

// Numeric readout beside the stamp — the raw ratio plus its threshold breakdown.
export const SealMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-inline-size: 10rem;
`;

// Ratio value and its unit label, set baseline-aligned like a spec sheet's own measurement line.
export const RatioRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.4375rem;
`;

// The raw numeric ratio, e.g. "4.50:1".
export const RatioValue = styled.span`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-fg-default);
`;

// The muted "contrast ratio" caption beside the value.
export const RatioLabel = styled.span`
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;

// Row of the four individual WCAG threshold checks, each its own small ticket.
export const ThresholdRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

// One threshold's own pass/fail ticket — inked green when it clears the bar, red when it doesn't.
export const ThresholdChip = styled.span`
  padding: 0.25rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: 700;
  border-radius: 0.25rem;
  border: 0.0625rem solid var(--color-border-muted);
  color: var(--color-fg-muted);
  background: var(--color-bg-muted);

  &[data-pass="true"] {
    color: var(--color-fg-success);
    border-color: color-mix(in srgb, var(--color-fg-success) 45%, transparent);
    background: var(--color-bg-success-muted);
  }

  &[data-pass="false"] {
    color: var(--color-fg-danger);
    border-color: color-mix(in srgb, var(--color-fg-danger) 45%, transparent);
    background: var(--color-bg-danger-muted);
  }
`;

// The "press proof" — a literal test print of the pair in use, at both sizes the WCAG thresholds are defined against.
export const ProofPane = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
`;

// The proof's "large text" sample — the size WCAG's aaLarge/aaaLarge thresholds are defined against.
export const ProofLarge = styled.p`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
`;

// The proof's "normal text" sample — the size WCAG's aaNormal/aaaNormal thresholds are defined against.
export const ProofNormal = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.5;
`;
