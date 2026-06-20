import type { JSX } from "react";
import SiteBanner from "@/components/SiteBanner";
import SkyBannerBottom from "@/components/SkyBanners/SkyBannerBottom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Container, PageWrapper } from "@/app/(site)/layout.styles";
import PageViewTracker from "@/components/PageViewTracker";
import FooterDivider from "@/components/FooterDivider";

// Site chrome lives in the (site) group so the root error and 404 pages can render without it.
export default function SiteLayout({ children }: { children: React.ReactNode; }): JSX.Element {
  return (
    <>
      <PageViewTracker />
      <SiteBanner />

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
