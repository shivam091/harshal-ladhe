import { styled } from "@linaria/react";
import { BREAKPOINTS } from "@/constants/breakpoints";
import DismissButton from "@/components/DismissButton";

// Rainbow gradient for the wish text.
const FESTIVE_BANNER_TEXT_GRADIENT = `linear-gradient(
  90deg,
  hsl(350deg 80% 38%),
  hsl(25deg 80% 34%),
  hsl(50deg 90% 18%),
  hsl(150deg 75% 20%),
  hsl(210deg 80% 38%),
  hsl(240deg 75% 40%),
  hsl(260deg 70% 40%),
  hsl(300deg 75% 38%)
)`;

// Banner container.
export const Wrapper = styled.div`
  position: relative;
  background: var(--color-bg-festive-banner);
  background-clip: content-box;
  color: var(--color-fg-festive-banner);
  padding-block-end: 15px;
`;

// Bottom scalloped strip.
export const Zigzag = styled.div`
  position: absolute;
  inset-block-end: 0;
  inset-inline: 0;
  block-size: 15px;
`;

// Content row.
export const Row = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 100%;
  max-inline-size: clamp(37.5rem, 90%, 75rem);
  margin-inline: auto;
  padding-inline: 2.75rem;
  padding-block-start: 0.5rem;
  font-size: 0.9375rem;
`;

// Wish text container.
export const Message = styled.p`
  margin: 0;
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.02em;

  a {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

// Gradient-filled wish text.
export const WishText = styled.span`
  background: ${FESTIVE_BANNER_TEXT_GRADIENT};
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
`;

// Positions the shared DismissButton at the banner's right edge, resetting it to plain inherited chrome.
export const CloseButton = styled(DismissButton)`
  position: absolute;
  inset-block: 0;
  inset-inline-end: 0.5rem;
  display: grid;
  place-content: center;
  padding-inline: 0.5rem;
  padding-block-start: .5rem;
  margin: 0;
  background: none;
  border: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
`;
