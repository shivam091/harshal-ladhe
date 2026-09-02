"use client";

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import { encodeShareableState } from "@/utils/easing-curve-serialize";
import { toShareableState } from "@/helpers/easing-curve-editor";
import CopyLink from "@/components/CopyLink";
import { SectionCard, PanelTitle } from "@/components/EasingCurveEditor/EasingCurveEditor.styles";
import type { ShareControlsProps } from "@/interfaces/easing-curve-editor";

// Computes the permalink fresh on every render (cheap — a small base64 string) rather than syncing it into the URL bar via router.replace on every edit, which would spam browser history during a drag.
export default function ShareControls({ state }: ShareControlsProps): JSX.Element {
  const pathname = usePathname();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}${pathname}?state=${encodeShareableState(toShareableState(state))}`;

  return (
    <>
      <SectionCard>
        <PanelTitle>Share</PanelTitle>
        <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--color-fg-muted)" }}>Copy a link to this exact curve.</p>
        <CopyLink url={url} />
      </SectionCard>
    </>
  );
}

ShareControls.displayName = "ShareControls";
