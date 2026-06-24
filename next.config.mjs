import createMDX from "@next/mdx";
import withLinaria from "next-with-linaria";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
  webpack: (config) => {
    config.cache = { type: "filesystem" };
    return config;
  }
};

// Pass plugins as absolute path strings — Turbopack requires serialisable (non-function) loader
// options, and mdx-js-loader resolves string entries via require.resolve at compile time.
const withMDX = createMDX({
  options: {
    remarkPlugins: [path.join(__dirname, "src/lib/remark-git-dates.mjs")],
    // Highlighting at build time with CSS-variable token colours lets theming work without client JS.
    rehypePlugins: [path.join(__dirname, "src/lib/shiki/rehype-shiki.mjs")],
  },
});
export default withLinaria(withMDX(nextConfig));
