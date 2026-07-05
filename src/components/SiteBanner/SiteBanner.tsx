"use client";

/*
  A thin client boundary so reading the pathname doesn't pull the server-rendered layout into the
  client bundle; the static export still renders the right banner per route, so there's no hydration flash.
*/

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import HeroBanner from "@/components/HeroBanner";
import SkyBannerTop from "@/components/SkyBanners/SkyBannerTop";

// Content-detail path segments that should show the taller inner banner variant.
const INNER_PATH_SEGMENTS = ["/snippet/", "/post/", "/series/"];

// Varies the banner by route so only the homepage carries the heavier hero scene.
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
