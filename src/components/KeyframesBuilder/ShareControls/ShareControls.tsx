"use client";

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import { encodeShareableState } from "@/utils/keyframes-builder-serialize";
import { toShareableState } from "@/helpers/keyframes-builder-editor";
import { useIsClient } from "@/hooks/use-is-client";
import CopyLink from "@/components/CopyLink";
import { SectionCard, PanelTitle } from "@/components/KeyframesBuilder/KeyframesBuilder.styles";
import { Row, LinkPreview } from "@/components/KeyframesBuilder/ShareControls/ShareControls.styles";
import type { ShareControlsProps } from "@/components/KeyframesBuilder/KeyframesBuilder.types";

// Computes the permalink fresh on every render (cheap — a small base64 string) rather than syncing it into the URL bar via router.replace on every edit, which would spam browser history during a drag. `origin` stays blank until hydration (useIsClient) so the server and first client render match.
export default function ShareControls({ state }: ShareControlsProps): JSX.Element {
  const pathname = usePathname();
  const isClient = useIsClient();
  const origin = isClient ? window.location.origin : "";
  const url = `${origin}${pathname}?state=${encodeShareableState(toShareableState(state))}`;

  return (
    <>
      <SectionCard aria-labelledby="keyframes-share-title">
        <PanelTitle id="keyframes-share-title">Share</PanelTitle>
        <Row>
          <LinkPreview title={url}>{url}</LinkPreview>
          <CopyLink url={url} />
        </Row>
      </SectionCard>
    </>
  );
}

ShareControls.displayName = "ShareControls";
