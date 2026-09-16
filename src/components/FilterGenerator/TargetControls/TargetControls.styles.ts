import { styled } from "@linaria/react";

// The switch's own recessed housing — a sunken groove the two rocker halves sit inside, so whichever half is "pressed" reads as sitting lower than the other rather than just a color swap.
export const SwitchHousing = styled.div`
  display: flex;
  gap: 0.125rem;
  padding: 0.1875rem;
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
  box-shadow: inset 0 0.0625rem 0.25rem color-mix(in srgb, var(--color-fg-default) 16%, transparent);
`;

/*
  One rocker half of the two-position switch. At rest it reads as raised (a small cast shadow); the
  active position instead reads as pressed IN — a stronger inset shadow plus a slight downward
  nudge — the same "which side got pushed" read a real rocker switch gives at a glance, rather than
  a plain filled/unfilled segmented-tab swap.
*/
export const SwitchHalf = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
  padding: 0.5rem 0.375rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--color-fg-muted);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  box-shadow: 0 0.0625rem 0 color-mix(in srgb, var(--color-fg-default) 10%, transparent);
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease, box-shadow 150ms ease, transform 150ms ease;

  &[data-selected="true"] {
    color: var(--color-fg-on-emphasis);
    background: var(--color-bg-accent-emphasis);
    border-color: var(--color-bg-accent-emphasis);
    box-shadow: inset 0 0.0625rem 0.1875rem color-mix(in srgb, black 30%, transparent);
    transform: translateY(0.0625rem);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: color 150ms ease, background 150ms ease, box-shadow 150ms ease;
  }
`;

// Tiny caption under a rocker half naming the CSS property it throws — the switch's own engraved legend.
export const SwitchCaption = styled.span`
  font-size: 0.5625rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: none;
  opacity: 0.8;
`;

// Engraved-plaque readout explaining the current throw of the switch — a sunken groove matching ShareControls' own LinkPreview treatment, since both are "read this back to me" text rather than editable chrome.
export const HelperText = styled.p`
  margin: 0;
  padding: 0.5rem 0.625rem;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  box-shadow: inset 0 0.0625rem 0.1875rem color-mix(in srgb, var(--color-fg-default) 12%, transparent);
`;
