"use client";

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { buildCrumbs } from "@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd.helpers";
import { stripInlineMarkdown } from "@/utils/markdown";
import { serializeJsonLd } from "@/utils/json-ld";

/*
  Structured breadcrumbs let search results show where a page sits in the site; skipped
  on the home page because a single-item list has no SEO value.
*/
export default function BreadcrumbsJsonLd(): JSX.Element | null {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname);

  if (crumbs.length <= 1) return null;

  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: stripInlineMarkdown(crumb.title),
      item: `${siteConfig.url}${crumb.url}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(json) }}
      />
    </>
  );
}

BreadcrumbsJsonLd.displayName = "BreadcrumbsJsonLd";
