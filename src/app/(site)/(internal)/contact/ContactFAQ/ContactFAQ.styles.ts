import { styled } from "@linaria/react";

// Card surface sets the FAQ apart from the form as secondary, reference content.
export const FAQRoot = styled.aside`
  grid-area: contact-questions;
  background: var(--color-bg-cloud-300);
  border-radius: 0.375rem;
  padding: 1rem;
  border: 1px solid var(--color-border-muted);
  transition:
    background-color 350ms cubic-bezier(0.41, 0.1, 0.13, 1),
    border-color 350ms cubic-bezier(0.41, 0.1, 0.13, 1);
`;

// Slight letter-spacing gives the heading presence without a larger font size.
export const FAQHeading = styled.h2`
  font-size: 1.5rem;
  letter-spacing: 1px;
  margin-block: 0 1rem;
  color: var(--color-fg-default);
`;

// Keeps list semantics for screen readers while dropping the default bullets and indent.
export const FAQList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

// Fixed size keeps question text aligned while the icon morphs between shapes.
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
