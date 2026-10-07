"use client";

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import CopyLink from "@/components/CopyLink";
import { encodeShareableState, toShareableState } from "@/components/MotionPathBuilder/MotionPathBuilder.helpers";
import { SectionCard, PanelTitle, PanelHint } from "@/components/MotionPathBuilder/MotionPathBuilder.styles";
import { ShareRow } from "@/components/MotionPathBuilder/ShareControls/ShareControls.styles";
import type { ShareControlsProps } from "@/components/MotionPathBuilder/MotionPathBuilder.types";

// Computes the permalink fresh on every render rather than syncing it into the URL bar, which would spam browser history during a pin drag.
export default function ShareControls({ state }: ShareControlsProps): JSX.Element {
  const pathname = usePathname();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}${pathname}?state=${encodeShareableState(toShareableState(state))}`;

  return (
    <>
      <SectionCard>
        <PanelTitle>Share</PanelTitle>
        <PanelHint>Copy a link to this exact layout — track, timetable and rolling stock.</PanelHint>
        <ShareRow>
          <CopyLink url={url} />
        </ShareRow>
      </SectionCard>
    </>
  );
}

ShareControls.displayName = "ShareControls";
