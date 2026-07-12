"use client";

import type { JSX} from "react";
import { useEffect } from "react";
import { EmojiSadIcon } from "@/components/Icon";
import Button from "@/components/Button";
import FlashlightOverlay from "@/components/FlashlightOverlay";
import { siteConfig } from "@/config/site";
import { ErrorWrapper, ErrorIconCircle, ErrorHeading, ErrorMessage, ErrorButtonRow, ErrorPage } from "@/app/error-page.styles";

// Last-resort boundary so a render crash still leaves the reader a way to retry or get home instead of a blank page.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }): JSX.Element {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // Client boundaries can't export `metadata`, so the tab/AT title would otherwise stay stuck on whatever page errored.
  useEffect(() => {
    document.title = `Something Went Wrong | ${siteConfig.name}`;
  }, []);

  return (
    <>
      <FlashlightOverlay showToggle />
      <ErrorWrapper
        id="main-content"
        tabIndex={-1}
        className={(ErrorPage as unknown as { __wyw_meta?: { className?: string } }).__wyw_meta?.className}
      >
        <ErrorIconCircle>
          <EmojiSadIcon size={96} />
        </ErrorIconCircle>

        <ErrorHeading>
          Something Went Wrong
        </ErrorHeading>

        <ErrorMessage>
          An unexpected error occurred while rendering this page.
          Try again, or head back home.
        </ErrorMessage>

        <ErrorButtonRow>
          <Button intent="danger" onClick={() => reset()}>
            Try again
          </Button>

          <Button variant="outlined" href="/">
            Go Home
          </Button>
        </ErrorButtonRow>
      </ErrorWrapper>
    </>
  );
}
