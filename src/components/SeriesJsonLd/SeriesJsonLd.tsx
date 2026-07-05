import type { JSX } from "react";
import { siteConfig } from "@/config/site";
import { stripInlineMarkdown } from "@/utils/markdown";
import { serializeJsonLd } from "@/utils/json-ld";
import { getAbsoluteUrl } from "@/utils/page-url";
import { getPostUrl } from "@/utils/post-url";
import type { SeriesJsonLdProps } from "@/components/SeriesJsonLd/SeriesJsonLd.types";

/*
  A series page is an index of its parts, not an article, so it's described as a
  CollectionPage with an ordered ItemList — marking it as an article would have it
  compete with the parts it links to.
*/
export default function SeriesJsonLd({
  series,
  posts,
  publishedAt,
  lastModifiedAt
}: SeriesJsonLdProps): JSX.Element {
  const pageUrl = getAbsoluteUrl(`/series/${series.slug}`);

  const json = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": pageUrl,
    name: stripInlineMarkdown(series.title),
    description: stripInlineMarkdown(series.description),
    url: pageUrl,
    inLanguage: siteConfig.lang,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url
    },
    ...(series.image && { image: getAbsoluteUrl(series.image.path) }),
    ...(publishedAt && { datePublished: publishedAt }),
    ...((lastModifiedAt || publishedAt) && { dateModified: lastModifiedAt || publishedAt }),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: stripInlineMarkdown(post.title),
        url: getAbsoluteUrl(getPostUrl(post))
      }))
    }
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

SeriesJsonLd.displayName = "SeriesJsonLd";
