import type { CSSProperties, JSX } from "react";
import PreviewImage from "@/components/OpenGraphPreview/PlatformPreviews/PreviewImage";
import { Clamp, OneLine } from "@/components/OpenGraphPreview/PlatformPreviews/PlatformPreviews.styles";
import { XCard, TitleChip, FromLine, SummaryText, Muted } from "@/components/OpenGraphPreview/PlatformPreviews/XPreview.styles";
import type { PlatformPreviewProps } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// Switches layout on twitter:card exactly as X does — summary_large_image gets the 1.91:1 image with an overlaid title, anything else the square-thumbnail summary.
export default function XPreview({ data }: PlatformPreviewProps): JSX.Element {
  if (data.isLargeImage) {
    return (
      <>
        <XCard>
          <PreviewImage src={data.imageSrc} alt={data.imageAlt} aspect="large">
            <TitleChip>{data.title}</TitleChip>
          </PreviewImage>
        </XCard>
        {data.host && <FromLine>From {data.host}</FromLine>}
      </>
    );
  }

  return (
    <>
      <XCard data-layout="summary">
        <PreviewImage src={data.imageSrc} alt={data.imageAlt} aspect="square" />
        <SummaryText>
          <Muted>
            <OneLine>{data.host || "example.com"}</OneLine>
          </Muted>
          <OneLine>{data.title}</OneLine>
          {data.description && (
            <Muted>
              <Clamp style={{ "--lines": 2 } as CSSProperties}>{data.description}</Clamp>
            </Muted>
          )}
        </SummaryText>
      </XCard>
    </>
  );
}

XPreview.displayName = "XPreview";
