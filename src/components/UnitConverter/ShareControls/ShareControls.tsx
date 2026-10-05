"use client";

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import { encodeShareableState } from "@/utils/unit-converter-serialize";
import { toShareableState } from "@/helpers/unit-converter-editor";
import CopyLink from "@/components/CopyLink";
import { SectionCard, PanelTitle, PanelHint } from "@/components/UnitConverter/UnitConverter.styles";
import type { ShareControlsProps } from "@/components/UnitConverter/UnitConverter.types";

// Computes the permalink fresh on every render (cheap — a small base64 string) rather than syncing it into the URL bar via router.replace on every edit, which would spam browser history during a drag.
export default function ShareControls({ state }: ShareControlsProps): JSX.Element {
  const pathname = usePathname();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}${pathname}?state=${encodeShareableState(toShareableState(state))}`;

  return (
    <>
      <SectionCard>
        <PanelTitle>Share</PanelTitle>
        <PanelHint>Copy a link to this exact length, context and scale.</PanelHint>
        <CopyLink url={url} />
      </SectionCard>
    </>
  );
}

ShareControls.displayName = "ShareControls";
