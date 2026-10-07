"use client";

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import CopyLink from "@/components/CopyLink";
import { useIsClient } from "@/hooks/use-is-client";
import { encodeShareableState, toShareableState } from "@/components/SvgPathMorph/SvgPathMorph.helpers";
import { ParchmentCard, PanelTitle, PanelHint } from "@/components/SvgPathMorph/SvgPathMorph.styles";
import type { ShareControlsProps } from "@/components/SvgPathMorph/SvgPathMorph.types";

// Computes the permalink fresh on every render rather than syncing it into the URL bar on every edit, which would spam browser history; origin waits for hydration so server and client markup agree.
export default function ShareControls({ state }: ShareControlsProps): JSX.Element {
  const pathname = usePathname();
  const isClient = useIsClient();
  const origin = isClient ? window.location.origin : "";
  const url = `${origin}${pathname}?state=${encodeShareableState(toShareableState(state))}`;

  return (
    <>
      <ParchmentCard aria-labelledby="morph-share-title">
        <PanelTitle id="morph-share-title">Send the recipe</PanelTitle>
        <PanelHint>Copy a link to this exact morph — keyframes, alignment and timing included.</PanelHint>
        <CopyLink url={url} />
      </ParchmentCard>
    </>
  );
}

ShareControls.displayName = "ShareControls";
