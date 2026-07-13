import { styled } from "@linaria/react";

// Aside panel in the contact grid — card-styled container for FAQ items.
export const FAQRoot = styled.aside`
  grid-area: contact-questions;
  background: var(--color-bg-cloud-300);
  border-radius: var(--border-radius-default);
  padding: var(--space-base);
  border: 1px solid var(--color-border-muted);
`;

// FAQ section heading — monospace, letter-spaced for a code-like visual identity.
export const FAQHeading = styled.h2`
  font-size: var(--font-size-xl);
  letter-spacing: 1px;
  margin-block: var(--space-none) var(--space-base);
  color: var(--color-fg-default);
`;

// Unstyled list wrapper for FAQ entries.
export const FAQList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

// Icon cell — fixed-size grid container that centres the icon within the FAQ item.
export const IconWrapper = styled.span`
  position: relative;
  flex-shrink: 0;
  display: grid;
  place-content: center;
  inline-size: var(--size-lg);
  block-size: var(--size-lg);

  & > svg {
    position: relative;
    z-index: 1;
  }
`;
