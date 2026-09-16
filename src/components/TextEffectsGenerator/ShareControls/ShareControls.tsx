"use client";

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import { encodeShareableState } from "@/utils/text-effects-serialize";
import { toShareableState } from "@/helpers/text-effects-editor";
import { useIsClient } from "@/hooks/use-is-client";
import CopyLink from "@/components/CopyLink";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/TextEffectsGenerator/TextEffectsGenerator.styles";
import { Row, LinkPreview } from "@/components/TextEffectsGenerator/ShareControls/ShareControls.styles";
import type { ShareControlsProps } from "@/interfaces/text-effects";

// Computes the permalink fresh on every render (cheap — a small base64 string) rather than syncing it into the URL bar via router.replace on every edit, which would spam browser history during a drag. `origin` is blank during SSR and the initial client render (window isn't available on the server) so both match; useIsClient flips the render right after hydration to fill in the real origin, same pattern as BoxShadowGenerator/CronBuilder/RegexTester's own ShareControls.
export default function ShareControls({ state }: ShareControlsProps): JSX.Element {
  const pathname = usePathname();
  const isClient = useIsClient();
  const origin = isClient ? window.location.origin : "";
  const url = `${origin}${pathname}?state=${encodeShareableState(toShareableState(state))}`;

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Share</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <Row>
            <LinkPreview title={url}>{url}</LinkPreview>
            <CopyLink url={url} />
          </Row>
        </PanelBody>
      </Panel>
    </>
  );
}

ShareControls.displayName = "ShareControls";
