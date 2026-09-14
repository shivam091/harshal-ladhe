import { styled } from "@linaria/react";
import { BREAKPOINTS } from "@/constants/breakpoints";
import DismissButton from "@/components/DismissButton";

// Multi-hue wish text feels celebratory; the deep stops keep every letter legible on the banner.
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

// Background clipped to the content box so the bottom padding stays clear for the scalloped edge.
export const Wrapper = styled.div`
  position: relative;
  background: var(--color-bg-festive-banner);
  background-clip: content-box;
  color: var(--color-fg-festive-banner);
  padding-block-end: 15px;
`;

// Fills that bottom padding so the banner ends in a festive scallop rather than a flat edge.
export const Zigzag = styled.div`
  position: absolute;
  inset-block-end: 0;
  inset-inline: 0;
  block-size: 15px;
`;

// Inline padding reserves room for the close button so the wish never runs underneath it.
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

// Links inherit the banner colour so an occasion link reads as part of the wish.
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

// Clipped to the glyphs so the gradient paints the letters; the shadow lifts them off the banner.
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
