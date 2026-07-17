import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import { BREAKPOINTS } from "@/constants/breakpoints";
import CloudBottom from "@/components/Search/CloudBottom";

export { headerActionClass } from "@/components/SiteHeader/SiteHeaderClient.styles";

// Dimmed backdrop behind the panel — click dismisses, same as clicking outside any modal.
export const overlayClass = css`
  position: fixed;
  inset: 0;
  z-index: 1001;
  background-color: hsl(0deg 0% 0% / 0.4);
`;

/*
  --extend-by pads the panel above the viewport so the springy entrance can overshoot without
  revealing page content above it. Colours come from the theme's paired cloud and foreground
  tokens so the panel reads as part of the sky, legibly, in every theme; the height cap leaves
  page visible beneath it for the cloud to sit in.
*/
export const panelClass = css`
  --extend-by: 4rem;
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  z-index: 1002;
  display: flex;
  flex-direction: column;
  max-block-size: calc(min(85vh, 40rem) + var(--extend-by));
  max-block-size: calc(min(85svh, 40rem) + var(--extend-by));
  padding-block-start: var(--extend-by);
  margin-block-start: calc(var(--extend-by) * -1);
  background: var(--color-bg-cloud-500);
  color: var(--color-fg-default);
  box-shadow: var(--box-shadow-md);
`;

// Inner content column — constrained to a comfortable reading width and centered.
export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  inline-size: 100%;
  max-inline-size: 43rem;
  margin-inline: auto;
  padding-block: 2rem;
  padding-inline: clamp(1rem, 1.25vw, 1.5rem);
  min-block-size: 14rem;
  overflow: hidden;
`;

/*
  Positioning only, combined with the header's action-button class so the dismiss button
  matches the header buttons exactly.
*/
export const desktopCloseButtonClass = css`
  position: absolute;
  inset-block-start: calc(var(--extend-by) + 0.75rem);
  inset-inline-end: 0.75rem;
  z-index: 1;

  @media ${BREAKPOINTS.mobile} {
    display: none;
  }
`;

// Decorative cloud anchored to the panel's bottom edge, sitting behind its content.
export const StyledCloud = styled(CloudBottom)`
  position: absolute;
  z-index: -1;
  inset-inline: 0;
  inset-block-end: 0;
  inline-size: 100%;
  transform: translateY(calc(100% - 2px));
`;
