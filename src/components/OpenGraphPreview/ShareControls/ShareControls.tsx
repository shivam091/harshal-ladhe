"use client";

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import { encodeShareableState } from "@/utils/open-graph-serialize";
import { toShareableState } from "@/helpers/open-graph-editor";
import CopyLink from "@/components/CopyLink";
import { SectionCard, PanelTitle, HelpText } from "@/components/OpenGraphPreview/OpenGraphPreview.styles";
import type { ShareControlsProps } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// Computes the permalink fresh on every render (cheap — a small base64 string) rather than syncing it into the URL bar via router.replace on every edit, which would spam browser history while typing.
export default function ShareControls({ state }: ShareControlsProps): JSX.Element {
  const pathname = usePathname();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}${pathname}?state=${encodeShareableState(toShareableState(state))}`;

  return (
    <>
      <SectionCard>
        <PanelTitle>Share</PanelTitle>
        <HelpText>Copy a link to these exact tags. An uploaded image isn&apos;t included.</HelpText>
        <CopyLink url={url} />
      </SectionCard>
    </>
  );
}

ShareControls.displayName = "ShareControls";
