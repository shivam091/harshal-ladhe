/// <reference types="react/canary" />
import type { JSX } from "react";
import { ViewTransition } from "react";
import SiteBanner from "@/components/SiteBanner";
import FestiveBanner from "@/components/FestiveBanner";
import SkyBannerBottom from "@/components/SkyBanners/SkyBannerBottom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Container, PageWrapper } from "@/app/(site)/layout.styles";
import PageViewTracker from "@/components/PageViewTracker";
import FooterDivider from "@/components/FooterDivider";
import ConnectivityBanner from "@/components/ConnectivityBanner";
import OutdatedBrowserBanner from "@/components/OutdatedBrowserBanner";

// Site chrome lives in the (site) group so the root error and 404 pages can render without it.
export default function SiteLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      <PageViewTracker />
      <OutdatedBrowserBanner />
      <SiteBanner />
      <FestiveBanner />

      <Container>
        <PageWrapper>
          <SiteHeader />
          {/* Only page content animates on navigation; the chrome around it stays put (tuned in _view-transitions.scss). */}
          <ViewTransition name="page-content">
            {children}
          </ViewTransition>
          <FooterDivider />
          <SiteFooter />
        </PageWrapper>
      </Container>

      <SkyBannerBottom />
      <ConnectivityBanner />
    </>
  );
}
