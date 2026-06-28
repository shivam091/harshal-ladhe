"use client";

/*
  SiteBanner — thin "use client" boundary for the full-bleed sky banner.

  Reads usePathname() to decide which banner to render:
    /                           → HeroBanner            (star-field + multi-layer clouds)
    /snippet/*, /post/*, /series/* → SkyBannerTop inner (taller cloud variant for detail pages)
    everything else             → SkyBannerTop          (simpler gradient sky)

  Why a separate component?
    The parent (site)/layout.tsx is a server component. Importing usePathname()
    directly there would force the entire layout into the client bundle.
    This wrapper keeps the "use client" surface area as small as possible.

  Static-export note:
    Next.js SSG-renders client components at build time with the correct path,
    so the initial HTML already contains the right banner — no hydration flash.
*/

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import HeroBanner from "@/components/HeroBanner";
import SkyBannerTop from "@/components/SkyBanners/SkyBannerTop";

// Content-detail path segments that should show the taller inner banner variant.
const INNER_PATH_SEGMENTS = ["/snippet/", "/post/", "/series/"];

// Picks HeroBanner on the homepage and the inner SkyBannerTop variant on content
// detail pages (/snippet/, /post/, /series/), falling back to the default SkyBannerTop.
export default function SiteBanner(): JSX.Element {
  const pathname = usePathname();

  if (pathname === "/") return <HeroBanner />;

  return (
    <>
      <SkyBannerTop inner={INNER_PATH_SEGMENTS.some((seg) => pathname.includes(seg))} />
    </>
  );
}

SiteBanner.displayName = "SiteBanner";
