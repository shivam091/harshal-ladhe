import type { CSSProperties, JSX } from "react";
import PreviewImage from "@/components/OpenGraphPreview/PlatformPreviews/PreviewImage";
import { Clamp, OneLine } from "@/components/OpenGraphPreview/PlatformPreviews/PlatformPreviews.styles";
import { DiscordEmbed, DiscordText, DiscordSite, DiscordTitle, DiscordThumb, DiscordLargeImage } from "@/components/OpenGraphPreview/PlatformPreviews/DiscordPreview.styles";
import type { PlatformPreviewProps } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// Discord colours the embed's left border from theme-color and, like Slack, reads twitter:card to pick a thumbnail or a full-width image.
export default function DiscordPreview({ data }: PlatformPreviewProps): JSX.Element {
  return (
    <>
      <DiscordEmbed style={{ "--accent": data.accentColour } as CSSProperties}>
        <DiscordText>
          {data.siteName && (
            <DiscordSite>
              <OneLine>{data.siteName}</OneLine>
            </DiscordSite>
          )}
          <DiscordTitle>
            <Clamp style={{ "--lines": 2 } as CSSProperties}>{data.title}</Clamp>
          </DiscordTitle>
          {data.description && <Clamp style={{ "--lines": 4 } as CSSProperties}>{data.description}</Clamp>}
        </DiscordText>
        {data.imageSrc && !data.isLargeImage && (
          <DiscordThumb>
            <PreviewImage src={data.imageSrc} alt={data.imageAlt} aspect="square" />
          </DiscordThumb>
        )}
        {data.imageSrc && data.isLargeImage && (
          <DiscordLargeImage>
            <PreviewImage src={data.imageSrc} alt={data.imageAlt} aspect="large" />
          </DiscordLargeImage>
        )}
      </DiscordEmbed>
    </>
  );
}

DiscordPreview.displayName = "DiscordPreview";
