import type { JSX } from "react";
import { siteConfig } from "@/config/site";
import { stripInlineMarkdown } from "@/utils/markdown";
import { serializeJsonLd } from "@/utils/json-ld";
import { getAbsoluteUrl } from "@/utils/page-url";
import type { ArticleJsonLdProps } from "@/components/ArticleJsonLd/ArticleJsonLd.types";

/*
  Article structured data lets Google show the headline, image, author and real
  updated date in results; optional fields are spread in only when present so the
  schema never carries empty values Google would flag.
*/
export default function ArticleJsonLd({
  type,
  title,
  description,
  url,
  image,
  publishedAt,
  lastModifiedAt,
  tags,
  words,
  series
}: ArticleJsonLdProps): JSX.Element {
  const pageUrl = getAbsoluteUrl(url);
  const wordCount = Number(words) || 0;

  const json = {
    "@context": "https://schema.org",
    "@type": type,
    headline: stripInlineMarkdown(title),
    description: stripInlineMarkdown(description),
    url: pageUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    inLanguage: siteConfig.lang,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url
    },
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: getAbsoluteUrl(image.path),
        width: image.width,
        height: image.height
      }
    }),
    ...(publishedAt && { datePublished: publishedAt }),
    // Falls back to the publish date so Google never sees a modified date missing beside a published one.
    ...((lastModifiedAt || publishedAt) && { dateModified: lastModifiedAt || publishedAt }),
    ...(tags && tags.length > 0 && { keywords: tags.join(", ") }),
    ...(wordCount > 0 && { wordCount }),
    ...(series && {
      isPartOf: {
        "@type": "CreativeWorkSeries",
        name: stripInlineMarkdown(series.title),
        url: getAbsoluteUrl(series.url)
      },
      position: series.index
    })
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

ArticleJsonLd.displayName = "ArticleJsonLd";
