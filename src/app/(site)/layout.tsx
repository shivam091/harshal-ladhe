import { JSX } from "react";
import SiteBanner from "@/components/SiteBanner";
import SkyBannerBottom from "@/components/SkyBanners/SkyBannerBottom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageViewTracker from "@/components/PageViewTracker";
import { Container, PageWrapper } from "@/app/(site)/layout.styles";

// Shared layout for every content route — composes banner, container, footer, and bottom sky ornament.
export default function SiteLayout({ children }: { children: React.ReactNode; }): JSX.Element {
  return (
    <>
      <SiteBanner />

      <Container>
        <PageWrapper>
          <SiteHeader />
          {children}
          <SiteFooter />
        </PageWrapper>
      </Container>

      <SkyBannerBottom />
    </>
  );
}
