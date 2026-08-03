import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import Link from "next/link";
import { BREAKPOINTS } from "@/constants/breakpoints";

// Top section — two-column layout: brand/greeting on left, newsletter on right.
export const FooterTop = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  justify-content: space-between;
  padding-block-end: 2rem;
  border-block-end: 1px solid var(--color-border-muted);
  margin-block-end: 1.5rem;

  @media ${BREAKPOINTS.mobile} {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
    text-align: start;
  }
`;

// Left column — stacks logo link and greeting text.
export const FooterBrand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;

  @media ${BREAKPOINTS.mobile} {
    align-items: flex-start;
  }
`;

// Footer logo link — mirrors the header LogoLink appearance.
export const FooterLogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-fg-accent-muted);
  text-decoration-line: none;
  font-weight: 700;
  inline-size: fit-content;

  &:hover {
    @media (hover: hover) {
      color: var(--color-fg-default);
    }
  }
`;

// Right column — newsletter call-to-action and form.
export const FooterNewsletterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  max-inline-size: 420px;

  @media ${BREAKPOINTS.mobile} {
    inline-size: 100%;
  }
`;

// Transparent background so the sky bottom ornament shows through.
export const SiteFooterContainer = styled.footer`
  background: var(--color-bg-transparent);
  color: var(--color-fg-accent-muted);
  font-size: 0.875rem;
  padding: clamp(0.75rem, 1vw, 1rem);
`;

// Named areas let sections move between the mobile stack and the desktop 2×2 without reordering markup.
export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: "misc" "legal" "social" "credits";
  gap: 0.75rem;
  align-items: center;

  @media (width > 48rem) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas: "misc social" "legal credits";
  }
`;

// A plain string rather than a class so it can be interpolated into each styled section.
const footerSectionBase = `
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (width > 48rem) {
    justify-content: flex-start;
  }
`;

// Separate from the legal nav so each group can land in its own grid area.
export const FooterLinksNav = styled.nav`
  ${footerSectionBase}
  grid-area: misc;
`;

// Kept apart from quick links so legal pages read as a distinct group.
export const FooterLegalNav = styled.nav`
  ${footerSectionBase}
  grid-area: legal;
`;

// Right-aligned on desktop to balance the left-hand link groups.
export const FooterSocialNav = styled.nav`
  ${footerSectionBase}
  grid-area: social;
  gap: 1rem;

  @media (width > 48rem) {
    justify-content: end;
  }
`;

// Right-aligned on desktop to line up under the social links.
export const FooterCredits = styled.div`
  ${footerSectionBase}
  grid-area: credits;

  @media (width > 48rem) {
    justify-content: end;
  }
`;

// A class rather than a styled component so plain anchors and buttons can share the footer link look.
export const footerLinkClass = css`
  color: inherit;
  text-decoration: none;
  padding-block: 0.1875rem;

  &:hover {
    color: var(--color-fg-default);
  }
`;

// Client-side navigation for internal links, with aria-current marking the page you're on.
export const FooterLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  padding-block: 0.1875rem;

  &:hover {
    color: var(--color-fg-default);
    text-decoration: none;
  }

  &[aria-current="page"] {
    color: var(--color-fg-default);
    font-weight: 600;
  }
`;

// Tinted so the heart stands out from the muted credits text.
export const Heart = styled.span`
  color: var(--color-fg-danger);
`;
