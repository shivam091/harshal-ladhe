"use client";

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { quickLinks, legalLinks, socialLinks } from "@/data/navigation";
import { Icon } from "@/components/Icon";
import IconRssLink from "@/icons/IconRssLink";
import IconFileLink from "@/icons/IconFileLink";
import IconEnvelopeLink from "@/icons/IconEnvelopeLink";
import VisuallyHidden from "@/components/VisuallyHidden";
import {
  Heart,
  FooterGrid,
  FooterLink,
  FooterCredits,
  FooterLinksNav,
  FooterLegalNav,
  FooterSocialNav,
  SiteFooterContainer,
  footerLinkClass
} from "@/components/SiteFooter/SiteFooter.styles";

// Keeps secondary destinations, profiles and legal pages reachable from every page without crowding the header.
export default function Footer(): JSX.Element {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  // Collapses to a single year in the launch year so the range never reads "2026–2026".
  const copyrightYear =
    currentYear > siteConfig.foundedYear
      ? `${siteConfig.foundedYear}–present`
      : `${siteConfig.foundedYear}`;

  return (
    <>
      <SiteFooterContainer aria-label="Site footer">
        <FooterGrid>

          <FooterLinksNav aria-label="Quick links">
            {quickLinks.map(({ title, href }) => (
              <FooterLink key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{title}</FooterLink>
            ))}
          </FooterLinksNav>

          <FooterSocialNav aria-label="Social links">
            {/* Unconfigured links (e.g. no resume yet) are skipped rather than rendered dead. */}
            {socialLinks.filter(link => link.href).map((link) => {
              const { type, label, href, icon, external, analytics } = link;

              if (type === "atom") {
                return (
                  <IconRssLink
                    key={href}
                    href={href}
                    label={label}
                    size={18}
                    className={footerLinkClass}
                    analytics={analytics}
                  />
                );
              }

              if (type === "resume") {
                return (
                  <IconFileLink
                    key={href}
                    href={href}
                    label={label}
                    size={18}
                    className={footerLinkClass}
                    external={external}
                    analytics={analytics}
                  />
                );
              }

              if (type === "email") {
                return (
                  <IconEnvelopeLink
                    key={href}
                    href={href}
                    label={label}
                    size={18}
                    className={footerLinkClass}
                    analytics={analytics}
                  />
                );
              }

              return (
                <FooterLink
                  key={href}
                  href={href}
                  aria-label={external ? `${label} (opens in new tab)` : label}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  {...(analytics ? {
                    "data-analytics-event":    analytics.event,
                    "data-analytics-label":    analytics.label,
                    "data-analytics-category": analytics.category
                  } : {})}
                >
                  <Icon name={icon} size={18} aria-hidden="true" focusable={false} />
                </FooterLink>
              );
            })}
          </FooterSocialNav>

          <FooterLegalNav aria-label="Legal links">
            {legalLinks.map(({ title, href }) => (
              <FooterLink key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{title}</FooterLink>
            ))}
          </FooterLegalNav>

          <FooterCredits>
            <span>
              © {copyrightYear}{" "}
              <strong>{siteConfig.name}</strong>.{" "}
              All Rights Reserved.
              Built with{" "}
              <Heart aria-hidden="true">♥</Heart>
              <VisuallyHidden>love</VisuallyHidden>
              {" and "}
              <FooterLink
                href="https://nextjs.org/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Next.js (opens in new tab)"
              >
                Next.js
              </FooterLink>
              .
            </span>
          </FooterCredits>
        </FooterGrid>
      </SiteFooterContainer>
    </>
  );
}

Footer.displayName = "Footer";
