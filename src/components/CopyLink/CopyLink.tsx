"use client";

import type { JSX } from "react";
import { useCopyLink } from "@/hooks/use-copy-link";
import Tooltip from "@/components/Tooltip";
import VisuallyHidden from "@/components/VisuallyHidden";
import { LinkIcon, CheckIcon } from "@/components/Icon";
import { ShareButton } from "@/components/ShareBar/ShareBar.styles";
import type { CopyLinkProps } from "@/components/CopyLink/CopyLink.types";

/*
  Icon button that copies a URL to the clipboard. While the copied state is active,
  the icon swaps to a checkmark and the tooltip reads "Copied!" to confirm the action.
  Delegates the copy logic and timeout reset to the useCopyLink hook.
*/
export default function CopyLink({ url }: CopyLinkProps): JSX.Element {
  const { copied, copy } = useCopyLink(url);

  return (
    <>
      <Tooltip content={copied ? "Copied!" : "Copy link"}>
        <ShareButton
          aria-label={copied ? "Link copied!" : "Copy link"}
          data-copied={copied ? "true" : undefined}
          onClick={copy}
        >
          {copied ? (
            <CheckIcon size={16} aria-hidden="true" />
          ) : (
            <LinkIcon size={16} aria-hidden="true" />
          )}
        </ShareButton>
      </Tooltip>

      {/*
        aria-label changes on an already-focused button aren't reliably announced across
        screen readers, so the "copied" confirmation gets its own live region.
      */}
      <VisuallyHidden role="status" aria-live="polite">
        {copied ? "Link copied to clipboard" : ""}
      </VisuallyHidden>
    </>
  );
}

CopyLink.displayName = "CopyLink";
