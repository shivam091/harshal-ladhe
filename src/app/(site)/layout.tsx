import type { JSX } from "react";
import SiteBanner from "@/components/SiteBanner";
import FestiveBanner from "@/components/FestiveBanner";
import SkyBannerBottom from "@/components/SkyBanners/SkyBannerBottom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageViewTracker from "@/components/PageViewTracker";
import { Container, PageWrapper } from "@/app/(site)/layout.styles";
import FooterDivider from "@/components/FooterDivider";

// Shared layout for every content route — composes banner, container, footer, and bottom sky ornament.
export default function SiteLayout({ children }: { children: React.ReactNode; }): JSX.Element {
  return (
    <>
      <PageViewTracker />
      <SiteBanner />
      <FestiveBanner />

      <Container>
        <PageWrapper>
          <SiteHeader />
          {children}
          <FooterDivider />
          <SiteFooter />
        </PageWrapper>
      </Container>

      <SkyBannerBottom />
    </>
  );
}
