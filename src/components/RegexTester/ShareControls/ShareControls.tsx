"use client";

import type { JSX } from "react";
import { usePathname } from "next/navigation";
import { encodeShareableState } from "@/utils/regex-serialize";
import { toShareableState } from "@/helpers/regex-tester-editor";
import { useIsClient } from "@/hooks/use-is-client";
import CopyLink from "@/components/CopyLink";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/RegexTester/RegexTester.styles";
import { Row, LinkPreview } from "@/components/RegexTester/ShareControls/ShareControls.styles";
import type { ShareControlsProps } from "@/interfaces/regex-tester";

// Computes the permalink fresh on every render (cheap — a small base64 string) rather than syncing it into the URL bar via router.replace on every edit, which would spam browser history while typing. `origin` is blank during SSR and the initial client render (window isn't available on the server) so both match; useIsClient flips the render right after hydration to fill in the real origin, same pattern as CronBuilder's own ShareControls.
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
