"use client";

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import { encodeShareableState } from "@/utils/event-loop-serialize";
import { toShareableState } from "@/helpers/event-loop-editor";
import CopyLink from "@/components/CopyLink";
import { SectionCard, PanelTitle, PanelNote } from "@/components/EventLoopVisualiser/EventLoopVisualiser.styles";
import type { ShareControlsProps } from "@/components/EventLoopVisualiser/EventLoopVisualiser.types";

// Computes the permalink fresh on every render (cheap — a small base64 string) rather than syncing it into the URL bar on every edit, which would spam browser history while typing.
export default function ShareControls({ state }: ShareControlsProps): JSX.Element {
  const pathname = usePathname();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}${pathname}?state=${encodeShareableState(toShareableState(state))}`;

  return (
    <>
      <SectionCard>
        <PanelTitle>Share</PanelTitle>
        <PanelNote>Copy a link to this exact program.</PanelNote>
        <CopyLink url={url} />
      </SectionCard>
    </>
  );
}

ShareControls.displayName = "ShareControls";
