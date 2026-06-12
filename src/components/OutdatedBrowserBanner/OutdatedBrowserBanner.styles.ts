import { styled } from "@linaria/react";
import DismissButton from "@/components/DismissButton";

// Sits in normal flow above the page chrome so it pushes content down instead of covering it.
export const Wrapper = styled.div`
  position: relative;
  background: var(--color-bg-attention-muted);
  border-block-end: 0.0625rem solid var(--color-border-attention-emphasis);
  color: var(--color-fg-attention);

  @media print {
    display: none;
  }
`;

// Inline padding reserves room for the close button so the message never runs underneath it.
export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  max-inline-size: clamp(37.5rem, 90%, 75rem);
  margin-inline: auto;
  padding-block: 0.5rem;
  padding-inline: 2.75rem;
  font-size: 0.9375rem;
`;

// Links inherit the banner colour so the update link reads as part of the message.
export const Message = styled.p`
  margin: 0;
  text-align: center;
  font-weight: 600;

  a {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

// Positions the shared DismissButton at the banner's right edge, resetting it to plain inherited chrome.
export const CloseButton = styled(DismissButton)`
  position: absolute;
  inset-block: 0;
  inset-inline-end: 0.5rem;
  display: grid;
  place-content: center;
  padding-inline: 0.5rem;
  margin: 0;
  background: none;
  border: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
`;
