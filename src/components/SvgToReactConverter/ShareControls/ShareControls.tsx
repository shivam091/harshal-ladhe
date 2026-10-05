"use client";

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import { encodeShareableState } from "@/utils/svg-to-react-serialize";
import { toShareableState } from "@/helpers/svg-to-react-editor";
import CopyLink from "@/components/CopyLink";
import { SectionCard, PanelTitle, HintText } from "@/components/SvgToReactConverter/SvgToReactConverter.styles";
import type { ShareControlsProps } from "@/components/SvgToReactConverter/SvgToReactConverter.types";

// Computes the permalink fresh on every render (cheap for icon-sized markup) rather than syncing it into the URL bar via router.replace on every edit, which would spam browser history while typing.
export default function ShareControls({ state }: ShareControlsProps): JSX.Element {
  const pathname = usePathname();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}${pathname}?state=${encodeShareableState(toShareableState(state))}`;

  return (
    <>
      <SectionCard>
        <PanelTitle data-designator="J3">Share</PanelTitle>
        <HintText>Copy a link to this exact SVG and these settings.</HintText>
        <CopyLink url={url} />
      </SectionCard>
    </>
  );
}

ShareControls.displayName = "ShareControls";
