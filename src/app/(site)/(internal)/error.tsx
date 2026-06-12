"use client";

import type { JSX} from "react";
import { useEffect } from "react";
import { EmojiSadIcon } from "@/components/Icon";
import Button from "@/components/Button";
import { siteConfig } from "@/config/site";
import { ErrorWrapper, IconCircle, Heading, Message, ButtonRow } from "./error.styles";

// Segment-level boundary so a content crash keeps header, footer, and PageHeading mounted and the reader oriented.
export default function InternalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // Client boundaries can't export `metadata`, so the tab/AT title would otherwise stay stuck on whatever page errored.
  useEffect(() => {
    document.title = `This Page Couldn't Load | ${siteConfig.name}`;
  }, []);

  return (
    <>
      <ErrorWrapper>
        <IconCircle>
          <EmojiSadIcon size={64} />
        </IconCircle>

        <Heading>
          This Page Couldn&apos;t Load
        </Heading>

        <Message>
          Something went wrong while rendering this content. Try again, or head back home.
        </Message>

        <ButtonRow>
          <Button intent="danger" onClick={() => reset()}>
            Try again
          </Button>

          <Button variant="outlined" href="/">
            Go Home
          </Button>
        </ButtonRow>
      </ErrorWrapper>
    </>
  );
}
