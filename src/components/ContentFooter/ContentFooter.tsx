import { JSX } from "react";
import { defaultLicense } from "@/data/copyright";
import ShareBar from "@/components/ShareBar";
import ContentCopyright from "@/components/ContentCopyright";
import { ContentFooterProps } from "@/interfaces/content-footer";
import { FooterContent } from "@/components/ContentFooter/ContentFooter.styles";

// Composes ContentCopyright and ShareBar side-by-side at the bottom of a content page.
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
