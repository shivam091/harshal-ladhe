"use client";

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import { encodeShareableState } from "@/utils/shader-playground-serialize";
import { toShareableState } from "@/helpers/shader-playground-editor";
import CopyLink from "@/components/CopyLink";
import { SectionCard, PanelTitle, PanelHint } from "@/components/ShaderPlayground/ShaderPlayground.styles";
import type { ShareControlsProps } from "@/components/ShaderPlayground/ShaderPlayground.types";

// Computes the permalink fresh on every render rather than syncing it into the URL bar via router.replace on every keystroke, which would spam browser history while typing.
export default function ShareControls({ state }: ShareControlsProps): JSX.Element {
  const pathname = usePathname();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}${pathname}?state=${encodeShareableState(toShareableState(state))}`;

  return (
    <>
      <SectionCard>
        <PanelTitle>Share</PanelTitle>
        <PanelHint>Copy a link to this exact shader, slider values included.</PanelHint>
        <CopyLink url={url} />
      </SectionCard>
    </>
  );
}

ShareControls.displayName = "ShareControls";
