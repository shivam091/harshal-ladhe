import type { CSSProperties, JSX } from "react";
import PreviewImage from "@/components/OpenGraphPreview/PlatformPreviews/PreviewImage";
import SiteFavicon from "@/components/OpenGraphPreview/PlatformPreviews/SiteFavicon";
import { Clamp, OneLine } from "@/components/OpenGraphPreview/PlatformPreviews/PlatformPreviews.styles";
import { SlackUnfurl, SlackText, SlackSite, SlackTitle, SlackThumb, SlackLargeImage } from "@/components/OpenGraphPreview/PlatformPreviews/SlackPreview.styles";
import type { PlatformPreviewProps } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// Slack reads twitter:card to choose between a thumbnail beside the text and a large image beneath it, and clamps long descriptions to a few lines.
export default function SlackPreview({ data }: PlatformPreviewProps): JSX.Element {
  return (
    <>
      <SlackUnfurl style={{ "--accent": data.accentColour } as CSSProperties}>
        <SlackText>
          <SlackSite>
            <SiteFavicon src={data.faviconSrc} />
            <OneLine>{data.siteName || "example.com"}</OneLine>
          </SlackSite>
          <SlackTitle>
            <Clamp style={{ "--lines": 2 } as CSSProperties}>{data.title}</Clamp>
          </SlackTitle>
          {data.description && <Clamp style={{ "--lines": 3 } as CSSProperties}>{data.description}</Clamp>}
        </SlackText>
        {data.imageSrc && !data.isLargeImage && (
          <SlackThumb>
            <PreviewImage src={data.imageSrc} alt={data.imageAlt} aspect="square" />
          </SlackThumb>
        )}
        {data.imageSrc && data.isLargeImage && (
          <SlackLargeImage>
            <PreviewImage src={data.imageSrc} alt={data.imageAlt} aspect="large" />
          </SlackLargeImage>
        )}
      </SlackUnfurl>
    </>
  );
}

SlackPreview.displayName = "SlackPreview";
