"use client";

import type { JSX } from "react";
import { useCopyLink } from "@/hooks/use-copy-link";
import Tooltip from "@/components/Tooltip";
import VisuallyHidden from "@/components/VisuallyHidden";
import { LinkIcon, CheckIcon } from "@/components/Icon";
import { ShareButton } from "@/components/ShareBar/ShareBar.styles";
import type { CopyLinkProps } from "@/components/CopyLink/CopyLink.types";

// Swaps to a checkmark and "Copied!" so the click gets visible confirmation, not a silent clipboard write.
export default function CopyLink({ url }: CopyLinkProps): JSX.Element {
  const { copied, copy } = useCopyLink(url);

  return (
    <>
      <Tooltip content={copied ? "Copied!" : "Copy link"}>
        <ShareButton
          aria-label={copied ? "Link copied!" : "Copy link"}
          data-copied={copied ? "true" : undefined}
          data-analytics-event="share"
          data-analytics-label="Copy link"
          data-analytics-category="engagement"
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
