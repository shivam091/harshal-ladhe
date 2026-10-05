import type { CSSProperties, JSX } from "react";
import PreviewImage from "@/components/OpenGraphPreview/PlatformPreviews/PreviewImage";
import SiteFavicon from "@/components/OpenGraphPreview/PlatformPreviews/SiteFavicon";
import { Clamp, OneLine } from "@/components/OpenGraphPreview/PlatformPreviews/PlatformPreviews.styles";
import { Bubble, BubbleText, BubbleLines, BubbleTitle, BubbleHost } from "@/components/OpenGraphPreview/PlatformPreviews/IMessagePreview.styles";
import type { PlatformPreviewProps } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// iMessage never shows the description — just image, title and domain — and falls back to a favicon row when there's no image.
export default function IMessagePreview({ data }: PlatformPreviewProps): JSX.Element {
  return (
    <>
      <Bubble>
        {data.imageSrc && <PreviewImage src={data.imageSrc} alt={data.imageAlt} aspect="large" />}
        <BubbleText>
          {!data.imageSrc && <SiteFavicon src={data.faviconSrc} />}
          <BubbleLines>
            <BubbleTitle>
              <Clamp style={{ "--lines": 2 } as CSSProperties}>{data.title}</Clamp>
            </BubbleTitle>
            <BubbleHost>
              <OneLine>{data.host || "example.com"}</OneLine>
            </BubbleHost>
          </BubbleLines>
        </BubbleText>
      </Bubble>
    </>
  );
}

IMessagePreview.displayName = "IMessagePreview";
