"use client";

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import CopyLink from "@/components/CopyLink";
import { encodeShareableState } from "@/components/FillRuleVisualiser/FillRuleVisualiser.helpers";
import { SectionCard, PanelTitle, PanelHint } from "@/components/FillRuleVisualiser/FillRuleVisualiser.styles";
import type { ShareControlsProps } from "@/components/FillRuleVisualiser/FillRuleVisualiser.types";

// Computes the permalink fresh on every render rather than syncing it into the URL bar, which would spam browser history while dragging.
export default function ShareControls({ state }: ShareControlsProps): JSX.Element {
  const pathname = usePathname();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}${pathname}?state=${encodeShareableState(state)}`;

  return (
    <>
      <SectionCard>
        <PanelTitle>Share</PanelTitle>
        <PanelHint>Copy a link to this exact window — the path, the ray and the view all travel with it.</PanelHint>
        <CopyLink url={url} />
      </SectionCard>
    </>
  );
}

ShareControls.displayName = "ShareControls";
