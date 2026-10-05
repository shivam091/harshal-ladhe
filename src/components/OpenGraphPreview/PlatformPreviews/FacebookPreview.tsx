import type { CSSProperties, JSX } from "react";
import PreviewImage from "@/components/OpenGraphPreview/PlatformPreviews/PreviewImage";
import { Clamp, OneLine } from "@/components/OpenGraphPreview/PlatformPreviews/PlatformPreviews.styles";
import { FacebookCard, FacebookText, FacebookHost, FacebookTitle, FacebookDescription } from "@/components/OpenGraphPreview/PlatformPreviews/FacebookPreview.styles";
import type { PlatformPreviewProps } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// Facebook always uses the large 1.91:1 crop for og:image, whatever twitter:card says.
export default function FacebookPreview({ data }: PlatformPreviewProps): JSX.Element {
  return (
    <>
      <FacebookCard>
        {data.imageSrc && <PreviewImage src={data.imageSrc} alt={data.imageAlt} aspect="large" />}
        <FacebookText>
          <FacebookHost>
            <OneLine>{data.host || "example.com"}</OneLine>
          </FacebookHost>
          <FacebookTitle>
            <Clamp style={{ "--lines": 2 } as CSSProperties}>{data.title}</Clamp>
          </FacebookTitle>
          {data.description && (
            <FacebookDescription>
              <OneLine>{data.description}</OneLine>
            </FacebookDescription>
          )}
        </FacebookText>
      </FacebookCard>
    </>
  );
}

FacebookPreview.displayName = "FacebookPreview";
