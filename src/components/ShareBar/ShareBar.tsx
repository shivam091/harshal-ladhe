"use client";

import { JSX, useCallback } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { sharePlatforms } from "@/data/share";
import VisuallyHidden from "@/components/VisuallyHidden";
import Tooltip from "@/components/Tooltip";
import CopyLink from "@/components/CopyLink";
import { Icon } from "@/components/Icon";
import { ShareBarProps } from "@/interfaces/share-bar";
import {
  ShareSection,
  ShareIcons,
  ShareLabel,
  ShareLink
} from "@/components/ShareBar/ShareBar.styles";

/*
  Renders a row of platform share links built from sharePlatforms, plus a CopyLink button.
  Each platform link opens in a fixed-size popup (500×500) instead of a full new tab
  so the user stays in context on the originating page.
*/
export default function ShareBar({
  title,
  contentLabel = "post"
}: ShareBarProps): JSX.Element {
  const pathname = usePathname();

  const fullUrl = `${siteConfig.url}${pathname}`;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(fullUrl);

  const headingLabel = `Share this ${contentLabel}`;

  // Opens the share URL in a small popup window rather than a new tab.
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

          {sharePlatforms.map(({ type, icon, buildHref }) => (
            <Tooltip key={type} content={type}>
              <ShareLink
                href={buildHref(encodedTitle, encodedUrl)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Share on ${type} (opens in a pop-up window)`}
                onClick={(e) => {
                  e.preventDefault();
                  openPopup(buildHref(encodedTitle, encodedUrl));
                }}
              >
                <Icon name={icon} size={16} aria-hidden="true" />
              </ShareLink>
            </Tooltip>
          ))}

          <CopyLink url={fullUrl} />
        </ShareIcons>
      </ShareSection>
    </>
  );
}

ShareBar.displayName = "ShareBar";
