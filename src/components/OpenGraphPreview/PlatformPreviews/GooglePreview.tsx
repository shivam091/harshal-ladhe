import type { JSX } from "react";
import SiteFavicon from "@/components/OpenGraphPreview/PlatformPreviews/SiteFavicon";
import { OneLine } from "@/components/OpenGraphPreview/PlatformPreviews/PlatformPreviews.styles";
import { GOOGLE_SNIPPET_MAX_CHARS, GOOGLE_TITLE_MAX_CHARS, truncateAtWord } from "@/utils/open-graph-text";
import { ResultHeader, FaviconChip, ResultSource, SiteName, Breadcrumb, ResultTitle, Snippet } from "@/components/OpenGraphPreview/PlatformPreviews/GooglePreview.styles";
import type { PlatformPreviewProps } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// Google reads <title> and the meta description, not Open Graph — and trims with " ..." rather than a single ellipsis character, so the preview does too.
export default function GooglePreview({ data }: PlatformPreviewProps): JSX.Element {
  return (
    <>
      <ResultHeader>
        <FaviconChip>
          <SiteFavicon src={data.faviconSrc} />
        </FaviconChip>
        <ResultSource>
          <SiteName>
            <OneLine>{data.siteName || "example.com"}</OneLine>
          </SiteName>
          <Breadcrumb>
            <OneLine>{data.breadcrumb || "https://example.com"}</OneLine>
          </Breadcrumb>
        </ResultSource>
      </ResultHeader>
      <ResultTitle>{truncateAtWord(data.title, GOOGLE_TITLE_MAX_CHARS, " ...")}</ResultTitle>
      {data.description ? (
        <Snippet>{truncateAtWord(data.description, GOOGLE_SNIPPET_MAX_CHARS, " ...")}</Snippet>
      ) : (
        <Snippet data-empty="true">No description — Google would pull a snippet from the page text instead.</Snippet>
      )}
    </>
  );
}

GooglePreview.displayName = "GooglePreview";
