import type { JSX } from "react";
import type { ContentCopyrightProps } from "@/interfaces/content-copyright";
import { CopyrightWrapper } from "@/components/ContentCopyright/ContentCopyright.styles";

/*
  Renders a one-line license attribution. When the license has a URL it becomes
  a link that opens in a new tab; otherwise the name is wrapped in a plain span.
*/
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
