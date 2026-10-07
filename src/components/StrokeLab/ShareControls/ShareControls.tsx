"use client";

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import { encodeShareableState } from "@/components/StrokeLab/StrokeLab.utils";
import { toShareableState } from "@/components/StrokeLab/StrokeLab.helpers";
import CopyLink from "@/components/CopyLink";
import { NotionCard, CardTitle, CardHint } from "@/components/StrokeLab/StrokeLab.styles";
import type { ShareControlsProps } from "@/components/StrokeLab/StrokeLab.types";

// Computes the permalink fresh each render rather than pushing it into the URL bar, which would spam browser history on every slider tick.
export default function ShareControls({ state }: ShareControlsProps): JSX.Element {
  const pathname = usePathname();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}${pathname}?state=${encodeShareableState(toShareableState(state))}`;

  return (
    <>
      <NotionCard>
        <CardTitle>Share the pattern</CardTitle>
        <CardHint>Copy a link to this exact stroke — subject, overlays and draw-on timing included.</CardHint>
        <CopyLink url={url} />
      </NotionCard>
    </>
  );
}

ShareControls.displayName = "ShareControls";
