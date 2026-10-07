"use client";

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import { encodeShareableState, toShareableState } from "@/components/ShapeToPathConverter/ShapeToPathConverter.helpers";
import CopyLink from "@/components/CopyLink";
import { SectionCard, PanelTitle, PanelHint } from "@/components/ShapeToPathConverter/ShapeToPathConverter.styles";
import type { ShareControlsProps } from "@/components/ShapeToPathConverter/ShapeToPathConverter.types";

// Computes the permalink fresh on every render rather than syncing it into the URL bar on every drag, which would spam browser history.
export default function ShareControls({ state }: ShareControlsProps): JSX.Element {
  const pathname = usePathname();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}${pathname}?state=${encodeShareableState(toShareableState(state))}`;

  return (
    <>
      <SectionCard>
        <PanelTitle>Hand it in</PanelTitle>
        <PanelHint>Copy a link to this exact exercise: every shape tab, plus the command style and precision.</PanelHint>
        <CopyLink url={url} />
      </SectionCard>
    </>
  );
}

ShareControls.displayName = "ShareControls";
