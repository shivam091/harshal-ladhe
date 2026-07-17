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
  Full-width panel pinned to the top of the viewport. Applied as a className to a `motion.div`
  (see SearchModal.tsx) — matches the drawer's css+motion pairing.

  The entrance is a springy slide that's allowed to overshoot slightly past y:0 before
  settling (see the spring transition in SearchModal.tsx) — --extend-by pads the panel
  upward past the edge of the viewport with matching background + a matching negative
  margin, so that overshoot never reveals a gap of page content above the panel.

  Background + text colour both come from the active theme's own sky/cloud + foreground
  tokens (var(--color-bg-cloud-500) / var(--color-fg-default)) rather than being forced to
  light theme — those two are already designed as a matching pair per theme (dark theme's
  cloud-500 is a dark navy paired with a light foreground, same relationship light theme
  uses in reverse), so the panel just reads as "part of the sky" in every theme, legibly.

  Capped well under full viewport height (see max-height below) so there's always page
  visible beneath it — that's what CloudBottom sits in, anchored to the panel's bottom edge.
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
  Desktop-only dismiss button — positioning-only overrides, combined with headerActionClass
  (imported above) so the button is pixel-identical, chrome and all, to the header's own
  action buttons. Applied to the shared DismissButton component (see Search.tsx), which
  presses/boops exactly like the header hamburger's own "open" state.
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
