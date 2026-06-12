import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import DismissButton from "@/components/DismissButton";

/*
  Fixed and centred at the bottom so it never shifts page layout; clicks pass through the empty space
  around the pill, and the safe-area inset keeps it clear of the iOS home indicator.
*/
export const Wrapper = styled.div`
  position: fixed;
  inset-block-end: calc(1rem + env(safe-area-inset-bottom, 0px));
  inset-inline: 1rem;
  z-index: 1001;
  display: flex;
  justify-content: center;
  pointer-events: none;

  @media print {
    display: none;
  }
`;

// Danger by default, success once reconnected — keyed off data-status so both messages share one set of rules.
export const bannerClass = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-block: 0.375rem;
  padding-inline: 0.875rem 0.375rem;
  border: 0.0625rem solid var(--color-border-danger-emphasis);
  border-radius: 999px;
  background: var(--color-bg-danger-muted);
  color: var(--color-fg-danger);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
  box-shadow: 0 0.25rem 1rem hsl(0deg 0% 0% / 0.15);
  backdrop-filter: blur(8px);
  /* Re-enabled here only, so the dismiss button works while the space around the pill stays click-through. */
  pointer-events: auto;

  svg {
    flex-shrink: 0;
  }

  &[data-status="online"] {
    border-color: var(--color-border-success-emphasis);
    background: var(--color-bg-success-muted);
    color: var(--color-fg-success);
  }
`;

// A paragraph so the message reads as prose to assistive tech browsing the page.
export const Message = styled.p`
  margin: 0;
`;

// Stripped to bare inherited chrome so the ✕ always matches the status colour instead of fighting it.
export const CloseButton = styled(DismissButton)`
  display: grid;
  place-content: center;
  flex-shrink: 0;
  padding: 0.25rem;
  margin: 0;
  background: none;
  border: none;
  border-radius: 50%;
  font: inherit;
  color: inherit;
  cursor: pointer;
`;
