import { JSX, type ReactNode } from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import SkipLink from "@/components/SkipLink";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "@/context/ThemeContext";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import { themeRule } from "@/utils/color";
import { LIGHT_COLORS_CSS } from "@/constants/themes/light";
import { DARK_COLORS_CSS } from "@/constants/themes/dark";
import { SOFT_DARK_COLORS_CSS } from "@/constants/themes/soft-dark";
import "@/styles/main.scss";
import Script from "next/script";

// All three color-scheme themes as a single CSS string, injected into <head>.
const THEMES_CSS = [
  themeRule(":root, [data-theme='light']", "light", LIGHT_COLORS_CSS),
  themeRule("[data-theme='dark']",         "dark",  DARK_COLORS_CSS),
  themeRule("[data-theme='soft-dark']",    "dark",  SOFT_DARK_COLORS_CSS),
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
 * Runs synchronously as the very first child of <body> so the browser applies
 * the correct theme before painting anything — zero flash on every page load.
 *
 * "system" is stored as a preference but always resolved to a concrete theme
 * before being written to data-theme, because the CSS only understands
 * "light" | "dark" | "soft-dark" — not "system".
 */
const ANTI_FOUC_SCRIPT = `(function() {
  try {
    var saved = localStorage.getItem("saved-color-theme") || "system";
    var resolved = saved;
    if (saved === "system") {
      resolved = window.matchMedia("(prefers-color-scheme:dark)").matches
        ? "dark"
        : "light";
    }
    document.documentElement.setAttribute("data-theme", resolved);
  } catch (e) {}
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
      {/* data-theme="light" is the SSR default; ANTI_FOUC_SCRIPT overwrites it on frame 0 with the saved preference. */}
      <html
        lang={siteConfig.lang}
        data-theme="light"
        suppressHydrationWarning={true}
      >
        <head>
          {isGoogleFont && (
            <>
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </>
          )}
          <link rel="stylesheet" href={siteConfig.font_url} />

          <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: GA_SCRIPT }} />
          <Script id="anti-fouc" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: ANTI_FOUC_SCRIPT }} />
          <style dangerouslySetInnerHTML={{ __html: THEMES_CSS }} />
        </head>
        <body>

          <SkipLink />

          <ThemeProvider>
            <AnalyticsProvider>
              {children}
            </AnalyticsProvider>
          </ThemeProvider>

          <ScrollToTop />
        </body>
      </html>
    </>
  );
}
