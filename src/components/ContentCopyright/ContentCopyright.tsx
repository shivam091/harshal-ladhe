import type { JSX } from "react";
import type { ContentCopyrightProps } from "@/components/ContentCopyright/ContentCopyright.types";
import { CopyrightWrapper } from "@/components/ContentCopyright/ContentCopyright.styles";

// Makes reuse terms explicit on every content page; licences without a URL are still named, just unlinked.
export default function ContentCopyright({
  license,
  contentLabel = "post"
}: ContentCopyrightProps): JSX.Element {
  return (
    <>
      <CopyrightWrapper>
        This {contentLabel} is licensed under{" "}
        {license.url ? (
          <a href={license.url} target="_blank" rel="noopener noreferrer" aria-label={`${license.name} (opens in new tab)`}>
            {license.name}
          </a>
        ) : (
          <span>{license.name}</span>
        )}{" "}
        by the author.
      </CopyrightWrapper>
    </>
  );
}

ContentCopyright.displayName = "ContentCopyright";
