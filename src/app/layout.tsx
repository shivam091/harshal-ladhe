import type { JSX} from "react";
import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { MotionConfig } from "motion/react";
import { siteConfig } from "@/config/site";
import SkipLink from "@/components/SkipLink";
import ScrollToTop from "@/components/ScrollToTop";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import { ThemeProvider } from "@/context/ThemeContext";
import { SoundProvider } from "@/context/SoundContext";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import NavigationProgress from "@/components/NavigationProgress";
import { themeRule } from "@/utils/color";
import { LIGHT_COLORS_CSS } from "@/constants/themes/light";
import { DARK_COLORS_CSS } from "@/constants/themes/dark";
import { SOFT_DARK_COLORS_CSS } from "@/constants/themes/soft-dark";
import "@/styles/main.scss";

// All three color-scheme themes as a single CSS string, injected into <head>.
const THEMES_CSS = [
  themeRule(":root, [data-theme='light']", "light", LIGHT_COLORS_CSS),
  themeRule("[data-theme='dark']",         "dark",  DARK_COLORS_CSS),
  themeRule("[data-theme='soft-dark']",    "dark",  SOFT_DARK_COLORS_CSS)
].join("\n");

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website"
  },
  icons: {
    icon: [
      { url: "/assets/img/icons/favicon.png" },
      { url: "/assets/img/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/img/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/img/icons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/assets/img/icons/android-icon-192x192.png", sizes: "192x192", type: "image/png" }
    ],
    apple: [
      { url: "/assets/img/icons/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/assets/img/icons/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/assets/img/icons/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/assets/img/icons/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/assets/img/icons/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/assets/img/icons/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/assets/img/icons/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/assets/img/icons/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/assets/img/icons/apple-icon-180x180.png", sizes: "180x180", type: "image/png" }
    ]
  },
  manifest: "/assets/img/icons/manifest.json",
  verification: siteConfig.verification
};

/**
 * Anti-FOUC (Flash of Unstyled Content) script.
 *
 * Rendered as a plain <script> — not next/script — as the very first child of
 * <head>, ahead of the font stylesheet <link>. A synchronous inline script
 * placed after a pending render-blocking stylesheet is held by the browser
 * until that stylesheet finishes loading, which let the SSR-default
 * data-theme="light" paint first on slow connections; being first in <head>
 * guarantees this runs — and data-theme is corrected — before first paint.
 *
 * Also toggles the "no-transition" class on <html> around that correction so
 * the body background/color transition (src/styles/layout/_base.scss) never
 * plays on initial load, only on user-triggered theme toggles later.
 *
 * "system" is stored as a preference but always resolved to a concrete theme
 * before being written to data-theme, because the CSS only understands
 * "light" | "dark" | "soft-dark" — not "system".
 */
const ANTI_FOUC_SCRIPT = `(function() {
  var root = document.documentElement;
  try {
    var saved = localStorage.getItem("saved-color-theme") || "system";
    var resolved = saved;
    if (saved === "system") {
      resolved = window.matchMedia("(prefers-color-scheme:dark)").matches
        ? "dark"
        : "light";
    }
    root.setAttribute("data-theme", resolved);
  } catch (e) {}
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      root.classList.remove("no-transition");
    });
  });
})();`;

const GA_ID = siteConfig.analytics.googleMeasurementId;

const GA_SCRIPT = `
  window.dataLayer = window.dataLayer || [];
  function gtag () {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "${GA_ID}");
`;

export default function RootLayout({
  children
}: Readonly<{ children: ReactNode }>): JSX.Element {
  const isGoogleFont = siteConfig.font_url.includes("fonts.googleapis.com");

  return (
    <>
      {/*
        data-theme="light" + "no-transition" are the SSR defaults; ANTI_FOUC_SCRIPT
        (first thing in <head>, ahead of the font stylesheet) overwrites data-theme
        before first paint and drops "no-transition" a couple of frames later.
      */}
      <html
        lang={siteConfig.lang}
        data-theme="light"
        className="no-transition"
        suppressHydrationWarning={true}
      >
        <head>
          <script id="anti-fouc" dangerouslySetInnerHTML={{ __html: ANTI_FOUC_SCRIPT }} />
          <style dangerouslySetInnerHTML={{ __html: THEMES_CSS }} />

          {isGoogleFont && (
            <>
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </>
          )}
          <link rel="stylesheet" href={siteConfig.font_url} />

          <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: GA_SCRIPT }} />
        </head>
        <body>

          <BreadcrumbsJsonLd />
          <SkipLink />

          {/*
            reducedMotion="user" makes every Framer Motion animation in the app (Drawer,
            Details, CategoryAccordion, …) automatically honor the OS-level
            prefers-reduced-motion setting, without each component checking it manually.
          */}
          <MotionConfig reducedMotion="user">
            <ThemeProvider>
              <SoundProvider>
                <AnalyticsProvider>
                  {/*
                   * Suspense required because usePathname() reads from the router context.
                   * The top progress bar always shows; `overlay` (default false) opts into the
                   * extra centred loader, whose visual is picked by `loader` — "rings" | "logo" |
                   * "dots" | "blob" | "wave" | "typewriter" | "bounce" | "burst" — and whose
                   * frosted pill can be turned off with `backdrop={false}`.
                   */}
                  <Suspense fallback={null}>
                    <NavigationProgress loader="blob" />
                  </Suspense>
                  {children}
                </AnalyticsProvider>
              </SoundProvider>
            </ThemeProvider>

            <ScrollToTop />
          </MotionConfig>
        </body>
      </html>
    </>
  );
}
