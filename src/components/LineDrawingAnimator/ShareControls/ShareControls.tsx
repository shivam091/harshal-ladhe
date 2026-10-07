"use client";

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import CopyLink from "@/components/CopyLink";
import { toPermalinkState } from "@/components/LineDrawingAnimator/LineDrawingAnimator.helpers";
import { SectionCard, PanelTitle, PanelHint } from "@/components/LineDrawingAnimator/LineDrawingAnimator.styles";
import type { ShareControlsProps } from "@/components/LineDrawingAnimator/LineDrawingAnimator.types";

// Computes the permalink fresh on every render rather than syncing it into the URL bar on every edit, which would spam browser history.
export default function ShareControls({ state }: ShareControlsProps): JSX.Element {
  const pathname = usePathname();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const { encoded, truncated } = toPermalinkState(state);
  const url = `${origin}${pathname}?state=${encoded}`;

  return (
    <>
      <SectionCard aria-labelledby="ld-share-title">
        <PanelTitle id="ld-share-title">Post it</PanelTitle>
        <PanelHint>
          {truncated
            ? "This drawing is too large to fit in a link, so the link carries your settings only. Send the animated SVG export alongside it."
            : "Copy a link to this exact drawing, settings and ledger tweaks included."}
        </PanelHint>
        <CopyLink url={url} />
      </SectionCard>
    </>
  );
}

ShareControls.displayName = "ShareControls";
