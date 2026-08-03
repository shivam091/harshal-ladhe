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
  width: fit-content;

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

// 2×2 named-area grid; collapses to single-column stack on mobile.
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

// Shared base styles for all footer nav sections — interpolated as plain CSS text.
const footerSectionBase = `
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (width > 48rem) {
    justify-content: flex-start;
  }
`;

// Quick-links nav — occupies the "misc" grid area.
export const FooterLinksNav = styled.nav`
  ${footerSectionBase}
  grid-area: misc;
`;

// Legal nav — occupies the "legal" grid area.
export const FooterLegalNav = styled.nav`
  ${footerSectionBase}
  grid-area: legal;
`;

// Social links nav — right-aligned on desktop, centered on mobile.
export const FooterSocialNav = styled.nav`
  ${footerSectionBase}
  grid-area: social;
  gap: 1rem;

  @media (width > 48rem) {
    justify-content: end;
  }
`;

// Credits row — right-aligned on desktop, centered on mobile.
export const FooterCredits = styled.div`
  ${footerSectionBase}
  grid-area: credits;

  @media (width > 48rem) {
    justify-content: end;
  }
`;

// Shared footer link styles — used as className for non-Link elements and composed into FooterLink.
export const footerLinkClass = css`
  color: inherit;
  text-decoration: none;
  padding-block: 0.1875rem;

  &:hover {
    color: var(--color-fg-default);
  }
`;

// Next.js Link with footer link appearance.
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

// Red heart span for the "Built with ♥" credits line.
export const Heart = styled.span`
  color: var(--color-fg-danger);
`;
