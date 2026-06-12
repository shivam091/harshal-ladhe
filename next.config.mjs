import createMDX from "@next/mdx";
import withLinaria from "next-with-linaria";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV !== "production";

/*
  Enforced: only directives that can't break a third-party integration. A full script/style
  policy can't be enforced on a statically generated Next.js site without 'unsafe-inline' —
  nonces need per-request rendering, and the inline RSC payload changes every build so it
  can't be hashed — which would leave it weak enough not to be worth the breakage risk.
*/
const ENFORCED_CSP = [
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'"
].join("; ");

/*
  Report-only until it has run in production without violations: gtag and the Sandpack
  bundler iframes each pull from hosts that change over time, and an enforced miss would
  silently break analytics or every sandbox.
*/
const REPORT_ONLY_CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://*.google-analytics.com https://*.googletagmanager.com https://www.google.com",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws:" : ""} https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com`,
  "frame-src https://*.codesandbox.io https://*.csb.app",
  "worker-src 'self' blob:",
  "media-src 'self'",
  "manifest-src 'self'",
  // Sandpack's "Open in CodeSandbox" posts a form to codesandbox.io.
  "form-action 'self' https://codesandbox.io",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'"
].join("; ");

const SECURITY_HEADERS = [
  // No includeSubDomains/preload: the site lives on a vercel.app subdomain it doesn't own the parent of.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Still sends the origin cross-site, so referral analytics and the page-view referrer keep working.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Clipboard and fullscreen stay allowed: copy buttons and Sandpack previews use them.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  // Legacy twin of frame-ancestors for browsers that predate CSP level 2.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: ENFORCED_CSP },
  { key: "Content-Security-Policy-Report-Only", value: REPORT_ONLY_CSP }
];

/*
  public/ files aren't fingerprinted, so they get a day of freshness plus a week of background
  revalidation rather than immutable caching; Next already sets immutable on /_next/static.
*/
const PUBLIC_ASSET_CACHE = "public, max-age=86400, stale-while-revalidate=604800";

// Feeds and the search index change only on deploy, so an hour keeps readers and crawlers close to current.
const GENERATED_FILE_CACHE = "public, max-age=3600, stale-while-revalidate=86400";

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Runs every <Link>/router navigation through the View Transitions API so <ViewTransition> boundaries can animate page swaps.
  experimental: {
    viewTransition: true,
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  // fastCheck's heuristic skip was dropping Linaria styles on some routes
  // (error/not-found pages rendered unstyled) — disable it for correctness.
  linaria: {
    fastCheck: false,
  },
  sassOptions: {
    // Lets SCSS files import shared partials by bare name instead of fragile relative paths.
    includePaths: [path.join(__dirname, "src/styles")],
  },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      { source: "/assets/:path*", headers: [{ key: "Cache-Control", value: PUBLIC_ASSET_CACHE }] },
      { source: "/sounds/:path*", headers: [{ key: "Cache-Control", value: PUBLIC_ASSET_CACHE }] },
      ...["/sitemap.xml", "/robots.txt", "/search-index.json", "/manifest.webmanifest"].map((source) => ({
        source,
        headers: [{ key: "Cache-Control", value: GENERATED_FILE_CACHE }]
      }))
    ];
  }
};

// Pass plugin as an absolute path string — Turbopack requires serializable (non-function) loader
// options, and mdx-js-loader resolves string entries via require.resolve at compile time.
const withMDX = createMDX({
  options: {
    remarkPlugins: [path.join(__dirname, "src/lib/remark-git-dates.mjs")],
  },
});
export default withLinaria(withMDX(nextConfig));
