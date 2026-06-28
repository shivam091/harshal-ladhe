import type { JSX } from "react";
import { defaultLicense } from "@/data/copyright";
import ShareBar from "@/components/ShareBar";
import ContentCopyright from "@/components/ContentCopyright";
import type { ContentFooterProps } from "@/components/ContentFooter/ContentFooter.types";
import { FooterContent } from "@/components/ContentFooter/ContentFooter.styles";

// Pairs licensing with sharing so every content page ends with the same next steps.
export default function ContentFooter({
  title,
  contentLabel = "post",
  license = defaultLicense
}: ContentFooterProps): JSX.Element {
  return (
    <>
      <FooterContent>
        <ContentCopyright license={license} contentLabel={contentLabel} />
        <ShareBar title={title} contentLabel={contentLabel} />
      </FooterContent>
    </>
  );
}

ContentFooter.displayName = "ContentFooter";
