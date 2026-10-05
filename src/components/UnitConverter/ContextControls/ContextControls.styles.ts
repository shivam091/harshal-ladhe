import { styled } from "@linaria/react";

// Thin chalk rule between the font, box and precision groups — they answer different questions, so the break is worth marking.
export const GroupDivider = styled.hr`
  margin: 0.25rem 0;
  border: none;
  border-block-start: 0.0625rem dashed var(--color-border-muted);
`;

// Small heading for each group so a long run of sliders still scans as three short lists.
export const GroupLabel = styled.p`
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-fg-muted);
`;

// A text-style button rather than a toolbar icon, since "use this window" needs words to explain itself.
export const MatchWindowButton = styled.button`
  align-self: flex-start;
  padding: 0.3125rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-default);
  background: color-mix(in srgb, var(--color-fg-attention) 14%, var(--color-bg-default));
  border: 0.0625rem dashed color-mix(in srgb, var(--color-fg-attention) 60%, var(--color-border-default));
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    background: color-mix(in srgb, var(--color-fg-attention) 24%, var(--color-bg-default));
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }
`;
