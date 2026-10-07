"use client";

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import CopyLink from "@/components/CopyLink";
import { encodeShareableState } from "@/components/ViewboxExplorer/ViewboxExplorer.utils";
import { toShareableState } from "@/components/ViewboxExplorer/ViewboxExplorer.helpers";
import { SectionCard, PanelTitle, PanelHint } from "@/components/ViewboxExplorer/ViewboxExplorer.styles";
import type { ShareControlsProps } from "@/components/ViewboxExplorer/ViewboxExplorer.types";

// Computes the permalink fresh on every render rather than syncing it into the URL bar on every drag frame, which would spam browser history.
export default function ShareControls({ state }: ShareControlsProps): JSX.Element {
  const pathname = usePathname();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}${pathname}?state=${encodeShareableState(toShareableState(state))}`;

  return (
    <>
      <SectionCard>
        <PanelTitle>Share</PanelTitle>
        <PanelHint>Copy a link to this exact framing — easel, paper, alignment and any pasted drawing included.</PanelHint>
        <CopyLink url={url} />
      </SectionCard>
    </>
  );
}

ShareControls.displayName = "ShareControls";
