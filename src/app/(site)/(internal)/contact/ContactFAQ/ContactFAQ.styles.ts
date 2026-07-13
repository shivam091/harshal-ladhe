import { styled } from "@linaria/react";

// Aside panel in the contact grid — card-styled container for FAQ items.
export const FAQRoot = styled.aside`
  grid-area: contact-questions;
  background: var(--color-bg-cloud-300);
  border-radius: 0.375rem;
  padding: 1rem;
  border: 1px solid var(--color-border-muted);
`;

// FAQ section heading — monospace, letter-spaced for a code-like visual identity.
export const FAQHeading = styled.h2`
  font-size: 1.5rem;
  letter-spacing: 1px;
  margin-block: 0 1rem;
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
  inline-size: 1.5rem;
  block-size: 1.5rem;

  & > svg {
    position: relative;
    z-index: 1;
  }
`;
