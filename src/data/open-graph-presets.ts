import { siteConfig } from "@/config/site";
import type { OpenGraphPresetMeta } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

/*
  Four starting points chosen to exercise the audit differently: a well-formed blog post, a product
  page on a square thumbnail (a summary card, so the size and aspect checks have something to say),
  a deliberately bare page that trips most warnings, and one of this site's own goodie pages exactly
  as buildGoodieMetadata publishes it. Images point at real assets on this site so they actually
  load and measure, rather than at placeholder hosts that would only ever fail.
*/
export const openGraphPresets: OpenGraphPresetMeta[] = [
  {
    slug: "blog-post",
    name: "Blog Post",
    blurb: "Article with a large cover",
    fields: {
      title: "An Interactive Guide to CSS Transitions",
      description: "Master CSS transitions for responsive UI. Learn to use duration, delay, timing-function, and transform for GPU-accelerated performance and smooth micro-interactions.",
      url: `${siteConfig.url}/post/animations/css-transitions-guide`,
      siteName: siteConfig.name,
      imageUrl: `${siteConfig.url}/assets/img/posts/animations/css-transitions-guide/cover.png`,
      imageAlt: "A glowing “Hover me” button with motion trails beside a CSS code panel.",
      twitterCard: "summary_large_image",
      ogType: "article",
      themeColor: "#0969da",
      faviconUrl: `${siteConfig.url}/assets/img/icons/favicon-96x96.png`,
      author: siteConfig.author.name,
      twitterHandle: ""
    }
  },
  {
    slug: "product-page",
    name: "Product Page",
    blurb: "Square summary thumbnail",
    fields: {
      title: "Linen Field Notebook — A5, Dot Grid",
      description: "A lay-flat A5 notebook with 160 pages of 100gsm dot-grid paper, a linen cover, and a ribbon marker. Free delivery on orders over £30.",
      url: "https://shop.example.com/products/linen-field-notebook",
      siteName: "Example Stationery Co.",
      imageUrl: `${siteConfig.url}/assets/img/icons/favicon.png`,
      imageAlt: "The notebook's linen cover, photographed from above.",
      twitterCard: "summary",
      ogType: "product",
      themeColor: "#b45309",
      faviconUrl: `${siteConfig.url}/assets/img/icons/favicon-32x32.png`,
      author: "",
      twitterHandle: "@examplestationery"
    }
  },
  {
    slug: "minimal",
    name: "Minimal",
    blurb: "Bare tags — shows warnings",
    fields: {
      title: "Home",
      description: "",
      url: "/",
      siteName: "",
      imageUrl: "",
      imageAlt: "",
      twitterCard: "",
      ogType: "",
      themeColor: "",
      faviconUrl: "/favicon.ico",
      author: "",
      twitterHandle: ""
    }
  },
  {
    slug: "this-site",
    name: "This Site",
    blurb: "A goodie page, as published",
    fields: {
      title: "Cron Expression Builder",
      description: "Bidirectional cron builder — build a 5-field cron string with per-field widgets, read it back in plain English, and preview its next 5 runs with crontab, GitHub Actions, and Kubernetes export.",
      url: `${siteConfig.url}/goodies/cron-expression-builder`,
      siteName: siteConfig.name,
      imageUrl: `${siteConfig.url}/assets/img/goodies/cron-expression-builder/cover.png`,
      imageAlt: "A dark-themed cover for a Cron Expression Builder, showing a visual schedule editor and a live preview of upcoming run times.",
      twitterCard: "summary_large_image",
      ogType: "website",
      themeColor: "",
      faviconUrl: `${siteConfig.url}/assets/img/icons/favicon-96x96.png`,
      author: "",
      twitterHandle: ""
    }
  }
];
