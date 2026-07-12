import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import Link from "next/link";

// Transparent background so the sky bottom ornament shows through.
export const SiteFooterContainer = styled.footer`
  background: var(--color-bg-transparent);
  color: var(--color-fg-accent-muted);
  font-size: var(--font-size-sm);
  padding: var(--fluid-space-md);
  margin-block-start: var(--space-base);
`;

// 2×2 named-area grid; collapses to single-column stack on mobile.
export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: "misc" "legal" "social" "credits";
  gap: var(--space-md);
  align-items: center;

  @media (width > 48rem) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas: "misc social" "legal credits";
  }
`;

// Shared base styles for all footer nav sections — interpolated as plain CSS text.
const footerSectionBase = `
  display: flex;
  gap: var(--space-base);
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
  gap: var(--space-base);

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
  padding-block: var(--space-xxs);

  &:hover {
    color: var(--color-fg-default);
  }
`;

// Next.js Link with footer link appearance.
export const FooterLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  padding-block: var(--space-xxs);

  &:hover {
    color: var(--color-fg-default);
    text-decoration: none;
  }

  &[aria-current="page"] {
    color: var(--color-fg-default);
    font-weight: var(--font-weight-semi-bold);
  }
`;

// Red heart span for the "Built with ♥" credits line.
export const Heart = styled.span`
  color: var(--color-fg-danger);
`;
