"use client";

import type { JSX } from "react";
import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { sharePlatforms } from "@/data/share";
import VisuallyHidden from "@/components/VisuallyHidden";
import Tooltip from "@/components/Tooltip";
import CopyLink from "@/components/CopyLink";
import { Icon } from "@/components/Icon";
import {
  ShareSection,
  ShareIcons,
  ShareLabel,
  ShareLink
} from "@/components/ShareBar/ShareBar.styles";
import type { ShareBarProps } from "@/components/ShareBar/ShareBar.types";

// Shares open in a small popup rather than a new tab so the reader stays on the page they're sharing.
export default function ShareBar({ title, contentLabel = "post" }: ShareBarProps): JSX.Element {
  const pathname = usePathname();

  const fullUrl = `${siteConfig.url}${pathname}`;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(fullUrl);

  const headingLabel = `Share this ${contentLabel}`;

  // A named window means repeated shares reuse one popup instead of stacking new ones.
  const openPopup = useCallback((href: string) => {
    window.open(
      href,
      "share-window",
      "left=20,top=20,width=500,height=500,toolbar=1,resizable=0"
    );
  }, []);

  return (
    <>
      <ShareSection aria-labelledby="share-title">
        <VisuallyHidden as="h3" id="share-title">
          {headingLabel}
        </VisuallyHidden>

        <ShareIcons role="group" aria-label={headingLabel}>
          <ShareLabel aria-hidden="true">Share:</ShareLabel>

          {sharePlatforms.map(({ type, icon, buildHref }) => {
            // Computed once per platform per render instead of once for `href` and again inside `onClick`.
            const href = buildHref(encodedTitle, encodedUrl);

            return (
              <Tooltip key={type} content={type}>
                <ShareLink
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Share on ${type} (opens in a pop-up window)`}
                  onClick={(e) => {
                    e.preventDefault();
                    openPopup(href);
                  }}
                >
                  <Icon name={icon} size={16} aria-hidden="true" />
                </ShareLink>
              </Tooltip>
            );
          })}

          <CopyLink url={fullUrl} />
        </ShareIcons>
      </ShareSection>
    </>
  );
}

ShareBar.displayName = "ShareBar";
