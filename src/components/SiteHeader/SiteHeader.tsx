/*
  Deliberately a server component: the logo and shell ship as static HTML with
  zero JS, and only the interactive parts pay for hydration inside the client island.
*/
import type { JSX } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import SiteHeaderClient from "@/components/SiteHeader/SiteHeaderClient";
import SiteName from "@/components/SiteHeader/SiteName";
import { Header, LogoLink, logoImageClass } from "@/components/SiteHeader/SiteHeader.styles";

// Keeps the logo out of the client bundle so it paints before hydration finishes.
export default function SiteHeader(): JSX.Element {
  return (
    <>
      <Header>
        <LogoLink href="/" aria-label="Home">
          <Image
            className={logoImageClass}
            src="https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/hl-smiling-face.png"
            alt={siteConfig.author.name}
            width={48}
            height={48}
            priority
          />

          <SiteName />
        </LogoLink>

        {/* The header's only client boundary — anything needing the browser belongs inside it. */}
        <SiteHeaderClient />
      </Header>
    </>
  );
}

SiteHeader.displayName = "SiteHeader";
