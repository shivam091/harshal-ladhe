"use client";

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import { encodeShareableState } from "@/utils/clip-path-serialize";
import { toShareableState } from "@/helpers/clip-path-editor";
import CopyLink from "@/components/CopyLink";
import { SectionCard, PanelTitle } from "@/components/ClipPathGenerator/ClipPathGenerator.styles";
import type { ShareControlsProps } from "@/interfaces/clip-path";

/*
  Computes the permalink fresh on every render (cheap — a small base64 string) rather than syncing it
  into the URL bar via router.replace on every edit, which would spam browser history during a drag.
  The link is only ever read by the user clicking "Copy link," so a stale render between edits is fine.
*/
export default function ShareControls({ state }: ShareControlsProps): JSX.Element {
  const pathname = usePathname();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}${pathname}?state=${encodeShareableState(toShareableState(state))}`;

  return (
    <>
      <SectionCard>
        <PanelTitle>Share</PanelTitle>
        <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--color-fg-muted)" }}>Copy a link to this exact shape.</p>
        <CopyLink url={url} />
      </SectionCard>
    </>
  );
}

ShareControls.displayName = "ShareControls";
