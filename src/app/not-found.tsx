import { JSX } from "react";
import { EmojiSadIcon } from "@/components/Icon";
import Button from "@/components/Button";
import FlashlightOverlay from "@/components/FlashlightOverlay";
import { ErrorWrapper, ErrorIconCircle, ErrorHeading, ErrorMessage, ErrorButtonRow, ErrorPage } from "@/app/error-page.styles";

export const metadata = {
  title: "Page Not Found",
  description: "Sorry, we've misplaced that URL or it's pointing to something that doesn't exist.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Page Not Found",
    description: "Sorry, we've misplaced that URL or it's pointing to something that doesn't exist.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Page Not Found",
    description: "Sorry, we've misplaced that URL or it's pointing to something that doesn't exist.",
  },
};

// 404 page shown for any unmatched route — flashlight overlay plus a "Go Home" button.
export default function NotFound(): JSX.Element {
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
          404 — Page Not Found
        </ErrorHeading>

        <ErrorMessage>
          Sorry, we&apos;ve misplaced that URL or it&apos;s pointing to something that doesn&apos;t exist.
        </ErrorMessage>

        <ErrorButtonRow>
          <Button intent="danger" href="/">
            Go Home
          </Button>
        </ErrorButtonRow>
      </ErrorWrapper>
    </>
  );
}
