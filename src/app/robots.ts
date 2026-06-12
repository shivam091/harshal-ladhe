// Points crawlers at the sitemap, which the IndexNow workflow also reads to find changed URLs.
import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Required for `output: "export"` — tells Next.js this route is fully static.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/"
    },
    sitemap: `${siteConfig.url}/sitemap.xml`
  };
}
