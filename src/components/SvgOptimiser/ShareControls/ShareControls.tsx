"use client";

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import { encodeShareableState, toShareableState } from "@/components/SvgOptimiser/SvgOptimiser.helpers";
import CopyLink from "@/components/CopyLink";
import { SectionCard, PanelTitle, HintText } from "@/components/SvgOptimiser/SvgOptimiser.styles";
import type { ShareControlsProps } from "@/components/SvgOptimiser/SvgOptimiser.types";

// Computes the permalink fresh on every render rather than syncing it into the address bar, which would spam browser history while typing.
export default function ShareControls({ state }: ShareControlsProps): JSX.Element {
  const pathname = usePathname();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}${pathname}?state=${encodeShareableState(toShareableState(state))}`;

  return (
    <>
      <SectionCard>
        <PanelTitle data-form="P-58">Forwarding address</PanelTitle>
        <HintText>Copy a link that carries this exact parcel, its postage and precision.</HintText>
        <CopyLink url={url} />
      </SectionCard>
    </>
  );
}

ShareControls.displayName = "ShareControls";
