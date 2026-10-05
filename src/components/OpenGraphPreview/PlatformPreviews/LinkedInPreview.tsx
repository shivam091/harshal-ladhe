import type { CSSProperties, JSX } from "react";
import PreviewImage from "@/components/OpenGraphPreview/PlatformPreviews/PreviewImage";
import { Clamp, OneLine } from "@/components/OpenGraphPreview/PlatformPreviews/PlatformPreviews.styles";
import { LinkedInCard, LinkedInText, LinkedInTitle, LinkedInHost } from "@/components/OpenGraphPreview/PlatformPreviews/LinkedInPreview.styles";
import type { PlatformPreviewProps } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// LinkedIn ignores twitter:card and always shows a large 1.91:1 image when one exists.
export default function LinkedInPreview({ data }: PlatformPreviewProps): JSX.Element {
  return (
    <>
      <LinkedInCard>
        {data.imageSrc && <PreviewImage src={data.imageSrc} alt={data.imageAlt} aspect="large" />}
        <LinkedInText>
          <LinkedInTitle>
            <Clamp style={{ "--lines": 2 } as CSSProperties}>{data.title}</Clamp>
          </LinkedInTitle>
          <LinkedInHost>
            <OneLine>{data.host || "example.com"}</OneLine>
          </LinkedInHost>
        </LinkedInText>
      </LinkedInCard>
    </>
  );
}

LinkedInPreview.displayName = "LinkedInPreview";
