/*
  Header — server component (no "use client").

  The logo and outer <header> element are rendered to static HTML at build
  time and shipped with zero JavaScript. Only the interactive parts (nav
  active state, theme switcher, mobile drawer) live inside HeaderClient,
  which is the sole "use client" boundary for this feature.

  Island architecture:
    <Header>                ← server  (logo + shell)
      <HeaderClient />      ← client  (nav, theme, drawer)
    </Header>
*/
import type { JSX } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import SiteHeaderClient from "@/components/SiteHeader/SiteHeaderClient";
import SiteName from "@/components/SiteHeader/SiteName";
import { Header, LogoLink, logoImageClass } from "@/components/SiteHeader/SiteHeader.styles";

// Static header shell — renders the logo and mounts the interactive client island.
export default function SiteHeader(): JSX.Element {
  return (
    <>
      <Header>
        {/* Logo ── static HTML, zero JS */}
        <LogoLink href="/" aria-label="Home">
          <Image
            className={logoImageClass}
            src="/assets/img/hl-smiling-face.png"
            alt={siteConfig.author.name}
            width={48}
            height={48}
            priority
          />

          <SiteName />
        </LogoLink>

        {/*
        * Everything that needs the browser (usePathname, useState, localStorage)
        * lives here. This is the only JS boundary in the header.
        */}
        <SiteHeaderClient />
      </Header>
    </>
  );
}

SiteHeader.displayName = "SiteHeader";
