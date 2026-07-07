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
import AnalyticsProvider from "@/components/AnalyticsProvider";
import NavigationProgress from "@/components/NavigationProgress";
import { themeRule } from "@/utils/color";
import { LIGHT_COLORS_CSS } from "@/constants/themes/light";
import { DARK_COLORS_CSS } from "@/constants/themes/dark";
import { SOFT_DARK_COLORS_CSS } from "@/constants/themes/soft-dark";
import { fontVariables } from "@/styles/fonts";
import "@/styles/main.scss";

// Inlined into <head> so every theme's tokens exist before first paint, with no extra stylesheet request.
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
  manifest: "/manifest.webmanifest",
  verification: siteConfig.verification
};

/**
 * Prevents a flash of the wrong theme. Must be a plain <script> (not next/script)
 * and the first child of <head>: a synchronous inline script placed after a pending
 * render-blocking stylesheet is held until that stylesheet loads, which let the
 * SSR-default light theme paint first on slow connections.
 *
 * "system" is resolved before being written because the CSS only understands
 * concrete themes.
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
})();`;

const GA_ID = siteConfig.analytics.googleMeasurementId;

// Preview and local traffic would pollute the real visitor numbers, so only Vercel production reports to GA.
const IS_GA_ENABLED = process.env.VERCEL_ENV === "production";

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
  return (
    <>
      {/* SSR can't know the reader's theme, so these are placeholders the anti-FOUC script corrects before first paint. */}
      <html
        lang={siteConfig.lang}
        className={fontVariables}
        data-theme="light"
        suppressHydrationWarning={true}
      >
        <head>
          <script id="anti-fouc" dangerouslySetInnerHTML={{ __html: ANTI_FOUC_SCRIPT }} />
          <style dangerouslySetInnerHTML={{ __html: THEMES_CSS }} />

          {IS_GA_ENABLED && (
            <>
              <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
              <Script id="ga-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: GA_SCRIPT }} />
            </>
          )}
        </head>
        <body>

          <BreadcrumbsJsonLd />
          <SkipLink />

          {/*
            reducedMotion="user" makes every Framer Motion animation honour the OS reduced-motion
            setting without each component checking it.
          */}
          <MotionConfig reducedMotion="user">
            <ThemeProvider>
              <AnalyticsProvider>
                {/* Suspense required because usePathname() reads from the router context */}
                <Suspense fallback={null}>
                  <NavigationProgress />
                </Suspense>
                {children}
              </AnalyticsProvider>
            </ThemeProvider>

            <ScrollToTop />
          </MotionConfig>
        </body>
      </html>
    </>
  );
}
