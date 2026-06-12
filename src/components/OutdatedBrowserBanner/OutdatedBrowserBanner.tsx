"use client";

import type { JSX } from "react";
import { BROWSER_LABELS, BROWSER_UPDATE_URLS } from "@/constants/browser-support";
import { useOutdatedBrowser } from "@/hooks/use-outdated-browser";
import { Wrapper, Row, Message, CloseButton } from "@/components/OutdatedBrowserBanner/OutdatedBrowserBanner.styles";

// Modern CSS and JS features may misbehave on old browsers, so readers are nudged to update rather than left guessing.
export default function OutdatedBrowserBanner(): JSX.Element | null {
  const { browser, dismiss } = useOutdatedBrowser();

  if (!browser) return null;

  const label = BROWSER_LABELS[browser];

  return (
    <Wrapper role="region" aria-label="Outdated browser notice">
      <Row>
        <Message>
          You’re using an out-of-date version of {label}, so parts of this site may not look or work properly.{" "}
          <a href={BROWSER_UPDATE_URLS[browser]} target="_blank" rel="noopener noreferrer">
            Update {label}
          </a>
        </Message>

        <CloseButton onClose={dismiss} label="Dismiss outdated browser notice" />
      </Row>
    </Wrapper>
  );
}

OutdatedBrowserBanner.displayName = "OutdatedBrowserBanner";
